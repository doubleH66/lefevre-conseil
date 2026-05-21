"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, HelpCircle, MessageCircle, Search, X } from "lucide-react";
import { FaqAccordion } from "@/components/client/faq-accordion";
import { fieldClass } from "@/components/marketing/marketing-styles";
import {
  FAQ_CATEGORIES,
  FAQ_PUBLIC_ITEMS,
  type FaqCategory,
} from "@/lib/content/site-faq-public";
import { CONTACT_HREF, ROUTES } from "@/lib/content/routes";
import { cn } from "@/lib/utils";

type Filter = "Tous" | FaqCategory;
const FILTERS: Filter[] = ["Tous", ...FAQ_CATEGORIES];

export function FaqPageClient() {
  const [search, setSearch] = React.useState("");
  const [activeFilter, setActiveFilter] = React.useState<Filter>("Tous");

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return FAQ_PUBLIC_ITEMS.filter((item) => {
      const matchesCat = activeFilter === "Tous" || item.category === activeFilter;
      const matchesSearch =
        !q ||
        item.q.toLowerCase().includes(q) ||
        item.a.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [search, activeFilter]);

  const accordionItems = React.useMemo(
    () => filtered.map(({ q, a }) => ({ q, a })),
    [filtered],
  );

  return (
    <div className="bg-white pb-14 sm:pb-18">
      {/* Barre de recherche + filtres sticky */}
      <div className="sticky top-16 z-30 border-b border-neutral-100 bg-white/95 backdrop-blur-md sm:top-20 lg:top-24">
        <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="relative">
            <Search
              aria-hidden
              className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#1f2a7c]/40"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher une question (rendez-vous, honoraires, simulateur…)"
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

      {/* FAQ en ligne */}
      <div className="mx-auto max-w-3xl px-4 pt-8 sm:px-6 sm:pt-10 lg:px-8">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-24 text-center">
            <div className="grid size-14 place-items-center rounded-full bg-neutral-100">
              <HelpCircle className="size-6 text-neutral-400" aria-hidden />
            </div>
            <p className="text-sm font-medium text-neutral-500">Aucune question trouvée.</p>
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
            {(search || activeFilter !== "Tous") && (
              <p className="mb-5 text-[13px] text-[#1f2a7c]/50" role="status">
                {filtered.length} question{filtered.length > 1 ? "s" : ""} trouvée
                {filtered.length > 1 ? "s" : ""}
                {activeFilter !== "Tous" ? ` · ${activeFilter}` : ""}
                {search ? ` · « ${search} »` : ""}
              </p>
            )}

            <FaqAccordion items={accordionItems} searchQuery={search} />
          </>
        )}

        <div className="mt-12 overflow-hidden rounded-2xl border border-[#1f2a7c]/10 bg-[#1f2a7c]/[0.03] px-6 py-8 sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#1f2a7c] text-white">
                <MessageCircle className="size-5" aria-hidden />
              </span>
              <div>
                <p className="text-[15px] font-semibold text-[#1f2a7c]">
                  Vous ne trouvez pas votre réponse ?
                </p>
                <p className="mt-1 text-sm text-[#1f2a7c]/60">
                  Contactez le cabinet ou lancez une simulation patrimoniale en ligne.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href={CONTACT_HREF}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#1f2a7c] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                Nous contacter
                <ArrowUpRight className="size-4" aria-hidden />
              </Link>
              <Link
                href={ROUTES.simulateur}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#1f2a7c]/20 bg-white px-5 py-2.5 text-sm font-semibold text-[#1f2a7c] transition-colors hover:bg-[#1f2a7c]/[0.04]"
              >
                Simulateur
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
