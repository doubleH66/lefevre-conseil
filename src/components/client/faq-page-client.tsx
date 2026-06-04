"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Building2,
  Calendar,
  HelpCircle,
  MessageCircle,
  Tag,
  UserCircle,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { FaqAccordion } from "@/components/client/faq-accordion";
import { CategoryFilterPanel } from "@/components/marketing/category-filter-panel";
import { FilterChip } from "@/components/marketing/filter-chip";
import {
  hubEmptyStateClass,
  hubInnerNarrowClass,
  hubIntroClass,
  hubSectionClass,
} from "@/components/marketing/hub-styles";
import { SearchFilterBar } from "@/components/marketing/search-filter-bar";
import { useHubFilters } from "@/components/marketing/use-hub-filters";
import {
  FAQ_CATEGORIES,
  FAQ_PUBLIC_ITEMS,
  type FaqCategory,
} from "@/lib/content/site-faq-public";
import { CONTACT_HREF, ROUTES } from "@/lib/content/routes";

type Filter = "Tous" | FaqCategory;

const FILTER_OPTIONS: { value: Filter; label: string }[] = [
  { value: "Tous", label: "Tous" },
  ...FAQ_CATEGORIES.map((category) => ({ value: category, label: category })),
];

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
  const {
    search,
    setSearch,
    activeFilter,
    setActiveFilter,
    draftFilter,
    setDraftFilter,
    filterOpen,
    setFilterOpen,
    activeFilterCount,
    hasActiveFilters,
    resetFilters,
    applyFilter,
    clearSearch,
  } = useHubFilters<Filter>("Tous");

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

  return (
    <section className={hubSectionClass}>
      <div className={hubInnerNarrowClass}>
        <p className={hubIntroClass}>
          Trouvez rapidement les réponses à vos questions sur le cabinet, les rendez-vous et vos outils en ligne.
        </p>

        <SearchFilterBar
          className="mt-8"
          searchTerm={search}
          onSearchChange={setSearch}
          onSearchClear={clearSearch}
          searchPlaceholder="Rechercher (rendez-vous, honoraires, simulateur…)"
          searchAriaLabel="Rechercher dans la FAQ"
          filterOpen={filterOpen}
          onFilterOpenChange={setFilterOpen}
          filterPanelTitle="Filtres"
          activeFilterCount={activeFilterCount}
          showFilterButton
          showResultsSummary={hasActiveFilters}
          resultCount={hasActiveFilters ? filtered.length : undefined}
          resultLabel={(count) => `${count} question${count > 1 ? "s" : ""}`}
          onClearAll={resetFilters}
          activeChips={
            activeFilter !== "Tous" ? (
              <FilterChip label={activeFilter} icon={Tag} onRemove={() => setActiveFilter("Tous")} />
            ) : null
          }
          filterPanel={
            <CategoryFilterPanel
              label="Sujet"
              options={FILTER_OPTIONS}
              value={draftFilter}
              onChange={setDraftFilter}
              onReset={() => setDraftFilter("Tous")}
              onApply={applyFilter}
            />
          }
        />

        <div className="mt-10 space-y-12 md:mt-12 md:space-y-14">
          {filtered.length === 0 ? (
            <div className={hubEmptyStateClass}>
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

        <div className="mt-12 overflow-hidden rounded-xl border border-[#1f2a7c]/12 bg-[#1f2a7c] px-6 py-7 text-white shadow-[0_4px_24px_rgba(10,20,40,0.12)] sm:px-8 sm:py-8">
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
