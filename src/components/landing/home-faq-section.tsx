"use client";

import { ShortFaqSection } from "@/components/client/short-faq-section";
import { HOME_FAQ } from "@/lib/content/home-faq";
import {
  LANDING_SCROLL_MARGIN,
  LANDING_SECTION_INNER_Y,
  LANDING_SECTION_INSET,
  LANDING_SECTION_SHELL,
} from "@/lib/content/landing-layout";
import { cn } from "@/lib/utils";

/** FAQ accueil — même UI que /faq, 4 questions + lien vers la FAQ complète. */
export function HomeFaqSection() {
  return (
    <section
      data-nav-theme="light"
      aria-labelledby="home-faq-title"
      className={cn(LANDING_SECTION_SHELL, LANDING_SCROLL_MARGIN, "border-t border-[#1f2a7c]/8")}
    >
      <div className={cn(LANDING_SECTION_INSET, LANDING_SECTION_INNER_Y)}>
        <ShortFaqSection items={HOME_FAQ} titleId="home-faq-title" />
      </div>
    </section>
  );
}
