# Migrations Supabase

Schéma complet pour le portail Lefèvre Conseil (001 → 015).

**Projet actif :** `gyisrwfapphqqdbpujtb` — voir [CONTEXTE_DEV_SUPABASE.md](./CONTEXTE_DEV_SUPABASE.md).

## Ordre d’application

| # | Fichier | Contenu |
|---|---------|---------|
| 001 | `001_profiles_roles.sql` | Profils, rôles client/admin, trigger auth |
| 002 | `002_signup_requested_role.sql` | Rôle demandé à l’inscription |
| 003 | `003_portal_schema_bucket.sql` | Portail + bucket `portal-documents` |
| 004 | `004_client_self_link.sql` | RLS client (insert/update compte) |
| 005 | `005_ensure_client_portal_access.sql` | RPC bootstrap espace client |
| 006 | `006_client_status_actif.sql` | Statut Actif par défaut |
| 007 | `007_public_media_bucket.sql` | Médias publics admin |
| 008 | `008_profile_avatar.sql` | Avatar profil |
| 009 | `009_portal_documents_fix.sql` | Correctifs documents |
| 010 | `010_client_profile_save.sql` | RPC `update_my_client_account` |
| 011 | `011_admin_business_tools.sql` | Admin, `site_leads`, notifications |
| 012 | `012_mutuelle_simulator.sql` | Simulateur mutuelle |
| 013 | `013_mutuelle_admin_tools.sql` | Admin mutuelle |
| 014 | `014_fix_submit_mutuelle_lead_params.sql` | Fix RPC mutuelle |
| 015 | `015_mutuelle_install.sql` | Install idempotent mutuelle |

## Appliquer

- **Nouveau projet vide :** exécuter 001 → 015 dans l’ordre (SQL Editor ou `supabase db push`).
- **Projet `gyisrwfapphqqdbpujtb` :** déjà appliqué (juin 2026).

Dashboard : https://supabase.com/dashboard/project/gyisrwfapphqqdbpujtb/sql/new
