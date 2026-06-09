import { cn } from "@/lib/utils";

/** Marges latérales communes — hero, sections, carrousels. */
export const LANDING_SECTION_SHELL = "mx-2.5 lg:mx-4";

/** Padding intérieur des blocs de contenu. */
export const LANDING_SECTION_INSET = "px-4 sm:px-7 xl:px-11";

/** Padding vertical standard des sections texte. */
export const LANDING_SECTION_INNER_Y = "py-12 sm:py-14 xl:py-16";

/** Ancrage scroll (navbar fixe). */
export const LANDING_SCROLL_MARGIN = "scroll-mt-28";

/** Espacement vertical entre blocs / sections empilés (site marketing). */
export const SITE_BLOCK_GAP = "mt-4 sm:mt-5 lg:mt-6";

/** Colonne flex avec gap uniforme (landing, sous-pages). */
export const SITE_SECTION_STACK = "flex flex-col gap-4 sm:gap-5 lg:gap-6";

/** Coque + marge verticale (bandeaux image, CTA intermédiaires). */
export const SITE_BLOCK_SHELL = cn(LANDING_SECTION_SHELL, SITE_BLOCK_GAP);

/** Bloc blanc empilé (pages service, défiscalisation, etc.). */
export const SITE_WHITE_BLOCK = cn(SITE_BLOCK_SHELL, "bg-white");

/** Padding intérieur des blocs blancs (contenu service). */
export const SITE_BLOCK_INNER = "mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-14";

/** Bandeau CTA final — centré, sans conflit mx-auto / mx-2.5. */
export const LANDING_CTA_SECTION_CLASS =
  "mx-auto w-[calc(100%-1.25rem)] max-w-3xl sm:max-w-4xl lg:w-[calc(100%-2rem)] lg:max-w-4xl";
