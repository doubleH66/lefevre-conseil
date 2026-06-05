# portal-notify (Supabase Edge Function)

Envoie des e-mails transactionnels via [Resend](https://resend.com) pour le portail client/admin.

**Sans configuration Resend**, la fonction répond `200` avec `{ skipped: true }` — le portail continue de fonctionner (pas d'erreur 500 dans la console).

## Variables secrètes

Dans Supabase Dashboard → **Project Settings → Edge Functions → Secrets** (ou CLI) :

```bash
supabase secrets set RESEND_API_KEY=re_xxxxxxxx
# Optionnel — domaine vérifié chez Resend (sinon onboarding@resend.dev en test)
supabase secrets set RESEND_FROM_EMAIL="Lefèvre Conseil <no-reply@votredomaine.fr>"
```

## Déploiement

```bash
supabase link --project-ref gyisrwfapphqqdbpujtb
supabase functions deploy portal-notify
```

## Test

```bash
curl -i "https://gyisrwfapphqqdbpujtb.supabase.co/functions/v1/portal-notify" \
  -H "Authorization: Bearer VOTRE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"to":"vous@example.com","subject":"Test portail","text":"Hello"}'
```

Réponse attendue sans clé Resend :

```json
{ "ok": false, "skipped": true, "reason": "RESEND_API_KEY manquante..." }
```
