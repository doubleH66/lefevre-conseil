"use client";

import { AppLayout } from "@/components/portal/AppLayout";
import { AdminPortal, type AdminPageKey } from "@/components/portal/admin-portal";
import { ClientPortal, type ClientPageKey } from "@/components/portal/client-portal";
import { PortalProvider, usePortal } from "@/components/portal/portal-provider";
import { ToastStack } from "@/components/portal/Toast";
import type { ViewMode } from "@/components/portal/types";
import * as React from "react";

type PageKey = ClientPageKey | AdminPageKey;

export function PortalWorkspace({ initialMode = "client" }: { initialMode?: ViewMode }) {
  return (
    <PortalProvider initialMode={initialMode}>
      <PortalWorkspaceInner />
    </PortalProvider>
  );
}

function PortalWorkspaceInner() {
  const { mode, toasts, dismissToast } = usePortal();
  const [activePage, setActivePage] = React.useState<PageKey>(
    mode === "client" ? "client-documents" : "admin-dashboard",
  );

  React.useEffect(() => {
    setActivePage(mode === "client" ? "client-documents" : "admin-dashboard");
  }, [mode]);

  return (
    <>
      <AppLayout activePage={activePage} onChangePage={(key) => setActivePage(key as PageKey)}>
        {mode === "client" ? (
          <ClientPortal activePage={activePage as ClientPageKey} />
        ) : (
          <AdminPortal activePage={activePage as AdminPageKey} />
        )}
      </AppLayout>
      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </>
  );
}
