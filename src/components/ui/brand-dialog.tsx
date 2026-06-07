"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export type BrandDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  titleId?: string;
  closeLabel?: string;
  backdropLabel?: string;
  maxWidthClass?: string;
  panelClassName?: string;
  children: React.ReactNode;
};

/** Modale site — tiroir mobile, centrée desktop, croix blanche à l’extérieur (md+). */
export function BrandDialog({
  open,
  onOpenChange,
  title,
  description,
  titleId: titleIdProp,
  closeLabel = "Fermer",
  backdropLabel = "Fermer la fenêtre",
  maxWidthClass = "max-w-lg",
  panelClassName,
  children,
}: BrandDialogProps) {
  const generatedTitleId = React.useId();
  const titleId = titleIdProp ?? generatedTitleId;
  const [mounted, setMounted] = React.useState(false);
  const [mdUp, setMdUp] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setMdUp(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  React.useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onOpenChange(false);
    }

    document.addEventListener("keydown", onKeyDown);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prev;
    };
  }, [open, onOpenChange]);

  if (!mounted || typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          key="brand-dialog-shell"
          className="fixed inset-0 z-[200] flex items-end justify-center md:items-center md:p-6 md:pl-6 md:pr-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            className="absolute inset-0 bg-neutral-950/45 backdrop-blur-[2px]"
            aria-label={backdropLabel}
            onClick={() => onOpenChange(false)}
          />
          <motion.div
            className={cn("relative z-10 w-full", maxWidthClass)}
            initial={mdUp ? { opacity: 0, scale: 0.96, y: 0 } : { opacity: 1, y: "100%" }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={mdUp ? { opacity: 0, scale: 0.96, y: 0 } : { opacity: 1, y: "100%" }}
            transition={{ type: "tween", duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              type="button"
              className="absolute left-full top-0 z-20 ml-4 hidden size-11 place-items-center rounded-full bg-white text-[#1f2a7c] shadow-lg ring-1 ring-[#1f2a7c]/10 transition hover:bg-white hover:shadow-xl md:grid"
              aria-label={closeLabel}
              onClick={() => onOpenChange(false)}
            >
              <X className="size-5" strokeWidth={1.75} aria-hidden />
            </button>
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              className={cn(
                "flex max-h-[min(88dvh,640px)] w-full flex-col overflow-y-auto bg-white shadow-2xl outline-none",
                "rounded-t-[1.35rem] border border-[#1f2a7c]/10 p-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] md:max-h-[min(80dvh,520px)] md:rounded-2xl md:p-7 md:pb-7",
                panelClassName,
              )}
            >
              <div className="mx-auto mb-3 h-1 w-10 shrink-0 rounded-full bg-neutral-300 md:hidden" aria-hidden />
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 id={titleId} className="text-base font-semibold tracking-tight text-[#1f2a7c]">
                    {title}
                  </h2>
                  {description ? (
                    <p className="mt-1 text-sm leading-relaxed text-[#1f2a7c]/75">{description}</p>
                  ) : null}
                </div>
                <button
                  type="button"
                  className="grid size-9 shrink-0 place-items-center rounded-full border border-[#1f2a7c]/15 text-[#1f2a7c] transition-colors hover:bg-[#1f2a7c]/[0.06] md:hidden"
                  aria-label={closeLabel}
                  onClick={() => onOpenChange(false)}
                >
                  <X className="size-4" aria-hidden />
                </button>
              </div>
              <div className="mt-5 min-h-0">{children}</div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
