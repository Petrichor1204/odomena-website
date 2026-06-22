-- Run this in the Supabase SQL Editor

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price numeric(10, 2) not null check (price >= 0),
  description text not null default '',
  image_url text not null,
  created_at timestamptz not null default now()
);

create table if not exists purchase_requests (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete set null,
  product_name text not null,
  customer_name text not null,
  contact_info text not null,
  created_at timestamptz not null default now()
);

create index if not exists products_created_at_idx on products (created_at desc);
create index if not exists purchase_requests_created_at_idx on purchase_requests (created_at desc);

alter table products enable row level security;
alter table purchase_requests enable row level security;

-- Public can browse products
create policy "Products are publicly readable"
  on products for select
  using (true);

-- Public can submit purchase requests
create policy "Anyone can submit purchase requests"
  on purchase_requests for insert
  with check (true);
