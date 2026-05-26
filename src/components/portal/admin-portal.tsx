"use client";

import { AdminClientsView } from "@/components/portal/admin/admin-clients-view";
import { AdminDashboardView } from "@/components/portal/admin/admin-dashboard-view";
import { AdminDemandesView } from "@/components/portal/admin/admin-demandes-view";
import { AdminDocumentsView } from "@/components/portal/admin/admin-documents-view";
import { AdminMessagesView } from "@/components/portal/admin/admin-messages-view";
import { AdminPageHeader } from "@/components/portal/admin/admin-ui";
import { AdminPublicMediaPage } from "@/components/portal/AdminPublicMediaPage";

export type AdminPageKey =
  | "admin-dashboard"
  | "admin-clients"
  | "admin-demandes"
  | "admin-documents"
  | "admin-messages"
  | "admin-settings";

type AdminPortalProps = {
  activePage: AdminPageKey;
};

export function AdminPortal({ activePage }: AdminPortalProps) {
  switch (activePage) {
    case "admin-dashboard":
      return <AdminDashboardView />;
    case "admin-clients":
      return <AdminClientsView />;
    case "admin-demandes":
      return <AdminDemandesView />;
    case "admin-documents":
      return <AdminDocumentsView />;
    case "admin-messages":
      return <AdminMessagesView />;
    case "admin-settings":
      return (
        <section>
          <AdminPageHeader title="Réglages" description="Médias publics du site" />
          <AdminPublicMediaPage />
        </section>
      );
    default:
      return null;
  }
}
