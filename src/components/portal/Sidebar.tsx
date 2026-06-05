"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { LogOut, X } from "lucide-react";
import { SITE_LOGO_URL, SITE_NAME } from "@/lib/content/site";
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

function SidebarNav({
  mode,
  navSections,
  active,
  onSelect,
  connectedUser,
  onNavigate,
}: {
  mode: ViewMode;
  navSections: NavSection[];
  active: string;
  onSelect: (key: string) => void;
  connectedUser: PortalConnectedUser;
  onNavigate?: () => void;
}) {
  const isAdmin = mode === "admin";

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-neutral-100 px-5 py-5">
        <Link href="/" className="inline-flex items-center" onClick={onNavigate}>
          <Image
            src={SITE_LOGO_URL}
            alt={SITE_NAME}
            width={132}
            height={40}
            className="h-9 w-auto object-contain"
          />
        </Link>
        <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
          {isAdmin ? "Administration" : "Espace client"}
        </p>
      </div>

      <nav className="flex-1 space-y-4 overflow-y-auto px-3 py-4">
        {navSections.map((section) => (
          <div key={section.title || "default"}>
            {section.title ? (
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
                {section.title}
              </p>
            ) : null}
            <ul className="space-y-1">
              {section.items.map((item) => {
                const isActive = active === item.key;
                return (
                  <li key={item.key}>
                    <button
                      type="button"
                      onClick={() => {
                        onSelect(item.key);
                        onNavigate?.();
                      }}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors",
                        isActive
                          ? "bg-[#1f2a7c]/[0.08] text-[#1f2a7c]"
                          : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900",
                      )}
                    >
                      {item.icon ? (
                        <span
                          className={cn(
                            "grid size-8 shrink-0 place-items-center rounded-lg",
                            isActive ? "bg-[#1f2a7c] text-white" : "bg-neutral-100 text-neutral-600",
                          )}
                        >
                          {item.icon}
                        </span>
                      ) : null}
                      <span className="min-w-0 flex-1 truncate">{item.label}</span>
                      {item.badge ? (
                        <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-semibold tabular-nums text-rose-700">
                          {item.badge}
                        </span>
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="space-y-2 border-t border-neutral-100 px-3 py-4">
        <div className="flex items-center gap-3 rounded-lg border border-neutral-100 bg-neutral-50/80 px-3 py-2.5">
          {connectedUser.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- avatar Supabase
            <img
              src={connectedUser.avatarUrl}
              alt=""
              className="size-9 shrink-0 rounded-full object-cover"
            />
          ) : (
            <div
              className="grid size-9 shrink-0 place-items-center rounded-full bg-[#1f2a7c] text-[11px] font-bold text-white"
              aria-hidden
            >
              {initials(connectedUser.name, connectedUser.email)}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-neutral-900">{connectedUser.name}</p>
            <p className="truncate text-xs text-neutral-500">{connectedUser.email}</p>
          </div>
        </div>

        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-200 px-3 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
          >
            <LogOut className="size-4 shrink-0" aria-hidden />
            Se déconnecter
          </button>
        </form>
      </div>
    </div>
  );
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
}: {
  mode: ViewMode;
  items?: NavItem[];
  sections?: NavSection[];
  active: string;
  onSelect: (key: string) => void;
  mobileOpen: boolean;
  setMobileOpen: (value: boolean) => void;
  connectedUser: PortalConnectedUser;
  hidePortalBranding?: boolean;
  onOpenSettings?: () => void;
  showSettingsLink?: boolean;
}) {
  const navSections = sections ?? (items ? [{ title: "", items }] : []);

  return (
    <>
      <aside className="hidden w-64 shrink-0 border-r border-neutral-100 bg-white lg:sticky lg:top-0 lg:block lg:h-dvh">
        <SidebarNav
          mode={mode}
          navSections={navSections}
          active={active}
          onSelect={onSelect}
          connectedUser={connectedUser}
        />
      </aside>

      {mobileOpen ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-50 bg-black/20 lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-label="Fermer le menu"
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-[min(280px,88vw)] border-r border-neutral-100 bg-white shadow-xl lg:hidden">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-3 grid size-9 place-items-center rounded-lg text-neutral-500 hover:bg-neutral-50"
              aria-label="Fermer"
            >
              <X className="size-4" />
            </button>
            <SidebarNav
              mode={mode}
              navSections={navSections}
              active={active}
              onSelect={onSelect}
              connectedUser={connectedUser}
              onNavigate={() => setMobileOpen(false)}
            />
          </aside>
        </>
      ) : null}
    </>
  );
}
