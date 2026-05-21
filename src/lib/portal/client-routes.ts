import { ROUTES } from "@/lib/content/routes";
import type { ClientPageKey } from "@/components/portal/client-portal";

export const CLIENT_PORTAL_PATHS: Record<ClientPageKey, string> = {
  "client-documents": ROUTES.espaceClient,
  "client-profile": ROUTES.espaceClientProfil,
  "client-settings": ROUTES.espaceClientReglages,
};

export function clientPageKeyFromPath(pathname: string): ClientPageKey {
  if (pathname === ROUTES.espaceClientProfil || pathname.startsWith(`${ROUTES.espaceClientProfil}/`)) {
    return "client-profile";
  }
  if (pathname === ROUTES.espaceClientReglages || pathname.startsWith(`${ROUTES.espaceClientReglages}/`)) {
    return "client-settings";
  }
  return "client-documents";
}
