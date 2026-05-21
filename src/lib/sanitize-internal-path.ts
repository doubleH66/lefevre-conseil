/**
 * Limite les redirections post-auth aux chemins relatifs internes (évite open redirect).
 */
export function sanitizeInternalPath(path: string | null | undefined, fallback: string): string {
  if (!path || typeof path !== "string") return fallback;
  const t = path.trim();
  if (!t.startsWith("/") || t.startsWith("//")) return fallback;
  if (t.includes("://") || t.includes("\\")) return fallback;
  return t;
}
