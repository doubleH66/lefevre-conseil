"use client";

import type { ReactNode } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type SearchFilterBarProps = {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSearchClear: () => void;
  searchPlaceholder?: string;
  searchAriaLabel?: string;
  filterOpen: boolean;
  onFilterOpenChange: (open: boolean) => void;
  filterPanel?: ReactNode;
  filterPanelTitle?: string;
  activeFilterCount?: number;
  activeChips?: ReactNode;
  resultCount?: number;
  resultLabel?: (count: number) => string;
  showResultsSummary?: boolean;
  onClearAll?: () => void;
  showFilterButton?: boolean;
  className?: string;
};

const searchInputClass =
  "h-11 w-full rounded-xl border border-neutral-200 bg-white py-0 pl-12 pr-11 text-sm text-[#1f2a7c] shadow-[0_2px_12px_rgba(10,20,40,0.06)] outline-none transition placeholder:text-[#1f2a7c]/35 focus:border-[#1f2a7c]/25 focus:ring-2 focus:ring-[#1f2a7c]/10 [&::-webkit-search-cancel-button]:hidden";

const filterButtonClass =
  "relative inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-3.5 text-sm font-semibold text-[#1f2a7c] shadow-[0_2px_12px_rgba(10,20,40,0.06)] transition hover:bg-neutral-50 sm:px-4";

export function SearchFilterBar({
  searchTerm,
  onSearchChange,
  onSearchClear,
  searchPlaceholder = "Rechercher…",
  searchAriaLabel = "Rechercher",
  filterOpen,
  onFilterOpenChange,
  filterPanel,
  filterPanelTitle = "Filtres",
  activeFilterCount = 0,
  activeChips,
  resultCount,
  resultLabel = (count) => `${count} résultat${count > 1 ? "s" : ""}`,
  showResultsSummary = false,
  onClearAll,
  showFilterButton = true,
  className,
}: SearchFilterBarProps) {
  const filtersActive = activeFilterCount > 0;
  const hasSummary =
    showResultsSummary && (searchTerm.trim() || filtersActive || resultCount != null);

  return (
    <div className={cn("w-full min-w-0 space-y-3", className)}>
      <div className="flex min-w-0 gap-2">
        <div className="relative min-w-0 flex-1">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 z-10 size-5 -translate-y-1/2 text-[#1f2a7c]/35"
            aria-hidden
          />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className={searchInputClass}
            aria-label={searchAriaLabel}
            autoComplete="off"
          />
          {searchTerm ? (
            <button
              type="button"
              onClick={onSearchClear}
              className="absolute right-3 top-1/2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-[#1f2a7c]/45 transition hover:bg-neutral-100 hover:text-[#1f2a7c]"
              aria-label="Effacer la recherche"
            >
              <X className="size-4" aria-hidden />
            </button>
          ) : null}
        </div>

        {showFilterButton && filterPanel ? (
          <button
            type="button"
            onClick={() => onFilterOpenChange(!filterOpen)}
            className={cn(filterButtonClass, filtersActive && "border-[#1f2a7c]/25 bg-[#1f2a7c]/[0.04]")}
            aria-expanded={filterOpen}
            aria-label={
              filtersActive
                ? `${filterPanelTitle} (${activeFilterCount} actif${activeFilterCount > 1 ? "s" : ""})`
                : filterPanelTitle
            }
          >
            <SlidersHorizontal className="size-[18px] shrink-0" aria-hidden />
            <span className="hidden sm:inline">{filterPanelTitle}</span>
            {filtersActive ? (
              <span className="inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-[#1f2a7c] px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white">
                {activeFilterCount}
              </span>
            ) : null}
          </button>
        ) : null}
      </div>

      {filterOpen && filterPanel ? (
        <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white p-4 shadow-[0_4px_24px_rgba(10,20,40,0.06)] sm:p-5">
          {filterPanel}
        </div>
      ) : null}

      {activeChips ? <div className="flex flex-wrap items-center gap-2">{activeChips}</div> : null}

      {hasSummary ? (
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm sm:justify-start">
          {resultCount != null ? (
            <span className="text-[#1f2a7c]/55">{resultLabel(resultCount)}</span>
          ) : null}
          {onClearAll && (searchTerm.trim() || filtersActive) ? (
            <>
              {resultCount != null ? (
                <span className="text-neutral-300" aria-hidden>
                  ·
                </span>
              ) : null}
              <button
                type="button"
                onClick={onClearAll}
                className="font-medium text-[#1f2a7c] underline-offset-4 transition hover:underline"
              >
                Tout effacer
              </button>
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
