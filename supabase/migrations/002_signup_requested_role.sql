-- =============================================================================
-- Profil à l’inscription : prise en compte de requested_role (user_metadata)
-- Exécuter après 001_profiles_roles.sql
-- =============================================================================
-- Les métadonnées sont envoyées depuis l’app (signInWithOtp → options.data).
-- Attention prod : autoriser « admin » depuis le client expose un risque
-- (n’importe qui peut s’inscrire en admin). À durcir ensuite (invite only,
-- Edge Function, liste d’e-mails, etc.).
-- =============================================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested text;
  new_role public.app_role;
begin
  requested := lower(trim(coalesce(new.raw_user_meta_data ->> 'requested_role', '')));
  if requested = 'admin' then
    new_role := 'admin'::public.app_role;
  else
    new_role := 'client'::public.app_role;
  end if;

  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(
      nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
      split_part(coalesce(new.email, ''), '@', 1)
    ),
    new_role
  )
  on conflict (id) do nothing;

  return new;
end;
$$;
