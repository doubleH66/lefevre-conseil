"use client";

import Image from "next/image";
import { PanelLeft } from "lucide-react";
import { SITE_LOGO_URL, SITE_NAME } from "@/lib/content/site";

export function PortalMobileHeader({ onOpenMenu }: { onOpenMenu: () => void }) {
  return (
    <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-neutral-100 bg-white/95 px-4 py-3.5 backdrop-blur-sm supports-[padding:max(0px)]:pt-[max(0.875rem,env(safe-area-inset-top))] lg:hidden">
      <button
        type="button"
        onClick={onOpenMenu}
        className="grid size-10 shrink-0 place-items-center rounded-xl border border-neutral-200 text-neutral-700 transition-colors active:bg-neutral-50"
        aria-label="Ouvrir le menu"
      >
        <PanelLeft className="size-5" />
      </button>
      <Image
        src={SITE_LOGO_URL}
        alt={SITE_NAME}
        width={148}
        height={46}
        className="h-10 w-auto object-contain"
        priority
      />
    </header>
  );
}
