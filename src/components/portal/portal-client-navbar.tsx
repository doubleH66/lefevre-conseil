"use client";

import * as React from "react";
import Image from "next/image";
import { Bell, CheckCircle2, FileWarning, PanelLeft, Upload, X } from "lucide-react";
import type { PortalDocument } from "@/components/portal/types";
import {
  PORTAL_ICON_BUTTON,
  PORTAL_ICON_BUTTON_ACTIVE,
  PortalDropdownPanel,
  PortalMenuItem,
  useDismissiblePanel,
} from "@/components/portal/portal-client-ui";
import { cn } from "@/lib/utils";

export type ClientPortalNotification = {
  id: string;
  title: string;
  body?: string;
  tone: "action" | "info" | "success";
};

export const CLIENT_PORTAL_PAGE_TITLES: Record<string, string> = {
  "client-documents": "Mes documents",
  "client-profile": "Mon profil",
  "client-settings": "Réglages",
};

export function buildClientPortalNotifications(documents: PortalDocument[]): ClientPortalNotification[] {
  const items: ClientPortalNotification[] = [];

  for (const doc of documents) {
    if (doc.status === "Demandé" || doc.status === "Refusé") {
      items.push({
        id: `upload-${doc.id}`,
        title: doc.status === "Demandé" ? "Pièce à déposer" : "Pièce refusée",
        body: doc.name,
        tone: "action",
      });
      continue;
    }

    if (doc.status === "À corriger") {
      items.push({
        id: `fix-${doc.id}`,
        title: "Pièce à corriger",
        body: doc.name,
        tone: "action",
      });
      continue;
    }

    if (doc.status === "Envoyé") {
      items.push({
        id: `review-${doc.id}`,
        title: "En cours de vérification",
        body: doc.name,
        tone: "info",
      });
      continue;
    }

    if (doc.status === "Validé") {
      items.push({
        id: `done-${doc.id}`,
        title: "Pièce validée",
        body: doc.name,
        tone: "success",
      });
    }
  }

  return items;
}

function notificationIcon(tone: ClientPortalNotification["tone"]) {
  if (tone === "action") return <Upload className="size-3.5" aria-hidden />;
  if (tone === "success") return <CheckCircle2 className="size-3.5" aria-hidden />;
  return <FileWarning className="size-3.5" aria-hidden />;
}

function notificationToneClass(tone: ClientPortalNotification["tone"]) {
  if (tone === "action") return "bg-amber-100 text-amber-700";
  if (tone === "success") return "bg-emerald-100 text-emerald-700";
  return "bg-sky-100 text-sky-700";
}

export function PortalClientNavbar({
  activePage,
  notifications,
  open,
  onOpenChange,
  onOpenMenu,
  onOpenDocuments,
}: {
  activePage: string;
  notifications: ClientPortalNotification[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenMenu: () => void;
  onOpenDocuments?: () => void;
}) {
  const rootRef = useDismissiblePanel(open, () => onOpenChange(false));
  const unreadCount = notifications.filter((item) => item.tone === "action").length;
  const pageTitle = CLIENT_PORTAL_PAGE_TITLES[activePage] ?? "Espace client";

  React.useEffect(() => {
    onOpenChange(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fermeture à chaque changement de page
  }, [activePage]);

  const goToDocuments = React.useCallback(() => {
    onOpenChange(false);
    onOpenDocuments?.();
  }, [onOpenChange, onOpenDocuments]);

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-100/90 bg-white/95 backdrop-blur-md supports-[padding:max(0px)]:pt-[max(0.75rem,env(safe-area-inset-top))]">
      <div className="flex h-14 items-center gap-3 px-4 sm:h-16 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onOpenMenu}
          className={cn(PORTAL_ICON_BUTTON, "lg:hidden")}
          aria-label="Ouvrir le menu"
        >
          <PanelLeft className="size-5" />
        </button>

        <div className="min-w-0 text-left">
          <h1 className="truncate text-base font-semibold tracking-tight text-neutral-900 sm:text-lg">{pageTitle}</h1>
          <p className="hidden truncate text-left text-xs text-neutral-500 sm:block lg:hidden">
            Lefèvre Conseil · Espace client
          </p>
        </div>

        <div ref={rootRef} className="relative ml-auto shrink-0">
          <button
            type="button"
            onClick={() => onOpenChange(!open)}
            aria-expanded={open}
            aria-haspopup="menu"
            aria-label={
              unreadCount > 0
                ? `Notifications, ${unreadCount} action${unreadCount > 1 ? "s" : ""} requise${unreadCount > 1 ? "s" : ""}`
                : "Notifications"
            }
            className={cn(PORTAL_ICON_BUTTON, "relative", open && PORTAL_ICON_BUTTON_ACTIVE)}
          >
            <Bell className="size-[18px]" />
            {unreadCount > 0 ? (
              <span className="absolute right-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white ring-2 ring-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            ) : null}
          </button>

          <PortalDropdownPanel open={open} className="w-[min(320px,calc(100vw-2rem))]">
            <div className="flex items-start justify-between gap-3 border-b border-neutral-100 px-4 py-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-neutral-900">Notifications</p>
                <p className="mt-0.5 text-xs text-neutral-500">
                  {notifications.length > 0
                    ? `${notifications.length} mise${notifications.length > 1 ? "s" : ""} à jour`
                    : "Rien à signaler"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="grid size-8 shrink-0 place-items-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
                aria-label="Fermer les notifications"
              >
                <X className="size-4" />
              </button>
            </div>

            {notifications.length > 0 ? (
              <ul className="max-h-72 overflow-y-auto py-1">
                {notifications.slice(0, 8).map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={goToDocuments}
                      className="flex w-full items-start gap-3 px-3 py-2.5 text-left transition-colors hover:bg-neutral-50"
                    >
                      <span
                        className={cn(
                          "mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg",
                          notificationToneClass(item.tone),
                        )}
                      >
                        {notificationIcon(item.tone)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[13px] font-medium text-neutral-900">{item.title}</span>
                        {item.body ? (
                          <span className="mt-0.5 block truncate text-xs text-neutral-500">{item.body}</span>
                        ) : null}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-10 text-center">
                <p className="text-sm font-medium text-neutral-800">Vous êtes à jour</p>
                <p className="mt-1 text-xs text-neutral-500">Les alertes sur vos pièces apparaîtront ici.</p>
              </div>
            )}

            {notifications.length > 0 && onOpenDocuments ? (
              <div className="border-t border-neutral-100 p-2">
                <PortalMenuItem
                  icon={<Upload className="size-3.5" aria-hidden />}
                  label="Voir mes documents"
                  onClick={goToDocuments}
                />
              </div>
            ) : null}
          </PortalDropdownPanel>
        </div>
      </div>
    </header>
  );
}
