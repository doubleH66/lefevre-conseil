"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, HelpCircle, PenLine, Star } from "lucide-react";
import { CategorySearchToolbar } from "@/components/marketing/category-search-toolbar";
import { GoogleLogo } from "@/components/ui/google-logo";
import {
  LANDING_SECTION_INNER_Y,
  LANDING_SECTION_INSET,
  LANDING_SECTION_SHELL,
} from "@/lib/content/landing-layout";
import {
  CLIENT_REVIEWS,
  GOOGLE_RATING,
  GOOGLE_REVIEWS_HREF,
  HELLOKLIK_REVIEWS_URL,
  REVIEW_TOPICS,
  type ReviewTopic,
} from "@/lib/content/reviews";
import { cn } from "@/lib/utils";

const ALL_TOPIC = "Tout";
const FILTER_CATEGORIES = [ALL_TOPIC, ...REVIEW_TOPICS] as const;

function Stars({ value = 5, className = "" }: { value?: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} aria-label={`Note ${value} sur 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn("size-4", i < value ? "fill-amber-400 text-amber-400" : "fill-neutral-200 text-neutral-200")}
          aria-hidden
        />
      ))}
    </span>
  );
}

export function AvisReviewsBrowser() {
  const [search, setSearch] = React.useState("");
  const [topic, setTopic] = React.useState<string>(ALL_TOPIC);

  const filtered = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    return CLIENT_REVIEWS.filter((review) => {
      const matchesTopic = topic === ALL_TOPIC || review.topics.includes(topic as ReviewTopic);
      const matchesSearch =
        !query ||
        review.author.toLowerCase().includes(query) ||
        review.quote.toLowerCase().includes(query) ||
        review.topics.some((item) => item.toLowerCase().includes(query));
      return matchesTopic && matchesSearch;
    });
  }, [search, topic]);

  const hasActiveFilters = Boolean(search.trim()) || topic !== ALL_TOPIC;

  return (
    <section aria-labelledby="avis-grille-title" className={cn(LANDING_SECTION_SHELL, "border-t border-[#1f2a7c]/8")}>
      <div className={cn(LANDING_SECTION_INSET, LANDING_SECTION_INNER_Y)}>
        <div className="mx-auto w-full max-w-4xl">
          <div className="text-center">
            <h2
              id="avis-grille-title"
              className="text-balance text-[clamp(1.5rem,3.2vw,2.125rem)] font-normal leading-[1.1] tracking-[-0.03em] text-[#1f2a7c]"
            >
              Avis clients Google
            </h2>
            <div className="mx-auto mt-5 flex max-w-xl flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-semibold tracking-tight text-[#1f2a7c] sm:text-4xl">
                  {GOOGLE_RATING.value.toLocaleString("fr-FR", { minimumFractionDigits: 1 })}
                </span>
                <span className="inline-flex size-9 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-[#1f2a7c]/10">
                  <GoogleLogo className="size-4" />
                </span>
              </div>
              <div className="text-center sm:text-left">
                <Stars />
                <p className="mt-1 text-sm text-[#1f2a7c]/65">{GOOGLE_RATING.count} avis Google</p>
              </div>
            </div>
          </div>

          <div className="mt-8 sm:mt-10">
            <CategorySearchToolbar
              searchTerm={search}
              onSearchChange={setSearch}
              onSearchClear={() => setSearch("")}
              searchPlaceholder="Rechercher un avis (conseil, épargne, suivi…)"
              searchAriaLabel="Rechercher dans les avis clients"
              category={topic}
              onCategoryChange={setTopic}
              categories={FILTER_CATEGORIES}
              allCategoryValue={ALL_TOPIC}
              filterTitle="Filtrer par thème"
              filterPanelDescription="Affinez les avis selon le sujet abordé."
              activeCategoryLabel="Thème"
              resultCount={filtered.length}
              hasActiveSearchOrFilters={hasActiveFilters}
              resultLabel={(count) => `${count} avis affiché${count > 1 ? "s" : ""}`}
            />
          </div>

          <div className="mt-8 sm:mt-10">
            {filtered.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#1f2a7c]/12 bg-[#1f2a7c]/[0.025] px-6 py-12 text-center">
                <div className="mx-auto grid size-11 place-items-center rounded-full bg-white shadow-sm">
                  <HelpCircle className="size-5 text-[#1f2a7c]/45" aria-hidden />
                </div>
                <p className="mt-4 text-sm leading-relaxed text-[#1f2a7c]/70">
                  Aucun avis ne correspond à votre recherche. Essayez « conseil », « épargne » ou « suivi ».
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setTopic(ALL_TOPIC);
                  }}
                  className="mt-4 text-sm font-semibold text-[#1f2a7c] underline-offset-4 hover:underline"
                >
                  Réinitialiser
                </button>
              </div>
            ) : (
              <ul className="grid gap-4 sm:grid-cols-2">
                {filtered.map((review) => (
                  <li key={review.id} className="flex">
                    <article className="flex h-full w-full flex-col rounded-2xl border border-[#1f2a7c]/10 bg-white p-5 shadow-sm">
                      <div className="flex items-center gap-3">
                        {review.avatar ? (
                          /* eslint-disable-next-line @next/next/no-img-element -- avatar Google client */
                          <img
                            src={review.avatar}
                            alt={`Photo de ${review.author}`}
                            referrerPolicy="no-referrer"
                            className="size-10 shrink-0 rounded-full object-cover"
                          />
                        ) : (
                          <span
                            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#1f2a7c] text-xs font-bold text-white"
                            aria-hidden
                          >
                            {review.initials ?? "?"}
                          </span>
                        )}
                        <div className="min-w-0">
                          <p className="truncate text-[15px] font-semibold text-[#1f2a7c]">{review.author}</p>
                          <p className="text-xs text-[#1f2a7c]/50">{review.date}</p>
                        </div>
                        <span
                          className="ml-auto inline-flex size-6 items-center justify-center rounded-full bg-white ring-1 ring-[#1f2a7c]/10"
                          aria-label="Avis Google"
                        >
                          <GoogleLogo className="size-3.5" />
                        </span>
                      </div>

                      <Stars className="mt-3" />
                      <p className="mt-3 flex-1 text-[15px] leading-relaxed text-[#1f2a7c]/80">{review.quote}</p>

                      {review.topics.length > 0 ? (
                        <ul className="mt-4 flex flex-wrap gap-1.5">
                          {review.topics.map((item) => (
                            <li
                              key={item}
                              className="rounded-full bg-[#1f2a7c]/[0.06] px-2.5 py-0.5 text-[11px] font-medium text-[#1f2a7c]"
                            >
                              {item}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </article>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-10 space-y-4 border-t border-[#1f2a7c]/8 pt-8 sm:mt-12">
            <p className="text-center text-[13px] leading-relaxed text-[#1f2a7c]/55">
              Les avis sont synchronisés depuis helloklik.com.{" "}
              <Link
                href={HELLOKLIK_REVIEWS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#1f2a7c]/75 underline-offset-4 hover:text-[#1f2a7c] hover:underline"
              >
                En savoir plus
              </Link>
            </p>

            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={GOOGLE_REVIEWS_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 rounded-full border border-[#1f2a7c]/12 bg-white px-4 py-2 text-sm font-semibold text-[#1f2a7c]/78 shadow-sm transition-[color,box-shadow,border-color] hover:border-[#1f2a7c]/20 hover:text-[#1f2a7c] hover:shadow-md"
              >
                Voir la fiche Google
                <ArrowUpRight
                  aria-hidden
                  className="size-4 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
              <a
                href={GOOGLE_REVIEWS_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1f2a7c] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#182268]"
              >
                <PenLine className="size-4" aria-hidden />
                Donner un avis
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
