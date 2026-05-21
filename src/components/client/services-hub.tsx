"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Search, X } from "lucide-react";
import { MarketingPageStack, MarketingSection } from "@/components/marketing/marketing-section";
import { marketingCardClass, marketingPageShellClass } from "@/components/marketing/marketing-styles";
import { SearchHighlight } from "@/components/services/search-highlight";
import {
  EXPERTISE_CAROUSEL_IMAGES,
  SERVICE_CATALOG,
  serviceDetailHref,
} from "@/lib/content/services";
import type { ServiceSlug } from "@/lib/content/services";
import { matchesServiceSearch, serviceSearchHaystack } from "@/lib/content/services-search";
import { cn } from "@/lib/utils";

function ServiceHubCard({
  slug,
  title,
  summary,
  order,
  searchQuery,
  matches,
}: {
  slug: ServiceSlug;
  title: string;
  summary: string;
  order: number;
  searchQuery: string;
  matches: boolean;
}) {
  const hasQuery = searchQuery.trim().length > 0;
  const image = EXPERTISE_CAROUSEL_IMAGES[slug];

  return (
    <li>
      <Link
        href={serviceDetailHref(slug)}
        className={cn(
          marketingCardClass,
          "group flex h-full flex-col overflow-hidden p-0",
          matches && hasQuery && "ring-2 ring-[#1f2a7c]/25",
        )}
      >
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#1f2a7c]/5">
          <Image src={image} alt="" fill className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" sizes="(max-width:640px) 100vw, 50vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1f2a7c]/50 via-transparent to-transparent" />
          <span className="absolute left-4 top-4 text-[11px] font-semibold tabular-nums tracking-[0.14em] text-white/90">
            {String(order).padStart(2, "0")}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-lg font-semibold tracking-tight text-[#1f2a7c]">
              {hasQuery ? <SearchHighlight text={title} query={searchQuery} /> : title}
            </h2>
            <ArrowUpRight
              aria-hidden
              className="size-4 shrink-0 text-[#1f2a7c]/40 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </div>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-[#1f2a7c]/70">
            {hasQuery ? <SearchHighlight text={summary} query={searchQuery} /> : summary}
          </p>
          <span className="mt-4 text-sm font-semibold text-[#1f2a7c]">En savoir plus</span>
        </div>
      </Link>
    </li>
  );
}

export function ServicesHub() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const trimmedQuery = searchQuery.trim();

  const matchBySlug = React.useMemo(() => {
    const map = new Map<ServiceSlug, boolean>();
    for (const item of SERVICE_CATALOG) {
      map.set(
        item.slug,
        !trimmedQuery || matchesServiceSearch(serviceSearchHaystack(item.slug), trimmedQuery),
      );
    }
    return map;
  }, [trimmedQuery]);

  const hasSearchResult = !trimmedQuery || [...matchBySlug.values()].some(Boolean);

  return (
    <MarketingPageStack className={marketingPageShellClass}>
      <MarketingSection variant="flush" className="sticky top-20 z-30 lg:top-24">
        <div className="border-b border-[#1f2a7c]/10 bg-[#f2f3f7]/95 px-4 py-3 backdrop-blur-md sm:px-6">
          <label htmlFor="services-hub-search" className="sr-only">
            Rechercher une expertise
          </label>
          <div className="relative mx-auto max-w-xl">
            <Search
              aria-hidden
              className="pointer-events-none absolute left-3.5 top-1/2 size-[1.125rem] -translate-y-1/2 text-[#1f2a7c]/45"
            />
            <input
              id="services-hub-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher (retraite, PER, assurance-vie, art…)"
              autoComplete="off"
              className="h-12 w-full rounded-2xl border border-neutral-200/95 bg-white pl-11 pr-11 text-[15px] text-neutral-900 shadow-sm outline-none placeholder:text-neutral-400 focus:border-[#1f2a7c]/35 focus:ring-2 focus:ring-[#1f2a7c]/15"
            />
            {trimmedQuery ? (
              <button
                type="button"
                className="absolute right-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-xl text-neutral-500 hover:bg-neutral-100"
                aria-label="Effacer la recherche"
                onClick={() => setSearchQuery("")}
              >
                <X className="size-4" aria-hidden />
              </button>
            ) : null}
          </div>
          {trimmedQuery && !hasSearchResult ? (
            <p className="mx-auto mt-3 max-w-xl text-center text-sm text-neutral-600" role="status">
              Aucun résultat pour « {trimmedQuery} ».
            </p>
          ) : trimmedQuery ? (
            <p className="mx-auto mt-3 max-w-xl text-center text-xs text-[#1f2a7c]/70" role="status">
              Les termes correspondants sont surlignés dans les cartes ci-dessous.
            </p>
          ) : null}
        </div>
      </MarketingSection>

      <MarketingSection labelledBy="expertises-grid-title">
        <ul className="grid gap-3 sm:grid-cols-2">
          {SERVICE_CATALOG.map((item) => {
            const matches = Boolean(matchBySlug.get(item.slug));
            if (trimmedQuery && !matches) return null;
            return (
              <ServiceHubCard
                key={item.slug}
                slug={item.slug}
                title={item.title}
                summary={item.summary}
                order={item.order}
                searchQuery={searchQuery}
                matches={matches}
              />
            );
          })}
        </ul>
      </MarketingSection>
    </MarketingPageStack>
  );
}
