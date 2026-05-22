import type { CookieOptions } from "@supabase/ssr";
import {
  NEXT_PUBLIC_SUPABASE_ANON_KEY as ENV_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_SUPABASE_URL as ENV_SUPABASE_URL,
} from "@/lib/supabase/env-public";

/**
 * Variables publiques Supabase (NEXT_PUBLIC_*).
 * La clé doit être la clé **anon** (JWT `role: anon`) - jamais la service_role.
 */

function trimEnv(value: string | undefined): string {
  return (value ?? "").trim();
}

function decodeBase64Url(segment: string): string {
  const b64 = segment.replace(/-/g, "+").replace(/_/g, "/");
  const pad = b64.length % 4 === 0 ? "" : "=".repeat(4 - (b64.length % 4));
  return globalThis.atob(b64 + pad);
}

/** Décode le payload d’un JWT sans vérifier la signature (champ `role` uniquement). */
function readJwtRole(token: string): string | undefined {
  const parts = token.split(".");
  if (parts.length !== 3 || !parts[1]) return undefined;
  try {
    const payload = JSON.parse(decodeBase64Url(parts[1])) as { role?: string };
    return typeof payload.role === "string" ? payload.role : undefined;
  } catch {
    return undefined;
  }
}

function assertKeyIsNotServiceRole(key: string): void {
  const role = readJwtRole(key);
  if (role === "service_role") {
    throw new Error(
      "La clé publique Supabase ne doit pas être la clé « service_role ». Utilisez uniquement la clé publique « anon / publishable » (Supabase → Project Settings → API)."
    );
  }
}

function getRawSupabasePublicKey(): string {
  return trimEnv(ENV_SUPABASE_ANON_KEY);
}

/**
 * URL projet Supabase, sans slash final.
 * Refuse les schémas non http(s). En production, seul HTTPS est accepté (sauf tests locaux rares).
 */
export function getSupabaseUrl(): string | undefined {
  const raw = trimEnv(ENV_SUPABASE_URL);
  if (!raw) return undefined;
  try {
    const u = new URL(raw);
    if (u.protocol !== "https:" && u.protocol !== "http:") return undefined;
    if (process.env.NODE_ENV === "production" && u.protocol !== "https:") {
      return undefined;
    }
    return raw.replace(/\/+$/, "");
  } catch {
    return undefined;
  }
}

export function getSupabaseAnonKey(): string | undefined {
  const key = getRawSupabasePublicKey();
  if (!key) return undefined;
  const role = readJwtRole(key);
  if (role === "service_role") return undefined;
  return key;
}

/** True si le site peut initialiser Supabase Auth côté client / serveur. */
export function isSupabasePublicConfigured(): boolean {
  return Boolean(getSupabaseUrl() && getSupabaseAnonKey());
}

export function requireSupabasePublicEnv(): { url: string; anonKey: string } {
  const url = getSupabaseUrl();
  const anonKey = getRawSupabasePublicKey();
  if (!url || !anonKey) {
    throw new Error(
      "Variables NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY (ou NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) manquantes."
    );
  }
  assertKeyIsNotServiceRole(anonKey);
  return { url, anonKey };
}

/** Cookies de session Auth : `Secure` en production (HTTPS). */
export function supabaseAuthCookieOptions(): Pick<CookieOptions, "secure" | "sameSite" | "path"> {
  return {
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  };
}
