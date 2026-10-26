-- Schema do site (Supabase / Postgres).
-- Rode uma vez no SQL Editor do Supabase, antes do seed.sql. Pode rodar de novo: tudo é "if not exists" / "or replace".

-- ===========================================================================
-- Administradores
-- Quem está nesta tabela pode usar o /admin. O cadastro é feito pelo SQL Editor (ver README).
-- ===========================================================================
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- ===========================================================================
-- Catálogo
-- ===========================================================================
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 60),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  -- caminho no Storage (bucket "imagens") ou URL começando com / ou http
  image_path text,
  position int not null default 0,
  active boolean not null default true,
  show_on_home boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null check (char_length(name) between 1 and 120),
  description text not null default '' check (char_length(description) <= 2000),
  category_id uuid references public.categories (id) on delete set null,
  price numeric(10, 2) check (price is null or price >= 0),
  sale_price numeric(10, 2) check (sale_price is null or sale_price >= 0),
  tag text check (tag is null or char_length(tag) <= 30),
  featured boolean not null default false,
  active boolean not null default true,
  -- alerta quando a soma do estoque das variações fica igual ou abaixo deste número
  min_stock int not null default 2 check (min_stock >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint sale_below_price check (sale_price is null or price is null or sale_price < price)
);
create index if not exists products_category_idx on public.products (category_id);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  path text not null,
  position int not null default 0
);
create index if not exists product_images_product_idx on public.product_images (product_id, position);

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  size text not null check (char_length(size) between 1 and 10),
  color text not null check (char_length(color) between 1 and 40),
  color_hex text not null default '#cccccc' check (color_hex ~ '^#[0-9a-fA-F]{6}$'),
  stock int not null default 0 check (stock >= 0),
  position int not null default 0,
  unique (product_id, size, color)
);
create index if not exists product_variants_product_idx on public.product_variants (product_id);

create table if not exists public.stock_movements (
  id bigint generated always as identity primary key,
  variant_id uuid references public.product_variants (id) on delete set null,
  product_id uuid not null references public.products (id) on delete cascade,
  -- "48 · Preto", guardado para o histórico continuar legível se a variação for apagada
  label text not null,
  delta int not null check (delta <> 0),
  stock_after int not null,
  reason text not null check (reason in ('inicial', 'entrada', 'venda', 'troca', 'ajuste')),
  note text check (note is null or char_length(note) <= 200),
  created_by uuid default auth.uid() references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists stock_movements_product_idx on public.stock_movements (product_id, created_at desc);

-- ===========================================================================
-- Avaliações
-- Entram como "pending" pelo formulário do site (Server Action com a chave secreta)
-- e só aparecem depois de aprovadas no painel.
-- ===========================================================================
do $$ begin
  create type public.review_status as enum ('pending', 'approved', 'rejected');
exception when duplicate_object then null;
end $$;

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 60),
  city text check (city is null or char_length(city) <= 60),
  rating smallint not null check (rating between 1 and 5),
  comment text not null check (char_length(comment) between 10 and 800),
  status public.review_status not null default 'pending',
  featured boolean not null default false,
  -- hash do IP (nunca o IP em si), usado para limitar envios
  ip_hash text,
  created_at timestamptz not null default now()
);
create index if not exists reviews_status_idx on public.reviews (status, created_at desc);
create index if not exists reviews_ip_idx on public.reviews (ip_hash, created_at desc);

-- ===========================================================================
-- Conteúdo editável do site (hero, sobre, banner, contato, guia de medidas)
-- ===========================================================================
create table if not exists public.site_content (
  key text primary key check (key in ('hero', 'about', 'promo', 'contact', 'size_guide')),
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- ===========================================================================
-- updated_at automático
-- ===========================================================================
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists products_touch on public.products;
create trigger products_touch before update on public.products
  for each row execute function public.touch_updated_at();

drop trigger if exists site_content_touch on public.site_content;
create trigger site_content_touch before update on public.site_content
  for each row execute function public.touch_updated_at();

-- ===========================================================================
-- Funções usadas pelo painel (rodam com as permissões de quem chama: RLS vale)
-- ===========================================================================

-- Entrada ou saída de estoque de uma variação, com registro no histórico.
create or replace function public.adjust_stock(p_variant uuid, p_delta int, p_reason text, p_note text default null)
returns int
language plpgsql
security invoker
set search_path = public
as $$
declare
  v public.product_variants%rowtype;
begin
  if not public.is_admin() then
    raise exception 'Sem permissão' using errcode = '42501';
  end if;
  if p_delta is null or p_delta = 0 then
    raise exception 'Informe uma quantidade diferente de zero' using errcode = '22023';
  end if;

  update public.product_variants set stock = stock + p_delta where id = p_variant returning * into v;
  if not found then
    raise exception 'Variação não encontrada' using errcode = 'P0002';
  end if;

  insert into public.stock_movements (variant_id, product_id, label, delta, stock_after, reason, note)
  values (v.id, v.product_id, v.size || ' · ' || v.color, p_delta, v.stock, p_reason, nullif(btrim(p_note), ''));

  return v.stock;
end;
$$;

-- Cria ou atualiza uma peça com fotos e variações numa transação só.
-- p = { id?, slug, name, description, category_id, price, sale_price, tag, featured, active, min_stock,
--       images: [path...], colors: [{name, hex}...], sizes: [size...], initial_stock: {"48|Preto": 3} }
-- Retorna { id, removed: [paths das fotos que saíram] } para o servidor apagar do Storage.
create or replace function public.save_product(p jsonb)
returns jsonb
language plpgsql
security invoker
set search_path = public
as $$
declare
  pid uuid := nullif(p ->> 'id', '')::uuid;
  removed text[];
  r record;
  vid uuid;
  qty int;
begin
  if not public.is_admin() then
    raise exception 'Sem permissão' using errcode = '42501';
  end if;

  if pid is null then
    insert into public.products (slug, name, description, category_id, price, sale_price, tag, featured, active, min_stock)
    values (
      p ->> 'slug', p ->> 'name', coalesce(p ->> 'description', ''), nullif(p ->> 'category_id', '')::uuid,
      (p ->> 'price')::numeric, (p ->> 'sale_price')::numeric, nullif(p ->> 'tag', ''),
      coalesce((p ->> 'featured')::boolean, false), coalesce((p ->> 'active')::boolean, true), coalesce((p ->> 'min_stock')::int, 2)
    )
    returning id into pid;
  else
    update public.products set
      slug = p ->> 'slug',
      name = p ->> 'name',
      description = coalesce(p ->> 'description', ''),
      category_id = nullif(p ->> 'category_id', '')::uuid,
      price = (p ->> 'price')::numeric,
      sale_price = (p ->> 'sale_price')::numeric,
      tag = nullif(p ->> 'tag', ''),
      featured = coalesce((p ->> 'featured')::boolean, false),
      active = coalesce((p ->> 'active')::boolean, true),
      min_stock = coalesce((p ->> 'min_stock')::int, 2)
    where id = pid;
    if not found then
      raise exception 'Peça não encontrada' using errcode = 'P0002';
    end if;
  end if;

  -- fotos: a ordem do array é a ordem no site (a primeira é a capa)
  select coalesce(array_agg(path), '{}') into removed
  from public.product_images
  where product_id = pid
    and path not in (select jsonb_array_elements_text(coalesce(p -> 'images', '[]')));
  delete from public.product_images where product_id = pid;
  insert into public.product_images (product_id, path, position)
  select pid, t.path, t.ord - 1
  from jsonb_array_elements_text(coalesce(p -> 'images', '[]')) with ordinality as t (path, ord);

  -- variações: cor x tamanho. As que saíram são apagadas (o histórico fica, sem o vínculo).
  delete from public.product_variants v
  where v.product_id = pid
    and not exists (
      select 1
      from jsonb_array_elements(coalesce(p -> 'colors', '[]')) c
      cross join jsonb_array_elements_text(coalesce(p -> 'sizes', '[]')) s
      where c ->> 'name' = v.color and s = v.size
    );

  for r in
    select c.value ->> 'name' as color, c.value ->> 'hex' as hex, s.value as size, (c.ord * 100 + s.ord)::int as pos
    from jsonb_array_elements(coalesce(p -> 'colors', '[]')) with ordinality as c (value, ord)
    cross join jsonb_array_elements_text(coalesce(p -> 'sizes', '[]')) with ordinality as s (value, ord)
  loop
    update public.product_variants set color_hex = r.hex, position = r.pos
    where product_id = pid and color = r.color and size = r.size;
    if not found then
      qty := greatest(coalesce((p -> 'initial_stock' ->> (r.size || '|' || r.color))::int, 0), 0);
      insert into public.product_variants (product_id, size, color, color_hex, stock, position)
      values (pid, r.size, r.color, r.hex, qty, r.pos)
      returning id into vid;
      if qty > 0 then
        insert into public.stock_movements (variant_id, product_id, label, delta, stock_after, reason)
        values (vid, pid, r.size || ' · ' || r.color, qty, qty, 'inicial');
      end if;
    end if;
  end loop;

  return jsonb_build_object('id', pid, 'removed', to_jsonb(removed));
end;
$$;

-- Apaga a peça e devolve os caminhos das fotos para o servidor limpar o Storage.
create or replace function public.delete_product(p_id uuid)
returns text[]
language plpgsql
security invoker
set search_path = public
as $$
declare
  paths text[];
begin
  if not public.is_admin() then
    raise exception 'Sem permissão' using errcode = '42501';
  end if;
  select coalesce(array_agg(path), '{}') into paths from public.product_images where product_id = p_id;
  delete from public.products where id = p_id;
  return paths;
end;
$$;

-- ===========================================================================
-- Row Level Security
-- Público (chave anon/publishable): só lê o que está ativo e aprovado.
-- Escrita: só administradores (o formulário de avaliação usa a chave secreta no servidor).
-- ===========================================================================
alter table public.admins enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_variants enable row level security;
alter table public.stock_movements enable row level security;
alter table public.reviews enable row level security;
alter table public.site_content enable row level security;

drop policy if exists "admin vê o próprio cadastro" on public.admins;
create policy "admin vê o próprio cadastro" on public.admins for select using (user_id = auth.uid());

drop policy if exists "categorias ativas são públicas" on public.categories;
create policy "categorias ativas são públicas" on public.categories for select using (active or public.is_admin());
drop policy if exists "admin gerencia categorias" on public.categories;
create policy "admin gerencia categorias" on public.categories for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "peças ativas são públicas" on public.products;
create policy "peças ativas são públicas" on public.products for select using (active or public.is_admin());
drop policy if exists "admin gerencia peças" on public.products;
create policy "admin gerencia peças" on public.products for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "fotos de peças ativas são públicas" on public.product_images;
create policy "fotos de peças ativas são públicas" on public.product_images for select using (
  exists (select 1 from public.products p where p.id = product_id and (p.active or public.is_admin()))
);
drop policy if exists "admin gerencia fotos" on public.product_images;
create policy "admin gerencia fotos" on public.product_images for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "variações de peças ativas são públicas" on public.product_variants;
create policy "variações de peças ativas são públicas" on public.product_variants for select using (
  exists (select 1 from public.products p where p.id = product_id and (p.active or public.is_admin()))
);
drop policy if exists "admin gerencia variações" on public.product_variants;
create policy "admin gerencia variações" on public.product_variants for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin gerencia histórico de estoque" on public.stock_movements;
create policy "admin gerencia histórico de estoque" on public.stock_movements for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "avaliações aprovadas são públicas" on public.reviews;
create policy "avaliações aprovadas são públicas" on public.reviews for select using (status = 'approved' or public.is_admin());
drop policy if exists "admin gerencia avaliações" on public.reviews;
create policy "admin gerencia avaliações" on public.reviews for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "conteúdo é público" on public.site_content;
create policy "conteúdo é público" on public.site_content for select using (true);
drop policy if exists "admin gerencia conteúdo" on public.site_content;
create policy "admin gerencia conteúdo" on public.site_content for all using (public.is_admin()) with check (public.is_admin());

-- ===========================================================================
-- Storage: bucket público "imagens" (produtos/, categorias/, site/)
-- Leitura pela URL pública; listar, enviar e apagar só para administradores.
-- ===========================================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('imagens', 'imagens', true, 3145728, array['image/webp', 'image/jpeg', 'image/png'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "admin lista imagens" on storage.objects;
create policy "admin lista imagens" on storage.objects for select using (bucket_id = 'imagens' and public.is_admin());
drop policy if exists "admin envia imagens" on storage.objects;
create policy "admin envia imagens" on storage.objects for insert with check (bucket_id = 'imagens' and public.is_admin());
drop policy if exists "admin altera imagens" on storage.objects;
create policy "admin altera imagens" on storage.objects for update using (bucket_id = 'imagens' and public.is_admin());
drop policy if exists "admin apaga imagens" on storage.objects;
create policy "admin apaga imagens" on storage.objects for delete using (bucket_id = 'imagens' and public.is_admin());
