import Link from "next/link";
import { MarketingSubpage } from "@/components/layout/marketing-subpage";
import {
  MarketingHeading,
  MarketingPageStack,
  MarketingSection,
} from "@/components/marketing/marketing-section";
import { marketingPageShellClass } from "@/components/marketing/marketing-styles";
import type { Article } from "@/lib/content/articles";
import { ACTUALITES_HREF } from "@/lib/content/routes";

type ArticleDetailPageProps = {
  article: Article;
};

export function ArticleDetailPage({ article }: ArticleDetailPageProps) {
  return (
    <MarketingSubpage
      hero={{
        title: article.title,
        tagline: `${article.category} · ${article.date} · ${article.readTime} de lecture`,
        titleId: "article-hero-title",
        intro: article.excerpt,
      }}
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "Conseils", href: ACTUALITES_HREF },
        { label: article.category },
      ]}
    >
      <MarketingPageStack className={marketingPageShellClass}>
        <MarketingSection labelledBy="article-body-title">
          <MarketingHeading titleId="article-body-title" kicker="Article" title="Contenu" align="left" />
          <p className="mt-6 text-[15px] leading-relaxed text-[#1f2a7c]/78">
            Le contenu complet de cet article est en cours de migration depuis le site actuel. En attendant,
            contactez le cabinet pour approfondir ce sujet avec un conseiller.
          </p>
          <Link
            href={ACTUALITES_HREF}
            className="mt-8 inline-flex text-sm font-semibold text-[#1f2a7c] underline-offset-4 hover:underline"
          >
            ← Retour aux conseils
          </Link>
        </MarketingSection>
      </MarketingPageStack>
    </MarketingSubpage>
  );
}
