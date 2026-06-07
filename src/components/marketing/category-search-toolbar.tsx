"use client";

import * as React from "react";
import { SearchPillBar, SEARCH_PILL_BAR_WIDTH_CLASS } from "@/components/ui/search-pill-bar";
import { cn } from "@/lib/utils";

export type CategorySearchToolbarProps = {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSearchClear: () => void;
  searchPlaceholder?: string;
  searchAriaLabel?: string;
  category: string;
  onCategoryChange: (category: string) => void;
  categories: readonly string[];
  allCategoryValue?: string;
  filterTitle?: string;
  filterPanelDescription?: string;
  activeCategoryLabel?: string;
  resultCount?: number;
  hasActiveSearchOrFilters?: boolean;
  resultLabel?: (count: number) => string;
  className?: string;
};

export function CategorySearchToolbar({
  searchTerm,
  onSearchChange,
  onSearchClear,
  searchPlaceholder = "Rechercher…",
  searchAriaLabel = "Rechercher",
  category,
  onCategoryChange,
  categories,
  allCategoryValue = categories[0] ?? "Tous",
  filterTitle = "Filtrer",
  filterPanelDescription = "Affinez les résultats selon votre besoin.",
  activeCategoryLabel = "Catégorie",
  resultCount,
  hasActiveSearchOrFilters,
  resultLabel = (count) => `${count} résultat${count > 1 ? "s" : ""}`,
  className,
}: CategorySearchToolbarProps) {
  const showCategories = categories.length > 1;

  return (
    <div className={cn(SEARCH_PILL_BAR_WIDTH_CLASS, "space-y-3", className)}>
      <SearchPillBar
        value={searchTerm}
        onChange={onSearchChange}
        onClear={onSearchClear}
        placeholder={searchPlaceholder}
        ariaLabel={searchAriaLabel}
        category={showCategories ? category : undefined}
        onCategoryChange={showCategories ? onCategoryChange : undefined}
        categories={showCategories ? categories : undefined}
        allCategoryValue={allCategoryValue}
        filterTitle={filterTitle}
        filterDescription={filterPanelDescription}
        filterButtonLabel="Filtrer"
        activeCategoryLabel={activeCategoryLabel}
      />

      {hasActiveSearchOrFilters ? (
        <p className="text-center text-[13px] tracking-[-0.01em] text-[#1f2a7c]/50 sm:text-left">
          {resultCount != null ? resultLabel(resultCount) : null}
          {resultCount != null && (searchTerm.trim() || category !== allCategoryValue) ? (
            <>
              {" "}
              ·{" "}
            </>
          ) : null}
          {searchTerm.trim() || category !== allCategoryValue ? (
            <button
              type="button"
              onClick={() => {
                onSearchClear();
                onCategoryChange(allCategoryValue);
              }}
              className="font-medium text-[#1f2a7c]/70 underline-offset-4 hover:text-[#1f2a7c] hover:underline"
            >
              Tout effacer
            </button>
          ) : null}
        </p>
      ) : null}
    </div>
  );
}
