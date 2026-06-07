/** Classes CTA partagées (sans React --- utilisables en Server Components). */

import { navGlassRest } from "@/lib/styles/glass";
import { cn } from "@/lib/utils";

export const heroCtaPrimaryClassName =
  "inline-flex h-12 min-h-12 min-w-0 flex-1 items-center justify-center gap-2 rounded-full border-0 bg-[#1f2a7c] px-4 text-sm font-semibold leading-none text-white shadow-none outline-none ring-0 transition-colors duration-200 hover:bg-[#182266] sm:min-w-[220px] sm:flex-none sm:px-7 sm:text-base xl:h-11 xl:min-w-[14rem] xl:px-8 xl:text-[15px]";

export const heroCtaPrimaryCompactClassName =
  "inline-flex h-11 min-h-11 w-full items-center justify-center gap-2 rounded-full border-0 bg-[#1f2a7c] px-6 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#182266] sm:w-auto sm:min-w-[12rem]";

export const heroCtaSecondaryOnDarkClassName =
  "inline-flex h-12 min-h-12 min-w-0 flex-1 items-center justify-center rounded-full border border-white/40 bg-white/10 px-4 text-sm font-semibold leading-none text-white transition-colors duration-200 hover:bg-white/15 sm:min-w-[160px] sm:flex-none sm:px-7 sm:text-base xl:h-11 xl:min-w-[10.25rem] xl:px-8 xl:text-[15px]";

export const heroCtaRowClassName =
  "flex scroll-mt-28 flex-row flex-wrap items-stretch justify-center gap-2 sm:gap-3 max-xl:items-stretch xl:flex-nowrap xl:items-center xl:justify-start xl:gap-3.5";

export const heroCtaRowCompactClassName =
  "flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center";

export const googleBadgeClassName = cn(
  "relative inline-flex h-8 max-w-full cursor-default items-center gap-1 rounded-full px-2.5 py-1 sm:gap-1.5 sm:px-3",
  navGlassRest,
);
