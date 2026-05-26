"use client";

import * as React from "react";
import { Files, Settings, User } from "lucide-react";
import { Header } from "@/components/portal/Header";
import { Sidebar, type NavSection } from "@/components/portal/Sidebar";
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
  const { mode, authUser, loading, error, refresh, documents, clients, selectedClientId, siteLeads, notifications } =
    usePortal();
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
  const toValidate = pendingReview;

  const clientSections: NavSection[] = [
    {
      title: "",
      items: [
        {
          key: "client-documents",
          label: "Mes pièces justificatives",
          badge: toUpload > 0 ? String(toUpload) : undefined,
          icon: <Files className={iconClass} aria-hidden />,
        },
        {
          key: "client-profile",
          label: "Mon profil",
          icon: <User className={iconClass} aria-hidden />,
        },
        {
          key: "client-settings",
          label: "Réglages",
          icon: <Settings className={iconClass} aria-hidden />,
        },
      ],
    },
  ];

  const adminItems = [
    { key: "admin-dashboard", label: "Tableau de bord" },
    { key: "admin-clients", label: "Clients" },
    {
      key: "admin-demandes",
      label: "Demandes",
      badge:
        siteLeads.filter((l) => l.status !== "Traitée" && l.status !== "Archivée").length > 0
          ? String(siteLeads.filter((l) => l.status !== "Traitée" && l.status !== "Archivée").length)
          : undefined,
    },
    {
      key: "admin-documents",
      label: "Pièces justificatives",
      badge: toValidate > 0 ? String(toValidate) : undefined,
    },
    {
      key: "admin-messages",
      label: "Messages",
    },
  ];

  return (
    <div className="min-h-dvh bg-[#f4f6fb] px-3 pb-3 pt-3 sm:px-4 sm:pb-4 lg:px-5 lg:pb-5">
      <Sidebar
        mode={mode}
        sections={mode === "client" ? clientSections : undefined}
        items={mode === "admin" ? adminItems : undefined}
        active={activePage}
        onSelect={onChangePage}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        connectedUser={connectedUser}
        onOpenSettings={() => onChangePage(mode === "admin" ? "admin-settings" : "client-settings")}
        showSettingsLink={mode === "admin"}
        hidePortalBranding={mode === "client"}
      />

      <div className="mx-auto max-w-[1200px] lg:pl-[19.5rem]">
        <Header onOpenMobileMenu={() => setMobileOpen(true)} />

        <main className="min-h-[calc(100dvh-2rem)] rounded-3xl border border-neutral-200 bg-white p-4 shadow-[0_10px_30px_rgba(10,20,40,0.04)] sm:p-5 lg:p-6">
          {loading && clients.length === 0 ? (
            <p className="py-12 text-center text-sm text-neutral-600" role="status">
              Chargement de votre espace…
            </p>
          ) : error ? (
            <div className="py-10 text-center">
              <p className="text-sm font-medium text-rose-700">{error}</p>
              <button
                type="button"
                onClick={() => void refresh()}
                className="mt-4 rounded-xl border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-800 hover:bg-neutral-50"
              >
                Réessayer
              </button>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}
