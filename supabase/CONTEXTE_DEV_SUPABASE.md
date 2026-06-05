# Contexte Supabase — reconfiguration (juin 2026)

Document à l’attention du **développeur** reprenant le projet Lefèvre Conseil.

---

## Résumé exécutif

| Avant | Après |
|-------|-------|
| Projet `qhiyxnbcegbxtvydcjhf` (inaccessible / supprimé ou en pause) | Projet **`gyisrwfapphqqdbpujtb`** — nom dashboard **« LE ferre »** |
| Base vide ou 503 | Schéma complet appliqué (migrations 001 → 015) |
| `.env.local` + Vercel pointaient l’ancienne ref | Code + `.env.local` mis à jour |

**Le site marketing** (pages statiques, images via `cdn.helloklik.com`) fonctionnait sans Supabase.  
**Auth, formulaire contact, portail client/admin, simulateur mutuelle** dépendent de Supabase — ils étaient KO tant que le mauvais projet était configuré.

---

## Nouveau projet Supabase

| Clé | Valeur |
|-----|--------|
| **Ref** | `gyisrwfapphqqdbpujtb` |
| **URL** | `https://gyisrwfapphqqdbpujtb.supabase.co` |
| **Dashboard** | https://supabase.com/dashboard/project/gyisrwfapphqqdbpujtb |
| **Région** | eu-west-1 |
| **Statut** | ACTIVE_HEALTHY (créé le 4 juin 2026) |

La clé **anon** (publique) se trouve dans **Project Settings → API**.  
Ne jamais committer `service_role` ni mettre de secrets dans `NEXT_PUBLIC_*`.

---

## Ce qui a été fait automatiquement

1. **Restauration** des migrations SQL depuis l’historique Git (`3c56eef`) dans `supabase/migrations/`.
2. **Application** des migrations 001 → 015 sur le nouveau projet (via MCP Supabase / SQL).
3. **Mise à jour du code** : `src/lib/supabase/config.ts`, tests, `next.config.ts`, `public/sw.js`, scripts, notices UI.
4. **`.env.local`** local mis à jour (fichier gitignored).
5. **Edge Function** `portal-notify` déployée (v1, JWT requis).
6. **Smoke test** : RPC `submit_site_lead` → OK (retourne un UUID lead).

### Tables présentes (public, RLS activé)

`profiles`, `client_accounts`, `client_members`, `projects`, `document_requests`, `documents`, `client_demands`, `portal_messages`, `internal_notes`, `site_leads`, `admin_notifications`, `admin_activity_log`, `mutuelle_leads`, `partner_api_logs`, `public_media_files`.

### RPC critiques vérifiées

- `submit_site_lead` — formulaire contact / demande site  
- `ensure_client_portal_access` — 1er login espace client  
- `update_my_client_account` — sauvegarde profil client  
- `submit_mutuelle_lead` — simulateur mutuelle  

### Storage buckets

- `portal-documents` — pièces justificatives portail (privé)  
- `public-media` — médias admin (migration 007)  

---

## Actions restantes (dev / ops)

### 1. Vercel — variables d’environnement (obligatoire)

Dans **Vercel → Project → Settings → Environment Variables** (Production + Preview) :

```env
NEXT_PUBLIC_SUPABASE_URL=https://gyisrwfapphqqdbpujtb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<clé anon du dashboard>
```

Puis **Redeploy** (les `NEXT_PUBLIC_*` sont figées au build).

Optionnel :

```env
NEXT_PUBLIC_SITE_URL=https://www.lefevre-conseil.fr
CABINET_NOTIFY_EMAIL=contact@...
```

### 2. Supabase Auth — URLs de redirection

**Authentication → URL Configuration** :

| Champ | Valeurs suggérées |
|-------|-------------------|
| Site URL | `http://localhost:9999` (dev) / domaine prod |
| Redirect URLs | `http://localhost:9999/auth/callback` |
| | `https://lefevre-conseil.vercel.app/auth/callback` |
| | `https://www.lefevre-conseil.fr/auth/callback` (domaine final) |

Sans ces URLs, magic link / OAuth renvoie une erreur après clic e-mail.

### 3. E-mails (Resend) — optionnel mais recommandé

Dans **Supabase → Edge Functions → portal-notify → Secrets** :

```env
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL="Lefèvre Conseil <no-reply@lefevre-conseil.fr>"
```

Sans `RESEND_API_KEY`, la fonction répond `{ ok: false, skipped: true }` — les leads sont **quand même** en base, mais pas d’e-mail cabinet / accusé réception.

### 4. Créer le premier compte admin

1. S’inscrire via `/login` (magic link ou mot de passe selon config Auth).
2. Dans **SQL Editor** :

```sql
update public.profiles
set role = 'admin'::public.app_role
where id = (
  select id from auth.users
  where email = 'votre-email@cabinet.fr'
  limit 1
);
```

> **Sécurité :** la migration 002 permet `requested_role: admin` depuis le client à l’inscription — à durcir en prod (invite only, liste d’e-mails, Edge Function).

### 5. Données de l’ancien projet

L’ancien projet `qhiyxnbcegbxtvydcjhf` **n’a pas été migré** (inaccessible).  
Clients, leads, documents : **repartir de zéro** ou exporter manuellement si une sauvegarde existe ailleurs.

---

## Dev local

```bash
npm install
cp .env.example .env.local   # remplir URL + anon key
npm run check:env            # doit afficher OK
npm run dev                  # port 9999 (package.json)
```

Tests rapides :

- `/login` — connexion  
- `/contact` ou `/demande` — envoi lead → table `site_leads`  
- `/espace-client` — profil + documents (après compte client)  
- `/espace-admin` — après promotion admin  

---

## Fichiers code liés à Supabase

| Fichier | Rôle |
|---------|------|
| `src/lib/supabase/config.ts` | Ref projet attendue en prod |
| `src/lib/supabase/client.ts` / `server.ts` / `middleware.ts` | Clients SSR / auth |
| `src/app/api/site-lead/route.ts` | POST formulaire → RPC + e-mails |
| `src/lib/portal/*` | Portail client / admin |
| `supabase/migrations/*.sql` | Source de vérité schéma |
| `supabase/functions/portal-notify/` | Envoi e-mail via Resend |

---

## Historique / pourquoi ce changement

1. Le site utilisait le projet **`qhiyxnbcegbxtvydcjhf`** (documenté partout dans le repo).
2. Ce projet ne répondait plus (503, introuvable via l’API management).
3. Un **nouveau projet** « LE ferre » a été créé sur le compte Supabase connecté à Cursor.
4. Les migrations avaient été **supprimées du working tree** puis **restaurées depuis Git** et rejouées sur la nouvelle base.

---

## Checklist recette post-déploiement

- [ ] `npm run check:env` OK en local  
- [ ] Vercel : 2 variables Supabase + redeploy  
- [ ] Auth redirect URLs configurées  
- [ ] Compte admin promu en SQL  
- [ ] Formulaire contact → ligne dans `site_leads`  
- [ ] (Optionnel) `RESEND_API_KEY` → e-mail cabinet reçu  
- [ ] Login client → `/espace-client` sans erreur RLS  
- [ ] Profil client → Enregistrer → données persistées  

---

*Dernière mise à jour : 4 juin 2026 — reconfiguration automatisée depuis Cursor.*
