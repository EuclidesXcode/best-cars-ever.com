-- ============================================================
-- Best Cars Ever — Área Admin / Blog de Notícias
-- Rode DEPOIS de schema.sql e 02_profiles.sql.
--
-- Cria:
--   1. profiles.is_admin       — quem pode publicar
--   2. public.is_admin()       — helper usado nas policies
--   3. public.posts            — as notícias (Markdown + capa)
--   4. RLS                     — público lê só publicados; só admin escreve
--   5. bucket "news" + policies — imagens das notícias
-- ============================================================

-- ----------- 1. Flag de admin no perfil ---------------------
alter table public.profiles
  add column if not exists is_admin boolean not null default false;

-- Depois de rodar, marque o SEU usuário como admin:
--   update public.profiles set is_admin = true where id = '<seu-uuid-de-auth.users>';
-- (descubra o uuid em Authentication → Users no painel do Supabase)

-- ----------- 2. Helper: o usuário atual é admin? ------------
-- security definer + search_path fixo para poder ler profiles dentro das policies.
create or replace function public.is_admin()
returns boolean as $$
  select coalesce(
    (select p.is_admin from public.profiles p where p.id = auth.uid()),
    false
  );
$$ language sql stable security definer set search_path = public;

-- ----------- 3. POSTS (notícias) ----------------------------
create table if not exists public.posts (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  title       text not null,
  excerpt     text,
  cover_url   text,
  body        text not null default '',          -- conteúdo em Markdown
  published   boolean not null default false,    -- rascunho vs publicado
  author_id   uuid references auth.users(id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists posts_slug_idx on public.posts (slug);
create index if not exists posts_pub_idx  on public.posts (published, created_at desc);

-- Trigger de updated_at (mesmo padrão usado em reviews)
create or replace function public.posts_set_updated_at()
returns trigger as $$
begin
  new.updated_at := now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_posts_updated_at on public.posts;
create trigger trg_posts_updated_at
  before update on public.posts
  for each row execute function public.posts_set_updated_at();

-- ----------- 4. ROW LEVEL SECURITY --------------------------
alter table public.posts enable row level security;

-- Leitura: público vê só publicados; admin vê tudo (inclui rascunhos)
drop policy if exists "posts_read" on public.posts;
create policy "posts_read" on public.posts
  for select using (published or public.is_admin());

-- Escrita: apenas admin
drop policy if exists "posts_insert_admin" on public.posts;
create policy "posts_insert_admin" on public.posts
  for insert with check (public.is_admin());

drop policy if exists "posts_update_admin" on public.posts;
create policy "posts_update_admin" on public.posts
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "posts_delete_admin" on public.posts;
create policy "posts_delete_admin" on public.posts
  for delete using (public.is_admin());

-- ----------- 5. STORAGE: bucket de imagens das notícias -----
-- Bucket público (leitura via URL pública); upload só para admin.
insert into storage.buckets (id, name, public)
values ('news', 'news', true)
on conflict (id) do nothing;

-- Leitura pública dos objetos do bucket "news"
drop policy if exists "news_read_public" on storage.objects;
create policy "news_read_public" on storage.objects
  for select using (bucket_id = 'news');

-- Upload / edição / remoção só para admin
drop policy if exists "news_insert_admin" on storage.objects;
create policy "news_insert_admin" on storage.objects
  for insert with check (bucket_id = 'news' and public.is_admin());

drop policy if exists "news_update_admin" on storage.objects;
create policy "news_update_admin" on storage.objects
  for update using (bucket_id = 'news' and public.is_admin());

drop policy if exists "news_delete_admin" on storage.objects;
create policy "news_delete_admin" on storage.objects
  for delete using (bucket_id = 'news' and public.is_admin());
