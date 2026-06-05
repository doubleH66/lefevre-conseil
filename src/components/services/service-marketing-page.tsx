import { MarketingSubpage } from "@/components/layout/marketing-subpage";
import { ServicePremiumClient } from "@/components/services/service-premium-client";
import type { ServicePremiumContent } from "@/lib/content/service-premium-types";
import { getOtherServices } from "@/lib/content/service-data";
import { getServiceBySlug } from "@/lib/content/services";
import { CONTACT_HREF, EXPERTISES_BASE_HREF, NOTRE_CABINET_HREF } from "@/lib/content/routes";

/** CTA hero partagé sur toutes les pages expertises : conversion unique + découverte cabinet. */
export const EXPERTISE_HERO_CTAS = {
  primary: { href: CONTACT_HREF, label: "Prendre rendez-vous", shortLabel: "Rendez-vous" },
  secondary: { href: NOTRE_CABINET_HREF, label: "Découvrir le cabinet", shortLabel: "Le cabinet" },
} as const;

/** Gabarit service aligné sur `/expertises/fiscalite-investissement` (bandeau + blocs blancs). */
export function ServiceMarketingPage({ content }: { content: ServicePremiumContent }) {
  const catalog = getServiceBySlug(content.slug);
  const otherServices = getOtherServices(content.slug);

  return (
    <MarketingSubpage
      hero={{
        title: content.hero.h1,
        tagline: content.hero.subtitle,
        titleId: `service-hero-${content.slug}`,
        taglineHighlightAfter: content.hero.taglineHighlightAfter,
      }}
      heroCtas={EXPERTISE_HERO_CTAS}
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "Nos expertises", href: EXPERTISES_BASE_HREF },
        { label: catalog?.title ?? content.hero.h1 },
      ]}
    >
      <ServicePremiumClient content={content} otherServices={otherServices} />
    </MarketingSubpage>
  );
}
