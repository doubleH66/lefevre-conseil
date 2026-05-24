# Profil espace client — flux Supabase (source de vérité)

Le front **lit** `public.client_accounts` via `loadClientPortalData()` (JWT navigateur).  
L’**écriture** passe par `saveClientProfile()` : RPC **`update_my_client_account`** (migration **`010_client_profile_save.sql`**) via le **même client Supabase navigateur** que le chargement (pattern identique aux médias publics / avatar).

## Projet Supabase attendu

Production : **`qhiyxnbcegbxtvydcjhf`** → `https://qhiyxnbcegbxtvydcjhf.supabase.co`

Vérification automatique : `src/lib/supabase/config.ts` — en production, toute autre URL lève une erreur explicite au démarrage des clients Supabase.

## Variables d’environnement

| Variable | Où |
|----------|-----|
| `NEXT_PUBLIC_SUPABASE_URL` | Vercel Production / Preview / Development + `.env.local` local |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | idem |

Pas de `SUPABASE_SERVICE_ROLE_KEY` côté Next.js (non utilisée dans ce repo).

**Important** : après changement d’une `NEXT_PUBLIC_*` sur Vercel → **redéployer** (valeurs figées au build).

## Fichiers env locaux

- `.env.example` — modèle (commité)
- `.env.local` — dev local (gitignored)
- Pas de `.env.production` dans le repo

## Ordre migrations

**001** → **010** — voir [`migrations/README.md`](../migrations/README.md).

## Côté Next.js

| Couche | Client Supabase | Source données profil |
|--------|-----------------|------------------------|
| Chargement portail | Browser (`createClient`) | `client_accounts` |
| Sauvegarde profil | Browser (`saveClientProfile`) | RPC → `client_accounts` |
| Avatar | Browser | `profiles.avatar_url` |
| Nom header auth | Browser + `profiles.full_name` | sync après save contact |
| Middleware session | Server anon + cookies | auth only |
| Server Action profil | **Supprimée** (évitait double session) |

## Debug profil (logs à l’écran)

Actif automatiquement en **`npm run dev`**, ou en prod/preview avec :

`NEXT_PUBLIC_DEBUG_PORTAL_PROFILE=true` (+ redéploiement Vercel)

Sur **`/espace-client/profil`**, un panneau amber **Debug profil (écran)** s’affiche sous le formulaire avec l’historique des événements (refresh, RPC, patchClient, resync, etc.). Boutons **Masquer** / **Effacer**.

Les mêmes lignes sont aussi dans la console navigateur (`[profil]`).
