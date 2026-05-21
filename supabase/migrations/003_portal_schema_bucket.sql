-- =============================================================================
-- Portail SaaS (client + admin) : schéma métier + bucket Storage
-- Exécuter après 001_profiles_roles.sql
-- =============================================================================

create extension if not exists pgcrypto;

-- -----------------------------------------------------------------------------
-- Tables
-- -----------------------------------------------------------------------------
create table if not exists public.client_accounts (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  contact_name text not null,
  email text not null,
  phone text,
  address text,
  website text,
  status text not null default 'Actif' check (status in ('Actif', 'En attente', 'À relancer')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.client_members (
  client_id uuid not null references public.client_accounts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'owner' check (role in ('owner', 'member', 'viewer')),
  created_at timestamptz not null default now(),
  primary key (client_id, user_id)
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.client_accounts(id) on delete cascade,
  name text not null,
  description text,
  status text not null default 'En attente' check (status in ('En attente', 'En cours', 'En validation', 'Terminé')),
  progress int not null default 0 check (progress >= 0 and progress <= 100),
  start_date date,
  target_date date,
  next_step text,
  owner_name text,
  client_todo text,
  internal_notes text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.document_requests (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.client_accounts(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  name text not null,
  description text,
  due_date date,
  priority text not null default 'Normal' check (priority in ('Normal', 'Important', 'Urgent')),
  status text not null default 'Demandé' check (status in ('Demandé', 'Envoyé', 'Validé', 'Refusé', 'À corriger')),
  requested_by uuid references auth.users(id),
  message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.client_accounts(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  request_id uuid references public.document_requests(id) on delete set null,
  storage_path text not null,
  original_name text not null,
  status text not null default 'Reçu' check (status in ('En attente', 'Reçu', 'Validé', 'Refusé', 'À corriger')),
  comment text,
  uploaded_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.client_demands (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.client_accounts(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  content text not null,
  status text not null default 'Reçue' check (status in ('Reçue', 'En cours', 'Traitée')),
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.portal_messages (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.client_accounts(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  sender_type text not null check (sender_type in ('client', 'team')),
  sender_id uuid references auth.users(id),
  body text not null,
  status text not null default 'Envoyé' check (status in ('Envoyé', 'Lu', 'En attente')),
  created_at timestamptz not null default now()
);

create table if not exists public.internal_notes (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.client_accounts(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  note text not null,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- Fonctions utilitaires RLS (après création des tables référencées)
-- -----------------------------------------------------------------------------
create or replace function public.user_client_ids()
returns setof uuid
language sql
stable
security definer
set search_path = public
as $$
  select cm.client_id
  from public.client_members cm
  where cm.user_id = auth.uid();
$$;

create or replace function public.user_is_client_member(p_client_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.client_members cm
    where cm.client_id = p_client_id
      and cm.user_id = auth.uid()
  );
$$;

-- -----------------------------------------------------------------------------
-- updated_at triggers
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_client_accounts_updated_at on public.client_accounts;
create trigger trg_client_accounts_updated_at before update on public.client_accounts
for each row execute function public.set_updated_at();

drop trigger if exists trg_projects_updated_at on public.projects;
create trigger trg_projects_updated_at before update on public.projects
for each row execute function public.set_updated_at();

drop trigger if exists trg_document_requests_updated_at on public.document_requests;
create trigger trg_document_requests_updated_at before update on public.document_requests
for each row execute function public.set_updated_at();

drop trigger if exists trg_documents_updated_at on public.documents;
create trigger trg_documents_updated_at before update on public.documents
for each row execute function public.set_updated_at();

drop trigger if exists trg_client_demands_updated_at on public.client_demands;
create trigger trg_client_demands_updated_at before update on public.client_demands
for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- RLS
-- -----------------------------------------------------------------------------
alter table public.client_accounts enable row level security;
alter table public.client_members enable row level security;
alter table public.projects enable row level security;
alter table public.document_requests enable row level security;
alter table public.documents enable row level security;
alter table public.client_demands enable row level security;
alter table public.portal_messages enable row level security;
alter table public.internal_notes enable row level security;

-- client_accounts
drop policy if exists "client_accounts_admin_all" on public.client_accounts;
create policy "client_accounts_admin_all" on public.client_accounts
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "client_accounts_member_select" on public.client_accounts;
create policy "client_accounts_member_select" on public.client_accounts
for select to authenticated
using (public.user_is_client_member(id));

-- client_members
drop policy if exists "client_members_admin_all" on public.client_members;
create policy "client_members_admin_all" on public.client_members
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "client_members_select_own" on public.client_members;
create policy "client_members_select_own" on public.client_members
for select to authenticated
using (user_id = auth.uid());

-- projects
drop policy if exists "projects_admin_all" on public.projects;
create policy "projects_admin_all" on public.projects
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "projects_member_rw" on public.projects;
create policy "projects_member_rw" on public.projects
for all to authenticated
using (public.user_is_client_member(client_id))
with check (public.user_is_client_member(client_id));

-- document_requests
drop policy if exists "document_requests_admin_all" on public.document_requests;
create policy "document_requests_admin_all" on public.document_requests
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "document_requests_member_rw" on public.document_requests;
create policy "document_requests_member_rw" on public.document_requests
for all to authenticated
using (public.user_is_client_member(client_id))
with check (public.user_is_client_member(client_id));

-- documents
drop policy if exists "documents_admin_all" on public.documents;
create policy "documents_admin_all" on public.documents
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "documents_member_rw" on public.documents;
create policy "documents_member_rw" on public.documents
for all to authenticated
using (public.user_is_client_member(client_id))
with check (public.user_is_client_member(client_id));

-- client_demands
drop policy if exists "client_demands_admin_all" on public.client_demands;
create policy "client_demands_admin_all" on public.client_demands
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "client_demands_member_rw" on public.client_demands;
create policy "client_demands_member_rw" on public.client_demands
for all to authenticated
using (public.user_is_client_member(client_id))
with check (public.user_is_client_member(client_id));

-- portal_messages
drop policy if exists "portal_messages_admin_all" on public.portal_messages;
create policy "portal_messages_admin_all" on public.portal_messages
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "portal_messages_member_rw" on public.portal_messages;
create policy "portal_messages_member_rw" on public.portal_messages
for all to authenticated
using (public.user_is_client_member(client_id))
with check (public.user_is_client_member(client_id));

-- internal_notes (admin uniquement)
drop policy if exists "internal_notes_admin_all" on public.internal_notes;
create policy "internal_notes_admin_all" on public.internal_notes
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- Bucket Storage : portal-documents
-- Convention de chemin : <client_id>/<project_id>/<filename>
-- -----------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portal-documents',
  'portal-documents',
  false,
  52428800,
  array[
    'application/pdf',
    'image/png',
    'image/jpeg',
    'image/webp',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword'
  ]
)
on conflict (id) do nothing;

drop policy if exists "portal_docs_admin_all" on storage.objects;
create policy "portal_docs_admin_all" on storage.objects
for all to authenticated
using (bucket_id = 'portal-documents' and public.is_admin())
with check (bucket_id = 'portal-documents' and public.is_admin());

drop policy if exists "portal_docs_member_select" on storage.objects;
create policy "portal_docs_member_select" on storage.objects
for select to authenticated
using (
  bucket_id = 'portal-documents'
  and (
    public.is_admin()
    or split_part(name, '/', 1) in (
      select cm.client_id::text from public.client_members cm where cm.user_id = auth.uid()
    )
  )
);

drop policy if exists "portal_docs_member_insert" on storage.objects;
create policy "portal_docs_member_insert" on storage.objects
for insert to authenticated
with check (
  bucket_id = 'portal-documents'
  and (
    public.is_admin()
    or split_part(name, '/', 1) in (
      select cm.client_id::text from public.client_members cm where cm.user_id = auth.uid()
    )
  )
);

drop policy if exists "portal_docs_member_update_delete" on storage.objects;
create policy "portal_docs_member_update_delete" on storage.objects
for update to authenticated
using (
  bucket_id = 'portal-documents'
  and (
    public.is_admin()
    or split_part(name, '/', 1) in (
      select cm.client_id::text from public.client_members cm where cm.user_id = auth.uid()
    )
  )
)
with check (
  bucket_id = 'portal-documents'
  and (
    public.is_admin()
    or split_part(name, '/', 1) in (
      select cm.client_id::text from public.client_members cm where cm.user_id = auth.uid()
    )
  )
);

drop policy if exists "portal_docs_member_delete" on storage.objects;
create policy "portal_docs_member_delete" on storage.objects
for delete to authenticated
using (
  bucket_id = 'portal-documents'
  and (
    public.is_admin()
    or split_part(name, '/', 1) in (
      select cm.client_id::text from public.client_members cm where cm.user_id = auth.uid()
    )
  )
);

-- -----------------------------------------------------------------------------
-- Indexes
-- -----------------------------------------------------------------------------
create index if not exists idx_projects_client_id on public.projects(client_id);
create index if not exists idx_document_requests_client_id on public.document_requests(client_id);
create index if not exists idx_documents_client_id on public.documents(client_id);
create index if not exists idx_client_demands_client_id on public.client_demands(client_id);
create index if not exists idx_portal_messages_client_id on public.portal_messages(client_id);
create index if not exists idx_client_members_user_id on public.client_members(user_id);

