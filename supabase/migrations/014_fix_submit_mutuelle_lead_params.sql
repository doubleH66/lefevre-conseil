-- =============================================================================
-- 014 — Correctif submit_mutuelle_lead (42P13 + GRANT 42883)
-- PRÉREQUIS : tables mutuelle_leads déjà créées (migration 012 ou 015).
-- Si erreur 42P01 « mutuelle_leads does not exist » → exécutez 015_mutuelle_install.sql
-- =============================================================================

-- Ancienne signature (p_lead_id en premier) ou GRANT erroné (31 types)
drop function if exists public.submit_mutuelle_lead(
  uuid, text, text, text, text, text, date, text, text, boolean, text,
  text, jsonb, text, date, boolean, integer, jsonb, text, text,
  boolean, text, boolean, text, boolean, text, text, text, text, jsonb, text
);

drop function if exists public.submit_mutuelle_lead(
  text, text, text, uuid, text, text, date, text, text, boolean, text,
  text, jsonb, text, date, boolean, integer, jsonb, text, text,
  boolean, text, boolean, text, boolean, text, text, text, text, jsonb, text
);

drop function if exists public.submit_mutuelle_lead(
  text, text, text, uuid, text, text, date, text, text, boolean, text,
  text, jsonb, text, date, boolean, integer, jsonb, text, text,
  boolean, text, boolean, text, boolean, text, text, text, jsonb, text
);

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

-- 30 paramètres — doit correspondre exactement à la signature ci-dessus
grant execute on function public.submit_mutuelle_lead(
  text, text, text, uuid, text, text, date, text, text, boolean, text,
  text, jsonb, text, date, boolean, integer, jsonb, text, text,
  boolean, text, boolean, text, boolean, text, text, text, jsonb, text
) to anon, authenticated;
