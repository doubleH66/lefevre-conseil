"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { BrandDialog } from "@/components/ui/brand-dialog";
import { cn } from "@/lib/utils";

export const SEARCH_PILL_BAR_WIDTH_CLASS = "mx-auto w-full max-w-2xl";

export const SEARCH_PILL_SHELL_CLASS =
  "flex w-full items-center gap-1.5 rounded-full border border-[#1f2a7c]/15 bg-white p-1.5 shadow-sm transition-[border-color,box-shadow] focus-within:border-[#1f2a7c]/35 focus-within:ring-2 focus-within:ring-[#1f2a7c]/12";

export const SEARCH_PILL_INPUT_CLASS =
  "min-h-10 min-w-0 flex-1 rounded-full border-0 bg-transparent py-0 pl-1 text-sm leading-normal text-[#1f2a7c] outline-none placeholder:text-[#1f2a7c]/40 [&::-webkit-search-cancel-button]:hidden";

export const SEARCH_PILL_ACTION_CLASS =
  "min-h-10 shrink-0 rounded-full bg-[#1f2a7c] px-3.5 text-sm font-semibold leading-none text-white transition-colors hover:bg-[#18226b] sm:min-w-[5.75rem] sm:px-4";

export const SEARCH_PILL_CLEAR_BUTTON_CLASS =
  "flex size-8 shrink-0 items-center justify-center rounded-full text-[#1f2a7c]/50 transition hover:bg-[#1f2a7c]/6 hover:text-[#1f2a7c]";

export const FILTER_OPTION_CLASS =
  "rounded-full border px-3.5 py-2 text-[13px] font-medium leading-snug transition-[color,background-color,border-color,box-shadow] duration-200";

export type SearchPillBarProps = {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  placeholder?: string;
  ariaLabel?: string;
  className?: string;
  category?: string;
  onCategoryChange?: (category: string) => void;
  categories?: readonly string[];
  allCategoryValue?: string;
  filterTitle?: string;
  filterDescription?: string;
  filterButtonLabel?: string;
  activeCategoryLabel?: string;
};

/** Barre recherche pilule + modale filtre (pattern /faq). */
export function SearchPillBar({
  value,
  onChange,
  onClear,
  placeholder = "Rechercher…",
  ariaLabel = "Rechercher",
  className,
  category,
  onCategoryChange,
  categories,
  allCategoryValue = "Tous",
  filterTitle = "Filtrer",
  filterDescription = "Affinez les résultats selon votre besoin.",
  filterButtonLabel = "Filtrer",
  activeCategoryLabel = "Sujet",
}: SearchPillBarProps) {
  const [filterOpen, setFilterOpen] = React.useState(false);
  const showFilter = Boolean(categories?.length && onCategoryChange && category != null);
  const filtersActive = showFilter && category !== allCategoryValue;

  const selectCategory = (option: string) => {
    onCategoryChange?.(option);
    setFilterOpen(false);
  };

  const resetFilters = () => {
    onCategoryChange?.(allCategoryValue);
    setFilterOpen(false);
  };

  return (
    <>
      <div className={cn(SEARCH_PILL_BAR_WIDTH_CLASS, className)}>
        <div className={SEARCH_PILL_SHELL_CLASS}>
          <Search className="ml-2.5 size-4 shrink-0 text-[#1f2a7c]/35" aria-hidden />
          <input
            type="search"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            aria-label={ariaLabel}
            autoComplete="off"
            className={cn(
              SEARCH_PILL_INPUT_CLASS,
              showFilter || value ? "pr-1" : "pr-3",
            )}
          />
          {value ? (
            <button
              type="button"
              onClick={onClear}
              className={SEARCH_PILL_CLEAR_BUTTON_CLASS}
              aria-label="Effacer la recherche"
            >
              <X className="size-4" aria-hidden />
            </button>
          ) : showFilter ? (
            <span className="size-8 shrink-0" aria-hidden />
          ) : null}
          {showFilter ? (
            <button
              type="button"
              onClick={() => setFilterOpen(true)}
              className={cn(
                SEARCH_PILL_ACTION_CLASS,
                "relative inline-flex min-w-[4.75rem] items-center justify-center",
                filtersActive && "ring-2 ring-white/30 ring-offset-1 ring-offset-[#1f2a7c]",
              )}
              aria-haspopup="dialog"
              aria-expanded={filterOpen}
              aria-label={
                filtersActive ? `${filterButtonLabel} (1 actif) — ${category}` : filterButtonLabel
              }
            >
              <span className="hidden min-[380px]:inline">{filterButtonLabel}</span>
              <span className="min-[380px]:hidden">{filtersActive ? "1" : "···"}</span>
              {filtersActive ? (
                <span className="absolute -right-0.5 -top-0.5 hidden min-[380px]:inline-flex size-4 items-center justify-center rounded-full bg-white text-[10px] font-bold leading-none text-[#1f2a7c]">
                  1
                </span>
              ) : null}
            </button>
          ) : null}
        </div>

        {filtersActive && category ? (
          <p className="mt-2.5 text-center text-[12px] text-[#1f2a7c]/55 sm:text-left">
            {activeCategoryLabel} :{" "}
            <span className="font-semibold text-[#1f2a7c]/80">{category}</span>
            {" · "}
            <button
              type="button"
              onClick={() => onCategoryChange?.(allCategoryValue)}
              className="font-semibold text-[#1f2a7c]/65 underline-offset-2 hover:text-[#1f2a7c] hover:underline"
            >
              Retirer
            </button>
          </p>
        ) : null}
      </div>

      {showFilter && categories ? (
        <BrandDialog
          open={filterOpen}
          onOpenChange={setFilterOpen}
          title={filterTitle}
          description={filterDescription}
          backdropLabel={`Fermer — ${filterTitle.toLowerCase()}`}
        >
          <div className="flex flex-wrap gap-2">
            {categories.map((option) => {
              const active = category === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => selectCategory(option)}
                  aria-pressed={active}
                  className={cn(
                    FILTER_OPTION_CLASS,
                    active
                      ? "border-[#1f2a7c] bg-[#1f2a7c] text-white shadow-sm"
                      : "border-[#1f2a7c]/12 bg-[#1f2a7c]/[0.03] text-[#1f2a7c]/80 hover:border-[#1f2a7c]/22 hover:bg-[#1f2a7c]/[0.07]",
                  )}
                >
                  {option}
                </button>
              );
            })}
          </div>
          {filtersActive ? (
            <button
              type="button"
              onClick={resetFilters}
              className="mt-5 w-full rounded-xl border border-[#1f2a7c]/15 py-2.5 text-sm font-semibold text-[#1f2a7c]/75 transition hover:border-[#1f2a7c]/25 hover:bg-[#1f2a7c]/[0.04] hover:text-[#1f2a7c]"
            >
              Tout afficher
            </button>
          ) : null}
        </BrandDialog>
      ) : null}
    </>
  );
}
