# Lefèvre Conseil — site & portail client

Site marketing Next.js + espace client / admin (Supabase).

## Démarrage

```bash
npm install
cp .env.example .env.local   # renseigner Supabase
npm run dev -- -p 8089
```

→ [http://localhost:8089](http://localhost:8089)

## Supabase

Migrations SQL : [supabase/migrations/README.md](./supabase/migrations/README.md) (ordre 001 → **011**).

**Important :** exécuter `011_admin_business_tools.sql` pour :
- formulaire de demande `/demande` (leads en base)
- notifications admin, historique, CRUD clients
- blocage du rôle admin à l'inscription publique

## Routes principales

| Route | Description |
|-------|-------------|
| `/` | Site public |
| `/demande` | Formulaire prospect (API + Supabase + e-mails) |
| `/login` | Connexion / inscription client |
| `/espace-client` | Dépôt de pièces justificatives |
| `/espace-admin` | Pilotage cabinet (clients, demandes, docs, messages) |
| `/espace-admin/clients` | Gestion clients |
| `/espace-admin/demandes` | Leads site + demandes portail |
| `/espace-admin/documents` | Pièces justificatives |
| `/espace-admin/messages` | Messages portail |
| `/espace-admin/reglages` | Médias publics |

## E-mails (Resend)

Edge Function `supabase/functions/portal-notify` — voir [README](./supabase/functions/portal-notify/README.md).

## Articles / conseils

Les contenus articles sont conservés dans le code mais **non publiés** (`ARTICLES_PUBLISHED = false`). La page `/conseils` reste visible ; les URLs `/conseils/[slug]` redirigent vers la liste.
