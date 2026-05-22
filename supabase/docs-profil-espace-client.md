# Profil espace client — flux Supabase (source de vérité)

Le front **lit** `public.client_accounts` via `loadClientPortalData()` (JWT utilisateur).  
L’écriture se fait avec la RPC **`update_my_client_account`** (migration **`010_client_profile_save.sql`**) : fonction `SECURITY DEFINER` qui résout toujours le bon `client_id` via **`ensure_client_portal_access()`**.

## Ordre d’application (nouveau projet)

Exécuter les migrations **`001`** → **`010`** comme dans [`migrations/README.md`](../migrations/README.md), en particulier :

- **`005_ensure_client_portal_access.sql`** — droits + RPC de liaison utilisateur ⇄ fiche client  
- **`010_client_profile_save.sql`** — `ensure_client_portal_access` résolue avec tri + **`update_my_client_account`**

## Vérifications rapides (SQL Editor)

```sql
-- La RPC existe
select proname from pg_proc where proname = 'update_my_client_account';

-- Ligne compte mise à jour (remplacer l’uuid)
select id, company_name, phone, updated_at from public.client_accounts where id = '…';
```

## Côté Next.js

La mutation passe par une **Server Action** (`saveClientProfileAction`) : même session que le navigateur (cookies SSR Supabase).  
Ensuite le portail client appelle **`refresh({ silent: true })`** pour recharger `PortalClient` depuis la DB — **pas** de second état contradictoire avec `patchClient` sur ces champs.
