"use client";

import * as React from "react";
import { LayoutDashboard, MessageSquare, Settings, Users } from "lucide-react";
import { Sidebar } from "@/components/portal/Sidebar";
import { PortalMobileHeader } from "@/components/portal/portal-mobile-header";
import {
  ClientPortalShell,
  CLIENT_PORTAL_NAV_ICONS,
  type ClientPortalNavItem,
} from "@/components/portal/client-portal-sidebar";
import { buildClientPortalNotifications } from "@/components/portal/portal-client-navbar";
import { usePortal } from "@/components/portal/portal-provider";
import type { ReactNode } from "react";

const iconClass = "size-4";

export function AppLayout({
  activePage,
  onChangePage,
  children,
}: {
  activePage: string;
  onChangePage: (key: string) => void;
  children: ReactNode;
}) {
  const { mode, authUser, loading, error, refresh, documents, clients, selectedClientId, siteLeads } = usePortal();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const selectedClient = clients.find((c) => c.id === selectedClientId) ?? clients[0];
  const connectedUser =
    mode === "admin"
      ? {
          name:
            authUser?.fullName ||
            (authUser?.email ? authUser.email.split("@")[0] : "") ||
            "Administrateur",
          email: authUser?.email ?? "",
          statusLabel: "",
        }
      : {
          name: selectedClient?.contactName ?? authUser?.fullName ?? "Client",
          email: selectedClient?.email ?? authUser?.email ?? "",
          statusLabel: "",
          avatarUrl: authUser?.avatarUrl ?? null,
        };

  const toUpload = documents.filter(
    (d) => d.status === "Demandé" || d.status === "À corriger" || d.status === "Refusé",
  ).length;
  const pendingReview = documents.filter((d) => d.status === "Envoyé").length;

  const clientNavItems: ClientPortalNavItem[] = [
    {
      key: "client-documents",
      label: "Mes documents",
      badge: toUpload > 0 ? String(toUpload) : undefined,
      icon: CLIENT_PORTAL_NAV_ICONS.documents,
    },
    {
      key: "client-profile",
      label: "Mon profil",
      icon: CLIENT_PORTAL_NAV_ICONS.profile,
    },
    {
      key: "client-settings",
      label: "Réglages",
      icon: CLIENT_PORTAL_NAV_ICONS.settings,
    },
  ];

  const adminItems = [
    { key: "admin-dashboard", label: "Tableau de bord", icon: <LayoutDashboard className={iconClass} aria-hidden /> },
    { key: "admin-clients", label: "Clients", icon: <Users className={iconClass} aria-hidden /> },
    {
      key: "admin-demandes",
      label: "Demandes",
      icon: <MessageSquare className={iconClass} aria-hidden />,
      badge:
        siteLeads.filter((l) => l.status !== "Traitée" && l.status !== "Archivée").length > 0
          ? String(siteLeads.filter((l) => l.status !== "Traitée" && l.status !== "Archivée").length)
          : undefined,
    },
    {
      key: "admin-documents",
      label: "Pièces justificatives",
      badge: pendingReview > 0 ? String(pendingReview) : undefined,
    },
    { key: "admin-messages", label: "Messages" },
    {
      key: "admin-settings",
      label: "Réglages",
      icon: <Settings className={iconClass} aria-hidden />,
    },
  ];

  const clientNotifications = React.useMemo(() => buildClientPortalNotifications(documents), [documents]);

  const mainContent =
    loading && clients.length === 0 ? (
      <p className="py-16 text-center text-sm text-neutral-500" role="status">
        Chargement de votre espace…
      </p>
    ) : error ? (
      <div className="py-14 text-center">
        <p className="text-sm font-medium text-rose-700">{error}</p>
        <button
          type="button"
          onClick={() => void refresh()}
          className="mt-4 rounded-lg border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-800 hover:bg-neutral-50"
        >
          Réessayer
        </button>
      </div>
    ) : (
      children
    );

  if (mode === "client") {
    return (
      <ClientPortalShell
        items={clientNavItems}
        active={activePage}
        onSelect={onChangePage}
        notifications={clientNotifications}
        user={{
          name: connectedUser.name,
          email: connectedUser.email,
          role: "Client",
          avatarUrl: connectedUser.avatarUrl,
        }}
      >
        {mainContent}
      </ClientPortalShell>
    );
  }

  return (
    <div className="min-h-dvh bg-white text-neutral-900">
      <div className="flex min-h-dvh">
        <Sidebar
          mode={mode}
          items={adminItems}
          active={activePage}
          onSelect={onChangePage}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          connectedUser={connectedUser}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <PortalMobileHeader onOpenMenu={() => setMobileOpen(true)} />
          <main className="flex-1 px-4 py-6 sm:px-8 sm:py-8">
            <div className="mx-auto w-full max-w-6xl">{mainContent}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
