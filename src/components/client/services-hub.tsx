"use client";

import * as React from "react";
import { LayoutGrid } from "lucide-react";
import { CategorySearchToolbar } from "@/components/marketing/category-search-toolbar";
import { ExpertiseHubCard } from "@/components/marketing/expertise-hub-card";
import {
  hubEmptyStateClass,
  hubGridClass,
  hubInnerWideClass,
  hubIntroClass,
  hubSectionClass,
} from "@/components/marketing/hub-styles";
import { SERVICE_CATALOG } from "@/lib/content/services";
import { matchesServiceSearch, serviceSearchHaystack } from "@/lib/content/services-search";

const ALL_CATEGORY = "Tous";

const CATEGORIES = [ALL_CATEGORY, ...SERVICE_CATALOG.map((s) => s.title)] as const;

export function ServicesHub() {
  const [search, setSearch] = React.useState("");
  const [category, setCategory] = React.useState<string>(ALL_CATEGORY);

  const filtered = React.useMemo(() => {
    const q = search.trim();
    return SERVICE_CATALOG.filter((item) => {
      const matchesCat = category === ALL_CATEGORY || item.title === category;
      const matchesSearch = !q || matchesServiceSearch(serviceSearchHaystack(item.slug), q);
      return matchesCat && matchesSearch;
    });
  }, [search, category]);

  const hasActiveSearchOrFilters = Boolean(search.trim()) || category !== ALL_CATEGORY;

  return (
    <section className={hubSectionClass}>
      <div className={hubInnerWideClass}>
        <p className={hubIntroClass}>
          Six expertises complémentaires pour structurer, protéger et transmettre votre patrimoine. En bas de
          page : accès séparés à la mutuelle santé et à l’assurance de prêt.
        </p>

        <CategorySearchToolbar
          className="mt-8"
          searchTerm={search}
          onSearchChange={setSearch}
          onSearchClear={() => setSearch("")}
          searchPlaceholder="Rechercher une expertise (retraite, PER, art, fiscalité…)"
          searchAriaLabel="Rechercher dans les expertises"
          category={category}
          onCategoryChange={setCategory}
          categories={CATEGORIES}
          allCategoryValue={ALL_CATEGORY}
          filterTitle="Filtrer par expertise"
          filterPanelDescription="Affinez par domaine d'expertise."
          activeCategoryLabel="Expertise"
          resultCount={filtered.length}
          hasActiveSearchOrFilters={hasActiveSearchOrFilters}
          resultLabel={(count) => `${count} expertise${count > 1 ? "s" : ""}`}
        />

        <div className="mt-8 sm:mt-10">
          {filtered.length === 0 ? (
            <div className={hubEmptyStateClass}>
              <div className="mx-auto grid size-12 place-items-center rounded-full bg-zinc-100">
                <LayoutGrid className="size-5 text-zinc-400" aria-hidden />
              </div>
              <p className="mt-4 text-sm text-zinc-600">Aucune expertise ne correspond à votre recherche.</p>
              {hasActiveSearchOrFilters ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setCategory(ALL_CATEGORY);
                  }}
                  className="mt-3 text-sm text-zinc-700 underline underline-offset-4 transition hover:text-zinc-900"
                >
                  Réinitialiser
                </button>
              ) : null}
            </div>
          ) : (
            <ul id="expertises-grid" className={hubGridClass}>
              {filtered.map((item) => (
                <li key={item.slug}>
                  <ExpertiseHubCard
                    slug={item.slug}
                    title={item.title}
                    summary={item.summary}
                    searchTerm={search}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
