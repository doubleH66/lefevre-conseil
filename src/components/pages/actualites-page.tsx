import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { MarketingSubpage } from "@/components/layout/marketing-subpage";
import { NewsletterSignup } from "@/components/client/newsletter-signup";
import {
  MarketingHeading,
  MarketingHighlight,
  MarketingPageStack,
  MarketingSection,
} from "@/components/marketing/marketing-section";
import { marketingCardClass, marketingPageShellClass } from "@/components/marketing/marketing-styles";
import { ARTICLES, FEATURED_ARTICLE } from "@/lib/content/articles";
import { articleHref } from "@/lib/content/routes";
import { PAGE_HEROES } from "@/lib/content/page-heroes";
import { cn } from "@/lib/utils";

export function ActualitesPage() {
  return (
    <MarketingSubpage
      hero={PAGE_HEROES.actualites}
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "Conseils" },
      ]}
    >
      <MarketingPageStack className={marketingPageShellClass}>
        <MarketingSection labelledBy="featured-title">
          <article className={cn(marketingCardClass, "overflow-hidden p-0")}>
            <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
              <div className="relative min-h-[200px] bg-gradient-to-br from-[#1f2a7c] via-[#1f2a7c] to-[#0f164a] p-8 sm:p-10">
                <span className="inline-flex rounded-full border border-white/30 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/90">
                  À la une · {FEATURED_ARTICLE.category}
                </span>
                <p className="mt-4 text-xs text-white/75">
                  {FEATURED_ARTICLE.date} · {FEATURED_ARTICLE.readTime}
                </p>
              </div>
              <div className="flex flex-col justify-center gap-4 p-6 sm:p-8">
                <h2 id="featured-title" className="text-xl font-semibold text-[#1f2a7c] sm:text-2xl">
                  {FEATURED_ARTICLE.title}
                </h2>
                <p className="text-sm leading-relaxed text-[#1f2a7c]/75">{FEATURED_ARTICLE.excerpt}</p>
                <Link
                  href={articleHref(FEATURED_ARTICLE.slug)}
                  className="group inline-flex items-center gap-2 text-sm font-semibold text-[#1f2a7c]"
                >
                  Lire l’article
                  <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </Link>
              </div>
            </div>
          </article>
        </MarketingSection>

        <MarketingSection labelledBy="articles-list-title">
          <MarketingHeading
            titleId="articles-list-title"
            kicker="Publications"
            title={
              <>
                Derniers <MarketingHighlight>conseils</MarketingHighlight>
              </>
            }
          />
          <ul className="mt-8 grid gap-3">
            {ARTICLES.map((article) => (
              <li key={article.slug}>
                <Link
                  href={articleHref(article.slug)}
                  className={cn(
                    marketingCardClass,
                    "group flex items-start justify-between gap-4 p-5 sm:p-6",
                  )}
                >
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#1f2a7c]/50">
                      {article.category} · {article.date}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-[#1f2a7c]">{article.title}</h3>
                    <p className="mt-2 text-sm text-[#1f2a7c]/70">{article.excerpt}</p>
                  </div>
                  <ArrowUpRight
                    aria-hidden
                    className="size-4 shrink-0 text-[#1f2a7c]/35 transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </MarketingSection>

        <MarketingSection labelledBy="newsletter-title">
          <MarketingHeading titleId="newsletter-title" kicker="Newsletter" title="Restez informé" />
          <div className="mx-auto mt-8 max-w-md">
            <NewsletterSignup />
          </div>
        </MarketingSection>
      </MarketingPageStack>
    </MarketingSubpage>
  );
}
