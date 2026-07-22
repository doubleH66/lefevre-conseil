"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import type { NavDropdownId } from "@/lib/content/navigation";
import {
  NAV_AVIS,
  NAV_CONSEILS,
  NAV_DROPDOWNS,
  NAV_PRIMARY_CTA,
  ROUTES,
} from "@/lib/content/navigation";
import { FAQ_HREF } from "@/lib/content/routes";
import { NavAccountButton } from "@/components/layout/navbar/nav-account-button";
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
                <div key={`${link.href}-${link.label}`}>
                  {link.dividerBefore ? (
                    <div role="separator" className="mx-3 my-2 border-t border-[#1f2a7c]/10" />
                  ) : null}
                  <Link
                    href={link.href}
                    onClick={onNavigate}
                    className="block rounded-lg px-3 py-2.5 text-[13px] text-neutral-700 transition-colors hover:bg-[#1f2a7c]/[0.05]"
                  >
                    {link.label}
                  </Link>
                </div>
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
  onLoginClick,
  surfaceClass,
}: {
  open: boolean;
  onClose: () => void;
  onLoginClick?: () => void;
  surfaceClass: string;
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
            <Link
              href={NAV_AVIS.href}
              onClick={onClose}
              className="block rounded-xl px-3 py-3 text-[14px] font-semibold text-neutral-800 transition-colors hover:bg-[#1f2a7c]/[0.06]"
            >
              {NAV_AVIS.label}
            </Link>
            <Link
              href={FAQ_HREF}
              onClick={onClose}
              className="block rounded-xl px-3 py-3 text-[14px] font-semibold text-neutral-800 transition-colors hover:bg-[#1f2a7c]/[0.06]"
            >
              FAQ
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
              <NavAccountButton
                light={false}
                surfaceClass={surfaceClass}
                compact
                menuUp
                onMenuAction={onClose}
                onLoginClick={onLoginClick}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
