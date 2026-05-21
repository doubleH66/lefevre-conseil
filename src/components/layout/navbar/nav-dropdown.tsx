"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { NavDropdownId } from "@/lib/content/navigation";
import { NAV_DROPDOWNS } from "@/lib/content/navigation";
import { cn } from "@/lib/utils";

type NavDropdownProps = {
  id: NavDropdownId;
  light: boolean;
  /** Coque verre (navbar ou variante sous-menu au scroll). */
  surfaceClass: string;
  open: NavDropdownId | null;
  setOpen: React.Dispatch<React.SetStateAction<NavDropdownId | null>>;
};

export function NavDropdown({ id, light, surfaceClass, open, setOpen }: NavDropdownProps) {
  const item = NAV_DROPDOWNS[id];
  const closeTimerRef = useRef<number | null>(null);
  const isOpen = open === id;

  const openMenu = () => {
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
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

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    };
  }, []);

  return (
    <div className="relative" onMouseEnter={openMenu} onMouseLeave={closeMenu}>
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

      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="menu"
            initial={{ y: -4 }}
            animate={{ y: 0 }}
            exit={{ y: -4 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 top-[calc(100%-2px)] z-[60] w-72"
          >
            <div
              className={cn(
                "overflow-hidden rounded-[1.75rem] p-2 transition-[background,box-shadow] duration-300",
                surfaceClass,
              )}
            >
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
        )}
      </AnimatePresence>
    </div>
  );
}
