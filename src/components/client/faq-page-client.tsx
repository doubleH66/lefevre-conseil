"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Building2,
  Calendar,
  HelpCircle,
  MessageCircle,
  UserCircle,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { FaqAccordion } from "@/components/client/faq-accordion";
import { CategorySearchToolbar } from "@/components/marketing/category-search-toolbar";
import {
  hubEmptyStateClass,
  hubInnerNarrowClass,
  hubIntroClass,
  hubSectionClass,
} from "@/components/marketing/hub-styles";
import {
  FAQ_CATEGORIES,
  FAQ_PUBLIC_ITEMS,
  type FaqCategory,
} from "@/lib/content/site-faq-public";
import { CONTACT_HREF, ROUTES } from "@/lib/content/routes";

const ALL_CATEGORY = "Tous";

const CATEGORIES = [ALL_CATEGORY, ...FAQ_CATEGORIES] as const;

function pickFaqIcon(category: FaqCategory): LucideIcon {
  switch (category) {
    case "Rendez-vous":
      return Calendar;
    case "Cabinet":
      return Building2;
    case "Outils":
      return Wrench;
    case "Espace client":
      return UserCircle;
    default:
      return HelpCircle;
  }
}

export function FaqPageClient() {
  const [search, setSearch] = React.useState("");
  const [category, setCategory] = React.useState<string>(ALL_CATEGORY);

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return FAQ_PUBLIC_ITEMS.filter((item) => {
      const matchesCat = category === ALL_CATEGORY || item.category === category;
      const matchesSearch =
        !q ||
        item.q.toLowerCase().includes(q) ||
        item.a.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [search, category]);

  const grouped = React.useMemo(() => {
    const showGroups = category === ALL_CATEGORY && !search.trim();
    if (!showGroups) {
      return [{ category: null as FaqCategory | null, items: filtered }];
    }
    return FAQ_CATEGORIES.map((cat) => ({
      category: cat,
      items: filtered.filter((item) => item.category === cat),
    })).filter((group) => group.items.length > 0);
  }, [category, filtered, search]);

  const hasActiveSearchOrFilters = Boolean(search.trim()) || category !== ALL_CATEGORY;

  return (
    <section className={hubSectionClass}>
      <div className={hubInnerNarrowClass}>
        <p className={hubIntroClass}>
          Trouvez rapidement les réponses à vos questions sur le cabinet, les rendez-vous et vos outils en ligne.
        </p>

        <CategorySearchToolbar
          className="mt-8"
          searchTerm={search}
          onSearchChange={setSearch}
          onSearchClear={() => setSearch("")}
          searchPlaceholder="Rechercher (rendez-vous, honoraires, simulateur…)"
          searchAriaLabel="Rechercher dans la FAQ"
          category={category}
          onCategoryChange={setCategory}
          categories={CATEGORIES}
          allCategoryValue={ALL_CATEGORY}
          categoryFieldLabel="Sujet"
          filterPanelDescription="Affinez par thématique de question."
          resultCount={filtered.length}
          hasActiveSearchOrFilters={hasActiveSearchOrFilters}
          resultLabel={(count) => `${count} question${count > 1 ? "s" : ""}`}
        />

        <div className="mt-8 space-y-10 sm:mt-10 md:space-y-12">
          {filtered.length === 0 ? (
            <div className={hubEmptyStateClass}>
              <div className="mx-auto grid size-12 place-items-center rounded-full bg-zinc-100">
                <HelpCircle className="size-5 text-zinc-400" aria-hidden />
              </div>
              <p className="mt-4 text-sm text-zinc-600">
                Aucune question ne correspond à votre recherche. Essayez « rendez-vous », « honoraires » ou « simulateur ».
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
            grouped.map((group) => (
              <section
                key={group.category ?? "results"}
                aria-labelledby={group.category ? `faq-cat-${group.category}` : undefined}
              >
                {group.category ? (
                  <h2
                    id={`faq-cat-${group.category}`}
                    className="text-lg font-semibold tracking-tight text-zinc-900 md:text-xl"
                  >
                    {group.category}
                  </h2>
                ) : null}
                <FaqAccordion
                  className={group.category ? "mt-5" : undefined}
                  items={group.items.map((item) => ({
                    q: item.q,
                    a: item.a,
                    icon: pickFaqIcon(item.category),
                  }))}
                  searchQuery={search}
                />
              </section>
            ))
          )}
        </div>

        <div className="mt-12 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-900 px-6 py-7 text-white shadow-[0_4px_24px_rgba(0,0,0,0.12)] sm:px-8 sm:py-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white/10">
                <MessageCircle className="size-5" aria-hidden />
              </span>
              <div>
                <p className="text-[15px] font-semibold">Vous ne trouvez pas votre réponse ?</p>
                <p className="mt-1 text-sm leading-relaxed text-white/70">
                  Contactez le cabinet ou lancez une simulation patrimoniale en ligne.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href={CONTACT_HREF}
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-zinc-900 transition-colors hover:bg-white/90"
              >
                Nous contacter
                <ArrowUpRight className="size-4" aria-hidden />
              </Link>
              <Link
                href={ROUTES.simulateur}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Simulateur
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
