"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronUp, ExternalLink, Files, LogOut, PanelLeft, Settings, User, X } from "lucide-react";
import { PortalClientNavbar } from "@/components/portal/portal-client-navbar";
import type { ClientPortalNotification } from "@/components/portal/portal-client-navbar";
import {
  PORTAL_ICON_BUTTON,
  PORTAL_MOTION,
  PortalDropdownPanel,
  PortalMenuItem,
  PortalMenuSection,
  PortalMenuSeparator,
  useDismissiblePanel,
} from "@/components/portal/portal-client-ui";
import { SITE_LOGO_URL, SITE_NAME } from "@/lib/content/site";
import { cn } from "@/lib/utils";

const SIDEBAR_COLLAPSED_STORAGE_KEY = "client-portal-sidebar-collapsed";

export type ClientPortalNavItem = {
  key: string;
  label: string;
  badge?: string;
  icon: React.ReactNode;
};

export type ClientPortalSidebarUser = {
  name: string;
  email: string;
  role: string;
  avatarUrl?: string | null;
};

function initials(name: string, email: string) {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (email.split("@")[0] ?? "?").slice(0, 2).toUpperCase();
}

function SidebarTooltip({ label, show }: { label: string; show: boolean }) {
  if (!show || !label) return null;
  return (
    <span className="pointer-events-none absolute left-[calc(100%+0.5rem)] top-1/2 z-50 hidden -translate-y-1/2 whitespace-nowrap rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-medium text-neutral-800 shadow-md lg:group-hover/nav:block">
      {label}
    </span>
  );
}

function UserAvatar({ user, compact }: { user: ClientPortalSidebarUser; compact?: boolean }) {
  const inner = user.avatarUrl ? (
    // eslint-disable-next-line @next/next/no-img-element -- avatar Supabase
    <img src={user.avatarUrl} alt="" className="size-full rounded-full object-cover" />
  ) : (
    <div
      className="grid size-full place-items-center rounded-full bg-gradient-to-br from-[#1f2a7c] to-[#2d3a9a] text-[11px] font-semibold text-white"
      aria-hidden
    >
      {initials(user.name, user.email)}
    </div>
  );

  return (
    <div
      className={cn(
        "relative shrink-0 rounded-full bg-white p-0.5 shadow-sm ring-1 ring-neutral-200/80",
        compact ? "size-10" : "size-11",
      )}
    >
      <div className="size-full overflow-hidden rounded-full">{inner}</div>
    </div>
  );
}

function SidebarUserCard({
  user,
  collapsed,
  onNavigate,
  onSelectProfile,
  onSelectSettings,
}: {
  user: ClientPortalSidebarUser;
  collapsed?: boolean;
  onNavigate?: () => void;
  onSelectProfile?: () => void;
  onSelectSettings?: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  const rootRef = useDismissiblePanel(open, () => setOpen(false));

  React.useEffect(() => {
    setOpen(false);
  }, [collapsed]);

  const runAction = (action?: () => void) => {
    setOpen(false);
    action?.();
    onNavigate?.();
  };

  return (
    <div
      ref={rootRef}
      className={cn(
        "group/nav relative shrink-0 supports-[padding:max(0px)]:pb-[max(1rem,env(safe-area-inset-bottom))]",
        collapsed ? "px-2 pb-3 pt-2" : "px-3 pb-4 pt-3",
      )}
    >
      <PortalDropdownPanel
        open={open}
        placement={collapsed ? "right-center" : "top-stretch"}
        className={cn(collapsed ? "w-56" : "shadow-[0_-8px_30px_rgba(0,0,0,0.08)]")}
      >
        <PortalMenuSection title="Compte">
          <PortalMenuItem
            icon={<User className="size-3.5" aria-hidden />}
            label="Mon profil"
            onClick={() => runAction(onSelectProfile)}
          />
          <PortalMenuItem
            icon={<Settings className="size-3.5" aria-hidden />}
            label="Réglages"
            onClick={() => runAction(onSelectSettings)}
          />
        </PortalMenuSection>

        <PortalMenuSeparator />

        <PortalMenuSection title="Navigation">
          <Link
            href="/"
            role="menuitem"
            onClick={() => runAction()}
            className="mx-1.5 flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
          >
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-neutral-100 text-neutral-600">
              <ExternalLink className="size-3.5" aria-hidden />
            </span>
            Retour au site
          </Link>
        </PortalMenuSection>

        <PortalMenuSeparator />

        <PortalMenuSection>
          <form action="/auth/signout" method="post" role="none">
            <PortalMenuItem
              type="submit"
              icon={<LogOut className="size-3.5" aria-hidden />}
              label="Se déconnecter"
              tone="danger"
            />
          </form>
        </PortalMenuSection>
      </PortalDropdownPanel>

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={collapsed ? `${user.name}, ouvrir le menu` : undefined}
        className={cn(
          "group flex w-full text-left transition-all duration-200",
          collapsed
            ? "justify-center rounded-xl p-2 hover:bg-neutral-100/80"
            : "items-center gap-3 rounded-2xl px-3 py-3 hover:bg-neutral-100/80",
          open && !collapsed && "bg-neutral-100/90 shadow-inner",
        )}
      >
        <UserAvatar user={user} compact={collapsed} />
        {!collapsed ? (
          <>
            <span className="min-w-0 flex-1 overflow-hidden">
              <span className="block truncate text-[13px] font-semibold tracking-tight text-neutral-900">{user.name}</span>
              <span className="mt-1 inline-flex items-center rounded-full bg-[#1f2a7c]/[0.07] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#1f2a7c]/80">
                {user.role}
              </span>
            </span>
            <ChevronUp
              className={cn(
                "size-4 shrink-0 text-neutral-400 transition-transform duration-200 group-hover:text-neutral-600",
                open && "rotate-180",
              )}
              aria-hidden
            />
          </>
        ) : null}
      </button>

      <SidebarTooltip label={user.name} show={Boolean(collapsed)} />
    </div>
  );
}

function NavItemButton({
  active,
  label,
  badge,
  icon,
  collapsed,
  onClick,
}: {
  active: boolean;
  label: string;
  badge?: string;
  icon: React.ReactNode;
  collapsed?: boolean;
  onClick: () => void;
}) {
  return (
    <div className="group/nav relative">
      <button
        type="button"
        onClick={onClick}
        aria-current={active ? "page" : undefined}
        aria-label={collapsed ? label : undefined}
        className={cn(
          "flex w-full items-center rounded-xl text-[13px] font-medium transition-all duration-200 active:scale-[0.99]",
          collapsed ? "justify-center px-0 py-3" : "gap-3 px-3 py-3",
          active
            ? "bg-[#1f2a7c]/[0.07] text-[#1f2a7c] shadow-[inset_0_0_0_1px_rgba(31,42,124,0.08)]"
            : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900",
        )}
      >
        <span
          className={cn(
            "relative grid size-8 shrink-0 place-items-center rounded-lg transition-colors",
            active ? "bg-[#1f2a7c] text-white shadow-sm" : "bg-neutral-100/90 text-neutral-500",
          )}
        >
          {icon}
          {collapsed && badge ? (
            <span className="absolute -right-1 -top-1 size-2 rounded-full bg-rose-500 ring-2 ring-white" aria-hidden />
          ) : null}
        </span>
        {!collapsed ? (
          <>
            <span className="min-w-0 flex-1 truncate">{label}</span>
            {badge ? (
              <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-semibold tabular-nums text-rose-700">
                {badge}
              </span>
            ) : null}
          </>
        ) : null}
      </button>
      <SidebarTooltip label={badge ? `${label} (${badge})` : label} show={Boolean(collapsed)} />
    </div>
  );
}

function SidebarHeader({
  collapsed,
  mobileDrawer,
  onToggleCollapse,
  onCloseDrawer,
  onNavigate,
}: {
  collapsed?: boolean;
  mobileDrawer?: boolean;
  onToggleCollapse?: () => void;
  onCloseDrawer?: () => void;
  onNavigate?: () => void;
}) {
  if (collapsed && !mobileDrawer) {
    return (
      <div className="flex shrink-0 justify-center border-b border-neutral-100/80 px-2 py-4">
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label="Ouvrir la barre latérale"
          className="group relative grid size-11 place-items-center rounded-xl transition-colors hover:bg-neutral-100/80"
        >
          <Image
            src={SITE_LOGO_URL}
            alt={SITE_NAME}
            width={40}
            height={40}
            className="size-8 object-contain transition-all duration-200 group-hover:scale-95 group-hover:opacity-0"
          />
          <PanelLeft className="absolute size-5 text-neutral-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
        </button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex shrink-0 items-center gap-2 border-b border-neutral-100/80",
        mobileDrawer ? "px-4 py-4" : "px-4 py-5",
      )}
    >
      <Link href="/" className="inline-flex min-w-0 flex-1 items-center" onClick={onNavigate}>
        <Image
          src={SITE_LOGO_URL}
          alt={SITE_NAME}
          width={168}
          height={52}
          className="h-10 w-auto object-contain sm:h-11"
          priority
        />
      </Link>

      {mobileDrawer && onCloseDrawer ? (
        <button
          type="button"
          onClick={onCloseDrawer}
          className={cn(PORTAL_ICON_BUTTON, "size-9 border-0 bg-neutral-100 text-neutral-500 hover:bg-neutral-200/80")}
          aria-label="Fermer le menu"
        >
          <X className="size-4" />
        </button>
      ) : onToggleCollapse ? (
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label="Replier la barre latérale"
          className={PORTAL_ICON_BUTTON}
        >
          <PanelLeft className="size-[18px]" />
        </button>
      ) : null}
    </div>
  );
}

function SidebarContent({
  items,
  active,
  onSelect,
  user,
  collapsed,
  onNavigate,
  mobileDrawer,
  onCloseDrawer,
  onToggleCollapse,
}: {
  items: ClientPortalNavItem[];
  active: string;
  onSelect: (key: string) => void;
  user: ClientPortalSidebarUser;
  collapsed?: boolean;
  onNavigate?: () => void;
  mobileDrawer?: boolean;
  onCloseDrawer?: () => void;
  onToggleCollapse?: () => void;
}) {
  const isCollapsed = Boolean(collapsed) && !mobileDrawer;

  return (
    <div className="flex h-full min-h-0 flex-col bg-white">
      <SidebarHeader
        collapsed={isCollapsed}
        mobileDrawer={mobileDrawer}
        onToggleCollapse={onToggleCollapse}
        onCloseDrawer={onCloseDrawer}
        onNavigate={onNavigate}
      />

      <nav
        className={cn(
          "min-h-0 flex-1 space-y-0.5 overflow-y-auto overscroll-contain py-3",
          isCollapsed ? "px-2" : "px-3",
        )}
        aria-label="Navigation espace client"
      >
        {items.map((item) => (
          <NavItemButton
            key={item.key}
            active={active === item.key}
            label={item.label}
            badge={item.badge}
            icon={item.icon}
            collapsed={isCollapsed}
            onClick={() => {
              onSelect(item.key);
              onNavigate?.();
            }}
          />
        ))}
      </nav>

      <div className="mt-auto border-t border-neutral-100/80">
        <SidebarUserCard
          user={user}
          collapsed={isCollapsed}
          onNavigate={onNavigate}
          onSelectProfile={() => onSelect("client-profile")}
          onSelectSettings={() => onSelect("client-settings")}
        />
      </div>
    </div>
  );
}

export function ClientPortalShell({
  items,
  active,
  onSelect,
  user,
  notifications,
  children,
}: {
  items: ClientPortalNavItem[];
  active: string;
  onSelect: (key: string) => void;
  user: ClientPortalSidebarUser;
  notifications?: ClientPortalNotification[];
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(false);

  React.useEffect(() => {
    try {
      if (localStorage.getItem(SIDEBAR_COLLAPSED_STORAGE_KEY) === "1") setCollapsed(true);
    } catch {
      /* ignore */
    }
  }, []);

  React.useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  React.useEffect(() => {
    setNotificationsOpen(false);
    setMobileOpen(false);
  }, [active]);

  const closeMobile = React.useCallback(() => setMobileOpen(false), []);

  const openMobile = React.useCallback(() => {
    setNotificationsOpen(false);
    setMobileOpen(true);
  }, []);

  const handleNotificationsOpenChange = React.useCallback((open: boolean) => {
    if (open) setMobileOpen(false);
    setNotificationsOpen(open);
  }, []);

  const toggleCollapsed = React.useCallback(() => {
    setCollapsed((value) => {
      const next = !value;
      try {
        localStorage.setItem(SIDEBAR_COLLAPSED_STORAGE_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  return (
    <div className="min-h-dvh bg-neutral-50/40 text-neutral-900">
      <div className="flex min-h-dvh">
        <aside
          className={cn(
            "hidden shrink-0 overflow-visible border-r border-neutral-100/90 bg-white transition-[width] duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] lg:sticky lg:top-0 lg:block lg:h-dvh",
            collapsed ? "w-[76px]" : "w-[260px]",
          )}
        >
          <SidebarContent
            items={items}
            active={active}
            onSelect={onSelect}
            user={user}
            collapsed={collapsed}
            onToggleCollapse={toggleCollapsed}
          />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col bg-white">
          <PortalClientNavbar
            activePage={active}
            notifications={notifications ?? []}
            open={notificationsOpen}
            onOpenChange={handleNotificationsOpenChange}
            onOpenMenu={openMobile}
            onOpenDocuments={() => onSelect("client-documents")}
          />

          <main className="flex-1 px-4 py-6 sm:px-8 sm:py-8">
            <div className="mx-auto w-full max-w-3xl">{children}</div>
          </main>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {mobileOpen ? (
          <>
            <motion.button
              type="button"
              key="mobile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={PORTAL_MOTION.backdrop}
              className="fixed inset-0 z-50 bg-neutral-900/25 backdrop-blur-[2px] lg:hidden"
              onClick={closeMobile}
              aria-label="Fermer le menu"
            />
            <motion.aside
              key="mobile-drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={PORTAL_MOTION.drawer}
              className="fixed inset-y-0 left-0 z-[60] flex h-dvh w-[min(288px,88vw)] flex-col shadow-2xl lg:hidden"
            >
              <SidebarContent
                items={items}
                active={active}
                onSelect={onSelect}
                user={user}
                mobileDrawer
                onCloseDrawer={closeMobile}
                onNavigate={closeMobile}
              />
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export const CLIENT_PORTAL_NAV_ICONS = {
  documents: <Files className="size-4" aria-hidden />,
  profile: <User className="size-4" aria-hidden />,
  settings: <Settings className="size-4" aria-hidden />,
} as const;
