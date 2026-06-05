/** Ref projet Supabase attendue en production (lefevre-conseil). */
export const SUPABASE_PROJECT_REF = "gyisrwfapphqqdbpujtb";

export const SUPABASE_PRODUCTION_URL = `https://${SUPABASE_PROJECT_REF}.supabase.co`;

/** Extrait la ref depuis une URL Supabase (ex. gyisrwfapphqqdbpujtb). */
export function supabaseRefFromUrl(url: string): string | null {
  try {
    const host = new URL(url.replace(/\/+$/, "")).hostname;
    const match = host.match(/^([a-z0-9]+)\.supabase\.co$/i);
    return match?.[1] ?? null;
  } catch {
    return null;
  }
}

/**
 * En production : refuse tout projet Supabase autre que SUPABASE_PROJECT_REF.
 * Évite lecture/écriture sur un mauvais projet après changement d’env non redéployé.
 */
export function assertProductionSupabaseUrl(url: string): void {
  if (process.env.NODE_ENV !== "production") return;
  const ref = supabaseRefFromUrl(url);
  if (ref !== SUPABASE_PROJECT_REF) {
    throw new Error(
      `[supabase-config] NEXT_PUBLIC_SUPABASE_URL incorrect en production : attendu ${SUPABASE_PRODUCTION_URL}, reçu ${url} (ref=${ref ?? "?"}). Corrigez Vercel → Production puis redéployez.`,
    );
  }
}
