-- Vérification droits profil espace client (à coller dans Supabase → SQL Editor)
-- Projet attendu : gyisrwfapphqqdbpujtb

-- 1) GRANT table (rôle authenticated doit avoir SELECT + UPDATE minimum)
select table_name, privilege_type
from information_schema.role_table_grants
where table_schema = 'public'
  and table_name in ('client_accounts', 'client_members', 'profiles')
  and grantee = 'authenticated'
order by table_name, privilege_type;

-- 2) RPC profil (EXECUTE obligatoire)
select p.proname,
       has_function_privilege('authenticated', p.oid, 'EXECUTE') as ok
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname in ('ensure_client_portal_access', 'update_my_client_account');

-- 3) RLS client_accounts (SELECT + UPDATE requis pour le repli direct)
select polname, polcmd
from pg_policies
where schemaname = 'public' and tablename = 'client_accounts'
order by polname;

-- 4) Liaison utilisateur ↔ fiche client (remplacer l’email)
-- select u.email, cm.client_id, ca.company_name, ca.phone, ca.updated_at
-- from auth.users u
-- join public.client_members cm on cm.user_id = u.id
-- join public.client_accounts ca on ca.id = cm.client_id
-- where lower(u.email) = lower('VOTRE_EMAIL@example.com');
