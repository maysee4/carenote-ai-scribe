-- Run this in your Supabase SQL editor to add knowledge base and saved forms support

-- Add description column to clients (for onboarding notes about the client)
alter table public.clients add column if not exists description text;

-- Client knowledge base table
create table if not exists public.client_knowledge (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  client_id uuid references public.clients(id) on delete cascade not null,
  category text not null default 'general',
  content text not null,
  source text default 'manual',
  created_at timestamptz default now() not null
);

alter table public.client_knowledge enable row level security;

create policy "Users can manage own client knowledge"
  on public.client_knowledge for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Saved forms table
create table if not exists public.saved_forms (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  client_id uuid references public.clients(id) on delete cascade not null,
  form_id text not null,
  form_name text not null,
  form_fields jsonb not null default '{}',
  original_prompt text,
  created_at timestamptz default now() not null
);

alter table public.saved_forms enable row level security;

create policy "Users can manage own saved forms"
  on public.saved_forms for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
