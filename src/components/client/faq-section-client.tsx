"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, HelpCircle } from "lucide-react";
import { FaqAccordion } from "@/components/client/faq-accordion";
import { FaqSearchBar } from "@/components/client/faq-search-bar";
import { SEARCH_PILL_BAR_WIDTH_CLASS } from "@/components/ui/search-pill-bar";
import { CONTACT_HREF } from "@/lib/content/routes";
import { cn } from "@/lib/utils";

export type FaqSectionItem = {
  q: string;
  a: string;
  category?: string;
};

type FaqFooterLink = {
  href: string;
  label: string;
};

type FaqSectionClientProps = {
  items: readonly FaqSectionItem[];
  title?: string;
  titleId?: string;
  titleClassName?: string;
  contentClassName?: string;
  categories?: readonly string[];
  allCategoryValue?: string;
  className?: string;
  showContactLink?: boolean;
  /** Lien pied de section (prioritaire sur le bouton contact). */
  footerLink?: FaqFooterLink;
  /** Limite le nombre de questions affichées (FAQ courtes hors page /faq). */
  maxItems?: number;
  /** Masquer le titre (ex. page /faq : le hero affiche déjà le H1). */
  showTitle?: boolean;
};

/** Bloc FAQ --- recherche, filtre optionnel, accordéon brand/divided (pattern /faq). */
export function FaqSectionClient({
  items,
  title = "Questions fréquentes",
  titleId = "faq-section-title",
  titleClassName,
  contentClassName = "max-w-3xl",
  categories,
  allCategoryValue = "Tous",
  className,
  showContactLink = true,
  footerLink,
  maxItems,
  showTitle = true,
}: FaqSectionClientProps) {
  const [search, setSearch] = React.useState("");
  const [category, setCategory] = React.useState<string>(allCategoryValue);
  const showFilter = Boolean(categories?.length && categories.length > 1);

  const sectionItems = React.useMemo(
    () => (maxItems != null ? items.slice(0, maxItems) : items),
    [items, maxItems],
  );

  const filtered = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    return sectionItems.filter((item) => {
      const matchesCategory =
        !showFilter || category === allCategoryValue || item.category === category;
      const matchesSearch =
        !query ||
        item.q.toLowerCase().includes(query) ||
        item.a.toLowerCase().includes(query) ||
        (item.category?.toLowerCase().includes(query) ?? false);
      return matchesCategory && matchesSearch;
    });
  }, [allCategoryValue, category, sectionItems, search, showFilter]);

  const hasActiveFilters = Boolean(search.trim()) || (showFilter && category !== allCategoryValue);

  const resetFilters = () => {
    setSearch("");
    setCategory(allCategoryValue);
  };

  return (
    <div className={cn("mx-auto w-full", contentClassName, className)}>
      {showTitle ? (
        <div className="text-center">
          <h2
            id={titleId}
            className={cn(
              titleClassName ??
                "text-balance text-[clamp(1.5rem,3.2vw,2.125rem)] font-normal leading-[1.1] tracking-[-0.03em] text-[#1f2a7c]",
            )}
          >
            {title}
          </h2>
        </div>
      ) : null}

      <div className={cn(showTitle ? "mt-7 sm:mt-9" : "mt-0", SEARCH_PILL_BAR_WIDTH_CLASS)}>
        <FaqSearchBar
          value={search}
          onChange={setSearch}
          onClear={() => setSearch("")}
          category={showFilter ? category : undefined}
          onCategoryChange={showFilter ? setCategory : undefined}
          categories={showFilter ? categories : undefined}
          allCategoryValue={allCategoryValue}
        />
        {hasActiveFilters ? (
          <p className="mt-3 text-center text-[13px] tracking-[-0.01em] text-[#1f2a7c]/50">
            {filtered.length === 1
              ? "1 question trouvée"
              : `${filtered.length} questions trouvées`}
            {" · "}
            <button
              type="button"
              onClick={resetFilters}
              className="font-medium text-[#1f2a7c]/70 underline-offset-4 hover:text-[#1f2a7c] hover:underline"
            >
              Tout effacer
            </button>
          </p>
        ) : null}
      </div>

      <div className="mt-8 sm:mt-10">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#1f2a7c]/12 bg-[#1f2a7c]/[0.025] px-6 py-12 text-center">
            <div className="mx-auto grid size-11 place-items-center rounded-full bg-white shadow-sm">
              <HelpCircle className="size-5 text-[#1f2a7c]/45" aria-hidden />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-[#1f2a7c]/70">
              Aucune question ne correspond à votre recherche. Essayez « contact », « rendez-vous », « gratuit » ou «
              distance ».
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
          <FaqAccordion
            items={filtered.map((item) => ({ q: item.q, a: item.a }))}
            searchQuery={search}
            tone="brand"
            layout="divided"
          />
        )}
      </div>

      {footerLink ? (
        <p className="mt-10 text-center sm:mt-12">
          <Link
            href={footerLink.href}
            className="group inline-flex items-center gap-1.5 rounded-full border border-[#1f2a7c]/12 bg-white px-4 py-2 text-sm font-semibold text-[#1f2a7c]/78 shadow-sm transition-[color,box-shadow,border-color] hover:border-[#1f2a7c]/20 hover:text-[#1f2a7c] hover:shadow-md"
          >
            {footerLink.label}
            <ArrowUpRight
              aria-hidden
              className="size-4 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </p>
      ) : showContactLink ? (
        <p className="mt-10 text-center sm:mt-12">
          <Link
            href={CONTACT_HREF}
            className="group inline-flex items-center gap-1.5 rounded-full border border-[#1f2a7c]/12 bg-white px-4 py-2 text-sm font-semibold text-[#1f2a7c]/78 shadow-sm transition-[color,box-shadow,border-color] hover:border-[#1f2a7c]/20 hover:text-[#1f2a7c] hover:shadow-md"
          >
            Prendre rendez-vous
            <ArrowUpRight
              aria-hidden
              className="size-4 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </p>
      ) : null}
    </div>
  );
}
