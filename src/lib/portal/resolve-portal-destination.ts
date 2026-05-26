import { ROUTES } from "@/lib/content/routes";
import { sanitizeInternalPath } from "@/lib/sanitize-internal-path";

export type PortalRole = "admin" | "client";

/** Destination post-auth : un admin va toujours vers l'espace admin. */
export function resolvePortalDestination(
  role: PortalRole,
  requestedPath?: string | null,
): string {
  if (role === "admin") {
    const requested = sanitizeInternalPath(requestedPath, ROUTES.espaceAdmin);
    if (requested.startsWith(ROUTES.espaceAdmin)) return requested;
    return ROUTES.espaceAdmin;
  }

  const fallback = ROUTES.espaceClient;
  const requested = sanitizeInternalPath(requestedPath, fallback);
  if (requested.startsWith(ROUTES.espaceAdmin)) return fallback;
  if (requested.startsWith(ROUTES.espaceClient)) return requested;
  return fallback;
}
