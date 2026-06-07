"use client";

import * as React from "react";
import { Mail } from "lucide-react";
import { CABINET_CONTACT } from "@/lib/content/site";
import { BrandDialog } from "@/components/ui/brand-dialog";
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

  const formInner = (
    <form
      className="flex w-full flex-col gap-2"
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
        <BrandDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          title="Newsletter"
          description="Environ une fois par mois, sans spam."
          titleId={dialogTitleId}
          backdropLabel="Fermer la fenêtre newsletter"
        >
          {formInner}
        </BrandDialog>
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
