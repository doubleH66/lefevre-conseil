import { HERO_SHELL_RADIUS_CLASS } from "@/lib/content/hero-shell";
import {
  HERO_DESKTOP_IMAGE_URL,
  HERO_MOBILE_IMAGE_URL,
} from "@/lib/content/media";
import { cn } from "@/lib/utils";

/** Même visuel que le hero : réutilisable (bandeaux CTA, etc.). */
export const HERO_BACKGROUND_DESKTOP_SRC = HERO_DESKTOP_IMAGE_URL;
export const HERO_BACKGROUND_MOBILE_SRC = HERO_MOBILE_IMAGE_URL;

type HeroBackgroundProps = {
  /** Coins du masque (ex. hero page intérieure plus compact). */
  className?: string;
};

export function HeroBackground({ className }: HeroBackgroundProps) {
  return (
    <div className={cn("absolute inset-0 z-0 overflow-hidden", className ?? HERO_SHELL_RADIUS_CLASS)}>
      <picture className="absolute inset-0 block h-full w-full">
        <source media="(min-width: 1024px)" srcSet={HERO_BACKGROUND_DESKTOP_SRC} type="image/webp" />
        <img
          src={HERO_BACKGROUND_MOBILE_SRC}
          alt="Philippe Lefèvre - cabinet de conseil en patrimoine"
          className="h-full w-full object-cover object-center"
          sizes="100vw"
          fetchPriority="high"
        />
      </picture>
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/42 to-black/22 xl:bg-gradient-to-r xl:from-black/60 xl:via-black/30 xl:to-transparent" />
    </div>
  );
}
