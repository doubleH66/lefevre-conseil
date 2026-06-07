"use client";

import { SearchPillBar, type SearchPillBarProps } from "@/components/ui/search-pill-bar";

type FaqSearchBarProps = Omit<
  SearchPillBarProps,
  "filterTitle" | "filterDescription" | "filterButtonLabel" | "activeCategoryLabel"
> & {
  placeholder?: string;
  ariaLabel?: string;
};

/** Barre recherche FAQ — alias du pattern pilule + modale filtre. */
export function FaqSearchBar({
  placeholder = "Rechercher une question (rendez-vous, gratuit, distance…)",
  ariaLabel = "Rechercher dans les questions fréquentes",
  ...props
}: FaqSearchBarProps) {
  return (
    <SearchPillBar
      {...props}
      placeholder={placeholder}
      ariaLabel={ariaLabel}
      filterTitle="Filtrer par sujet"
      filterDescription="Affinez les questions selon votre besoin."
      filterButtonLabel="Filtrer"
      activeCategoryLabel="Sujet"
    />
  );
}
