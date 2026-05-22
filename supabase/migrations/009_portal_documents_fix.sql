-- =============================================================================
-- Correctif portail : bucket pièces justificatives + droits SQL
-- Exécuter si l'envoi de fichiers échoue (bucket absent, MIME refusé, 403).
-- À lancer après 003_portal_schema_bucket.sql et 005_ensure_client_portal_access.sql
-- =============================================================================

-- Bucket (création ou mise à jour : MIME non restreint pour éviter les rejets navigateur)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portal-documents',
  'portal-documents',
  false,
  52428800,
  null
)
on conflict (id) do update
set
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = null;

-- Droits tables portail (idempotent)
grant select, insert, update on public.client_accounts to authenticated;
grant select, insert on public.client_members to authenticated;
grant select, insert, update on public.projects to authenticated;
grant select, insert, update on public.document_requests to authenticated;
grant select, insert, update on public.documents to authenticated;
grant select, insert, update on public.client_demands to authenticated;
grant select, insert, update on public.portal_messages to authenticated;
grant select, insert, update, delete on public.internal_notes to authenticated;

-- Policies Storage portal-documents (ré-appliquées)
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
