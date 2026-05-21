"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, LayoutGrid, Search, X } from "lucide-react";
import { fieldClass } from "@/components/marketing/marketing-styles";
import { SearchHighlight } from "@/components/ui/search-highlight";
import {
  EXPERTISE_CAROUSEL_IMAGES,
  SERVICE_CATALOG,
  serviceDetailHref,
} from "@/lib/content/services";
import type { ServiceSlug } from "@/lib/content/services";
import { matchesServiceSearch, serviceSearchHaystack } from "@/lib/content/services-search";
import { cn } from "@/lib/utils";

type ServiceTitle = (typeof SERVICE_CATALOG)[number]["title"];
type Filter = "Tous" | ServiceTitle;

const FILTERS: Filter[] = ["Tous", ...SERVICE_CATALOG.map((s) => s.title)];

function ServiceHubCard({
  slug,
  title,
  summary,
  searchQuery,
}: {
  slug: ServiceSlug;
  title: string;
  summary: string;
  searchQuery: string;
}) {
  const hasQuery = searchQuery.trim().length > 0;
  const image = EXPERTISE_CAROUSEL_IMAGES[slug];

  return (
    <li className="flex">
      <Link
        href={serviceDetailHref(slug)}
        className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-sm transition-shadow hover:shadow-md"
      >
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#1f2a7c]/5">
          <Image
            src={image}
            alt=""
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <span className="absolute left-3 top-3 rounded-full border border-white/25 bg-black/35 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-sm">
            {hasQuery ? (
              <SearchHighlight text={title} query={searchQuery} variant="dark" />
            ) : (
              title
            )}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h2 className="text-[15px] font-semibold leading-snug tracking-tight text-[#1f2a7c] line-clamp-2">
            {hasQuery ? (
              <SearchHighlight text={title} query={searchQuery} />
            ) : (
              title
            )}
          </h2>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-[#1f2a7c]/60 line-clamp-3">
            {hasQuery ? (
              <SearchHighlight text={summary} query={searchQuery} />
            ) : (
              summary
            )}
          </p>
          <span className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-[#1f2a7c]">
            En savoir plus
            <ArrowUpRight
              aria-hidden
              className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </span>
        </div>
      </Link>
    </li>
  );
}

export function ServicesHub() {
  const [search, setSearch] = React.useState("");
  const [activeFilter, setActiveFilter] = React.useState<Filter>("Tous");

  const filtered = React.useMemo(() => {
    const q = search.trim();
    return SERVICE_CATALOG.filter((item) => {
      const matchesCat = activeFilter === "Tous" || item.title === activeFilter;
      const matchesSearch =
        !q || matchesServiceSearch(serviceSearchHaystack(item.slug), q);
      return matchesCat && matchesSearch;
    });
  }, [search, activeFilter]);

  const hasActiveFilter = search.trim().length > 0 || activeFilter !== "Tous";

  return (
    <div className="bg-white pb-14 sm:pb-18">
      {/* Barre de recherche + filtres sticky */}
      <div className="sticky top-16 z-30 border-b border-neutral-100 bg-white/95 backdrop-blur-md sm:top-20 lg:top-24">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="relative">
            <Search
              aria-hidden
              className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#1f2a7c]/40"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher une expertise (retraite, PER, assurance-vie, art…)"
              autoComplete="off"
              className={cn(fieldClass, "h-11 rounded-xl pl-10 pr-10 text-[15px]")}
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

      {/* Grille */}
      <div className="mx-auto max-w-5xl px-4 pt-8 sm:px-6 sm:pt-10 lg:px-8">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-24 text-center">
            <div className="grid size-14 place-items-center rounded-full bg-neutral-100">
              <LayoutGrid className="size-6 text-neutral-400" aria-hidden />
            </div>
            <p className="text-sm font-medium text-neutral-500">Aucune expertise trouvée.</p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setActiveFilter("Tous");
              }}
              className="text-sm font-semibold text-[#1f2a7c] underline-offset-2 hover:underline"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <>
            {hasActiveFilter ? (
              <p className="mb-5 text-[13px] text-[#1f2a7c]/50" role="status">
                {filtered.length} expertise{filtered.length > 1 ? "s" : ""} trouvée
                {filtered.length > 1 ? "s" : ""}
                {activeFilter !== "Tous" ? ` · ${activeFilter}` : ""}
                {search.trim() ? ` · « ${search.trim()} »` : ""}
              </p>
            ) : null}

            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((item) => (
                <ServiceHubCard
                  key={item.slug}
                  slug={item.slug}
                  title={item.title}
                  summary={item.summary}
                  searchQuery={search}
                />
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
