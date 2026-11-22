-- NameLoop core schema (Supabase / Postgres)
-- Safe to re-run: uses IF NOT EXISTS

create extension if not exists "pgcrypto";

create table if not exists public.tenants (
  id uuid primary key default gen_random_uuid(),
  name varchar(160) not null,
  product_url varchar(512),
  business_model varchar(32),
  onboarded boolean not null default false,
  paused boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key, -- matches auth.users.id
  email varchar(320) not null unique,
  full_name varchar(160),
  avatar_url varchar(512),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.memberships (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role varchar(32) not null default 'owner',
  created_at timestamptz not null default now(),
  unique (tenant_id, user_id)
);

create table if not exists public.brains (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null unique references public.tenants(id) on delete cascade,
  version int not null default 1,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  company varchar(255) not null,
  domain varchar(255),
  email varchar(320),
  tracker_stage varchar(32) not null default 'ready_to_send',
  qualify varchar(32),
  sender varchar(16),
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists leads_tenant_stage_idx on public.leads (tenant_id, tracker_stage);

create table if not exists public.job_runs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete set null,
  kind varchar(64) not null,
  status varchar(32) not null default 'queued',
  detail text,
  cost_usd varchar(32),
  created_at timestamptz not null default now(),
  finished_at timestamptz
);

alter table public.tenants enable row level security;
alter table public.profiles enable row level security;
alter table public.memberships enable row level security;
alter table public.brains enable row level security;
alter table public.leads enable row level security;
alter table public.job_runs enable row level security;

-- FastAPI uses the postgres role (bypasses RLS). Policies below protect Data API access.

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select to authenticated
  using ((select auth.uid()) = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

drop policy if exists "memberships_select_own" on public.memberships;
create policy "memberships_select_own" on public.memberships
  for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "tenants_select_member" on public.tenants;
create policy "tenants_select_member" on public.tenants
  for select to authenticated
  using (
    exists (
      select 1 from public.memberships m
      where m.tenant_id = tenants.id and m.user_id = (select auth.uid())
    )
  );
