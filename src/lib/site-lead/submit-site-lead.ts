export type SiteLeadPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  currentSituation?: string;
  requestType: string;
  patrimonialGoal?: string;
  approximateAmount?: string;
  message?: string;
  contactPreference?: "email" | "phone" | "either";
  gdprConsent: boolean;
  website?: string;
};

export function splitFullName(fullName: string): { firstName: string; lastName: string } {
  const trimmed = fullName.trim();
  if (!trimmed) return { firstName: "—", lastName: "—" };
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0]!, lastName: "—" };
  return { firstName: parts[0]!, lastName: parts.slice(1).join(" ") };
}

export async function submitSiteLead(
  payload: SiteLeadPayload,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const res = await fetch("/api/site-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await res.json()) as { ok?: boolean; error?: string };
    if (!res.ok || !data.ok) {
      return { ok: false, error: data.error ?? "Envoi impossible. Réessayez ou appelez le cabinet." };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Connexion impossible. Vérifiez votre réseau et réessayez." };
  }
}
