-- =============================================================================
-- Espace client : droits SQL + bootstrap compte (contourne le 403 RLS au 1er login)
-- Exécuter après 003_portal_schema_bucket.sql et 004_client_self_link.sql
-- =============================================================================

-- Droits de base (sans GRANT, PostgREST renvoie 403 même si une policy RLS existerait)
grant select, insert, update on public.client_accounts to authenticated;
grant select, insert on public.client_members to authenticated;
grant select, insert, update on public.projects to authenticated;
grant select, insert, update on public.document_requests to authenticated;
grant select, insert, update on public.documents to authenticated;
grant select, insert, update on public.client_demands to authenticated;
grant select, insert, update on public.portal_messages to authenticated;

-- Admin : notes internes (RLS limite aux admins)
grant select, insert, update, delete on public.internal_notes to authenticated;

-- Crée ou relie le compte client de l'utilisateur connecté (security definer)
create or replace function public.ensure_client_portal_access()
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_email text;
  v_name text;
  v_client_id uuid;
begin
  if v_uid is null then
    raise exception 'not_authenticated';
  end if;

  select email into v_email from auth.users where id = v_uid;
  if v_email is null or trim(v_email) = '' then
    raise exception 'user_email_missing';
  end if;

  select cm.client_id into v_client_id
  from public.client_members cm
  where cm.user_id = v_uid
  limit 1;

  if v_client_id is not null then
    return v_client_id;
  end if;

  select ca.id into v_client_id
  from public.client_accounts ca
  where lower(ca.email) = lower(v_email)
  limit 1;

  if v_client_id is null then
    select coalesce(nullif(trim(p.full_name), ''), split_part(v_email, '@', 1), 'Client')
    into v_name
    from public.profiles p
    where p.id = v_uid;

    insert into public.client_accounts (company_name, contact_name, email, status)
    values (coalesce(v_name, 'Client'), coalesce(v_name, 'Client'), v_email, 'Actif')
    returning id into v_client_id;
  end if;

  insert into public.client_members (client_id, user_id, role)
  values (v_client_id, v_uid, 'owner')
  on conflict (client_id, user_id) do nothing;

  return v_client_id;
end;
$$;

revoke all on function public.ensure_client_portal_access() from public;
grant execute on function public.ensure_client_portal_access() to authenticated;

-- Policies 004 : email via JWT (plus fiable que auth.users en RLS)
drop policy if exists "client_accounts_client_insert_own" on public.client_accounts;
create policy "client_accounts_client_insert_own" on public.client_accounts
for insert to authenticated
with check (
  lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
);

drop policy if exists "client_members_client_insert_self" on public.client_members;
create policy "client_members_client_insert_self" on public.client_members
for insert to authenticated
with check (
  user_id = auth.uid()
  and exists (
    select 1
    from public.client_accounts ca
    where ca.id = client_id
      and lower(ca.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  )
);
