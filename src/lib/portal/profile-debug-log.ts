/** Logs flux profil — actifs en dev ou si NEXT_PUBLIC_DEBUG_PORTAL_PROFILE=true (rebuild requis en prod). */
export function isProfileDebugEnabled(): boolean {
  return (
    process.env.NODE_ENV === "development" ||
    process.env.NEXT_PUBLIC_DEBUG_PORTAL_PROFILE === "true"
  );
}

export function profileLog(phase: string, data?: unknown): void {
  if (!isProfileDebugEnabled()) return;
  const label = `[profil] ${phase}`;
  if (data === undefined) {
    // eslint-disable-next-line no-console
    console.log(label);
    return;
  }
  // eslint-disable-next-line no-console
  console.log(label, data);
}

/** Résumé client pour les logs (pas de données sensibles inutiles). */
export function profileClientSnapshot(c: {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  updatedAtIso?: string;
  lastActivity?: string;
}) {
  return {
    id: c.id,
    companyName: c.companyName,
    contactName: c.contactName,
    email: c.email,
    phone: c.phone,
    address: c.address,
    website: c.website,
    updatedAtIso: c.updatedAtIso,
    lastActivity: c.lastActivity,
  };
}
