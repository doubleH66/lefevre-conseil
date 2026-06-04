import { PortalWorkspace } from "@/components/portal/PortalWorkspace";
import { ProtectedPortalShell } from "@/components/portal/protected-portal-shell";

export default function EspaceAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedPortalShell mode="admin">
      <PortalWorkspace initialMode="admin" />
      {children}
    </ProtectedPortalShell>
  );
}
