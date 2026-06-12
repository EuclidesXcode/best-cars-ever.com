-- ============================================================
-- Best Cars Ever — perfis públicos (nome do usuário)
-- Rode DEPOIS do schema.sql. Necessário para mostrar nome+sobrenome
-- nos comentários, tanto no cadastro normal quanto no login Google.
-- ============================================================

-- ----------- PROFILES ---------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  created_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Leitura pública (para exibir o autor dos comentários)
drop policy if exists "profiles_read_all" on public.profiles;
create policy "profiles_read_all" on public.profiles
  for select using (true);

-- Cada um edita só o próprio perfil
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- ----------- Trigger: cria o perfil no cadastro --------------
-- Pega o nome de:
--   1. full_name (cadastro normal — enviamos esse metadado)
--   2. name      (login Google)
--   3. parte do e-mail como fallback
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(
      nullif(new.raw_user_meta_data ->> 'full_name', ''),
      nullif(new.raw_user_meta_data ->> 'name', ''),
      split_part(new.email, '@', 1)
    )
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ----------- Backfill: perfis para usuários já existentes -----
insert into public.profiles (id, full_name)
select
  u.id,
  coalesce(
    nullif(u.raw_user_meta_data ->> 'full_name', ''),
    nullif(u.raw_user_meta_data ->> 'name', ''),
    split_part(u.email, '@', 1)
  )
from auth.users u
on conflict (id) do nothing;

-- ----------- View: comentários públicos com nome do autor -----
create or replace view public.car_comments as
select
  r.id,
  r.car_id,
  r.rating,
  r.comment,
  r.created_at,
  coalesce(p.full_name, 'Anônimo') as author_name
from public.reviews r
left join public.profiles p on p.id = r.user_id
where r.comment is not null;
