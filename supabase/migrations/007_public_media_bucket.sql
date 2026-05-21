-- Fichiers publics admin : bucket + métadonnées (URLs copiables)
-- Exécuter après 001_profiles_roles.sql

insert into storage.buckets (id, name, public, file_size_limit)
values ('public-media', 'public-media', true, 104857600)
on conflict (id) do update set public = true;

create table if not exists public.public_media_files (
  id uuid primary key default gen_random_uuid(),
  original_name text not null,
  storage_path text not null unique,
  content_type text,
  size_bytes bigint,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists idx_public_media_files_created_at on public.public_media_files(created_at desc);

alter table public.public_media_files enable row level security;

drop policy if exists "public_media_files_admin_all" on public.public_media_files;
create policy "public_media_files_admin_all" on public.public_media_files
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

grant select, insert, delete on public.public_media_files to authenticated;

drop policy if exists "public_media_storage_admin_insert" on storage.objects;
create policy "public_media_storage_admin_insert" on storage.objects
for insert to authenticated
with check (bucket_id = 'public-media' and public.is_admin());

drop policy if exists "public_media_storage_admin_update" on storage.objects;
create policy "public_media_storage_admin_update" on storage.objects
for update to authenticated
using (bucket_id = 'public-media' and public.is_admin())
with check (bucket_id = 'public-media' and public.is_admin());

drop policy if exists "public_media_storage_admin_delete" on storage.objects;
create policy "public_media_storage_admin_delete" on storage.objects
for delete to authenticated
using (bucket_id = 'public-media' and public.is_admin());
