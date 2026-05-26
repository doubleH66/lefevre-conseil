import { PortalWorkspace } from "@/components/portal/PortalWorkspace";

export default function EspaceAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PortalWorkspace initialMode="admin" />
      {children}
    </>
  );
}
