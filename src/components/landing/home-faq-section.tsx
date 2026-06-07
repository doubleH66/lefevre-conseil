"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, HelpCircle } from "lucide-react";
import { FaqAccordion } from "@/components/client/faq-accordion";
import { FaqSearchBar } from "@/components/client/faq-search-bar";
import { SEARCH_PILL_BAR_WIDTH_CLASS } from "@/components/ui/search-pill-bar";
import { HOME_FAQ } from "@/lib/content/home-faq";
import {
  LANDING_SCROLL_MARGIN,
  LANDING_SECTION_INNER_Y,
  LANDING_SECTION_INSET,
  LANDING_SECTION_SHELL,
} from "@/lib/content/landing-layout";
import { FAQ_HREF } from "@/lib/content/routes";
import { cn } from "@/lib/utils";

/** FAQ accueil --- titre unique + recherche (pattern hub DAS, design Lefèvre). */
export function HomeFaqSection() {
  const [search, setSearch] = React.useState("");

  const filtered = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return HOME_FAQ;
    return HOME_FAQ.filter(
      (item) =>
        item.q.toLowerCase().includes(query) || item.a.toLowerCase().includes(query),
    );
  }, [search]);

  const hasSearch = Boolean(search.trim());

  return (
    <section
      data-nav-theme="light"
      aria-labelledby="home-faq-title"
      className={cn(LANDING_SECTION_SHELL, LANDING_SCROLL_MARGIN, "border-t border-[#1f2a7c]/8")}
    >
      <div className={cn(LANDING_SECTION_INSET, LANDING_SECTION_INNER_Y)}>
        <div className="mx-auto max-w-3xl">
          <h2
            id="home-faq-title"
            className="text-balance text-center text-[clamp(1.5rem,3.2vw,2.125rem)] font-normal leading-[1.1] tracking-[-0.03em] text-[#1f2a7c]"
          >
            Questions fréquentes
          </h2>

          <div className={cn("mt-7 sm:mt-9", SEARCH_PILL_BAR_WIDTH_CLASS)}>
            <FaqSearchBar value={search} onChange={setSearch} onClear={() => setSearch("")} />
            {hasSearch ? (
              <p className="mt-3 text-center text-[13px] tracking-[-0.01em] text-[#1f2a7c]/50">
                {filtered.length === 1
                  ? "1 question trouvée"
                  : `${filtered.length} questions trouvées`}
              </p>
            ) : null}
          </div>

          <div className="mt-8 sm:mt-10">
            {filtered.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#1f2a7c]/12 bg-[#1f2a7c]/[0.025] px-6 py-12 text-center">
                <div className="mx-auto grid size-11 place-items-center rounded-full bg-white shadow-sm">
                  <HelpCircle className="size-5 text-[#1f2a7c]/45" aria-hidden />
                </div>
                <p className="mt-4 text-sm leading-relaxed text-[#1f2a7c]/70">
                  Aucune question ne correspond à votre recherche. Essayez « rendez-vous », « gratuit » ou «
                  distance ».
                </p>
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="mt-4 text-sm font-semibold text-[#1f2a7c] underline-offset-4 hover:underline"
                >
                  Effacer la recherche
                </button>
              </div>
            ) : (
              <FaqAccordion
                items={filtered}
                searchQuery={search}
                tone="brand"
                layout="divided"
              />
            )}
          </div>

          <p className="mt-10 text-center sm:mt-12">
            <Link
              href={FAQ_HREF}
              className="group inline-flex items-center gap-1.5 rounded-full border border-[#1f2a7c]/12 bg-white px-4 py-2 text-sm font-semibold text-[#1f2a7c]/78 shadow-sm transition-[color,box-shadow,border-color] hover:border-[#1f2a7c]/20 hover:text-[#1f2a7c] hover:shadow-md"
            >
              Voir toutes les réponses
              <ArrowUpRight
                aria-hidden
                className="size-4 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
