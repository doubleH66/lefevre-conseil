import * as React from "react";
import Link from "next/link";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { cn } from "@/lib/utils";

/** Encre / pictos alignés sur le bleu du CTA « Faire une simulation » (fond #1f2a7c), priorité sur le verre. */
export const heroCtaSimulationBrandTextClassName = "!text-[#1f2a7c]";

/** CTA principal identique au hero (simulation). */
export const heroCtaPrimaryClassName =
  "h-12 min-h-12 min-w-0 flex-1 gap-2 rounded-full border-0 bg-[#1f2a7c] px-4 text-sm font-semibold leading-none text-white shadow-none outline-none ring-0 transition-colors duration-200 hover:scale-100 hover:bg-[#1f2a7c] hover:text-white focus-visible:ring-0 active:scale-100 active:bg-[#1f2a7c] sm:min-w-[220px] sm:flex-none sm:px-7 sm:text-base xl:h-11 xl:min-w-[14rem] xl:px-8 xl:text-[15px]";

/** Variante pages intérieures / formulaires (hauteur uniforme, largeur fluide). */
export const heroCtaPrimaryCompactClassName =
  "h-11 min-h-11 w-full rounded-full border-0 bg-[#1f2a7c] px-6 text-sm font-semibold text-white shadow-none outline-none ring-0 transition-colors duration-200 hover:scale-100 hover:bg-[#1f2a7c] focus-visible:ring-0 sm:w-auto sm:min-w-[12rem]";

/** Secondaire sur fond sombre (hero, bandeaux bleus). */
export const heroCtaSecondaryOnDarkClassName =
  "h-12 min-h-12 min-w-0 flex-1 rounded-full border border-white/40 bg-white/10 px-4 text-sm font-semibold leading-none text-white transition-colors duration-200 hover:bg-white/15 sm:min-w-[160px] sm:flex-none sm:px-7 sm:text-base xl:h-11 xl:min-w-[10.25rem] xl:px-8 xl:text-[15px]";

/** Même style secondaire sombre, hauteur page / bandeau compact. */
export const heroCtaSecondaryOnDarkCompactClassName =
  "h-11 min-h-11 w-full rounded-full border border-white/40 bg-white/10 px-6 text-sm font-semibold text-white transition-colors duration-200 hover:bg-white/15 sm:w-auto sm:min-w-[10rem]";

/** Secondaire sur fond clair (même logique que la nav « Contact » au scroll). */
export const heroCtaSecondaryOnLightClassName =
  "h-11 min-h-11 w-full rounded-full border border-white/50 bg-transparent px-6 text-sm font-semibold text-[#1f2a7c] transition-colors duration-200 hover:bg-white/25 sm:w-auto sm:min-w-[10rem]";

export const heroCtaRowClassName =
  "flex scroll-mt-28 flex-row flex-wrap items-stretch justify-center gap-2 sm:gap-3 max-xl:items-stretch xl:flex-nowrap xl:items-center xl:justify-start xl:gap-3.5";

export const heroCtaRowCompactClassName =
  "flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center";

type Layout = "hero" | "page";

type PrimaryLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  /** `hero` : tailles du bandeau d’accueil ; `page` : pages intérieures / formulaires. */
  layout?: Layout;
};

export function HeroCtaPrimaryLink({ href, children, className, layout = "page" }: PrimaryLinkProps) {
  const base = layout === "hero" ? heroCtaPrimaryClassName : heroCtaPrimaryCompactClassName;
  return (
    <LiquidButton variant="stable" plain asChild className={cn(base, className)}>
      <Link href={href} className="inline-flex items-center justify-center text-nowrap">
        {children}
      </Link>
    </LiquidButton>
  );
}

type SecondaryLinkProps = PrimaryLinkProps & {
  surface: "dark" | "light";
};

export function HeroCtaSecondaryLink({
  href,
  children,
  className,
  layout = "page",
  surface,
}: SecondaryLinkProps) {
  const secondary =
    surface === "dark"
      ? layout === "hero"
        ? heroCtaSecondaryOnDarkClassName
        : heroCtaSecondaryOnDarkCompactClassName
      : heroCtaSecondaryOnLightClassName;
  return (
    <LiquidButton variant="stable" asChild className={cn(secondary, className)}>
      <Link href={href} className="inline-flex items-center justify-center text-nowrap">
        {children}
      </Link>
    </LiquidButton>
  );
}

type PrimaryButtonProps = React.ComponentProps<typeof LiquidButton> & {
  layout?: Layout;
};

export function HeroCtaPrimaryButton({ className, layout = "page", ...props }: PrimaryButtonProps) {
  const base = layout === "hero" ? heroCtaPrimaryClassName : heroCtaPrimaryCompactClassName;
  return <LiquidButton variant="stable" plain className={cn(base, className)} {...props} />;
}

type SecondaryButtonProps = PrimaryButtonProps & {
  surface: "dark" | "light";
};

export function HeroCtaSecondaryButton({
  className,
  layout = "page",
  surface,
  ...props
}: SecondaryButtonProps) {
  const secondary =
    surface === "dark"
      ? layout === "hero"
        ? heroCtaSecondaryOnDarkClassName
        : heroCtaSecondaryOnDarkCompactClassName
      : heroCtaSecondaryOnLightClassName;
  return <LiquidButton variant="stable" className={cn(secondary, className)} {...props} />;
}
