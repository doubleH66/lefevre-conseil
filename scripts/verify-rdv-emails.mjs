#!/usr/bin/env node
/**
 * Vérifie le déploiement portal-notify + flux RDV (Supabase + e-mails Resend).
 * Usage : node scripts/verify-rdv-emails.mjs [--site-url http://localhost:9393]
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const PROJECT_REF = "gyisrwfapphqqdbpujtb";
const SUPABASE_URL = `https://${PROJECT_REF}.supabase.co`;
const ADMIN_EMAIL = "elfarissih7@gmail.com";

function loadEnvLocal() {
  const path = resolve(".env.local");
  if (!existsSync(path)) return {};
  const out = {};
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) out[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
  }
  return out;
}

const env = loadEnvLocal();
const anonKey =
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!anonKey) {
  console.error("❌ NEXT_PUBLIC_SUPABASE_ANON_KEY manquante (.env.local)");
  process.exit(1);
}

const siteUrlArg = process.argv.find((a) => a.startsWith("--site-url="));
const siteUrl = siteUrlArg?.slice("--site-url=".length) || process.env.SITE_URL || "http://localhost:9393";

const results = [];

function pass(name, detail) {
  results.push({ ok: true, name, detail });
  console.log(`✅ ${name}${detail ? ` — ${detail}` : ""}`);
}

function fail(name, detail) {
  results.push({ ok: false, name, detail });
  console.log(`❌ ${name}${detail ? ` — ${detail}` : ""}`);
}

async function invokePortalNotify(payload) {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/portal-notify`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${anonKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }
  return { status: res.status, data };
}

async function main() {
  console.log(`\n🔍 Vérification RDV / e-mails — ${new Date().toISOString()}\n`);

  // 1. Edge function active
  const fnRes = await fetch(`${SUPABASE_URL}/functions/v1/portal-notify`, {
    method: "OPTIONS",
    headers: { Authorization: `Bearer ${anonKey}` },
  });
  if (fnRes.ok || fnRes.status === 204) {
    pass("Edge Function portal-notify", "répond (OPTIONS)");
  } else {
    fail("Edge Function portal-notify", `HTTP ${fnRes.status}`);
  }

  // 2. RESEND_API_KEY configurée
  const ping = await invokePortalNotify({
    to: ADMIN_EMAIL,
    subject: "[Vérif] portal-notify — ping Resend",
    text: "Test automatique de vérification. Vous pouvez ignorer cet e-mail.",
    clientName: "Vérification",
  });
  if (ping.data?.skipped && ping.data?.reason?.includes("RESEND_API_KEY")) {
    fail("Secret RESEND_API_KEY", ping.data.reason);
  } else if (ping.data?.ok) {
    pass("E-mail admin (direct Resend)", `id ${ping.data.data?.id ?? "?"}`);
  } else {
    fail("E-mail admin (direct Resend)", JSON.stringify(ping.data));
  }

  // 3. Confirmation visiteur
  const confirm = await invokePortalNotify({
    to: ADMIN_EMAIL,
    subject: "Confirmation de votre demande de rendez-vous — Lefèvre Conseil",
    text:
      "Bonjour Test,\n\nNous avons bien reçu votre demande de rendez-vous (Prise de rendez-vous).\n" +
      "Un conseiller du cabinet Lefèvre Conseil vous recontactera rapidement.\n\nCordialement,\nLefèvre Conseil",
    clientName: "Test",
  });
  if (confirm.data?.ok) {
    pass("E-mail confirmation visiteur", `id ${confirm.data.data?.id ?? "?"}`);
  } else {
    fail("E-mail confirmation visiteur", JSON.stringify(confirm.data));
  }

  // 4. RPC submit_site_lead
  const rpcRes = await fetch(`${SUPABASE_URL}/rest/v1/rpc/submit_site_lead`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${anonKey}`,
      apikey: anonKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      p_first_name: "Verif",
      p_last_name: "Automatique",
      p_email: ADMIN_EMAIL,
      p_phone: "06 00 00 00 01",
      p_current_situation: "Particulier",
      p_request_type: "Prise de rendez-vous",
      p_patrimonial_goal: "Bilan patrimonial",
      p_message: `Test vérification ${new Date().toISOString()}`,
      p_contact_preference: "email",
      p_gdpr_consent: true,
      p_honeypot: null,
    }),
  });
  const leadId = await rpcRes.text();
  if (rpcRes.ok) {
    pass("RPC submit_site_lead", `lead ${leadId.replace(/"/g, "")}`);
  } else {
    fail("RPC submit_site_lead", leadId);
  }

  // 5. API Next.js site-lead (flux complet)
  try {
    const apiRes = await fetch(`${siteUrl}/api/site-lead`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: "Verif",
        lastName: "SiteLead",
        email: ADMIN_EMAIL,
        phone: "06 00 00 00 02",
        requestType: "Prise de rendez-vous",
        currentSituation: "Dirigeant",
        patrimonialGoal: "Retraite",
        message: `Test flux complet site-lead ${new Date().toISOString()}`,
        contactPreference: "email",
        gdprConsent: true,
      }),
    });
    const apiData = await apiRes.json();
    if (apiRes.ok && apiData.ok) {
      pass("API /api/site-lead", `id ${apiData.id} (${siteUrl})`);
    } else {
      fail("API /api/site-lead", JSON.stringify(apiData));
    }
  } catch (e) {
    fail("API /api/site-lead", `${siteUrl} inaccessible — ${e.message}`);
  }

  const failed = results.filter((r) => !r.ok);
  console.log(`\n${failed.length === 0 ? "✅ Tous les tests passent." : `⚠️  ${failed.length} test(s) en échec.`}\n`);
  process.exit(failed.length === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
