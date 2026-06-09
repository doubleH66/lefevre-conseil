import Image from "next/image";

import { SUBPAGE_HEADER_IMAGE_URL } from "@/lib/content/media";
import { HERO_SHELL_RADIUS_CLASS } from "@/lib/content/hero-shell";
import { cn } from "@/lib/utils";

const INNER_PAGE_HEADER_IMAGE = SUBPAGE_HEADER_IMAGE_URL;

type SubpageHeaderBackgroundProps = {
  imageSrc?: string;
};

/** Visuel d’en-tête des pages intérieures (bandeau photo arrondi). */
export function SubpageHeaderBackground({ imageSrc }: SubpageHeaderBackgroundProps = {}) {
  return (
    <div className={cn("absolute inset-0 z-0 overflow-hidden", HERO_SHELL_RADIUS_CLASS)}>
      <Image
        src={imageSrc ?? INNER_PAGE_HEADER_IMAGE}
        alt=""
        fill
        className="object-cover object-center"
        sizes="(min-width: 1024px) 90vw, 100vw"
        priority
      />
      <div className="absolute inset-0 bg-black/35" aria-hidden />
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/30"
        aria-hidden
      />
    </div>
  );
}
