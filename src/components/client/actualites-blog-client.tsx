"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BookOpen, Calendar, Search, X } from "lucide-react";
import { ALL_ARTICLES, ARTICLE_CATEGORIES, ARTICLES_PUBLISHED, FEATURED_ARTICLE } from "@/lib/content/articles";
import type { Article, ArticleCategory } from "@/lib/content/articles";
import { articleHref } from "@/lib/content/routes";
import { fieldClass } from "@/components/marketing/marketing-styles";
import { SearchHighlight } from "@/components/ui/search-highlight";
import { cn } from "@/lib/utils";

type Filter = "Tous" | ArticleCategory;
const FILTERS: Filter[] = ["Tous", ...ARTICLE_CATEGORIES];

// ─── Article card ─────────────────────────────────────────────────────────────

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
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <span className="absolute left-3 top-3 rounded-full border border-white/25 bg-black/35 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-sm">
          {hasSearch ? (
            <SearchHighlight text={article.category} query={searchQuery} variant="dark" />
          ) : (
            article.category
          )}
        </span>
        <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full border border-white/25 bg-black/35 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
          <BookOpen className="size-3" aria-hidden />
          {article.readTime}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-[11px] font-medium text-[#1f2a7c]/45">
          <Calendar className="size-3.5" aria-hidden />
          {article.date}
        </div>
        <h2 className="mt-2 text-[15px] font-semibold leading-snug tracking-tight text-[#1f2a7c] line-clamp-2">
          {hasSearch ? (
            <SearchHighlight text={article.title} query={searchQuery} />
          ) : (
            article.title
          )}
        </h2>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-[#1f2a7c]/60 line-clamp-3">
          {hasSearch ? (
            <SearchHighlight text={article.excerpt} query={searchQuery} />
          ) : (
            article.excerpt
          )}
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
    return (
      <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-sm opacity-95">
        {inner}
      </div>
    );
  }

  return (
    <Link
      href={articleHref(article.slug)}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      {inner}
    </Link>
  );
}

function FeaturedCard({ article, searchQuery }: { article: Article; searchQuery: string }) {
  const hasSearch = searchQuery.trim().length > 0;
  const inner = (
    <div className="grid lg:grid-cols-[1fr_1.1fr]">
      <div className="relative min-h-[200px] overflow-hidden bg-[#1f2a7c]/5 lg:min-h-[300px]">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          sizes="(max-width:1024px) 100vw, 50vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#1f2a7c]/70 via-[#1f2a7c]/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
          <span className="inline-flex w-fit rounded-full border border-white/30 bg-white/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-sm">
            À la une ·{" "}
            {hasSearch ? (
              <SearchHighlight text={article.category} query={searchQuery} variant="dark" />
            ) : (
              article.category
            )}
          </span>
        </div>
      </div>

      <div className="flex flex-col justify-center gap-4 p-7 sm:p-9">
        <div className="flex items-center gap-3 text-[11px] font-medium text-[#1f2a7c]/45">
          <Calendar className="size-3.5" aria-hidden />
          {article.date}
          <span className="text-[#1f2a7c]/25">·</span>
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
    return (
      <div className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-sm">{inner}</div>
    );
  }

  return (
    <Link
      href={articleHref(article.slug)}
      className="group overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      {inner}
    </Link>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export function ActualitesBlogClient() {
  const [search, setSearch] = React.useState("");
  const [activeFilter, setActiveFilter] = React.useState<Filter>("Tous");

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
  const rest = filtered.filter((a) => !a.featured);

  return (
    <div className="bg-white pb-14 sm:pb-18">
      {/* ── Barre de recherche + filtres sticky ── */}
      <div className="sticky top-16 z-30 border-b border-neutral-100 bg-white/95 backdrop-blur-md sm:top-20 lg:top-24">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 lg:px-8">
          {/* Search */}
          <div className="relative">
            <Search
              aria-hidden
              className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#1f2a7c]/40"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un article (retraite, PER, assurance-vie…)"
              autoComplete="off"
              className={cn(
                fieldClass,
                "h-11 pl-10 pr-10 text-[15px] rounded-xl",
              )}
            />
            {search ? (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-neutral-400 hover:bg-neutral-100"
                aria-label="Effacer"
              >
                <X className="size-3.5" aria-hidden />
              </button>
            ) : null}
          </div>

          {/* Category filters */}
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setActiveFilter(f)}
                className={cn(
                  "shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-colors",
                  activeFilter === f
                    ? "bg-[#1f2a7c] text-white"
                    : "border border-neutral-200 bg-white text-[#1f2a7c]/60 hover:border-[#1f2a7c]/30 hover:text-[#1f2a7c]",
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="mx-auto max-w-5xl px-4 pt-8 sm:px-6 sm:pt-10 lg:px-8">
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
          <div className="flex flex-col items-center gap-4 py-24 text-center">
            <div className="grid size-14 place-items-center rounded-full bg-neutral-100">
              <BookOpen className="size-6 text-neutral-400" aria-hidden />
            </div>
            <p className="text-sm font-medium text-neutral-500">Aucun article trouvé.</p>
            <button
              type="button"
              onClick={() => { setSearch(""); setActiveFilter("Tous"); }}
              className="text-sm font-semibold text-[#1f2a7c] underline-offset-2 hover:underline"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <>
            {/* Featured */}
            {featured ? (
              <div className="mb-8">
                <FeaturedCard article={featured} searchQuery={search} />
              </div>
            ) : null}

            {/* Status */}
            {(search || activeFilter !== "Tous") && (
              <p className="mb-5 text-[13px] text-[#1f2a7c]/50" role="status">
                {filtered.length} article{filtered.length > 1 ? "s" : ""} trouvé{filtered.length > 1 ? "s" : ""}
                {activeFilter !== "Tous" ? ` · ${activeFilter}` : ""}
                {search ? ` · « ${search} »` : ""}
              </p>
            )}

            {/* Grid */}
            {rest.length > 0 ? (
              <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
  );
}
