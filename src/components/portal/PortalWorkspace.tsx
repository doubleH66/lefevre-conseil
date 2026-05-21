"use client";

import { usePathname, useRouter } from "next/navigation";
import { AppLayout } from "@/components/portal/AppLayout";
import { AdminPortal, type AdminPageKey } from "@/components/portal/admin-portal";
import { ClientPortal, type ClientPageKey } from "@/components/portal/client-portal";
import { PortalProvider, usePortal } from "@/components/portal/portal-provider";
import { ToastStack } from "@/components/portal/Toast";
import type { ViewMode } from "@/components/portal/types";
import { CLIENT_PORTAL_PATHS, clientPageKeyFromPath } from "@/lib/portal/client-routes";
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
  const pathname = usePathname();
  const router = useRouter();
  const [adminPage, setAdminPage] = React.useState<AdminPageKey>("admin-dashboard");

  const activePage: PageKey =
    mode === "client" ? clientPageKeyFromPath(pathname) : adminPage;

  const onChangePage = React.useCallback(
    (key: string) => {
      if (mode === "client") {
        const path = CLIENT_PORTAL_PATHS[key as ClientPageKey];
        if (path && path !== pathname) router.push(path);
        return;
      }
      setAdminPage(key as AdminPageKey);
    },
    [mode, pathname, router],
  );

  React.useEffect(() => {
    if (mode === "admin") setAdminPage("admin-dashboard");
  }, [mode]);

  return (
    <>
      <AppLayout activePage={activePage} onChangePage={onChangePage}>
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
