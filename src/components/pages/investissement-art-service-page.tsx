import { InvestissementArtClient } from "@/components/services/investissement-art-client";
import { MarketingSubpage } from "@/components/layout/marketing-subpage";
import { ART_CONTACT_SUBJECT } from "@/lib/content/investissement-art-content";
import { getOtherServices } from "@/lib/content/service-data";
import { getServicePremiumContent } from "@/lib/content/services-premium";
import { CONTACT_HREF, EXPERTISES_BASE_HREF } from "@/lib/content/routes";
import { getServiceBySlug } from "@/lib/content/services";

const artContactHref = `${CONTACT_HREF}?objet=${encodeURIComponent(ART_CONTACT_SUBJECT)}`;

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
      heroCtas={{
        primary: {
          href: artContactHref,
          label: "Réservez votre rendez-vous",
          shortLabel: "Rendez-vous",
        },
        secondary: {
          href: "#nouveautes",
          label: "Découvrir les œuvres",
          shortLabel: "Œuvres",
        },
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
