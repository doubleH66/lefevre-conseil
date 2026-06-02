const SENSITIVE_KEYS = new Set([
  "email",
  "telephone",
  "phone",
  "nom",
  "prenom",
  "first_name",
  "last_name",
  "iban",
  "bic",
  "numero_securite_sociale",
  "nss",
]);

export function redactPayload(value: unknown, depth = 0): unknown {
  if (depth > 6) return "[truncated]";
  if (value == null || typeof value !== "object") return value;

  if (Array.isArray(value)) {
    return value.map((item) => redactPayload(item, depth + 1));
  }

  const out: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
    const lower = key.toLowerCase();
    if (SENSITIVE_KEYS.has(lower)) {
      out[key] = "[redacted]";
    } else {
      out[key] = redactPayload(val, depth + 1);
    }
  }
  return out;
}
