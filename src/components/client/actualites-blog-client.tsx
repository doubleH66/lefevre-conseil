"use client";

import * as React from "react";
import { CategorySearchToolbar } from "@/components/marketing/category-search-toolbar";
import { ConseilCard } from "@/components/marketing/conseil-card";
import {
  hubEmptyStateClass,
  hubGridClass,
  hubInnerWideClass,
  hubIntroClass,
  hubSectionClass,
} from "@/components/marketing/hub-styles";
import { ALL_ARTICLES, ARTICLE_CATEGORIES, ARTICLES_PUBLISHED } from "@/lib/content/articles";

const ALL_CATEGORY = "Tous";

const CATEGORIES = [ALL_CATEGORY, ...ARTICLE_CATEGORIES] as const;

export function ActualitesBlogClient() {
  const [search, setSearch] = React.useState("");
  const [category, setCategory] = React.useState<string>(ALL_CATEGORY);

  const hasArticles = ALL_ARTICLES.length > 0;

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return ALL_ARTICLES.filter((a) => {
      const matchesCat = category === ALL_CATEGORY || a.category === category;
      const matchesSearch =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [search, category]);

  const hasActiveSearchOrFilters = Boolean(search.trim()) || category !== ALL_CATEGORY;

  return (
    <section className={hubSectionClass}>
      <div className={hubInnerWideClass}>
        <p className={hubIntroClass}>
          Retrouvez prochainement des contenus pédagogiques pour mieux comprendre les sujets patrimoniaux :
          assurance-vie, PER, retraite, transmission, fiscalité, prévoyance et organisation du patrimoine.
        </p>

        {hasArticles ? (
          <CategorySearchToolbar
            className="mt-8"
            searchTerm={search}
            onSearchChange={setSearch}
            onSearchClear={() => setSearch("")}
            searchPlaceholder="Rechercher un article (retraite, PER, assurance-vie…)"
            searchAriaLabel="Rechercher dans les conseils"
            category={category}
            onCategoryChange={setCategory}
            categories={CATEGORIES}
            allCategoryValue={ALL_CATEGORY}
            categoryFieldLabel="Thématique"
            filterPanelDescription="Affinez par thématique d'article."
            resultCount={filtered.length}
            hasActiveSearchOrFilters={hasActiveSearchOrFilters}
            resultLabel={(count) => `${count} article${count > 1 ? "s" : ""}`}
          />
        ) : null}

        <div className="mt-8 sm:mt-10">
          {filtered.length === 0 ? (
            <div className={hubEmptyStateClass}>
              <p className="text-sm text-zinc-600">
                {!hasArticles
                  ? "Aucun article pour le moment."
                  : search.trim()
                    ? "Aucun article ne correspond à votre recherche."
                    : "Aucun article dans cette catégorie pour le moment."}
              </p>
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
            <ul id="conseils-grid" className={hubGridClass}>
              {filtered.map((article) => (
                <li key={article.slug}>
                  <ConseilCard
                    article={article}
                    searchTerm={search}
                    published={ARTICLES_PUBLISHED}
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
