-- Run this in your Supabase SQL editor

-- Enable RLS
alter table if exists public.clients enable row level security;
alter table if exists public.reports enable row level security;

-- Clients table
create table if not exists public.clients (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  email text,
  phone text,
  date_of_birth date,
  notes text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Reports table
create table if not exists public.reports (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  client_id uuid references public.clients(id) on delete set null,
  title text not null,
  transcript text,
  content text,
  audio_url text,
  status text default 'draft' check (status in ('draft', 'processing', 'complete', 'error')),
  deleted_at timestamptz,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- RLS policies: clients
create policy "Users can manage own clients"
  on public.clients for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- RLS policies: reports
create policy "Users can manage own reports"
  on public.reports for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger handle_clients_updated_at
  before update on public.clients
  for each row execute procedure public.handle_updated_at();

create trigger handle_reports_updated_at
  before update on public.reports
  for each row execute procedure public.handle_updated_at();
