import type { Metadata } from "next";
import { PortalWorkspace } from "@/components/portal/PortalWorkspace";

export const metadata: Metadata = {
  title: "Mes pièces justificatives | Lefèvre Conseil",
  description: "Déposez vos pièces justificatives demandées par le cabinet Lefèvre Conseil.",
  robots: { index: false, follow: false },
};

export default function EspaceClientPage() {
  return <PortalWorkspace initialMode="client" />;
}
