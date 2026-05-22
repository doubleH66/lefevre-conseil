-- =============================================================================
-- Profil client : sauvegarde fiable (security definer) + ensure_client stable
-- Exécuter après 005_ensure_client_portal_access.sql
-- =============================================================================

-- Toujours le même compte client : membre le plus récent, sinon fiche la plus récente à l'e-mail
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
  inner join public.client_accounts ca on ca.id = cm.client_id
  where cm.user_id = v_uid
  order by ca.updated_at desc nulls last, cm.created_at desc
  limit 1;

  if v_client_id is not null then
    return v_client_id;
  end if;

  select ca.id into v_client_id
  from public.client_accounts ca
  where lower(ca.email) = lower(v_email)
  order by ca.updated_at desc nulls last, ca.created_at desc
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

-- Mise à jour du profil sur LE compte lié à l'utilisateur connecté
create or replace function public.update_my_client_account(
  p_company_name text,
  p_contact_name text,
  p_phone text default null,
  p_address text default null,
  p_website text default null
)
returns table (
  id uuid,
  company_name text,
  contact_name text,
  email text,
  phone text,
  address text,
  website text,
  status text,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_client_id uuid;
begin
  if nullif(trim(p_company_name), '') is null or nullif(trim(p_contact_name), '') is null then
    raise exception 'company_and_contact_required';
  end if;

  v_client_id := public.ensure_client_portal_access();

  return query
  update public.client_accounts ca
  set
    company_name = trim(p_company_name),
    contact_name = trim(p_contact_name),
    phone = nullif(trim(coalesce(p_phone, '')), ''),
    address = nullif(trim(coalesce(p_address, '')), ''),
    website = nullif(trim(coalesce(p_website, '')), ''),
    updated_at = now()
  where ca.id = v_client_id
  returning
    ca.id,
    ca.company_name,
    ca.contact_name,
    ca.email,
    ca.phone,
    ca.address,
    ca.website,
    ca.status,
    ca.updated_at;
end;
$$;

revoke all on function public.update_my_client_account(text, text, text, text, text) from public;
grant execute on function public.update_my_client_account(text, text, text, text, text) to authenticated;
