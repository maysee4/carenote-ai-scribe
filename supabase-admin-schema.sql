-- Organizations (clinics)
create table if not exists public.organizations (
  id uuid default gen_random_uuid() primary key,
  owner_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  description text,
  address text,
  created_at timestamptz default now() not null
);
alter table public.organizations enable row level security;
-- Owner can manage their org
create policy "Owner manages org" on public.organizations for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
-- Members can read their org
create policy "Members can read org" on public.organizations for select using (
  exists (select 1 from public.organization_members m where m.organization_id = id and m.user_id = auth.uid())
);

-- Organization members (staff)
create table if not exists public.organization_members (
  id uuid default gen_random_uuid() primary key,
  organization_id uuid references public.organizations(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  role text not null check (role in ('admin', 'nurse', 'support_worker')),
  full_name text not null,
  email text not null,
  created_at timestamptz default now() not null,
  unique(organization_id, user_id)
);
alter table public.organization_members enable row level security;
-- Owner of org can manage members
create policy "Owner manages members" on public.organization_members for all using (
  exists (select 1 from public.organizations o where o.id = organization_id and o.owner_id = auth.uid())
) with check (
  exists (select 1 from public.organizations o where o.id = organization_id and o.owner_id = auth.uid())
);
-- Members can read other members in same org
create policy "Members read same org" on public.organization_members for select using (
  exists (select 1 from public.organization_members m where m.organization_id = organization_id and m.user_id = auth.uid())
);

-- Activity logs
create table if not exists public.activity_logs (
  id uuid default gen_random_uuid() primary key,
  organization_id uuid references public.organizations(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  user_name text not null,
  action text not null,
  details jsonb not null default '{}',
  created_at timestamptz default now() not null
);
alter table public.activity_logs enable row level security;
-- Owner can see all activity in their orgs
create policy "Owner sees activity" on public.activity_logs for all using (
  exists (select 1 from public.organizations o where o.id = organization_id and o.owner_id = auth.uid())
);
-- Members can insert their own activity
create policy "Members log activity" on public.activity_logs for insert with check (
  auth.uid() = user_id and
  exists (select 1 from public.organization_members m where m.organization_id = organization_id and m.user_id = auth.uid())
);
