-- =============================================================================
-- Lefevre / Heritage - Supabase : profils + rôles client / admin
-- À exécuter dans : Supabase Dashboard → SQL Editor → New query → Run
-- (ou : supabase db push si vous utilisez la CLI Supabase)
-- =============================================================================
--
-- Après exécution :
-- 1. Authentication → URL configuration : Site URL = http://localhost:3000 (prod : votre domaine)
-- 2. Redirect URLs : http://localhost:3000/auth/callback
-- 3. Créer un utilisateur (Auth → Users) ou via /login (magic link)
-- 4. Promouvoir un admin (requête tout en bas)
-- =============================================================================

-- Rôle applicatif (ignorer l’erreur si vous ré-exécutez ce script sur un projet déjà migré)
do $$ begin
  create type public.app_role as enum ('client', 'admin');
exception
  when duplicate_object then null;
end $$;

-- Profil lié à auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  role public.app_role not null default 'client',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'Profil utilisateur : rôle client (défaut) ou admin.';

-- updated_at automatique
create or replace function public.set_profiles_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.set_profiles_updated_at();

-- Création profil à l’inscription (Auth)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(
      nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
      split_part(coalesce(new.email, ''), '@', 1)
    ),
    'client'::public.app_role
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Indique si l’utilisateur courant est admin (pour RLS)
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'::public.app_role
  );
$$;

revoke all on public.profiles from public;
grant select, insert, update, delete on public.profiles to service_role;
grant select, insert, update on public.profiles to authenticated;

alter table public.profiles enable row level security;

-- Lecture : soi-même
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

-- Lecture : tous les profils si admin
drop policy if exists "profiles_select_admin" on public.profiles;
create policy "profiles_select_admin"
  on public.profiles
  for select
  to authenticated
  using (public.is_admin());

-- Mise à jour : son propre profil (changement de rôle bloqué par trigger ci-dessous)
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

create or replace function public.profiles_prevent_role_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role and not public.is_admin() then
    raise exception 'Seul un administrateur peut modifier le champ role';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_profiles_role_guard on public.profiles;
create trigger trg_profiles_role_guard
  before update on public.profiles
  for each row
  execute function public.profiles_prevent_role_escalation();

-- Mise à jour : admin sur tous les profils
drop policy if exists "profiles_update_admin" on public.profiles;
create policy "profiles_update_admin"
  on public.profiles
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Insert manuel (secours) : uniquement sa propre ligne
drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles
  for insert
  to authenticated
  with check (auth.uid() = id);

-- =============================================================================
-- Profils pour utilisateurs déjà créés avant ce script (sans trigger)
-- =============================================================================
insert into public.profiles (id, full_name, role)
select
  u.id,
  coalesce(nullif(trim(u.raw_user_meta_data ->> 'full_name'), ''), split_part(u.email, '@', 1)),
  'client'::public.app_role
from auth.users u
where not exists (select 1 from public.profiles p where p.id = u.id)
on conflict (id) do nothing;

-- =============================================================================
-- Promouvoir un utilisateur en admin (remplacer l’e-mail)
-- Pour l’inscription avec choix du rôle depuis l’app, exécuter aussi
-- supabase/migrations/002_signup_requested_role.sql après ce fichier.
-- =============================================================================
-- update public.profiles
-- set role = 'admin'::public.app_role
-- where id = (select id from auth.users where email = 'vous@domaine.com' limit 1);
