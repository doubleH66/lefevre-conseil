"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import type { NavDropdownId } from "@/lib/content/navigation";
import { NAV_DROPDOWNS } from "@/lib/content/navigation";
import { cn } from "@/lib/utils";

const CLOSE_DELAY_MS = 200;
const PANEL_WIDTH = 288;

type NavDropdownProps = {
  id: NavDropdownId;
  light: boolean;
  /** @deprecated Le panneau utilise sa propre surface (portal). */
  surfaceClass?: string;
  open: NavDropdownId | null;
  setOpen: React.Dispatch<React.SetStateAction<NavDropdownId | null>>;
};

type MenuPosition = { top: number; left: number };

function readMenuPosition(anchor: HTMLDivElement | null): MenuPosition | null {
  if (!anchor) return null;
  const rect = anchor.getBoundingClientRect();
  const margin = 12;
  let left = rect.left;
  if (left + PANEL_WIDTH > window.innerWidth - margin) {
    left = window.innerWidth - PANEL_WIDTH - margin;
  }
  left = Math.max(margin, left);
  return { top: rect.bottom, left };
}

export function NavDropdown({ id, light, open, setOpen }: NavDropdownProps) {
  const item = NAV_DROPDOWNS[id];
  const anchorRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [menuPos, setMenuPos] = useState<MenuPosition | null>(null);
  const isOpen = open === id;

  const cancelClose = useCallback(() => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const closeNow = useCallback(() => {
    cancelClose();
    setOpen(null);
  }, [cancelClose, setOpen]);

  const openMenu = useCallback(() => {
    cancelClose();
    const nextPos = readMenuPosition(anchorRef.current);
    if (nextPos) setMenuPos(nextPos);
    setOpen(id);
  }, [cancelClose, id, setOpen]);

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimerRef.current = window.setTimeout(() => {
      setOpen((current) => (current === id ? null : current));
    }, CLOSE_DELAY_MS);
  }, [cancelClose, id, setOpen]);

  const toggleMenu = useCallback(() => {
    if (isOpen) {
      closeNow();
      return;
    }
    openMenu();
  }, [closeNow, isOpen, openMenu]);

  const updatePosition = useCallback(() => {
    const nextPos = readMenuPosition(anchorRef.current);
    if (nextPos) setMenuPos(nextPos);
  }, []);

  useEffect(() => {
    setMounted(true);
    return () => cancelClose();
  }, [cancelClose]);

  useLayoutEffect(() => {
    if (!isOpen) {
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
  }, [isOpen, updatePosition]);

  useEffect(() => {
    if (!isOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (panelRef.current?.contains(target)) return;
      if (anchorRef.current?.contains(target)) return;
      closeNow();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeNow();
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [closeNow, isOpen]);

  const panelSurfaceClass = light
    ? "border border-white/35 bg-[#0f164a]/92 text-white shadow-[0_16px_48px_rgba(0,0,0,0.35)] backdrop-blur-xl"
    : "border border-neutral-200/90 bg-white text-[#1f2a7c] shadow-[0_20px_50px_-12px_rgba(15,23,42,0.28)]";

  const linkClass = light
    ? "text-white hover:bg-white/10"
    : "text-[#1f2a7c] hover:bg-[#1f2a7c]/[0.06]";

  const canRenderMenu = mounted && isOpen && menuPos !== null;

  const menuPanel =
    mounted && typeof document !== "undefined"
      ? createPortal(
          canRenderMenu ? (
            <div
              ref={panelRef}
              role="menu"
              style={{ position: "fixed", top: menuPos.top, left: menuPos.left, zIndex: 70 }}
              className="hidden w-72 max-w-[calc(100vw-1.5rem)] lg:block"
              onMouseEnter={cancelClose}
              onMouseLeave={scheduleClose}
            >
              {/* Pont invisible : recouvre l'espace entre le bouton et le panneau */}
              <div aria-hidden className="-mt-3 h-3" />
              <div className={cn("overflow-hidden rounded-2xl", panelSurfaceClass)}>
                <div className="border-b border-current/10 px-4 py-3">
                  <p
                    className={cn(
                      "text-[11px] font-semibold uppercase tracking-[0.14em]",
                      light ? "text-white/60" : "text-[#1f2a7c]/60",
                    )}
                  >
                    {item.label}
                  </p>
                </div>
                <ul className="max-h-[min(20rem,58vh)] overflow-y-auto overscroll-contain p-2">
                  {item.links.map((link) => (
                    <li key={`${link.href}-${link.label}`}>
                      <Link
                        href={link.href}
                        role="menuitem"
                        onClick={closeNow}
                        className={cn(
                          "block rounded-xl px-3 py-2.5 text-[14px] font-semibold leading-snug transition-colors duration-150",
                          linkClass,
                        )}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null,
          document.body,
        )
      : null;

  return (
    <>
      <div
        ref={anchorRef}
        className="relative"
        onMouseEnter={openMenu}
        onMouseLeave={scheduleClose}
      >
        <button
          type="button"
          aria-expanded={isOpen}
          aria-haspopup="menu"
          onClick={toggleMenu}
          className={cn(
            "inline-flex h-10 items-center gap-1 rounded-full px-3.5 text-[15px] font-semibold tracking-tight outline-none focus-visible:ring-2 focus-visible:ring-[#1f2a7c]/25",
            light ? "text-white focus-visible:ring-white/35" : "text-[#1f2a7c]",
          )}
        >
          {item.label}
          <ChevronDown
            className={cn("h-4 w-4 opacity-55 transition-transform duration-200", isOpen && "rotate-180")}
          />
        </button>
      </div>
      {menuPanel}
    </>
  );
}
