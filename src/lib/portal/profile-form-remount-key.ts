import type { PortalClient } from "@/components/portal/types";

/**
 * Force un remount du formulaire profil lorsque les données serveur changent,
 * sans `useEffect` (évite désync / champs vidés après refresh).
 *
 * Priorité à `updated_at` ISO depuis la DB (trigger migration 003).
 * Retombe sur une empreinte des champs métier si jamais `updated_at` est absent.
 */
export function profileFormRemountKey(c: PortalClient): string {
  const ts = (c.updatedAtIso ?? "").trim();
  if (ts.length > 0) return `${c.id}:${ts}`;
  return `${c.id}|${c.companyName}|${c.contactName}|${c.phone}|${c.address}|${c.website}|${c.email}`;
}
