import { PortalWorkspace } from "@/components/portal/PortalWorkspace";

export default function EspaceClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PortalWorkspace initialMode="client" />
      {children}
    </>
  );
}
