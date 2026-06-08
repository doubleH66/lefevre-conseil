#!/usr/bin/env node
/**
 * Applique un fichier SQL sur le projet Supabase Lefèvre via l'API Management.
 * Usage : node scripts/apply-supabase-sql.mjs supabase/migrations/016_restore_signup_requested_role.sql
 *
 * Token : variable SUPABASE_ACCESS_TOKEN ou entrée Keychain « Supabase CLI ».
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { execSync } from "node:child_process";

const PROJECT_REF = "gyisrwfapphqqdbpujtb";
const sqlPath = process.argv[2];

if (!sqlPath) {
  console.error("Usage: node scripts/apply-supabase-sql.mjs <fichier.sql>");
  process.exit(1);
}

function readAccessToken() {
  if (process.env.SUPABASE_ACCESS_TOKEN?.trim()) {
    return process.env.SUPABASE_ACCESS_TOKEN.trim();
  }

  try {
    const raw = execSync('security find-generic-password -s "Supabase CLI" -a "access-token" -w 2>/dev/null', {
      encoding: "utf8",
    }).trim();
    if (raw.startsWith("go-keyring-base64:")) {
      return Buffer.from(raw.slice("go-keyring-base64:".length), "base64").toString("utf8").trim();
    }
    return raw;
  } catch {
    return null;
  }
}

const token = readAccessToken();
if (!token) {
  console.error("Token Supabase introuvable. Lancez `npx supabase login` ou définissez SUPABASE_ACCESS_TOKEN.");
  process.exit(1);
}

const query = readFileSync(resolve(sqlPath), "utf8");
const res = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ query }),
});

const body = await res.text();
if (!res.ok) {
  console.error(`Échec (${res.status}):`, body);
  process.exit(1);
}

console.log("OK — SQL appliqué sur", PROJECT_REF);
if (body && body !== "[]") console.log(body);
