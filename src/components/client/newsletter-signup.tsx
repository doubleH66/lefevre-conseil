"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, X } from "lucide-react";
import { CABINET_CONTACT } from "@/lib/content/site";
import { HeroCtaSecondaryButton } from "@/components/ui/hero-cta";
import { cn } from "@/lib/utils";

type NewsletterSignupProps = {
  className?: string;
  variant?: "default" | "compact";
  embedded?: boolean;
  idSuffix?: string;
  /**
   * `dialog-trigger` : un bouton ouvre une modale (centrée desktop, tiroir bas mobile).
   * `inline` : titre + champ e-mail directement visible (footer).
   * `default` : formulaire inline (pages conseils, etc.).
   */
  presentation?: "default" | "dialog-trigger" | "inline";
  /**
   * Avec `presentation="dialog-trigger"` : déclencheur pour fond sombre (footer),
   * un bouton secondaire type hero - sans bloc titre bleu.
   */
  footerOnDark?: boolean;
};

export function NewsletterSignup({
  className,
  variant = "default",
  embedded = false,
  idSuffix = "main",
  presentation = "default",
  footerOnDark = false,
}: NewsletterSignupProps) {
  const compact = variant === "compact";
  const headingId = `newsletter-heading-${idSuffix}`;
  const inputId = `newsletter-email-${idSuffix}`;
  const dialogTitleId = `newsletter-dialog-title-${idSuffix}`;

  const [dialogOpen, setDialogOpen] = React.useState(false);
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
    if (!dialogOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDialogOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [dialogOpen]);

  const formInner = (
    <form
      className="mt-5 flex w-full flex-col gap-2"
      action={`mailto:${CABINET_CONTACT.email}`}
      method="post"
      encType="text/plain"
      onSubmit={() => setDialogOpen(false)}
    >
      <label htmlFor={inputId} className="text-[11px] font-medium text-[#1f2a7c]/70">
        E-mail
      </label>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
        <input
          id={inputId}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="exemple@email.fr"
          className="min-h-11 min-w-0 flex-1 rounded-xl border border-[#1f2a7c]/15 bg-white px-3 text-sm text-neutral-900 shadow-sm outline-none placeholder:text-neutral-400 focus:border-[#1f2a7c]/40 focus:ring-2 focus:ring-[#1f2a7c]/12"
        />
        <button
          type="submit"
          className="min-h-11 shrink-0 rounded-xl bg-[#1f2a7c] px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#18226b]"
        >
          S’inscrire
        </button>
      </div>
    </form>
  );

  if (presentation === "inline") {
    return (
      <section aria-labelledby={headingId} className={cn("w-full", className)}>
        <h2 id={headingId} className="text-sm font-semibold tracking-tight text-[#1f2a7c] sm:text-[15px]">
          Newsletter
        </h2>
        <form
          className="mt-3 w-full"
          action={`mailto:${CABINET_CONTACT.email}`}
          method="post"
          encType="text/plain"
        >
          <label htmlFor={inputId} className="sr-only">
            E-mail
          </label>
          <div className="flex w-full items-center gap-1 rounded-full border border-[#1f2a7c]/15 bg-white p-1 shadow-sm focus-within:border-[#1f2a7c]/35 focus-within:ring-2 focus-within:ring-[#1f2a7c]/12">
            <input
              id={inputId}
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="exemple@email.fr"
              className="min-h-10 min-w-0 flex-1 rounded-full border-0 bg-transparent px-3 text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
            />
            <button
              type="submit"
              className="min-h-10 shrink-0 rounded-full bg-[#1f2a7c] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#18226b]"
            >
              S’inscrire
            </button>
          </div>
          <p className="mt-1.5 text-[10px] leading-snug text-[#1f2a7c]/60 sm:text-[11px]">
            Environ une fois par mois, sans spam.
          </p>
        </form>
      </section>
    );
  }

  if (presentation === "dialog-trigger") {
    const modal = (
      <AnimatePresence>
        {dialogOpen ? (
          <motion.div
            key="newsletter-dialog-shell"
            className="fixed inset-0 z-[200] flex items-end justify-center md:items-center md:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              type="button"
              className="absolute inset-0 bg-neutral-950/45 backdrop-blur-[2px]"
              aria-label="Fermer la fenêtre newsletter"
              onClick={() => setDialogOpen(false)}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby={dialogTitleId}
              className={cn(
                "relative z-10 flex max-h-[min(88dvh,640px)] w-full max-w-lg flex-col overflow-y-auto bg-white shadow-2xl outline-none",
                "rounded-t-[1.35rem] border border-[#1f2a7c]/10 p-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] md:max-h-[min(80dvh,520px)] md:rounded-2xl md:p-7 md:pb-7",
              )}
              initial={mdUp ? { opacity: 0, scale: 0.96, y: 0 } : { opacity: 1, y: "100%" }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={mdUp ? { opacity: 0, scale: 0.96, y: 0 } : { opacity: 1, y: "100%" }}
              transition={{ type: "tween", duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mx-auto mb-3 h-1 w-10 shrink-0 rounded-full bg-neutral-300 md:hidden" aria-hidden />
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#1f2a7c]/[0.08] text-[#1f2a7c]">
                    <Mail className="size-5" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <h2 id={dialogTitleId} className="text-base font-semibold tracking-tight text-[#1f2a7c]">
                      Newsletter
                    </h2>
                    <p className="mt-1 text-sm leading-relaxed text-[#1f2a7c]/75">
                      Environ une fois par mois, sans spam.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="grid size-9 shrink-0 place-items-center rounded-full border border-[#1f2a7c]/15 text-[#1f2a7c] transition-colors hover:bg-[#1f2a7c]/[0.06]"
                  aria-label="Fermer"
                  onClick={() => setDialogOpen(false)}
                >
                  <X className="size-4" aria-hidden />
                </button>
              </div>
              {formInner}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    );

    return (
      <>
        {footerOnDark ? (
          <div className={cn("flex justify-center", className)}>
            <HeroCtaSecondaryButton
              type="button"
              surface="dark"
              layout="hero"
              aria-haspopup="dialog"
              aria-expanded={dialogOpen}
              aria-label="Newsletter - ouvrir le formulaire d’inscription"
              onClick={() => setDialogOpen(true)}
              className="inline-flex items-center justify-center gap-2"
            >
              <Mail className="size-4 shrink-0 opacity-90" aria-hidden />
              Newsletter
            </HeroCtaSecondaryButton>
          </div>
        ) : (
          <section aria-labelledby={headingId} className={cn("bg-transparent", className)}>
            <div className="flex flex-col gap-3">
              <div>
                <h2
                  id={headingId}
                  className="text-sm font-semibold tracking-tight text-[#1f2a7c] sm:text-[15px]"
                >
                  Newsletter
                </h2>
                <p className="mt-0.5 text-xs leading-snug text-[#1f2a7c]/75 sm:text-[13px]">
                  Environ une fois par mois, sans spam.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDialogOpen(true)}
                className="inline-flex h-11 w-fit items-center justify-center rounded-xl border border-[#1f2a7c]/25 bg-white px-5 text-sm font-semibold text-[#1f2a7c] shadow-sm transition-colors hover:bg-[#1f2a7c]/[0.06]"
              >
                S’inscrire à la newsletter
              </button>
            </div>
          </section>
        )}
        {mounted && typeof document !== "undefined" ? createPortal(modal, document.body) : null}
      </>
    );
  }

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        !embedded && "rounded-2xl border border-neutral-200/90 bg-white shadow-[0_1px_0_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.12)]",
        embedded && "bg-transparent",
        compact && !embedded ? "p-4 sm:p-5" : !compact ? "p-5 sm:p-6" : "p-0",
        className,
      )}
    >
      <div
        className={cn(
          "flex gap-4",
          compact
            ? embedded
              ? "flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
              : "flex-col sm:flex-row sm:items-end sm:justify-between sm:gap-6"
            : "flex-col sm:flex-row sm:items-center sm:gap-6",
        )}
      >
        <div className="flex min-w-0 flex-1 items-start gap-3">
          {!(compact && embedded) ? (
            <span
              className={cn(
                "flex shrink-0 items-center justify-center rounded-xl bg-[#1f2a7c]/[0.07] text-[#1f2a7c]",
                compact ? "size-9" : "size-10 sm:size-11",
              )}
              aria-hidden
            >
              <Mail className={compact ? "size-4" : "size-[18px] sm:size-5"} />
            </span>
          ) : null}
          <div className="min-w-0 pt-0.5">
            <h2
              id={headingId}
              className={cn(
                "font-semibold tracking-tight text-neutral-900",
                compact ? "text-sm sm:text-[15px]" : "text-base sm:text-lg",
              )}
            >
              Newsletter
            </h2>
            <p
              className={cn(
                "mt-0.5 text-neutral-600",
                compact ? "text-xs leading-snug sm:max-w-sm" : "mt-1 text-sm leading-relaxed",
              )}
            >
              {compact && embedded
                ? "Environ une fois par mois, sans spam."
                : "Patrimoine et fiscalité, environ une fois par mois - sans spam."}
            </p>
          </div>
        </div>

        <form
          className={cn(
            "flex w-full flex-col gap-1.5",
            compact ? "sm:max-w-[min(100%,380px)] sm:flex-1 lg:max-w-none" : "sm:max-w-md lg:max-w-[340px]",
            compact && embedded && "sm:min-w-[min(100%,240px)] lg:max-w-[300px]",
          )}
          action={`mailto:${CABINET_CONTACT.email}`}
          method="post"
          encType="text/plain"
        >
          <label
            htmlFor={inputId}
            className={cn(compact && embedded ? "sr-only" : "text-[11px] font-medium text-neutral-600")}
          >
            E-mail
          </label>
          <div className="flex gap-2">
            <input
              id={inputId}
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="exemple@email.fr"
              className={cn(
                "min-h-11 min-w-0 flex-1 rounded-xl border border-neutral-200 bg-white px-3 text-sm text-neutral-900 shadow-sm outline-none placeholder:text-neutral-400 focus:border-[#1f2a7c]/40 focus:ring-2 focus:ring-[#1f2a7c]/12",
              )}
            />
            <button
              type="submit"
              className={cn(
                "shrink-0 rounded-xl bg-[#1f2a7c] px-4 font-semibold text-white shadow-sm transition-colors hover:bg-[#18226b]",
                "min-h-11 whitespace-nowrap text-sm",
              )}
            >
              S’inscrire
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
