import type { PortalClient } from "@/components/portal/types";
import { profileLog } from "@/lib/portal/profile-debug-log";

/**
 * Force un remount du formulaire profil lorsque les données serveur changent,
 * sans `useEffect` (évite désync / champs vidés après refresh).
 *
 * Priorité à `updated_at` ISO depuis la DB (trigger migration 003).
 * Retombe sur une empreinte des champs métier si jamais `updated_at` est absent.
 */
export function profileFormRemountKey(c: PortalClient): string {
  const ts = (c.updatedAtIso ?? "").trim();
  const key =
    ts.length > 0
      ? `${c.id}:${ts}`
      : `${c.id}|${c.companyName}|${c.contactName}|${c.phone}|${c.address}|${c.website}|${c.email}`;
  profileLog("profileFormRemountKey", { key, updatedAtIso: ts || "(vide → empreinte champs)" });
  return key;
}
