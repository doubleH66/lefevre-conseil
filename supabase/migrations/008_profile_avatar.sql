-- Photo de profil utilisateur (espace client / admin)
-- Exécuter après 007_public_media_bucket.sql

alter table public.profiles
  add column if not exists avatar_url text;

comment on column public.profiles.avatar_url is 'URL publique de la photo de profil (bucket profile-avatars).';

-- Bucket dédié : chemin {user_id}/{filename}
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'profile-avatars',
  'profile-avatars',
  true,
  5242880,
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = true,
  file_size_limit = 5242880;

drop policy if exists "profile_avatars_public_read" on storage.objects;
create policy "profile_avatars_public_read" on storage.objects
for select to public
using (bucket_id = 'profile-avatars');

drop policy if exists "profile_avatars_own_insert" on storage.objects;
create policy "profile_avatars_own_insert" on storage.objects
for insert to authenticated
with check (
  bucket_id = 'profile-avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "profile_avatars_own_update" on storage.objects;
create policy "profile_avatars_own_update" on storage.objects
for update to authenticated
using (
  bucket_id = 'profile-avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'profile-avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "profile_avatars_own_delete" on storage.objects;
create policy "profile_avatars_own_delete" on storage.objects
for delete to authenticated
using (
  bucket_id = 'profile-avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);
