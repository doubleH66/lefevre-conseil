import { MarketingSubpage } from "@/components/layout/marketing-subpage";
import { ServicePremiumClient } from "@/components/services/service-premium-client";
import type { ServicePremiumContent } from "@/lib/content/service-premium-types";
import { getOtherServices } from "@/lib/content/service-data";
import { EXPERTISE_CAROUSEL_IMAGES, getServiceBySlug } from "@/lib/content/services";
import { EXPERTISES_BASE_HREF } from "@/lib/content/routes";

/** Gabarit service aligné sur `/expertises/fiscalite-investissement` (bandeau + blocs blancs). */
export function ServiceMarketingPage({ content }: { content: ServicePremiumContent }) {
  const catalog = getServiceBySlug(content.slug);
  const otherServices = getOtherServices(content.slug);
  const headerImage = EXPERTISE_CAROUSEL_IMAGES[content.slug];
  const imageAlt = catalog?.title ?? content.hero.h1;

  return (
    <MarketingSubpage
      headerImageSrc={headerImage}
      hero={{
        title: content.hero.h1,
        tagline: content.hero.subtitle,
        titleId: `service-hero-${content.slug}`,
        taglineHighlightAfter: content.hero.taglineHighlightAfter,
      }}
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "Nos expertises", href: EXPERTISES_BASE_HREF },
        { label: catalog?.title ?? content.hero.h1 },
      ]}
    >
      <ServicePremiumClient content={content} otherServices={otherServices} imageAlt={imageAlt} />
    </MarketingSubpage>
  );
}
