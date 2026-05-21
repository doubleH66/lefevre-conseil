import type { Metadata } from "next";
import { PortalWorkspace } from "@/components/portal/PortalWorkspace";

export const metadata: Metadata = {
  title: "Administration | Lefèvre Conseil",
  description: "Gestion des clients et validation des pièces justificatives.",
  robots: { index: false, follow: false },
};

export default function EspaceAdminPage() {
  return <PortalWorkspace initialMode="admin" />;
}
