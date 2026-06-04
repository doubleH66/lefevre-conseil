"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, LayoutGrid, Tag } from "lucide-react";
import { CategoryFilterPanel } from "@/components/marketing/category-filter-panel";
import { FilterChip } from "@/components/marketing/filter-chip";
import {
  hubCardBadgeClass,
  hubCardClass,
  hubEmptyStateClass,
  hubGridClass,
  hubInnerWideClass,
  hubIntroClass,
  hubSectionClass,
} from "@/components/marketing/hub-styles";
import { SearchFilterBar } from "@/components/marketing/search-filter-bar";
import { useHubFilters } from "@/components/marketing/use-hub-filters";
import { SearchHighlight } from "@/components/ui/search-highlight";
import {
  EXPERTISE_CAROUSEL_IMAGES,
  SERVICE_CATALOG,
  serviceDetailHref,
} from "@/lib/content/services";
import type { ServiceSlug } from "@/lib/content/services";
import { matchesServiceSearch, serviceSearchHaystack } from "@/lib/content/services-search";
import { cn } from "@/lib/utils";

type ServiceTitle = (typeof SERVICE_CATALOG)[number]["title"];
type Filter = "Tous" | ServiceTitle;

const FILTER_OPTIONS: { value: Filter; label: string }[] = [
  { value: "Tous", label: "Tous" },
  ...SERVICE_CATALOG.map((service) => ({ value: service.title, label: service.title })),
];

function ServiceHubCard({
  slug,
  title,
  summary,
  searchQuery,
}: {
  slug: ServiceSlug;
  title: string;
  summary: string;
  searchQuery: string;
}) {
  const hasQuery = searchQuery.trim().length > 0;
  const image = EXPERTISE_CAROUSEL_IMAGES[slug];

  return (
    <li className="flex">
      <Link href={serviceDetailHref(slug)} className={cn(hubCardClass, "group flex h-full w-full flex-col")}>
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#1f2a7c]/5">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
          />
          <span className={hubCardBadgeClass}>
            {hasQuery ? <SearchHighlight text={title} query={searchQuery} /> : "Expertise"}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h2 className="text-base font-semibold leading-snug tracking-tight text-[#1f2a7c] line-clamp-2">
            {hasQuery ? <SearchHighlight text={title} query={searchQuery} /> : title}
          </h2>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-[#1f2a7c]/65 line-clamp-3">
            {hasQuery ? <SearchHighlight text={summary} query={searchQuery} /> : summary}
          </p>
          <span className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-[#1f2a7c]">
            En savoir plus
            <ArrowUpRight
              aria-hidden
              className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </span>
        </div>
      </Link>
    </li>
  );
}

export function ServicesHub() {
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
    const q = search.trim();
    return SERVICE_CATALOG.filter((item) => {
      const matchesCat = activeFilter === "Tous" || item.title === activeFilter;
      const matchesSearch = !q || matchesServiceSearch(serviceSearchHaystack(item.slug), q);
      return matchesCat && matchesSearch;
    });
  }, [search, activeFilter]);

  return (
    <section className={hubSectionClass}>
      <div className={hubInnerWideClass}>
        <p className={hubIntroClass}>
          Six expertises complémentaires pour structurer, protéger et transmettre votre patrimoine.
        </p>

        <SearchFilterBar
          className="mt-8"
          searchTerm={search}
          onSearchChange={setSearch}
          onSearchClear={clearSearch}
          searchPlaceholder="Rechercher une expertise (retraite, PER, art, fiscalité…)"
          searchAriaLabel="Rechercher dans les expertises"
          filterOpen={filterOpen}
          onFilterOpenChange={setFilterOpen}
          filterPanelTitle="Filtres"
          activeFilterCount={activeFilterCount}
          showFilterButton
          showResultsSummary={hasActiveFilters}
          resultCount={hasActiveFilters ? filtered.length : undefined}
          resultLabel={(count) => `${count} expertise${count > 1 ? "s" : ""}`}
          onClearAll={resetFilters}
          activeChips={
            activeFilter !== "Tous" ? (
              <FilterChip label={activeFilter} icon={Tag} onRemove={() => setActiveFilter("Tous")} />
            ) : null
          }
          filterPanel={
            <CategoryFilterPanel
              label="Expertise"
              options={FILTER_OPTIONS}
              value={draftFilter}
              onChange={setDraftFilter}
              onReset={() => setDraftFilter("Tous")}
              onApply={applyFilter}
            />
          }
        />

        <div className="mt-10 sm:mt-12">
          {filtered.length === 0 ? (
            <div className={hubEmptyStateClass}>
              <div className="mx-auto grid size-12 place-items-center rounded-full bg-white">
                <LayoutGrid className="size-5 text-[#1f2a7c]/35" aria-hidden />
              </div>
              <p className="mt-4 text-sm text-[#1f2a7c]/65">Aucune expertise ne correspond à votre recherche.</p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-4 text-sm font-semibold text-[#1f2a7c] underline-offset-4 hover:underline"
              >
                Réinitialiser
              </button>
            </div>
          ) : (
            <ul className={hubGridClass}>
              {filtered.map((item) => (
                <ServiceHubCard
                  key={item.slug}
                  slug={item.slug}
                  title={item.title}
                  summary={item.summary}
                  searchQuery={search}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
