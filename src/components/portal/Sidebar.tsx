"use client";

import * as React from "react";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ViewMode } from "@/components/portal/types";

export type NavItem = {
  key: string;
  label: string;
  badge?: string;
  icon?: React.ReactNode;
};

export type NavSection = {
  title: string;
  items: NavItem[];
};

export type PortalConnectedUser = {
  name: string;
  email: string;
  statusLabel: string;
  avatarUrl?: string | null;
};

function initials(name: string, email: string) {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return parts[0].slice(0, 2).toUpperCase();
  }
  const local = email.split("@")[0] ?? "?";
  return local.slice(0, 2).toUpperCase();
}

export function Sidebar({
  mode,
  items,
  sections,
  active,
  onSelect,
  mobileOpen,
  setMobileOpen,
  connectedUser,
  hidePortalBranding = false,
}: {
  mode: ViewMode;
  items?: NavItem[];
  sections?: NavSection[];
  active: string;
  onSelect: (key: string) => void;
  mobileOpen: boolean;
  setMobileOpen: (value: boolean) => void;
  connectedUser: PortalConnectedUser;
  /** @deprecated Réglages via la navigation latérale */
  onOpenSettings?: () => void;
  /** @deprecated */
  showSettingsLink?: boolean;
  hidePortalBranding?: boolean;
}) {
  const isClient = mode === "client";
  const isAdmin = mode === "admin";
  const navSections = sections ?? (items ? [{ title: "", items }] : []);
  const activeNavClass = isAdmin
    ? "bg-amber-800 text-white shadow-sm"
    : "bg-[#1f2a7c] text-white shadow-sm";
  const inactiveNavIconClass = isAdmin ? "bg-amber-800/10 text-amber-900" : "bg-[#1f2a7c]/8 text-[#1f2a7c]";

  return (
    <>
      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-app-drawer-backdrop bg-black/35 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Fermer le menu"
        />
      ) : null}

      <aside
        className={cn(
          "fixed bottom-4 left-4 top-4 z-app-drawer flex w-72 flex-col rounded-3xl border border-neutral-200 bg-white p-4 shadow-card transition-transform duration-300 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-[120%] lg:translate-x-0",
        )}
      >
        {isAdmin ? (
          <div className="shrink-0 rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50/90 to-white p-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-900/70">
              Administration
            </p>
            <p className="text-sm font-semibold text-neutral-900">Lefèvre Conseil</p>
            <div className="mt-2.5 flex items-center gap-2 border-t border-amber-200/60 pt-2.5">
              {connectedUser.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- avatar Supabase
                <img
                  src={connectedUser.avatarUrl}
                  alt=""
                  className="size-8 shrink-0 rounded-lg border border-amber-200/80 object-cover"
                />
              ) : (
                <div
                  className="grid size-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-amber-600 to-amber-900 text-[10px] font-bold text-white"
                  aria-hidden
                >
                  {initials(connectedUser.name, connectedUser.email)}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-neutral-900">{connectedUser.name}</p>
                <p className="truncate text-[10px] text-neutral-500">{connectedUser.email}</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {!hidePortalBranding ? (
              <div className="shrink-0 rounded-2xl border border-[#1f2a7c]/12 bg-gradient-to-br from-[#1f2a7c]/[0.08] to-white p-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#1f2a7c]/65">
                  Espace client
                </p>
                <p className="mt-0.5 text-sm font-semibold text-neutral-900">Lefèvre Conseil</p>
              </div>
            ) : null}

            <div
              className={cn(
                "shrink-0 rounded-2xl border border-neutral-200 bg-neutral-50/80 p-2.5",
                !hidePortalBranding && "mt-3",
              )}
            >
              <div className="flex items-center gap-2.5">
                {connectedUser.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element -- avatar Supabase
                  <img
                    src={connectedUser.avatarUrl}
                    alt=""
                    className="size-10 shrink-0 rounded-xl border border-neutral-200 object-cover shadow-sm"
                  />
                ) : (
                  <div
                    className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#1f2a7c] to-[#0f164a] text-xs font-bold text-white shadow-sm"
                    aria-hidden
                  >
                    {initials(connectedUser.name, connectedUser.email)}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-neutral-900">{connectedUser.name}</p>
                  <p className="truncate text-[11px] text-neutral-500">{connectedUser.email}</p>
                </div>
              </div>
            </div>
          </>
        )}

        <nav className="mt-4 min-h-0 flex-1 space-y-4 overflow-y-auto pr-0.5">
          {navSections.map((section) => (
            <div key={section.title || "default"}>
              {section.title ? (
                <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
                  {section.title}
                </p>
              ) : null}
              <ul className="space-y-1">
                {section.items.map((item) => (
                  <li key={item.key}>
                    <button
                      type="button"
                      onClick={() => {
                        onSelect(item.key);
                        setMobileOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors",
                        active === item.key ? activeNavClass : "text-neutral-700 hover:bg-neutral-100",
                      )}
                    >
                      {item.icon ? (
                        <span
                          className={cn(
                            "grid size-8 shrink-0 place-items-center rounded-lg",
                            active === item.key ? "bg-white/15" : inactiveNavIconClass,
                          )}
                        >
                          {item.icon}
                        </span>
                      ) : null}
                      <span className="min-w-0 flex-1 truncate">{item.label}</span>
                      {item.badge ? (
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[10px] font-semibold tabular-nums",
                            active === item.key ? "bg-white/20 text-white" : "bg-rose-100 text-rose-800",
                          )}
                        >
                          {item.badge}
                        </span>
                      ) : null}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="mt-3 shrink-0 space-y-1.5 border-t border-neutral-100 pt-3">
          {isClient ? (
            <Link
              href="/"
              className="flex w-full items-center justify-center rounded-xl border border-neutral-200 px-3 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
              onClick={() => setMobileOpen(false)}
            >
              Retour au site
            </Link>
          ) : null}
          <SignOutButton />
        </div>
      </aside>
    </>
  );
}

function SignOutButton() {
  return (
    <form action="/auth/signout" method="post" className="w-full">
      <button
        type="submit"
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 px-3 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
      >
        <LogOut className="size-4 shrink-0" aria-hidden />
        Se déconnecter
      </button>
    </form>
  );
}
