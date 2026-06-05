# Diagnostic — profil client qui ne se sauvegarde pas

**Projet Supabase :** `gyisrwfapphqqdbpujtb`  
**URL :** `https://gyisrwfapphqqdbpujtb.supabase.co`

> L’assistant IA / Cursor **n’a pas accès** au dashboard Supabase du client.  
> Le correctif passe par l’exécution des migrations SQL et la vérification RLS ci-dessous.

---

## Symptôme

- L’utilisateur remplit **Mon profil** (`/espace-client/profil`), clique **Enregistrer**.
- Message de succès possible puis champs vides, **ou** message rouge « Enregistrement refusé ».
- Les données ne sont pas visibles dans **Table Editor → `client_accounts`**.

---

## Chaîne technique (frontend)

1. `ClientProfileForm` → `updateClientProfile()` (`src/lib/portal/update-client-profile.ts`)
2. **Tentative 1 :** RPC `update_my_client_account` (migration **010**)
3. **Tentative 2 (fallback) :** `UPDATE client_accounts WHERE id = :clientId` + RLS (nécessite migration **004**)

Si **010** n’est pas déployée **et** **004** non appliquée → **aucune écriture possible** pour un client connecté.

---

## Checklist obligatoire (Supabase Dashboard → SQL Editor)

Exécuter **dans l’ordre** (fichiers dans `supabase/migrations/`) :

| # | Fichier | Pourquoi |
|---|---------|----------|
| 001 | `001_profiles_roles.sql` | Rôles + `is_admin()` |
| 003 | `003_portal_schema_bucket.sql` | Table `client_accounts`, RLS de base |
| 004 | `004_client_self_link.sql` | Policy **`client_accounts_member_update`** (UPDATE client) |
| 005 | `005_ensure_client_portal_access.sql` | **GRANT** + RPC `ensure_client_portal_access` |
| 010 | `010_client_profile_save.sql` | RPC **`update_my_client_account`** (sauvegarde fiable) |

Sans **004 + 005 + 010**, le profil client ne peut pas persister correctement.

---

## Script de vérification (à coller dans SQL Editor)

Remplacer `VOTRE_EMAIL@example.com` par l’e-mail du compte client testé.

```sql
-- 1) La RPC existe ?
select routine_name
from information_schema.routines
where routine_schema = 'public'
  and routine_name in ('update_my_client_account', 'ensure_client_portal_access');

-- 2) Policies UPDATE sur client_accounts
select policyname, cmd
from pg_policies
where tablename = 'client_accounts';

-- Attendu : au moins client_accounts_member_update (UPDATE) + member_select

-- 3) Doublons de fiches client pour le même e-mail (cause classique d'effacement)
select id, email, company_name, contact_name, phone, address, updated_at
from public.client_accounts
where lower(email) = lower('VOTRE_EMAIL@example.com')
order by updated_at desc;

-- 4) Liaison auth.users ↔ client_members
select cm.client_id, cm.user_id, u.email, ca.company_name, ca.phone
from auth.users u
left join public.client_members cm on cm.user_id = u.id
left join public.client_accounts ca on ca.id = cm.client_id
where lower(u.email) = lower('VOTRE_EMAIL@example.com');
```

### Interprétation

| Résultat | Action |
|----------|--------|
| `update_my_client_account` absente | Exécuter **010_client_profile_save.sql** |
| Pas de policy `client_accounts_member_update` | Exécuter **004** |
| **2+ lignes** dans `client_accounts` pour le même e-mail | Fusionner / supprimer les doublons ; ne garder qu’une fiche + un `client_members` |
| `client_members` vide pour l’utilisateur | Exécuter **005** ; le client doit se reconnecter |
| `client_id` en UI ≠ `client_id` dans `client_members` | Bug de données : aligner la membership sur la fiche à jour |

---

## Test manuel RPC (SQL Editor, connecté en tant que service role)

En **SQL Editor** (rôle postgres), on peut simuler l’appel — en prod le client appelle via JWT :

```sql
-- Vérifier que la fonction s'exécute (remplacer les valeurs)
select * from public.update_my_client_account(
  'Ma Société',
  'Jean Dupont',
  '06 12 34 56 78',
  '10 rue Example',
  'https://example.com'
);
```

> Cet appel échouera sans `auth.uid()` si lancé en SQL Editor admin.  
> Le test réel se fait **depuis l’app** connectée en client, ou via l’API REST avec le JWT utilisateur.

---

## Test depuis le navigateur (dev)

1. Se connecter en **client** sur `/espace-client/profil`
2. Ouvrir **DevTools → Network**
3. Cliquer **Enregistrer**
4. Chercher une requête vers :
   - `.../rest/v1/rpc/update_my_client_account` **(attendu si 010 OK)**
   - ou `.../rest/v1/client_accounts?id=eq....` **(fallback)**

| Code HTTP | Signification |
|-----------|----------------|
| **404 / PGRST202** | RPC absente → migration **010** manquante |
| **403 / 42501** | RLS ou GRANT → migrations **004** / **005** |
| **200** avec body `[]` | RPC exécutée mais aucune ligne mise à jour (mauvais `client_id` / doublons) |
| **200** avec JSON contenant `company_name`, `phone`, etc. | OK côté API — vérifier rechargement UI |

---

## Variables d’environnement (Vercel / local)

```env
NEXT_PUBLIC_SUPABASE_URL=https://gyisrwfapphqqdbpujtb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...  # clé anon uniquement, pas service_role
```

Après changement : redéployer le site.

---

## Fichiers code concernés

| Fichier | Rôle |
|---------|------|
| `src/components/portal/ClientProfileForm.tsx` | Formulaire |
| `src/lib/portal/update-client-profile.ts` | RPC + fallback UPDATE |
| `supabase/migrations/010_client_profile_save.sql` | Fix SQL principal |

---

## Résumé pour le chef de projet

Le site est prêt côté code (branche `main`, commit `7669f3b+`).  
**Le blocage est côté base Supabase** tant que les migrations **004, 005 et 010** ne sont pas appliquées sur le projet `gyisrwfapphqqdbpujtb`, et tant qu’il existe des **doublons** `client_accounts` pour le même e-mail.

**Temps estimé correctif :** 15–30 min (SQL + vérification données).
