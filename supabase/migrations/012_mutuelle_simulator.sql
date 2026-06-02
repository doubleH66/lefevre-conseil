-- =============================================================================
-- 012 — Simulateur mutuelle : leads + logs API partenaires
-- Exécuter après 011_admin_business_tools.sql
-- =============================================================================

create table if not exists public.mutuelle_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  first_name text,
  last_name text,
  email text,
  phone text,
  postal_code text,
  birth_date date,

  profile_type text,
  professional_status text,
  has_current_mutuelle boolean,
  desired_change_date text,

  coverage_level text,
  health_priorities jsonb not null default '[]'::jsonb,
  monthly_budget_range text,

  spouse_birth_date date,
  spouse_has_coverage boolean,
  children_count integer,
  children_birth_dates jsonb not null default '[]'::jsonb,

  tns_activity_type text,
  madelin_interest text,

  senior_is_retired boolean,
  senior_priority_notes text,

  rgpd_consent boolean not null default false,
  rgpd_consent_at timestamptz,

  source_page text,
  admin_notes text,
  status text not null default 'draft'
    check (status in ('draft', 'Reçue', 'En cours', 'Traitée', 'Archivée')),

  api_enabled boolean not null default false,
  api_partner text,
  api_status text,
  api_error text,
  api_response_summary jsonb
);

create index if not exists mutuelle_leads_status_idx on public.mutuelle_leads (status, created_at desc);
create index if not exists mutuelle_leads_email_idx on public.mutuelle_leads (lower(email));

create table if not exists public.partner_api_logs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  lead_id uuid references public.mutuelle_leads(id) on delete set null,
  partner text not null,
  endpoint text not null,
  request_payload_redacted jsonb,
  response_status integer,
  response_payload_redacted jsonb,
  success boolean not null default false,
  error_message text,
  duration_ms integer
);

create index if not exists partner_api_logs_lead_idx on public.partner_api_logs (lead_id, created_at desc);

-- -----------------------------------------------------------------------------
-- updated_at
-- -----------------------------------------------------------------------------
create or replace function public.touch_mutuelle_leads_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists mutuelle_leads_updated_at on public.mutuelle_leads;
create trigger mutuelle_leads_updated_at
  before update on public.mutuelle_leads
  for each row execute function public.touch_mutuelle_leads_updated_at();

-- -----------------------------------------------------------------------------
-- RLS — admin lecture seule ; écriture via RPC security definer
-- -----------------------------------------------------------------------------
alter table public.mutuelle_leads enable row level security;
alter table public.partner_api_logs enable row level security;

drop policy if exists mutuelle_leads_admin_select on public.mutuelle_leads;
create policy mutuelle_leads_admin_select on public.mutuelle_leads
  for select using (public.is_admin());

drop policy if exists partner_api_logs_admin_select on public.partner_api_logs;
create policy partner_api_logs_admin_select on public.partner_api_logs
  for select using (public.is_admin());

grant select on public.mutuelle_leads to authenticated;
grant select on public.partner_api_logs to authenticated;

-- -----------------------------------------------------------------------------
-- Brouillon (étape 2+) — ne pas perdre le prospect
-- -----------------------------------------------------------------------------
create or replace function public.save_mutuelle_lead_draft(
  p_lead_id uuid default null,
  p_first_name text default null,
  p_last_name text default null,
  p_email text default null,
  p_phone text default null,
  p_postal_code text default null,
  p_birth_date date default null,
  p_profile_type text default null,
  p_source_page text default null,
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
begin
  if coalesce(trim(p_honeypot), '') <> '' then
    raise exception 'Requête refusée';
  end if;

  v_email := lower(trim(coalesce(p_email, '')));
  if v_email = '' or position('@' in v_email) = 0 then
    raise exception 'Adresse e-mail invalide';
  end if;

  if coalesce(trim(p_first_name), '') = '' or coalesce(trim(p_last_name), '') = '' then
    raise exception 'Prénom et nom requis';
  end if;

  if p_lead_id is not null then
    update public.mutuelle_leads
    set
      first_name = trim(p_first_name),
      last_name = trim(p_last_name),
      email = v_email,
      phone = nullif(trim(p_phone), ''),
      postal_code = nullif(trim(p_postal_code), ''),
      birth_date = p_birth_date,
      profile_type = nullif(trim(p_profile_type), ''),
      source_page = coalesce(nullif(trim(p_source_page), ''), source_page),
      status = 'draft'
    where id = p_lead_id and status = 'draft'
    returning id into v_id;

    if v_id is not null then
      return v_id;
    end if;
  end if;

  insert into public.mutuelle_leads (
    first_name, last_name, email, phone, postal_code, birth_date,
    profile_type, source_page, status
  )
  values (
    trim(p_first_name), trim(p_last_name), v_email,
    nullif(trim(p_phone), ''), nullif(trim(p_postal_code), ''),
    p_birth_date, nullif(trim(p_profile_type), ''),
    nullif(trim(p_source_page), ''), 'draft'
  )
  returning id into v_id;

  return v_id;
end;
$$;

grant execute on function public.save_mutuelle_lead_draft(
  uuid, text, text, text, text, text, date, text, text, text
) to anon, authenticated;

-- -----------------------------------------------------------------------------
-- Soumission finale
-- -----------------------------------------------------------------------------
create or replace function public.submit_mutuelle_lead(
  p_first_name text,
  p_last_name text,
  p_email text,
  p_lead_id uuid default null,
  p_phone text default null,
  p_postal_code text default null,
  p_birth_date date default null,
  p_profile_type text default null,
  p_professional_status text default null,
  p_has_current_mutuelle boolean default null,
  p_desired_change_date text default null,
  p_coverage_level text default null,
  p_health_priorities jsonb default '[]'::jsonb,
  p_monthly_budget_range text default null,
  p_spouse_birth_date date default null,
  p_spouse_has_coverage boolean default null,
  p_children_count integer default null,
  p_children_birth_dates jsonb default '[]'::jsonb,
  p_tns_activity_type text default null,
  p_madelin_interest text default null,
  p_senior_is_retired boolean default null,
  p_senior_priority_notes text default null,
  p_rgpd_consent boolean default false,
  p_source_page text default null,
  p_api_enabled boolean default false,
  p_api_partner text default null,
  p_api_status text default null,
  p_api_error text default null,
  p_api_response_summary jsonb default null,
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
  v_children_count integer;
begin
  if coalesce(trim(p_honeypot), '') <> '' then
    raise exception 'Requête refusée';
  end if;

  v_email := lower(trim(p_email));
  if v_email = '' or position('@' in v_email) = 0 then
    raise exception 'Adresse e-mail invalide';
  end if;

  if coalesce(trim(p_first_name), '') = '' or coalesce(trim(p_last_name), '') = '' then
    raise exception 'Prénom et nom requis';
  end if;

  if not coalesce(p_rgpd_consent, false) then
    raise exception 'Consentement RGPD requis';
  end if;

  v_children_count := coalesce(p_children_count, 0);
  if v_children_count < 0 or v_children_count > 8 then
    raise exception 'Nombre d''enfants invalide (maximum 8)';
  end if;

  if p_lead_id is not null then
    update public.mutuelle_leads
    set
      first_name = trim(p_first_name),
      last_name = trim(p_last_name),
      email = v_email,
      phone = nullif(trim(p_phone), ''),
      postal_code = nullif(trim(p_postal_code), ''),
      birth_date = p_birth_date,
      profile_type = nullif(trim(p_profile_type), ''),
      professional_status = nullif(trim(p_professional_status), ''),
      has_current_mutuelle = p_has_current_mutuelle,
      desired_change_date = nullif(trim(p_desired_change_date), ''),
      coverage_level = nullif(trim(p_coverage_level), ''),
      health_priorities = coalesce(p_health_priorities, '[]'::jsonb),
      monthly_budget_range = nullif(trim(p_monthly_budget_range), ''),
      spouse_birth_date = p_spouse_birth_date,
      spouse_has_coverage = p_spouse_has_coverage,
      children_count = v_children_count,
      children_birth_dates = coalesce(p_children_birth_dates, '[]'::jsonb),
      tns_activity_type = nullif(trim(p_tns_activity_type), ''),
      madelin_interest = nullif(trim(p_madelin_interest), ''),
      senior_is_retired = p_senior_is_retired,
      senior_priority_notes = nullif(trim(p_senior_priority_notes), ''),
      rgpd_consent = true,
      rgpd_consent_at = now(),
      source_page = nullif(trim(p_source_page), ''),
      status = 'Reçue',
      api_enabled = coalesce(p_api_enabled, false),
      api_partner = nullif(trim(p_api_partner), ''),
      api_status = nullif(trim(p_api_status), ''),
      api_error = nullif(trim(p_api_error), ''),
      api_response_summary = p_api_response_summary
    where id = p_lead_id
    returning id into v_id;
  end if;

  if v_id is null then
    insert into public.mutuelle_leads (
      first_name, last_name, email, phone, postal_code, birth_date,
      profile_type, professional_status, has_current_mutuelle, desired_change_date,
      coverage_level, health_priorities, monthly_budget_range,
      spouse_birth_date, spouse_has_coverage, children_count, children_birth_dates,
      tns_activity_type, madelin_interest, senior_is_retired, senior_priority_notes,
      rgpd_consent, rgpd_consent_at, source_page, status,
      api_enabled, api_partner, api_status, api_error, api_response_summary
    )
    values (
      trim(p_first_name), trim(p_last_name), v_email,
      nullif(trim(p_phone), ''), nullif(trim(p_postal_code), ''),
      p_birth_date, nullif(trim(p_profile_type), ''),
      nullif(trim(p_professional_status), ''), p_has_current_mutuelle,
      nullif(trim(p_desired_change_date), ''), nullif(trim(p_coverage_level), ''),
      coalesce(p_health_priorities, '[]'::jsonb), nullif(trim(p_monthly_budget_range), ''),
      p_spouse_birth_date, p_spouse_has_coverage, v_children_count,
      coalesce(p_children_birth_dates, '[]'::jsonb),
      nullif(trim(p_tns_activity_type), ''), nullif(trim(p_madelin_interest), ''),
      p_senior_is_retired, nullif(trim(p_senior_priority_notes), ''),
      true, now(), nullif(trim(p_source_page), ''), 'Reçue',
      coalesce(p_api_enabled, false), nullif(trim(p_api_partner), ''),
      nullif(trim(p_api_status), ''), nullif(trim(p_api_error), ''),
      p_api_response_summary
    )
    returning id into v_id;
  end if;

  perform public.create_admin_notification(
    'mutuelle_lead',
    'Nouvelle demande mutuelle',
    trim(p_first_name) || ' ' || trim(p_last_name) || ' — ' || coalesce(nullif(trim(p_profile_type), ''), 'profil'),
    '/espace-admin/demandes',
    'mutuelle_lead',
    v_id
  );

  return v_id;
end;
$$;

grant execute on function public.submit_mutuelle_lead(
  text, text, text, uuid, text, text, date, text, text, boolean, text,
  text, jsonb, text, date, boolean, integer, jsonb, text, text,
  boolean, text, boolean, text, boolean, text, text, text, jsonb, text
) to anon, authenticated;

-- -----------------------------------------------------------------------------
-- Journal appels API partenaires (serveur uniquement via RPC)
-- -----------------------------------------------------------------------------
create or replace function public.log_partner_api_call(
  p_lead_id uuid,
  p_partner text,
  p_endpoint text,
  p_request_payload_redacted jsonb default null,
  p_response_status integer default null,
  p_response_payload_redacted jsonb default null,
  p_success boolean default false,
  p_error_message text default null,
  p_duration_ms integer default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  if p_lead_id is null then
    raise exception 'lead_id requis';
  end if;

  if not exists (select 1 from public.mutuelle_leads where id = p_lead_id) then
    raise exception 'Lead introuvable';
  end if;

  insert into public.partner_api_logs (
    lead_id, partner, endpoint,
    request_payload_redacted, response_status, response_payload_redacted,
    success, error_message, duration_ms
  )
  values (
    p_lead_id, coalesce(nullif(trim(p_partner), ''), 'unknown'),
    coalesce(nullif(trim(p_endpoint), ''), 'unknown'),
    p_request_payload_redacted, p_response_status, p_response_payload_redacted,
    coalesce(p_success, false), nullif(trim(p_error_message), ''), p_duration_ms
  )
  returning id into v_id;

  return v_id;
end;
$$;

grant execute on function public.log_partner_api_call(
  uuid, text, text, jsonb, integer, jsonb, boolean, text, integer
) to anon, authenticated;
