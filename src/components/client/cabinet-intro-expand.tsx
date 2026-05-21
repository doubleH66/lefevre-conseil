"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type CabinetIntroExpandProps = {
  children: React.ReactNode;
  className?: string;
};

/** Bloc « Voir + / Voir - » mobile (même comportement que l’ancien React heritage). */
export function CabinetIntroExpand({ children, className }: CabinetIntroExpandProps) {
  const [open, setOpen] = React.useState(false);
  const panelId = React.useId().replace(/:/g, "");

  return (
    <div className={cn("lg:hidden", className)}>
      <div
        id={`cabinet-intro-more-${panelId}`}
        className={cn(
          "grid overflow-hidden transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:duration-0",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="min-h-0 overflow-hidden">{children}</div>
      </div>
      <div className="mt-3 flex justify-center">
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-full border border-[#1f2a7c]/25 bg-[#1f2a7c]/[0.06] px-3.5 py-1.5 text-[13px] font-semibold tracking-tight text-[#1f2a7c] transition-colors hover:bg-[#1f2a7c]/[0.1] active:scale-100"
          aria-expanded={open}
          aria-controls={`cabinet-intro-more-${panelId}`}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Voir -" : "Voir +"}
        </button>
      </div>
    </div>
  );
}
