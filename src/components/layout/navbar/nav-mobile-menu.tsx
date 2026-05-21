"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ChevronDown, User } from "lucide-react";
import type { NavDropdownId } from "@/lib/content/navigation";
import {
  NAV_ACCOUNT,
  NAV_CONSEILS,
  NAV_DROPDOWNS,
  NAV_PRIMARY_CTA,
  ROUTES,
} from "@/lib/content/navigation";
import { navGlassWhite } from "@/components/layout/navbar/styles";
import { cn } from "@/lib/utils";

function MobileAccordion({
  id,
  active,
  setActive,
  onNavigate,
}: {
  id: NavDropdownId;
  active: NavDropdownId | null;
  setActive: React.Dispatch<React.SetStateAction<NavDropdownId | null>>;
  onNavigate: () => void;
}) {
  const item = NAV_DROPDOWNS[id];
  const isOpen = active === id;

  return (
    <div>
      <button
        type="button"
        onClick={() => setActive(isOpen ? null : id)}
        className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-[14px] font-semibold text-neutral-800 transition-colors hover:bg-[#1f2a7c]/[0.06]"
      >
        {item.label}
        <ChevronDown className={cn("h-4 w-4 text-[#1f2a7c]/45 transition-transform", isOpen && "rotate-180")} />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="ml-2 mt-1 py-1 pl-2">
              {item.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onNavigate}
                  className="block rounded-lg px-3 py-2.5 text-[13px] text-neutral-700 transition-colors hover:bg-[#1f2a7c]/[0.05]"
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

export function NavMobileMenu({
  open,
  onClose,
  onAccountClick,
}: {
  open: boolean;
  onClose: () => void;
  /** Ouvre la modale compte (tiroir bas) au lieu de naviguer vers /login. */
  onAccountClick?: () => void;
}) {
  const [active, setActive] = useState<NavDropdownId | null>(null);

  useEffect(() => {
    if (!open) setActive(null);
  }, [open]);

  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0, y: -4 }}
          animate={{ height: "auto", opacity: 1, y: 0 }}
          exit={{ height: 0, opacity: 0, y: -4 }}
          transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
          className={cn("mt-3 overflow-hidden rounded-[1.35rem] p-0 lg:hidden", navGlassWhite)}
        >
          <div className="px-3 pb-4 pt-2 sm:px-4">
            <Link
              href={ROUTES.home}
              onClick={onClose}
              className="block rounded-xl px-3 py-3 text-[14px] font-semibold text-neutral-800 transition-colors hover:bg-[#1f2a7c]/[0.06]"
            >
              Accueil
            </Link>
            <MobileAccordion id="cabinet" active={active} setActive={setActive} onNavigate={onClose} />
            <MobileAccordion id="expertises" active={active} setActive={setActive} onNavigate={onClose} />
            <Link
              href={NAV_CONSEILS.href}
              onClick={onClose}
              className="block rounded-xl px-3 py-3 text-[14px] font-semibold text-neutral-800 transition-colors hover:bg-[#1f2a7c]/[0.06]"
            >
              {NAV_CONSEILS.label}
            </Link>

            <div className="mt-2 flex items-center gap-3 border-t border-[#1f2a7c]/10 pt-3">
              <Link
                href={NAV_PRIMARY_CTA.href}
                onClick={onClose}
                className="flex h-11 flex-1 items-center justify-between rounded-full bg-[#1f2a7c] px-4 text-[13px] font-semibold text-white"
              >
                {NAV_PRIMARY_CTA.mobileLabel}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              {onAccountClick ? (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onAccountClick();
                  }}
                  aria-label="Compte : connexion ou inscription"
                  className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-full", navGlassWhite)}
                >
                  <User className="h-5 w-5" />
                </button>
              ) : (
                <Link
                  href={NAV_ACCOUNT.href}
                  onClick={onClose}
                  aria-label="Compte : connexion ou inscription"
                  className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-full", navGlassWhite)}
                >
                  <User className="h-5 w-5" />
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
