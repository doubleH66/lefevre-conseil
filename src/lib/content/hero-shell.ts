import { LANDING_SECTION_SHELL } from "@/lib/content/landing-layout";
import { cn } from "@/lib/utils";
import { SITE_NAV_BAR_HEIGHT, SITE_PROMO_BAR_HEIGHT } from "@/lib/nav-styles";

/** Marges extérieures des heroes intérieurs (sous-pages). */
export const HERO_SHELL_OUTER_CLASS = "mx-1.5 mt-0 lg:mx-2.5 lg:mt-9";

/** Alignement horizontal des blocs sous les heroes intérieurs. */
export const HERO_SHELL_HORIZONTAL_CLASS = "mx-1.5 lg:mx-2.5";

export const PAGE_HERO_MIN_HEIGHT_CLASS =
  "min-h-[22rem] sm:min-h-[26rem] lg:min-h-[29rem] xl:min-h-[32rem]";

/** Accueil — marges et coins partagés hero + partenaires. */
export const LANDING_HERO_HORIZONTAL_CLASS = LANDING_SECTION_SHELL;

/** Wrapper accueil : image hero + bandeau partenaires, sans contour ni fond. */
export const LANDING_HERO_SHELL_CLASS = cn(
  "relative isolate overflow-hidden",
  LANDING_HERO_HORIZONTAL_CLASS,
  // Collé sous le bandeau promo fixe (mt-9 = 36px = SITE_PROMO_BAR_HEIGHT).
  "mt-9",
);

/** @deprecated Alias — même classe que `LANDING_HERO_SHELL_CLASS`. */
export const LANDING_HERO_STACK_CLASS = LANDING_HERO_SHELL_CLASS;

/** Section hero accueil (haut du shell, image jusqu’au bandeau). */
export const LANDING_HERO_SECTION_CLASS = cn(
  "relative overflow-hidden",
  "min-h-[85vh]",
);

export const PAGE_HERO_TALL_MIN_HEIGHT_CLASS = "min-h-[85vh]";

/** Bandeau partenaires sous l’image hero — sans bordure ni fond. */
export const PARTNERS_HERO_STRIP_CLASS = cn(
  "relative",
  "px-4 sm:px-7 xl:px-11",
  "pb-2 pt-4 sm:pb-3 sm:pt-5 lg:pb-3 lg:pt-6",
);

/** Coins des heroes intérieurs (sous bandeau promo). */
export const HERO_SHELL_RADIUS_CLASS = "rounded-b-2xl rounded-t-none lg:rounded-[2.25rem]";

export function heroShellSectionClass(minHeightClass: string) {
  return cn(
    "relative isolate overflow-hidden border border-black/10 bg-black",
    HERO_SHELL_RADIUS_CLASS,
    HERO_SHELL_OUTER_CLASS,
    minHeightClass,
  );
}

/** Hauteur bandeau promo + gap navbar + barre nav. */
export const HERO_NAV_CHROME_HEIGHT = SITE_PROMO_BAR_HEIGHT + 8 + SITE_NAV_BAR_HEIGHT;

const heroNavClearanceLg = HERO_NAV_CHROME_HEIGHT - SITE_PROMO_BAR_HEIGHT;

/** Padding haut contenu — aligné sur promo + navbar fixes. */
export const HERO_CONTENT_TOP_PAD = cn(
  `pt-[calc(${HERO_NAV_CHROME_HEIGHT}px+1rem)]`,
  `lg:pt-[calc(${heroNavClearanceLg}px+1.25rem)]`,
);

/** Contenu texte hero accueil. */
export const HERO_LANDING_CONTENT_CLASS = cn("relative z-10", HERO_CONTENT_TOP_PAD, "pb-8 md:pb-10 lg:pb-12");
