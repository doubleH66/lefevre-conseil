"use client";

import * as React from "react";
import Link from "next/link";
import { BookOpen } from "lucide-react";
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
          Articles patrimoniaux, fiscalité et épargne — des contenus pour mieux décider, sans jargon inutile.
        </p>

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

        <div className="mt-8 sm:mt-10">
          {!ARTICLES_PUBLISHED ? (
            <p className="mb-6 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700">
              Les articles complets seront publiés prochainement. Vous pouvez parcourir les thématiques ci-dessous ou{" "}
              <Link href="/demande" className="font-semibold underline-offset-2 hover:underline">
                nous contacter via le formulaire de demande
              </Link>
              .
            </p>
          ) : null}

          {filtered.length === 0 ? (
            <div className={hubEmptyStateClass}>
              <p className="text-sm text-zinc-600">
                {search.trim()
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
