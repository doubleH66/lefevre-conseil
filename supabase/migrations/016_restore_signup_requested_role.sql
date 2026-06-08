-- Restaure le choix de rôle à l'inscription (requested_role dans user_metadata).
-- La migration 011 forçait toujours le rôle « client ».

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested text;
  new_role public.app_role;
  v_name text;
begin
  requested := lower(trim(coalesce(new.raw_user_meta_data ->> 'requested_role', '')));
  if requested = 'admin' then
    new_role := 'admin'::public.app_role;
  else
    new_role := 'client'::public.app_role;
  end if;

  v_name := coalesce(
    nullif(trim(new.raw_user_meta_data->>'full_name'), ''),
    nullif(trim(new.raw_user_meta_data->>'name'), ''),
    split_part(coalesce(new.email, ''), '@', 1)
  );

  insert into public.profiles (id, full_name, role)
  values (new.id, v_name, new_role)
  on conflict (id) do update
    set full_name = excluded.full_name,
        role = excluded.role,
        updated_at = now();

  return new;
end;
$$;

-- Autorise la montée admin si l'inscription a demandé ce rôle (metadata auth.users).
create or replace function public.profiles_prevent_role_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested text;
begin
  if new.role is distinct from old.role and not public.is_admin() then
    select lower(trim(coalesce(raw_user_meta_data ->> 'requested_role', '')))
    into requested
    from auth.users
    where id = new.id;

    if new.role = 'admin'::public.app_role and requested = 'admin' then
      return new;
    end if;

    raise exception 'Seul un administrateur peut modifier le champ role';
  end if;
  return new;
end;
$$;

-- Secours côté app après inscription / confirmation e-mail.
create or replace function public.apply_signup_requested_role()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  requested text;
begin
  if v_uid is null then
    return;
  end if;

  select lower(trim(coalesce(raw_user_meta_data ->> 'requested_role', '')))
  into requested
  from auth.users
  where id = v_uid;

  if requested <> 'admin' then
    return;
  end if;

  update public.profiles
  set role = 'admin'::public.app_role,
      updated_at = now()
  where id = v_uid
    and role is distinct from 'admin'::public.app_role;
end;
$$;

grant execute on function public.apply_signup_requested_role() to authenticated;

-- Comptes déjà créés avec requested_role = admin
update public.profiles p
set role = 'admin'::public.app_role,
    updated_at = now()
from auth.users u
where p.id = u.id
  and lower(trim(coalesce(u.raw_user_meta_data ->> 'requested_role', ''))) = 'admin'
  and p.role is distinct from 'admin'::public.app_role;
