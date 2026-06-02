-- =============================================================================
-- 013 — Admin : suivi des leads mutuelle (statuts + notes)
-- Exécuter après 012_mutuelle_simulator.sql
-- =============================================================================

alter table public.mutuelle_leads
  add column if not exists admin_notes text;

-- Compatibilité si 012 a été appliquée avec l'ancien statut « new »
update public.mutuelle_leads set status = 'Reçue' where status = 'new';

alter table public.mutuelle_leads drop constraint if exists mutuelle_leads_status_check;
alter table public.mutuelle_leads add constraint mutuelle_leads_status_check
  check (status in ('draft', 'Reçue', 'En cours', 'Traitée', 'Archivée'));

create or replace function public.admin_update_mutuelle_lead_status(
  p_lead_id uuid,
  p_status text,
  p_admin_notes text default null
)
returns public.mutuelle_leads
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.mutuelle_leads;
begin
  if not public.is_admin() then
    raise exception 'Accès réservé aux administrateurs';
  end if;

  if p_status not in ('draft', 'Reçue', 'En cours', 'Traitée', 'Archivée') then
    raise exception 'Statut invalide';
  end if;

  update public.mutuelle_leads
  set
    status = p_status,
    admin_notes = coalesce(nullif(trim(p_admin_notes), ''), admin_notes),
    updated_at = now()
  where id = p_lead_id
  returning * into v_row;

  if v_row.id is null then
    raise exception 'Demande mutuelle introuvable';
  end if;

  perform public.log_admin_activity(
    'mutuelle_lead_status',
    'mutuelle_lead',
    v_row.id,
    jsonb_build_object('status', p_status)
  );

  return v_row;
end;
$$;

grant execute on function public.admin_update_mutuelle_lead_status(uuid, text, text) to authenticated;

grant update on public.mutuelle_leads to authenticated;
