import { cn } from "@/lib/utils";

/** Marges latérales communes — hero, sections, carrousels. */
export const LANDING_SECTION_SHELL = "mx-2.5 lg:mx-4";

/** Padding intérieur des blocs de contenu. */
export const LANDING_SECTION_INSET = "px-4 sm:px-7 xl:px-11";

/** Padding vertical standard des sections texte. */
export const LANDING_SECTION_INNER_Y = "py-10 sm:py-12 xl:py-14";

/** Ancrage scroll (navbar fixe). */
export const LANDING_SCROLL_MARGIN = "scroll-mt-28";

/** Bandeau CTA final centré avant le footer. */
export const LANDING_CTA_SECTION_CLASS = cn(
  "mx-auto mt-6 mb-12 w-[calc(100%-1.25rem)] max-w-3xl sm:max-w-4xl lg:mb-16 lg:max-w-4xl lg:w-[calc(100%-2rem)]",
);
