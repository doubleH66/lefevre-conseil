/**
 * Références statiques à process.env - requises pour l’inlining Next.js / Turbopack
 * dans les composants client. Ne pas lire NEXT_PUBLIC_* via des helpers indirects seuls.
 */
export const NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const NEXT_PUBLIC_SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  "";
