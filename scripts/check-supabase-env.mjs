#!/usr/bin/env node
/**
 * Vérifie que Supabase est configuré pour le dev local.
 * Usage : npm run check:env
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const envPath = resolve(root, ".env.local");

function parseEnvFile(content) {
  const out = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

function jwtRole(token) {
  const parts = token.split(".");
  if (parts.length !== 3) return undefined;
  try {
    const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const pad = b64.length % 4 === 0 ? "" : "=".repeat(4 - (b64.length % 4));
    const payload = JSON.parse(Buffer.from(b64 + pad, "base64").toString("utf8"));
    return payload.role;
  } catch {
    return undefined;
  }
}

const env = { ...process.env };
if (existsSync(envPath)) {
  Object.assign(env, parseEnvFile(readFileSync(envPath, "utf8")));
}

const url = (env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim();
const key = (env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "").trim();
const issues = [];

if (!url) issues.push("NEXT_PUBLIC_SUPABASE_URL manquante");
else if (!/^https:\/\/qhiyxnbcegbxtvydcjhf\.supabase\.co\/?$/.test(url.replace(/\/+$/, ""))) {
  issues.push("NEXT_PUBLIC_SUPABASE_URL doit être https://qhiyxnbcegbxtvydcjhf.supabase.co");
}

if (!key || key === "eyJ..." || key.length < 100) {
  issues.push("NEXT_PUBLIC_SUPABASE_ANON_KEY manquante ou invalide");
} else {
  const role = jwtRole(key);
  if (role === "service_role") issues.push("Utilisez la clé anon, pas service_role");
  if (role && role !== "anon") issues.push(`Clé JWT inattendue (role=${role})`);
}

if (issues.length === 0) {
  console.log("OK — Supabase configuré pour le dev local (.env.local).");
  process.exit(0);
}

console.error("\nSupabase non configuré pour le dev local :\n");
for (const i of issues) console.error(`  • ${i}`);
console.error(`
Créez ou complétez ${envPath} :

  cp .env.example .env.local

Puis collez la clé anon depuis :
  https://supabase.com/dashboard/project/qhiyxnbcegbxtvydcjhf/settings/api

Redémarrez le serveur : npm run dev -- -p 8089
`);
process.exit(1);
