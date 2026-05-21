"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { NavDropdownId } from "@/lib/content/navigation";
import { NAV_DROPDOWNS } from "@/lib/content/navigation";
import {
  navGlassDropdownSurface,
  navGlassDropdownSurfaceDark,
} from "@/components/layout/navbar/styles";
import { cn } from "@/lib/utils";

type NavDropdownProps = {
  id: NavDropdownId;
  light: boolean;
  /** @deprecated Le panneau utilise sa propre surface verre (portal). */
  surfaceClass?: string;
  open: NavDropdownId | null;
  setOpen: React.Dispatch<React.SetStateAction<NavDropdownId | null>>;
};

type MenuPosition = { top: number; left: number };

function readMenuPosition(anchor: HTMLDivElement | null): MenuPosition | null {
  if (!anchor) return null;
  const rect = anchor.getBoundingClientRect();
  return { top: rect.bottom - 4, left: rect.left };
}

export function NavDropdown({ id, light, open, setOpen }: NavDropdownProps) {
  const item = NAV_DROPDOWNS[id];
  const anchorRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [menuPos, setMenuPos] = useState<MenuPosition | null>(null);
  const isOpen = open === id;

  const openMenu = () => {
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    const nextPos = readMenuPosition(anchorRef.current);
    if (nextPos) setMenuPos(nextPos);
    setOpen(id);
  };

  const closeMenu = () => {
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = window.setTimeout(() => {
      setOpen((current) => (current === id ? null : current));
    }, 130);
  };

  const closeNow = () => {
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    setOpen(null);
  };

  const updatePosition = () => {
    const nextPos = readMenuPosition(anchorRef.current);
    if (nextPos) setMenuPos(nextPos);
  };

  useEffect(() => {
    setMounted(true);
    return () => {
      if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    };
  }, []);

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
  }, [isOpen]);

  const dropdownSurfaceClass = light ? navGlassDropdownSurfaceDark : navGlassDropdownSurface;
  const canRenderMenu = mounted && isOpen && menuPos !== null;

  const menuPanel =
    mounted && typeof document !== "undefined"
      ? createPortal(
          <AnimatePresence mode="wait">
            {canRenderMenu ? (
              <motion.div
                key={id}
                role="menu"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.14, ease: [0.22, 1, 0.36, 1] }}
                style={{ position: "fixed", top: menuPos.top, left: menuPos.left, zIndex: 60 }}
                className="hidden w-72 lg:block"
                onMouseEnter={openMenu}
                onMouseLeave={closeMenu}
              >
                <div className={cn("overflow-hidden rounded-[1.75rem] p-2", dropdownSurfaceClass)}>
                  {item.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      role="menuitem"
                      onClick={closeNow}
                      className={cn(
                        "block rounded-xl px-3 py-2.5 text-[14px] font-semibold transition-colors duration-150",
                        light ? "text-white hover:bg-white/10" : "text-[#1f2a7c] hover:bg-[#1f2a7c]/[0.06]",
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>,
          document.body,
        )
      : null;

  return (
    <>
      <div ref={anchorRef} className="relative" onMouseEnter={openMenu} onMouseLeave={closeMenu}>
        <button
          type="button"
          aria-expanded={isOpen}
          aria-haspopup="menu"
          onClick={openMenu}
          className={cn(
            "inline-flex h-10 items-center gap-1 rounded-full px-3.5 text-[15px] font-semibold tracking-tight outline-none",
            light ? "text-white" : "text-[#1f2a7c]",
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
