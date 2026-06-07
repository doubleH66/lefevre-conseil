"use client";

import * as React from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { User } from "lucide-react";
import { NAV_ACCOUNT, NAV_ACCOUNT_MENU } from "@/lib/content/navigation";
import { navGlassBlue, navGlassRest } from "@/lib/styles/glass";
import { cn } from "@/lib/utils";

const CLOSE_DELAY_MS = 200;
const PANEL_WIDTH = 240;

type MenuPosition = { top: number; left: number };

function readMenuPosition(anchor: HTMLDivElement | null, menuUp: boolean): MenuPosition | null {
  if (!anchor) return null;
  const rect = anchor.getBoundingClientRect();
  const margin = 12;
  let left = rect.right - PANEL_WIDTH;
  left = Math.max(margin, Math.min(left, window.innerWidth - PANEL_WIDTH - margin));

  if (menuUp) {
    return { top: rect.top, left };
  }

  return { top: rect.bottom, left };
}

export function NavAccountButton({
  light,
  surfaceClass,
  compact = false,
  menuUp = false,
  portalMenu = false,
  onMenuAction,
  onLoginClick,
  onOpenChange,
}: {
  light: boolean;
  surfaceClass: string;
  compact?: boolean;
  menuUp?: boolean;
  /** Panneau fixe porté au body (desktop) --- suit le scroll comme les autres sous-menus. */
  portalMenu?: boolean;
  onMenuAction?: () => void;
  onLoginClick?: () => void;
  onOpenChange?: (open: boolean) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [menuPos, setMenuPos] = React.useState<MenuPosition | null>(null);
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const closeTimerRef = React.useRef<number | null>(null);
  const panelId = React.useId();

  const setOpenState = React.useCallback(
    (next: boolean) => {
      setOpen(next);
      onOpenChange?.(next);
    },
    [onOpenChange],
  );

  const cancelClose = React.useCallback(() => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const closeMenu = React.useCallback(() => {
    cancelClose();
    setOpenState(false);
  }, [cancelClose, setOpenState]);

  const updatePosition = React.useCallback(() => {
    const nextPos = readMenuPosition(anchorRef.current, menuUp);
    if (nextPos) setMenuPos(nextPos);
  }, [menuUp]);

  const openMenu = React.useCallback(() => {
    cancelClose();
    updatePosition();
    setOpenState(true);
  }, [cancelClose, setOpenState, updatePosition]);

  const scheduleClose = React.useCallback(() => {
    cancelClose();
    closeTimerRef.current = window.setTimeout(() => setOpenState(false), CLOSE_DELAY_MS);
  }, [cancelClose, setOpenState]);

  const toggleMenu = React.useCallback(() => {
    if (open) {
      closeMenu();
      return;
    }
    openMenu();
  }, [closeMenu, open, openMenu]);

  React.useEffect(() => {
    setMounted(true);
    return () => cancelClose();
  }, [cancelClose]);

  React.useLayoutEffect(() => {
    if (!open || !portalMenu) {
      setMenuPos(null);
      return;
    }
    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open, portalMenu, updatePosition]);

  React.useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (panelRef.current?.contains(target)) return;
      if (anchorRef.current?.contains(target)) return;
      closeMenu();
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeMenu();
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [closeMenu, open]);

  const buttonClass = cn(
    "grid shrink-0 place-items-center rounded-full transition-[background-color,color,box-shadow] duration-150 hover:bg-white/[0.16]",
    compact ? "h-11 w-11" : "h-10 w-10 xl:h-11 xl:w-11",
    light ? navGlassRest : navGlassBlue,
    open && (light ? "bg-white/10" : "bg-[#1f2a7c]/5"),
  );

  const linkClass = light
    ? "text-white hover:bg-white/10"
    : "text-[#1f2a7c] hover:bg-[#1f2a7c]/[0.06]";

  const itemClass = cn(
    "block w-full rounded-xl px-3 py-2.5 text-left text-[14px] font-semibold leading-snug transition-colors duration-150",
    linkClass,
  );

  const menuList = (
    <ul>
      {NAV_ACCOUNT_MENU.map((item) => (
        <li key={item.id}>
          {item.kind === "login" ? (
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                closeMenu();
                onMenuAction?.();
                onLoginClick?.();
              }}
              className={itemClass}
            >
              {item.label}
            </button>
          ) : (
            <Link
              href={item.href}
              role="menuitem"
              onClick={() => {
                closeMenu();
                onMenuAction?.();
              }}
              className={itemClass}
            >
              {item.label}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );

  const panelInner = (
    <div className={cn("overflow-hidden rounded-[1.75rem] p-2", surfaceClass)}>{menuList}</div>
  );

  const canRenderPortal = mounted && open && onLoginClick && portalMenu && menuPos !== null;

  const portalPanel =
    mounted && typeof document !== "undefined"
      ? createPortal(
          canRenderPortal ? (
            <div
              ref={panelRef}
              id={panelId}
              role="menu"
              aria-label="Menu compte"
              style={{
                position: "fixed",
                top: menuPos.top,
                left: menuPos.left,
                width: PANEL_WIDTH,
                zIndex: 70,
              }}
              className="hidden lg:block"
              onMouseEnter={cancelClose}
              onMouseLeave={scheduleClose}
            >
              <div aria-hidden className="-mt-3 h-3" />
              {panelInner}
            </div>
          ) : null,
          document.body,
        )
      : null;

  const inlinePanel =
    open && onLoginClick && !portalMenu ? (
      <div
        ref={panelRef}
        id={panelId}
        role="menu"
        aria-label="Menu compte"
        className={cn(
          "absolute right-0 z-50 w-[min(calc(100vw-2rem),240px)]",
          menuUp ? "bottom-full pb-2.5" : "top-full pt-2.5",
        )}
        onMouseEnter={cancelClose}
        onMouseLeave={scheduleClose}
      >
        {!menuUp ? <div aria-hidden className="-mt-3 h-3" /> : null}
        {panelInner}
      </div>
    ) : null;

  return (
    <>
      <div
        ref={anchorRef}
        className="relative"
        onMouseEnter={() => {
          if (window.matchMedia("(min-width: 1024px)").matches) openMenu();
        }}
        onMouseLeave={() => {
          if (window.matchMedia("(min-width: 1024px)").matches) scheduleClose();
        }}
      >
        {onLoginClick ? (
          <button
            type="button"
            aria-label="Compte et espace client"
            aria-expanded={open}
            aria-haspopup="menu"
            aria-controls={panelId}
            onClick={toggleMenu}
            className={buttonClass}
          >
            <User className={compact ? "h-5 w-5" : "h-5 w-5 xl:h-[22px] xl:w-[22px]"} aria-hidden />
          </button>
        ) : (
          <Link href={NAV_ACCOUNT.href} aria-label="Compte" className={buttonClass}>
            <User className={compact ? "h-5 w-5" : "h-5 w-5 xl:h-[22px] xl:w-[22px]"} aria-hidden />
          </Link>
        )}

        {inlinePanel}
      </div>
      {portalPanel}
    </>
  );
}
