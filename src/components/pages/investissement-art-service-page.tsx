import { InvestissementArtClient } from "@/components/services/investissement-art-client";
import { MarketingSubpage } from "@/components/layout/marketing-subpage";
import { getOtherServices } from "@/lib/content/service-data";
import { getServicePremiumContent } from "@/lib/content/services-premium";
import { EXPERTISES_BASE_HREF } from "@/lib/content/routes";
import { getServiceBySlug } from "@/lib/content/services";

export function InvestissementArtServicePage() {
  const content = getServicePremiumContent("investissement-art");
  if (!content) return null;

  const catalog = getServiceBySlug("investissement-art");
  const otherServices = getOtherServices("investissement-art");

  return (
    <MarketingSubpage
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
      <InvestissementArtClient content={content} otherServices={otherServices} />
    </MarketingSubpage>
  );
}
