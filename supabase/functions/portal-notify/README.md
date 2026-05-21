# portal-notify (Supabase Edge Function)

Envoie des emails transactionnels via Resend pour les actions du portail client/admin.

## Variables secrètes requises

```bash
supabase secrets set RESEND_API_KEY=your_resend_api_key
```

## Déploiement

```bash
supabase functions deploy portal-notify
```

## Test local

```bash
supabase functions serve portal-notify --env-file .env.local
```

## Exemple d'appel

```json
{
  "to": "contact@client-alpha.fr",
  "subject": "Nouvelle demande de pièce",
  "clientName": "Client Alpha",
  "html": "<p>Votre document est demandé.</p>"
}
```

L'expéditeur est forcé à :

`Lefevre Conseil <no-reply@lefevre-conseil.fr>`

