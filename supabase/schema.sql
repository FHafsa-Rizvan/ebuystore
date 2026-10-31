-- Run this once in Supabase: SQL Editor -> New query -> paste -> Run.

-- 1. Products table
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  price integer not null check (price >= 0),
  description text not null default '',
  image_url text,
  in_stock boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;

-- Anyone can view products (the public shop)
create policy "Anyone can view products"
  on public.products for select
  using (true);

-- Only logged-in admin users can add, change or delete products
create policy "Admins can add products"
  on public.products for insert to authenticated
  with check (true);

create policy "Admins can update products"
  on public.products for update to authenticated
  using (true) with check (true);

create policy "Admins can delete products"
  on public.products for delete to authenticated
  using (true);

-- 2. Image storage bucket (public, so product photos show on the shop)
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "Admins can view product image files"
  on storage.objects for select to authenticated
  using (bucket_id = 'product-images');

create policy "Admins can upload product images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'product-images');

create policy "Admins can update product images"
  on storage.objects for update to authenticated
  using (bucket_id = 'product-images');

create policy "Admins can delete product images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'product-images');
