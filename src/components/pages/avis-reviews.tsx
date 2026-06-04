"use client";

import * as React from "react";
import { ArrowUpRight, PenLine, Star } from "lucide-react";
import { GoogleLogo } from "@/components/ui/google-logo";
import {
  CLIENT_REVIEWS,
  GOOGLE_RATING,
  GOOGLE_REVIEWS_HREF,
  REVIEW_TOPICS,
  reviewTopicCounts,
  type ReviewTopic,
} from "@/lib/content/reviews";
import { cn } from "@/lib/utils";

type Filter = "Tout" | ReviewTopic;

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
  const [filter, setFilter] = React.useState<Filter>("Tout");
  const counts = React.useMemo(() => reviewTopicCounts(), []);

  const filtered = React.useMemo(
    () => (filter === "Tout" ? CLIENT_REVIEWS : CLIENT_REVIEWS.filter((r) => r.topics.includes(filter))),
    [filter],
  );

  const chips: { value: Filter; label: string; count?: number }[] = [
    { value: "Tout", label: "Tout" },
    ...REVIEW_TOPICS.map((t) => ({ value: t, label: t, count: counts[t] })),
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr] lg:items-start lg:gap-10">
      {/* Résumé de la note (réel : 5,0 / 13 avis Google) */}
      <aside className="rounded-2xl border border-neutral-200/90 bg-[#fafbfd] p-6 shadow-sm lg:sticky lg:top-28">
        <div className="flex items-center gap-3">
          <span className="text-4xl font-semibold tracking-tight text-[#1f2a7c]">
            {GOOGLE_RATING.value.toLocaleString("fr-FR", { minimumFractionDigits: 1 })}
          </span>
          <span className="inline-flex size-9 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-[#1f2a7c]/10">
            <GoogleLogo className="size-4" />
          </span>
        </div>
        <Stars className="mt-2" />
        <p className="mt-2 text-sm text-[#1f2a7c]/65">{GOOGLE_RATING.count} avis Google</p>

        <ul className="mt-5 space-y-1.5" aria-label="Répartition des notes">
          {[5, 4, 3, 2, 1].map((stars) => {
            const n = GOOGLE_RATING.distribution[stars] ?? 0;
            const pct = GOOGLE_RATING.count ? Math.round((n / GOOGLE_RATING.count) * 100) : 0;
            return (
              <li key={stars} className="flex items-center gap-2 text-xs text-[#1f2a7c]/60">
                <span className="w-3 tabular-nums">{stars}</span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#1f2a7c]/10">
                  <span className="block h-full rounded-full bg-amber-400" style={{ width: `${pct}%` }} />
                </span>
                <span className="w-5 text-right tabular-nums">{n}</span>
              </li>
            );
          })}
        </ul>

        <a
          href={GOOGLE_REVIEWS_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1f2a7c] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#182268]"
        >
          <PenLine className="size-4" aria-hidden />
          Donner un avis
        </a>
      </aside>

      <div className="min-w-0">
        {/* Filtres par thème */}
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrer les avis par thème">
          {chips.map((chip) => {
            const active = filter === chip.value;
            return (
              <button
                key={chip.value}
                type="button"
                onClick={() => setFilter(chip.value)}
                aria-pressed={active}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "border-[#1f2a7c] bg-[#1f2a7c] text-white"
                    : "border-neutral-200 bg-white text-[#1f2a7c]/75 hover:border-neutral-300 hover:bg-neutral-50",
                )}
              >
                {chip.label}
                {chip.count != null ? (
                  <span className={cn("text-xs", active ? "text-white/70" : "text-[#1f2a7c]/45")}>
                    {chip.count}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        {/* Grille d'avis */}
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {filtered.map((review) => (
            <li key={review.id} className="flex">
              <article className="flex h-full w-full flex-col rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  {review.avatar ? (
                    /* eslint-disable-next-line @next/next/no-img-element -- avatar Google client */
                    <img
                      src={review.avatar}
                      alt={`Photo de ${review.author}`}
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
                  <span className="ml-auto inline-flex size-6 items-center justify-center rounded-full bg-white ring-1 ring-[#1f2a7c]/10" aria-label="Avis Google">
                    <GoogleLogo className="size-3.5" />
                  </span>
                </div>

                <Stars className="mt-3" />

                <p className="mt-3 flex-1 text-[15px] leading-relaxed text-[#1f2a7c]/80">{review.quote}</p>

                {review.topics.length > 0 ? (
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {review.topics.map((topic) => (
                      <li
                        key={topic}
                        className="rounded-full bg-[#1f2a7c]/[0.06] px-2.5 py-0.5 text-[11px] font-medium text-[#1f2a7c]"
                      >
                        {topic}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </article>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-center text-sm text-[#1f2a7c]/55 sm:text-left">
          Avis publiés sur Google.{" "}
          <a
            href={GOOGLE_REVIEWS_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-[#1f2a7c] underline-offset-4 hover:underline"
          >
            Voir la fiche Google
            <ArrowUpRight className="size-3.5" aria-hidden />
          </a>
        </p>
      </div>
    </div>
  );
}
