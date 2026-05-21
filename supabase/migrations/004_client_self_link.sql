-- Permet à un utilisateur client de créer/lier son compte cabinet (première connexion).
-- Les admins conservent le contrôle total via les policies existantes.

drop policy if exists "client_accounts_client_insert_own" on public.client_accounts;
create policy "client_accounts_client_insert_own" on public.client_accounts
for insert to authenticated
with check (
  not public.is_admin()
  and lower(email) = lower((select email from auth.users where id = auth.uid()))
);

drop policy if exists "client_members_client_insert_self" on public.client_members;
create policy "client_members_client_insert_self" on public.client_members
for insert to authenticated
with check (
  user_id = auth.uid()
  and exists (
    select 1 from public.client_accounts ca
    where ca.id = client_id
      and lower(ca.email) = lower((select email from auth.users where id = auth.uid()))
  )
);

drop policy if exists "client_accounts_member_update" on public.client_accounts;
create policy "client_accounts_member_update" on public.client_accounts
for update to authenticated
using (public.user_is_client_member(id))
with check (public.user_is_client_member(id));
