"use client";

import { FaqSectionClient } from "@/components/client/faq-section-client";
import {
  LANDING_SECTION_INNER_Y,
  LANDING_SECTION_INSET,
  LANDING_SECTION_SHELL,
} from "@/lib/content/landing-layout";
import { FAQ_CATEGORIES, FAQ_PUBLIC_ITEMS } from "@/lib/content/site-faq-public";
import { cn } from "@/lib/utils";

const ALL_CATEGORY = "Tous";
const FAQ_FILTER_CATEGORIES = [ALL_CATEGORY, ...FAQ_CATEGORIES] as const;

export function FaqPageClient() {
  return (
    <section aria-labelledby="faq-page-title" className={cn(LANDING_SECTION_SHELL, "border-t border-[#1f2a7c]/8")}>
      <div className={cn(LANDING_SECTION_INSET, LANDING_SECTION_INNER_Y)}>
        <FaqSectionClient
          items={FAQ_PUBLIC_ITEMS}
          titleId="faq-page-title"
          categories={FAQ_FILTER_CATEGORIES}
          allCategoryValue={ALL_CATEGORY}
        />
      </div>
    </section>
  );
}
