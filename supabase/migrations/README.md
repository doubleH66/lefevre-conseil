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
| 9 | [009_portal_documents_fix.sql](./009_portal_documents_fix.sql) | **Correctif** envoi pièces justificatives (bucket + droits Storage) |
| 10 | [010_client_profile_save.sql](./010_client_profile_save.sql) | Sauvegarde profil client fiable (`update_my_client_account`) |
| 11 | [011_admin_business_tools.sql](./011_admin_business_tools.sql) | **Outil métier admin** : leads site, notifications, CRUD clients, sécurité inscription |
| 12 | [012_mutuelle_simulator.sql](./012_mutuelle_simulator.sql) | **Simulateur mutuelle** : `mutuelle_leads`, logs API Alptis, RPC brouillon/soumission |
| 13 | [013_mutuelle_admin_tools.sql](./013_mutuelle_admin_tools.sql) | **Admin** : statuts et notes sur les leads mutuelle |
| 14 | [014_fix_submit_mutuelle_lead_params.sql](./014_fix_submit_mutuelle_lead_params.sql) | **Correctif** RPC seulement (nécessite tables 012/015) |
| 15 | [015_mutuelle_install.sql](./015_mutuelle_install.sql) | **Recommandé** : installation complète mutuelle en un fichier (012+013+correctifs) |

### Simulateur mutuelle — démarrage rapide

Si les tables n’existent pas encore, exécutez **uniquement** `015_mutuelle_install.sql` (après la 011).  
Ne pas exécuter la 014 seule sans tables.

Voir aussi le flux **profil espace client** côté Next : [../docs-profil-espace-client.md](../docs-profil-espace-client.md).

## Migration 011 (sprint livraison)

Exécuter **`011_admin_business_tools.sql`** pour activer :
- table `site_leads` + RPC `submit_site_lead` (formulaire `/demande`)
- notifications admin, journal d'activité, notes internes (RLS admin)
- RPC admin : création/mise à jour client, statut lead, messages portail
- trigger `handle_new_user` : rôle **client** forcé (plus d'admin via inscription publique)

## Accès rapide dans le projet

Dossier :

`Philippe lefevre site web/lefevre-conseil/supabase/migrations/`

Archive (les 10 fichiers) :

`Philippe lefevre site web/lefevre-conseil/supabase/migrations-bundle.tar.gz`

## Si le profil client se vide après enregistrement

Exécutez **`010_client_profile_save.sql`** (et **`004`** si pas encore fait). Cette migration enregistre toujours sur le bon compte client lié à votre session.

## Si l'envoi de pièces justificatives échoue

1. Vérifiez que les migrations **003**, **005** et **009** sont exécutées (dans l'ordre).
2. Dans Supabase → **Storage**, le bucket `portal-documents` doit exister.
3. Le compte **client** doit utiliser le **même e-mail** que la fiche client (liaison via migration 005).

## CLI Supabase (optionnel)

```bash
cd "Philippe lefevre site web/lefevre-conseil"
supabase db push
```

## Après les migrations

1. **Authentication → URL configuration** : Site URL + Redirect URLs (`/auth/callback`)
2. Promouvoir un admin (voir commentaire en bas de `001_profiles_roles.sql`)
