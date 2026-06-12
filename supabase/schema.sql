-- ============================================================
-- Best Cars Ever — Supabase schema
-- Rode este arquivo no SQL Editor do Supabase (uma vez).
-- ============================================================

-- ----------- CARS -------------------------------------------
create table if not exists public.cars (
  id          bigint generated always as identity primary key,
  slug        text not null unique,
  name        text not null,
  manufacturer text not null,
  year        int not null,
  decade      smallint not null,          -- 1970, 1980, 1990, 2000, 2010, 2020
  top_speed   int,                        -- km/h
  power_hp    int,
  image_url   text not null,
  blurb       jsonb not null default '{}'::jsonb, -- { "en": "...", "pt": "...", "es": "..." }
  created_at  timestamptz not null default now()
);

create index if not exists cars_decade_idx on public.cars (decade);

-- ----------- REVIEWS ----------------------------------------
create table if not exists public.reviews (
  id          uuid primary key default gen_random_uuid(),
  car_id      bigint not null references public.cars(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  rating      int not null check (rating between 1 and 5),
  comment     text check (char_length(comment) <= 1000),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  edit_count  int not null default 0,
  -- Uma única review por usuário por carro
  unique (car_id, user_id)
);

create index if not exists reviews_car_idx on public.reviews (car_id);
create index if not exists reviews_user_idx on public.reviews (user_id);

-- Regra: o usuário só pode editar/apagar uma única vez.
-- edit_count começa em 0; cada UPDATE incrementa. Bloqueamos no >= 1.
create or replace function public.enforce_single_edit()
returns trigger as $$
begin
  if old.edit_count >= 1 then
    raise exception 'Esta avaliação já foi editada uma vez e não pode ser alterada novamente.';
  end if;
  new.edit_count := old.edit_count + 1;
  new.updated_at := now();
  new.created_at := old.created_at;   -- imutável
  new.user_id := old.user_id;         -- imutável
  new.car_id := old.car_id;           -- imutável
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_single_edit on public.reviews;
create trigger trg_single_edit
  before update on public.reviews
  for each row execute function public.enforce_single_edit();

-- ----------- RANKING (view agregada) ------------------------
create or replace view public.car_rankings as
select
  c.id            as car_id,
  c.decade,
  coalesce(round(avg(r.rating)::numeric, 2), 0) as avg_rating,
  count(r.id)     as review_count,
  rank() over (
    partition by c.decade
    order by coalesce(avg(r.rating), 0) desc, count(r.id) desc
  ) as decade_rank
from public.cars c
left join public.reviews r on r.car_id = c.id
group by c.id, c.decade;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.cars enable row level security;
alter table public.reviews enable row level security;

-- Carros: leitura pública
drop policy if exists "cars_read_all" on public.cars;
create policy "cars_read_all" on public.cars
  for select using (true);

-- Reviews: leitura pública (para montar o ranking e listar comentários)
drop policy if exists "reviews_read_all" on public.reviews;
create policy "reviews_read_all" on public.reviews
  for select using (true);

-- Reviews: o usuário só insere a própria
drop policy if exists "reviews_insert_own" on public.reviews;
create policy "reviews_insert_own" on public.reviews
  for insert with check (auth.uid() = user_id);

-- Reviews: o usuário só atualiza a própria (o trigger limita a 1 edição)
drop policy if exists "reviews_update_own" on public.reviews;
create policy "reviews_update_own" on public.reviews
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Reviews: o usuário só apaga a própria
drop policy if exists "reviews_delete_own" on public.reviews;
create policy "reviews_delete_own" on public.reviews
  for delete using (auth.uid() = user_id);
