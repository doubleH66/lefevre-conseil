"use client";

import * as React from "react";
import { Tag } from "lucide-react";
import { FilterChip } from "@/components/marketing/filter-chip";
import {
  FilterPanelActions,
  FilterPanelField,
  filterOptionClass,
  filterSelectClass,
} from "@/components/marketing/filter-panel-fields";
import { SearchFilterBar } from "@/components/marketing/search-filter-bar";

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
  categoryFieldLabel?: string;
  filterPanelDescription?: string;
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
  categoryFieldLabel = "Catégorie",
  filterPanelDescription = "Affinez par catégorie.",
  resultCount,
  hasActiveSearchOrFilters,
  resultLabel = (count) => `${count} résultat${count > 1 ? "s" : ""}`,
  className,
}: CategorySearchToolbarProps) {
  const [filterOpen, setFilterOpen] = React.useState(false);
  const showCategories = categories.length > 1;
  const activeFilterCount = category !== allCategoryValue ? 1 : 0;

  const resetFilters = React.useCallback(() => {
    onCategoryChange(allCategoryValue);
  }, [allCategoryValue, onCategoryChange]);

  const filterPanel = showCategories ? (
    <div className="space-y-6">
      <FilterPanelField label={categoryFieldLabel} icon={Tag} htmlFor="category-filter">
        <select
          id="category-filter"
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className={filterSelectClass}
        >
          {categories.map((option) => (
            <option key={option} value={option} className={filterOptionClass}>
              {option}
            </option>
          ))}
        </select>
      </FilterPanelField>
      <FilterPanelActions onReset={resetFilters} onApply={() => setFilterOpen(false)} />
    </div>
  ) : null;

  const activeChips =
    activeFilterCount > 0 ? (
      <FilterChip label={category} icon={Tag} onRemove={resetFilters} />
    ) : null;

  return (
    <SearchFilterBar
      className={className}
      searchTerm={searchTerm}
      onSearchChange={onSearchChange}
      onSearchClear={onSearchClear}
      searchPlaceholder={searchPlaceholder}
      searchAriaLabel={searchAriaLabel}
      filterOpen={filterOpen}
      onFilterOpenChange={setFilterOpen}
      filterPanelTitle="Filtres"
      filterPanelDescription={filterPanelDescription}
      filterPanel={filterPanel}
      activeFilterCount={activeFilterCount}
      activeChips={activeChips}
      resultCount={resultCount}
      resultLabel={resultLabel}
      showResultsSummary={hasActiveSearchOrFilters}
      onClearAll={() => {
        onSearchClear();
        resetFilters();
      }}
      showFilterButton={showCategories}
    />
  );
}
