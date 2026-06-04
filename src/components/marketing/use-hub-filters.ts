"use client";

import * as React from "react";

/** État partagé recherche + filtre catégorie (FAQ, Conseils, Expertises). */
export function useHubFilters<T extends string>(defaultFilter: T) {
  const [search, setSearch] = React.useState("");
  const [activeFilter, setActiveFilter] = React.useState<T>(defaultFilter);
  const [draftFilter, setDraftFilter] = React.useState<T>(defaultFilter);
  const [filterOpen, setFilterOpen] = React.useState(false);

  React.useEffect(() => {
    if (filterOpen) setDraftFilter(activeFilter);
  }, [filterOpen, activeFilter]);

  const activeFilterCount = activeFilter !== defaultFilter ? 1 : 0;
  const hasActiveFilters = Boolean(search.trim()) || activeFilter !== defaultFilter;

  const resetFilters = React.useCallback(() => {
    setSearch("");
    setActiveFilter(defaultFilter);
    setDraftFilter(defaultFilter);
    setFilterOpen(false);
  }, [defaultFilter]);

  const applyFilter = React.useCallback(() => {
    setActiveFilter(draftFilter);
    setFilterOpen(false);
  }, [draftFilter]);

  return {
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
    clearSearch: () => setSearch(""),
  };
}
