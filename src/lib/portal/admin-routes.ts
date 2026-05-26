import { ROUTES } from "@/lib/content/routes";
import type { AdminPageKey } from "@/components/portal/admin-portal";

export const ADMIN_PORTAL_PATHS: Record<AdminPageKey, string> = {
  "admin-dashboard": ROUTES.espaceAdmin,
  "admin-clients": `${ROUTES.espaceAdmin}/clients`,
  "admin-demandes": `${ROUTES.espaceAdmin}/demandes`,
  "admin-documents": `${ROUTES.espaceAdmin}/documents`,
  "admin-messages": `${ROUTES.espaceAdmin}/messages`,
  "admin-settings": `${ROUTES.espaceAdmin}/reglages`,
};

export function adminPageKeyFromPath(pathname: string): AdminPageKey {
  if (pathname === ADMIN_PORTAL_PATHS["admin-clients"] || pathname.startsWith(`${ADMIN_PORTAL_PATHS["admin-clients"]}/`)) {
    return "admin-clients";
  }
  if (pathname === ADMIN_PORTAL_PATHS["admin-demandes"] || pathname.startsWith(`${ADMIN_PORTAL_PATHS["admin-demandes"]}/`)) {
    return "admin-demandes";
  }
  if (pathname === ADMIN_PORTAL_PATHS["admin-documents"] || pathname.startsWith(`${ADMIN_PORTAL_PATHS["admin-documents"]}/`)) {
    return "admin-documents";
  }
  if (pathname === ADMIN_PORTAL_PATHS["admin-messages"] || pathname.startsWith(`${ADMIN_PORTAL_PATHS["admin-messages"]}/`)) {
    return "admin-messages";
  }
  if (pathname === ADMIN_PORTAL_PATHS["admin-settings"] || pathname.startsWith(`${ADMIN_PORTAL_PATHS["admin-settings"]}/`)) {
    return "admin-settings";
  }
  return "admin-dashboard";
}
