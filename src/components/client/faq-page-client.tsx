"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Building2,
  Calendar,
  HelpCircle,
  MessageCircle,
  Search,
  UserCircle,
  Wrench,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { FaqAccordion } from "@/components/client/faq-accordion";
import {
  FAQ_CATEGORIES,
  FAQ_PUBLIC_ITEMS,
  type FaqCategory,
} from "@/lib/content/site-faq-public";
import { CONTACT_HREF, ROUTES } from "@/lib/content/routes";
import { cn } from "@/lib/utils";

type Filter = "Tous" | FaqCategory;
const FILTERS: Filter[] = ["Tous", ...FAQ_CATEGORIES];

function pickFaqIcon(category: FaqCategory): LucideIcon {
  switch (category) {
    case "Rendez-vous":
      return Calendar;
    case "Cabinet":
      return Building2;
    case "Outils":
      return Wrench;
    case "Espace client":
      return UserCircle;
    default:
      return HelpCircle;
  }
}

export function FaqPageClient() {
  const [search, setSearch] = React.useState("");
  const [activeFilter, setActiveFilter] = React.useState<Filter>("Tous");

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return FAQ_PUBLIC_ITEMS.filter((item) => {
      const matchesCat = activeFilter === "Tous" || item.category === activeFilter;
      const matchesSearch =
        !q ||
        item.q.toLowerCase().includes(q) ||
        item.a.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [search, activeFilter]);

  const grouped = React.useMemo(() => {
    const showGroups = activeFilter === "Tous" && !search.trim();
    if (!showGroups) {
      return [{ category: null as FaqCategory | null, items: filtered }];
    }
    return FAQ_CATEGORIES.map((category) => ({
      category,
      items: filtered.filter((item) => item.category === category),
    })).filter((group) => group.items.length > 0);
  }, [activeFilter, filtered, search]);

  const hasActiveFilters = Boolean(search.trim()) || activeFilter !== "Tous";

  const resetFilters = () => {
    setSearch("");
    setActiveFilter("Tous");
  };

  return (
    <section className="border-t border-neutral-200 bg-white pb-14 pt-10 sm:pb-16 sm:pt-12 md:pt-14">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm leading-relaxed text-[#1f2a7c]/65 sm:text-[15px]">
            Trouvez rapidement les réponses à vos questions sur le cabinet, les rendez-vous et vos outils en ligne.
          </p>
        </div>

        <div className="mt-8 space-y-3">
          <div className="relative">
            <Search
              aria-hidden
              className="pointer-events-none absolute left-4 top-1/2 z-10 size-5 -translate-y-1/2 text-[#1f2a7c]/35"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher (rendez-vous, honoraires, simulateur…)"
              autoComplete="off"
              aria-label="Rechercher dans la FAQ"
              className="h-11 w-full rounded-xl border border-neutral-200 bg-white py-0 pl-12 pr-11 text-sm text-[#1f2a7c] shadow-[0_2px_12px_rgba(10,20,40,0.06)] outline-none transition placeholder:text-[#1f2a7c]/35 focus:border-[#1f2a7c]/25 focus:ring-2 focus:ring-[#1f2a7c]/10 [&::-webkit-search-cancel-button]:hidden"
            />
            {search ? (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-[#1f2a7c]/45 transition hover:bg-neutral-100 hover:text-[#1f2a7c]"
                aria-label="Effacer la recherche"
              >
                <X className="size-4" aria-hidden />
              </button>
            ) : null}
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  "shrink-0 rounded-full px-3.5 py-2 text-[12px] font-semibold transition-colors duration-150",
                  activeFilter === filter
                    ? "bg-[#1f2a7c] text-white shadow-[0_4px_14px_-6px_rgba(31,42,124,0.55)]"
                    : "border border-neutral-200 bg-white text-[#1f2a7c]/60 hover:border-[#1f2a7c]/20 hover:text-[#1f2a7c]",
                )}
              >
                {filter}
              </button>
            ))}
          </div>

          {hasActiveFilters ? (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-neutral-200/80 bg-[#fafbfd] px-4 py-3 text-sm">
              <p className="text-[#1f2a7c]/65" role="status">
                {filtered.length} question{filtered.length > 1 ? "s" : ""}
                {activeFilter !== "Tous" ? ` · ${activeFilter}` : ""}
                {search.trim() ? ` · « ${search.trim()} »` : ""}
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="text-sm font-medium text-[#1f2a7c] underline-offset-4 hover:underline"
              >
                Tout effacer
              </button>
            </div>
          ) : null}
        </div>

        <div className="mt-10 space-y-12 md:mt-12 md:space-y-14">
          {filtered.length === 0 ? (
            <div className="overflow-hidden rounded-xl border border-neutral-200 bg-[#fafbfd] px-5 py-10 text-center">
              <div className="mx-auto grid size-12 place-items-center rounded-full bg-white">
                <HelpCircle className="size-5 text-[#1f2a7c]/35" aria-hidden />
              </div>
              <p className="mt-4 text-sm text-[#1f2a7c]/65">
                Aucune question ne correspond à votre recherche. Essayez « rendez-vous », « honoraires » ou « simulateur ».
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-4 text-sm font-semibold text-[#1f2a7c] underline-offset-4 hover:underline"
              >
                Réinitialiser
              </button>
            </div>
          ) : (
            grouped.map((group) => (
              <section
                key={group.category ?? "results"}
                aria-labelledby={group.category ? `faq-cat-${group.category}` : undefined}
              >
                {group.category ? (
                  <h2
                    id={`faq-cat-${group.category}`}
                    className="text-xl font-semibold tracking-[-0.03em] text-[#1f2a7c] md:text-2xl"
                  >
                    {group.category}
                  </h2>
                ) : null}
                <FaqAccordion
                  className={group.category ? "mt-6" : undefined}
                  items={group.items.map((item) => ({
                    q: item.q,
                    a: item.a,
                    icon: pickFaqIcon(item.category),
                  }))}
                  searchQuery={search}
                />
              </section>
            ))
          )}
        </div>

        <div className="mt-12 overflow-hidden rounded-2xl border border-[#1f2a7c]/12 bg-[#1f2a7c] px-6 py-7 text-white sm:px-8 sm:py-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white/10">
                <MessageCircle className="size-5" aria-hidden />
              </span>
              <div>
                <p className="text-[15px] font-semibold">Vous ne trouvez pas votre réponse ?</p>
                <p className="mt-1 text-sm leading-relaxed text-white/70">
                  Contactez le cabinet ou lancez une simulation patrimoniale en ligne.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href={CONTACT_HREF}
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#1f2a7c] transition-colors hover:bg-white/90"
              >
                Nous contacter
                <ArrowUpRight className="size-4" aria-hidden />
              </Link>
              <Link
                href={ROUTES.simulateur}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Simulateur
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
