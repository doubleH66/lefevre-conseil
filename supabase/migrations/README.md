# Migrations Supabase — Lefèvre Conseil

Exécuter **dans cet ordre** dans [Supabase Dashboard → SQL Editor](https://supabase.com/dashboard) (New query → coller le fichier → Run).

| # | Fichier | Rôle |
|---|---------|------|
| 1 | [001_profiles_roles.sql](./001_profiles_roles.sql) | Profils, rôles client/admin, RLS |
| 2 | [002_signup_requested_role.sql](./002_signup_requested_role.sql) | Rôle à l’inscription (`requested_role`) |
| 3 | [003_portal_schema_bucket.sql](./003_portal_schema_bucket.sql) | Schéma portail + bucket `portal-documents` |
| 4 | [004_client_self_link.sql](./004_client_self_link.sql) | Client peut lier son compte |
| 5 | [005_ensure_client_portal_access.sql](./005_ensure_client_portal_access.sql) | Grants + `ensure_client_portal_access()` |
| 6 | [006_client_status_actif.sql](./006_client_status_actif.sql) | Statut Actif par défaut |
| 7 | [007_public_media_bucket.sql](./007_public_media_bucket.sql) | Bucket `public-media` (admin) |
| 8 | [008_profile_avatar.sql](./008_profile_avatar.sql) | Photos de profil (`profile-avatars`) |

## Accès rapide dans le projet

Dossier :

`Philippe lefevre site web/lefevre-conseil/supabase/migrations/`

Archive (les 8 fichiers) :

`Philippe lefevre site web/lefevre-conseil/supabase/migrations-bundle.tar.gz`

## CLI Supabase (optionnel)

```bash
cd "Philippe lefevre site web/lefevre-conseil"
supabase db push
```

## Après les migrations

1. **Authentication → URL configuration** : Site URL + Redirect URLs (`/auth/callback`)
2. Promouvoir un admin (voir commentaire en bas de `001_profiles_roles.sql`)
