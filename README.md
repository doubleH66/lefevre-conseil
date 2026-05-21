# Lefèvre Conseil — site & portail client

Site marketing Next.js + espace client / admin (Supabase), basé sur le design heritage.

## Démarrage

```bash
npm install
cp ../heritage-hero-banner/.env.local .env.local   # même projet Supabase
npm run dev -- -p 8089
```

→ [http://localhost:8089](http://localhost:8089)

## Supabase

Migrations SQL : [supabase/migrations/README.md](./supabase/migrations/README.md) (ordre 001 → 008).

## Routes principales

| Route | Description |
|-------|-------------|
| `/` | Site public |
| `/login` | Connexion / inscription |
| `/espace-client` | Dépôt de pièces justificatives |
| `/espace-admin` | Gestion clients & documents |
| `/simulateur` | Comparateur / mutuelle (iframe) |

## Référence design

`../heritage-hero-banner/` — gabarit visuel et auth d’origine.
