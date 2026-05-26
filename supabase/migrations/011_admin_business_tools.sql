-- =============================================================================
-- 011 — Outil métier admin : leads site, notifications, historique, CRUD clients
-- Exécuter après 010_client_profile_save.sql
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Leads / demandes depuis le site public (prospects)
-- -----------------------------------------------------------------------------
create table if not exists public.site_leads (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  current_situation text,
  request_type text not null,
  patrimonial_goal text,
  approximate_amount text,
  message text,
  contact_preference text not null default 'either'
    check (contact_preference in ('email', 'phone', 'either')),
  gdpr_consent boolean not null default false,
  status text not null default 'Reçue'
    check (status in ('Reçue', 'En cours', 'Traitée', 'Archivée')),
  source text not null default 'site',
  client_id uuid references public.client_accounts(id) on delete set null,
  assigned_to uuid references auth.users(id) on delete set null,
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists site_leads_status_idx on public.site_leads (status, created_at desc);
create index if not exists site_leads_email_idx on public.site_leads (lower(email));

-- -----------------------------------------------------------------------------
-- Notifications admin (in-app)
-- -----------------------------------------------------------------------------
create table if not exists public.admin_notifications (
  id uuid primary key default gen_random_uuid(),
  kind text not null,
  title text not null,
  body text,
  link text,
  entity_type text,
  entity_id uuid,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists admin_notifications_unread_idx
  on public.admin_notifications (read_at nulls first, created_at desc);

-- -----------------------------------------------------------------------------
-- Journal d'activité admin
-- -----------------------------------------------------------------------------
create table if not exists public.admin_activity_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists admin_activity_log_created_idx
  on public.admin_activity_log (created_at desc);

-- -----------------------------------------------------------------------------
-- Trigger updated_at site_leads
-- -----------------------------------------------------------------------------
create or replace function public.touch_site_leads_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists site_leads_updated_at on public.site_leads;
create trigger site_leads_updated_at
  before update on public.site_leads
  for each row execute function public.touch_site_leads_updated_at();

-- -----------------------------------------------------------------------------
-- RLS
-- -----------------------------------------------------------------------------
alter table public.site_leads enable row level security;
alter table public.admin_notifications enable row level security;
alter table public.admin_activity_log enable row level security;

drop policy if exists site_leads_admin_all on public.site_leads;
create policy site_leads_admin_all on public.site_leads
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists admin_notifications_admin_all on public.admin_notifications;
create policy admin_notifications_admin_all on public.admin_notifications
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists admin_activity_log_admin_all on public.admin_activity_log;
create policy admin_activity_log_admin_all on public.admin_activity_log
  for all using (public.is_admin()) with check (public.is_admin());

-- internal_notes : admin only (table exists in 003, ensure policy if missing)
alter table public.internal_notes enable row level security;
drop policy if exists internal_notes_admin_all on public.internal_notes;
create policy internal_notes_admin_all on public.internal_notes
  for all using (public.is_admin()) with check (public.is_admin());

grant select, insert, update, delete on public.site_leads to authenticated;
grant select, insert, update, delete on public.admin_notifications to authenticated;
grant select, insert on public.admin_activity_log to authenticated;
grant select, insert, update, delete on public.internal_notes to authenticated;

-- -----------------------------------------------------------------------------
-- Helpers
-- -----------------------------------------------------------------------------
create or replace function public.log_admin_activity(
  p_action text,
  p_entity_type text,
  p_entity_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Accès réservé aux administrateurs';
  end if;
  insert into public.admin_activity_log (actor_id, action, entity_type, entity_id, metadata)
  values (auth.uid(), p_action, p_entity_type, p_entity_id, coalesce(p_metadata, '{}'::jsonb));
end;
$$;

create or replace function public.create_admin_notification(
  p_kind text,
  p_title text,
  p_body text default null,
  p_link text default null,
  p_entity_type text default null,
  p_entity_id uuid default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  insert into public.admin_notifications (kind, title, body, link, entity_type, entity_id)
  values (p_kind, p_title, p_body, p_link, p_entity_type, p_entity_id)
  returning id into v_id;
  return v_id;
end;
$$;

-- -----------------------------------------------------------------------------
-- Soumission publique lead (via RPC — pas d'insert direct anon)
-- -----------------------------------------------------------------------------
create or replace function public.submit_site_lead(
  p_first_name text,
  p_last_name text,
  p_email text,
  p_phone text default null,
  p_current_situation text default null,
  p_request_type text default null,
  p_patrimonial_goal text default null,
  p_approximate_amount text default null,
  p_message text default null,
  p_contact_preference text default 'either',
  p_gdpr_consent boolean default false,
  p_honeypot text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_email text;
  v_type text;
begin
  if coalesce(trim(p_honeypot), '') <> '' then
    raise exception 'Requête refusée';
  end if;

  v_email := lower(trim(p_email));
  if v_email is null or v_email = '' or position('@' in v_email) = 0 then
    raise exception 'Adresse e-mail invalide';
  end if;

  if coalesce(trim(p_first_name), '') = '' or coalesce(trim(p_last_name), '') = '' then
    raise exception 'Prénom et nom requis';
  end if;

  if not coalesce(p_gdpr_consent, false) then
    raise exception 'Consentement RGPD requis';
  end if;

  v_type := coalesce(nullif(trim(p_request_type), ''), 'Demande générale');

  insert into public.site_leads (
    first_name, last_name, email, phone, current_situation, request_type,
    patrimonial_goal, approximate_amount, message, contact_preference, gdpr_consent
  )
  values (
    trim(p_first_name), trim(p_last_name), v_email, nullif(trim(p_phone), ''),
    nullif(trim(p_current_situation), ''), v_type,
    nullif(trim(p_patrimonial_goal), ''), nullif(trim(p_approximate_amount), ''),
    nullif(trim(p_message), ''), coalesce(nullif(trim(p_contact_preference), ''), 'either'),
    true
  )
  returning id into v_id;

  perform public.create_admin_notification(
    'site_lead',
    'Nouvelle demande site',
    trim(p_first_name) || ' ' || trim(p_last_name) || ' — ' || v_type,
    '/espace-admin/demandes',
    'site_lead',
    v_id
  );

  return v_id;
end;
$$;

grant execute on function public.submit_site_lead(
  text, text, text, text, text, text, text, text, text, text, boolean, text
) to anon, authenticated;

-- -----------------------------------------------------------------------------
-- CRUD client admin
-- -----------------------------------------------------------------------------
create or replace function public.admin_create_client_account(
  p_company_name text,
  p_contact_name text,
  p_email text,
  p_phone text default null,
  p_address text default null,
  p_website text default null,
  p_status text default 'Actif'
)
returns public.client_accounts
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.client_accounts;
begin
  if not public.is_admin() then
    raise exception 'Accès réservé aux administrateurs';
  end if;

  if coalesce(trim(p_company_name), '') = '' or coalesce(trim(p_contact_name), '') = '' then
    raise exception 'Raison sociale et contact requis';
  end if;

  if coalesce(trim(p_email), '') = '' then
    raise exception 'E-mail requis';
  end if;

  insert into public.client_accounts (
    company_name, contact_name, email, phone, address, website, status
  )
  values (
    trim(p_company_name),
    trim(p_contact_name),
    lower(trim(p_email)),
    nullif(trim(p_phone), ''),
    nullif(trim(p_address), ''),
    nullif(trim(p_website), ''),
    coalesce(nullif(trim(p_status), ''), 'Actif')
  )
  returning * into v_row;

  perform public.log_admin_activity(
    'client_created',
    'client_account',
    v_row.id,
    jsonb_build_object('email', v_row.email, 'company', v_row.company_name)
  );

  perform public.create_admin_notification(
    'client',
    'Nouveau client créé',
    v_row.company_name,
    '/espace-admin/clients',
    'client_account',
    v_row.id
  );

  return v_row;
end;
$$;

create or replace function public.admin_update_client_account(
  p_client_id uuid,
  p_company_name text,
  p_contact_name text,
  p_email text,
  p_phone text default null,
  p_address text default null,
  p_website text default null,
  p_status text default 'Actif'
)
returns public.client_accounts
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.client_accounts;
begin
  if not public.is_admin() then
    raise exception 'Accès réservé aux administrateurs';
  end if;

  update public.client_accounts
  set
    company_name = trim(p_company_name),
    contact_name = trim(p_contact_name),
    email = lower(trim(p_email)),
    phone = nullif(trim(p_phone), ''),
    address = nullif(trim(p_address), ''),
    website = nullif(trim(p_website), ''),
    status = coalesce(nullif(trim(p_status), ''), 'Actif'),
    updated_at = now()
  where id = p_client_id
  returning * into v_row;

  if v_row.id is null then
    raise exception 'Client introuvable';
  end if;

  perform public.log_admin_activity(
    'client_updated',
    'client_account',
    v_row.id,
    jsonb_build_object('email', v_row.email)
  );

  return v_row;
end;
$$;

create or replace function public.admin_update_site_lead_status(
  p_lead_id uuid,
  p_status text,
  p_admin_notes text default null
)
returns public.site_leads
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.site_leads;
begin
  if not public.is_admin() then
    raise exception 'Accès réservé aux administrateurs';
  end if;

  update public.site_leads
  set
    status = p_status,
    admin_notes = coalesce(nullif(trim(p_admin_notes), ''), admin_notes),
    updated_at = now()
  where id = p_lead_id
  returning * into v_row;

  if v_row.id is null then
    raise exception 'Demande introuvable';
  end if;

  perform public.log_admin_activity(
    'site_lead_status',
    'site_lead',
    v_row.id,
    jsonb_build_object('status', p_status)
  );

  return v_row;
end;
$$;

create or replace function public.admin_add_internal_note(
  p_client_id uuid,
  p_note text,
  p_project_id uuid default null
)
returns public.internal_notes
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.internal_notes;
begin
  if not public.is_admin() then
    raise exception 'Accès réservé aux administrateurs';
  end if;

  if coalesce(trim(p_note), '') = '' then
    raise exception 'Note vide';
  end if;

  insert into public.internal_notes (client_id, project_id, note, created_by)
  values (p_client_id, p_project_id, trim(p_note), auth.uid())
  returning * into v_row;

  perform public.log_admin_activity(
    'internal_note_added',
    'internal_note',
    v_row.id,
    jsonb_build_object('client_id', p_client_id)
  );

  return v_row;
end;
$$;

create or replace function public.admin_send_portal_message(
  p_client_id uuid,
  p_body text
)
returns public.portal_messages
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.portal_messages;
begin
  if not public.is_admin() then
    raise exception 'Accès réservé aux administrateurs';
  end if;

  if coalesce(trim(p_body), '') = '' then
    raise exception 'Message vide';
  end if;

  insert into public.portal_messages (client_id, sender_type, body, sender_id, status)
  values (p_client_id, 'team', trim(p_body), auth.uid(), 'Envoyé')
  returning * into v_row;

  perform public.log_admin_activity(
    'message_sent',
    'portal_message',
    v_row.id,
    jsonb_build_object('client_id', p_client_id)
  );

  perform public.create_admin_notification(
    'message',
    'Message envoyé au client',
    left(trim(p_body), 120),
    '/espace-admin/messages',
    'portal_message',
    v_row.id
  );

  return v_row;
end;
$$;

grant execute on function public.admin_create_client_account(text, text, text, text, text, text, text) to authenticated;
grant execute on function public.admin_update_client_account(uuid, text, text, text, text, text, text, text) to authenticated;
grant execute on function public.admin_update_site_lead_status(uuid, text, text) to authenticated;
grant execute on function public.admin_add_internal_note(uuid, text, uuid) to authenticated;
grant execute on function public.admin_send_portal_message(uuid, text) to authenticated;
grant execute on function public.log_admin_activity(text, text, uuid, jsonb) to authenticated;
grant execute on function public.create_admin_notification(text, text, text, text, text, uuid) to authenticated;

-- -----------------------------------------------------------------------------
-- Sécurité inscription : forcer rôle client (ignorer requested_role admin)
-- -----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role public.app_role := 'client';
  v_name text;
begin
  v_name := coalesce(
    nullif(trim(new.raw_user_meta_data->>'full_name'), ''),
    nullif(trim(new.raw_user_meta_data->>'name'), ''),
    split_part(new.email, '@', 1)
  );

  insert into public.profiles (id, full_name, role)
  values (new.id, v_name, v_role)
  on conflict (id) do update
    set full_name = excluded.full_name,
        updated_at = now();

  return new;
end;
$$;
