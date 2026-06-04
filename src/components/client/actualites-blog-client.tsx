"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BookOpen, Calendar, Tag } from "lucide-react";
import { ALL_ARTICLES, ARTICLE_CATEGORIES, ARTICLES_PUBLISHED } from "@/lib/content/articles";
import type { Article, ArticleCategory } from "@/lib/content/articles";
import { articleHref } from "@/lib/content/routes";
import { CategoryFilterPanel } from "@/components/marketing/category-filter-panel";
import { FilterChip } from "@/components/marketing/filter-chip";
import {
  hubCardBadgeClass,
  hubCardClass,
  hubCardMetaClass,
  hubEmptyStateClass,
  hubGridClass,
  hubInnerWideClass,
  hubIntroClass,
  hubSectionClass,
} from "@/components/marketing/hub-styles";
import { SearchFilterBar } from "@/components/marketing/search-filter-bar";
import { useHubFilters } from "@/components/marketing/use-hub-filters";
import { SearchHighlight } from "@/components/ui/search-highlight";
import { cn } from "@/lib/utils";

type Filter = "Tous" | ArticleCategory;

const FILTER_OPTIONS: { value: Filter; label: string }[] = [
  { value: "Tous", label: "Tous" },
  ...ARTICLE_CATEGORIES.map((category) => ({ value: category, label: category })),
];

function ArticleCard({ article, searchQuery }: { article: Article; searchQuery: string }) {
  const hasSearch = searchQuery.trim().length > 0;
  const inner = (
    <>
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#1f2a7c]/5">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
        />
        <span className={hubCardBadgeClass}>
          {hasSearch ? (
            <SearchHighlight text={article.category} query={searchQuery} />
          ) : (
            article.category
          )}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className={cn(hubCardMetaClass, "flex items-center gap-2")}>
          <Calendar className="size-3.5" aria-hidden />
          {article.date}
          <span className="text-[#1f2a7c]/20">·</span>
          <BookOpen className="size-3.5" aria-hidden />
          {article.readTime}
        </div>
        <h2 className="mt-2.5 text-base font-semibold leading-snug tracking-tight text-[#1f2a7c] line-clamp-2">
          {hasSearch ? <SearchHighlight text={article.title} query={searchQuery} /> : article.title}
        </h2>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-[#1f2a7c]/65 line-clamp-3">
          {hasSearch ? <SearchHighlight text={article.excerpt} query={searchQuery} /> : article.excerpt}
        </p>
        <span className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-[#1f2a7c]">
          {ARTICLES_PUBLISHED ? "Lire l'article" : "Bientôt disponible"}
          {ARTICLES_PUBLISHED ? (
            <ArrowUpRight
              aria-hidden
              className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          ) : null}
        </span>
      </div>
    </>
  );

  if (!ARTICLES_PUBLISHED) {
    return <div className={cn(hubCardClass, "flex h-full flex-col opacity-95")}>{inner}</div>;
  }

  return (
    <Link href={articleHref(article.slug)} className={cn(hubCardClass, "group flex h-full flex-col")}>
      {inner}
    </Link>
  );
}

function FeaturedCard({ article, searchQuery }: { article: Article; searchQuery: string }) {
  const hasSearch = searchQuery.trim().length > 0;
  const inner = (
    <div className="grid lg:grid-cols-[1fr_1.05fr]">
      <div className="relative min-h-[220px] overflow-hidden bg-[#1f2a7c]/5 lg:min-h-[320px]">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          sizes="(max-width:1024px) 100vw, 50vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1f2a7c]/75 via-[#1f2a7c]/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
          <span className="inline-flex rounded-lg bg-white/95 px-3 py-1 text-xs font-medium text-[#1f2a7c] shadow-sm">
            À la une ·{" "}
            {hasSearch ? (
              <SearchHighlight text={article.category} query={searchQuery} />
            ) : (
              article.category
            )}
          </span>
        </div>
      </div>

      <div className="flex flex-col justify-center gap-4 p-6 sm:p-8">
        <div className={cn(hubCardMetaClass, "flex items-center gap-3")}>
          <Calendar className="size-3.5" aria-hidden />
          {article.date}
          <span className="text-[#1f2a7c]/20">·</span>
          <BookOpen className="size-3.5" aria-hidden />
          {article.readTime}
        </div>
        <h2 className="text-xl font-semibold leading-snug tracking-tight text-[#1f2a7c] sm:text-2xl">
          {hasSearch ? <SearchHighlight text={article.title} query={searchQuery} /> : article.title}
        </h2>
        <p className="text-sm leading-relaxed text-[#1f2a7c]/65">
          {hasSearch ? <SearchHighlight text={article.excerpt} query={searchQuery} /> : article.excerpt}
        </p>
        <span className="flex items-center gap-1.5 text-sm font-semibold text-[#1f2a7c]">
          {ARTICLES_PUBLISHED ? "Lire l'article" : "Bientôt disponible"}
          {ARTICLES_PUBLISHED ? (
            <ArrowUpRight
              aria-hidden
              className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          ) : null}
        </span>
      </div>
    </div>
  );

  if (!ARTICLES_PUBLISHED) {
    return <div className={hubCardClass}>{inner}</div>;
  }

  return (
    <Link href={articleHref(article.slug)} className={cn(hubCardClass, "group block")}>
      {inner}
    </Link>
  );
}

export function ActualitesBlogClient() {
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
    return ALL_ARTICLES.filter((a) => {
      const matchesCat = activeFilter === "Tous" || a.category === activeFilter;
      const matchesSearch =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [search, activeFilter]);

  const featured = filtered.find((a) => a.featured);
  const rest = filtered.filter((a) => a.slug !== featured?.slug);

  return (
    <section className={hubSectionClass}>
      <div className={hubInnerWideClass}>
        <p className={hubIntroClass}>
          Articles patrimoniaux, fiscalité et épargne — des contenus pour mieux décider, sans jargon inutile.
        </p>

        <SearchFilterBar
          className="mt-8"
          searchTerm={search}
          onSearchChange={setSearch}
          onSearchClear={clearSearch}
          searchPlaceholder="Rechercher un article (retraite, PER, assurance-vie…)"
          searchAriaLabel="Rechercher dans les conseils"
          filterOpen={filterOpen}
          onFilterOpenChange={setFilterOpen}
          filterPanelTitle="Filtres"
          activeFilterCount={activeFilterCount}
          showFilterButton
          showResultsSummary={hasActiveFilters}
          resultCount={hasActiveFilters ? filtered.length : undefined}
          resultLabel={(count) => `${count} article${count > 1 ? "s" : ""}`}
          onClearAll={resetFilters}
          activeChips={
            activeFilter !== "Tous" ? (
              <FilterChip label={activeFilter} icon={Tag} onRemove={() => setActiveFilter("Tous")} />
            ) : null
          }
          filterPanel={
            <CategoryFilterPanel
              label="Thématique"
              options={FILTER_OPTIONS}
              value={draftFilter}
              onChange={setDraftFilter}
              onReset={() => setDraftFilter("Tous")}
              onApply={applyFilter}
            />
          }
        />

        <div className="mt-10 sm:mt-12">
          {!ARTICLES_PUBLISHED ? (
            <p className="mb-6 rounded-xl border border-[#1f2a7c]/15 bg-[#1f2a7c]/5 px-4 py-3 text-sm text-[#1f2a7c]/80">
              Les articles complets seront publiés prochainement. Vous pouvez parcourir les thématiques ci-dessous ou{" "}
              <Link href="/demande" className="font-semibold underline-offset-2 hover:underline">
                nous contacter via le formulaire de demande
              </Link>
              .
            </p>
          ) : null}

          {filtered.length === 0 ? (
            <div className={hubEmptyStateClass}>
              <div className="mx-auto grid size-12 place-items-center rounded-full bg-white">
                <BookOpen className="size-5 text-[#1f2a7c]/35" aria-hidden />
              </div>
              <p className="mt-4 text-sm text-[#1f2a7c]/65">Aucun article ne correspond à votre recherche.</p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-4 text-sm font-semibold text-[#1f2a7c] underline-offset-4 hover:underline"
              >
                Réinitialiser
              </button>
            </div>
          ) : (
            <>
              {featured ? (
                <div className="mb-6 sm:mb-8">
                  <FeaturedCard article={featured} searchQuery={search} />
                </div>
              ) : null}

              {rest.length > 0 ? (
                <ul className={hubGridClass}>
                  {rest.map((article) => (
                    <li key={article.slug} className="flex">
                      <ArticleCard article={article} searchQuery={search} />
                    </li>
                  ))}
                </ul>
              ) : null}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
