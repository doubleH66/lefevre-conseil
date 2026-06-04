import { PortalWorkspace } from "@/components/portal/PortalWorkspace";
import { ProtectedPortalShell } from "@/components/portal/protected-portal-shell";

export default function EspaceClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedPortalShell mode="client">
      <PortalWorkspace initialMode="client" />
      {children}
    </ProtectedPortalShell>
  );
}
