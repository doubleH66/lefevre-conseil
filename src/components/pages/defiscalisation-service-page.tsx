import { DefiscalisationServiceClient } from "@/components/pages/defiscalisation-service-client";
import { MarketingSubpage } from "@/components/layout/marketing-subpage";
import { SERVICES_BASE_HREF } from "@/lib/content/routes";
import { getOtherServices, getServiceContent } from "@/lib/content/service-data";

/** Page « Fiscalité & investissement » — même gabarit que heritage `DefiscalisationServicePage`. */
export function DefiscalisationServicePage() {
  const content = getServiceContent("fiscalite-investissement");
  if (!content) return null;

  const otherServices = getOtherServices(content.slug);

  return (
    <MarketingSubpage
      hero={{
        title: content.title,
        tagline: content.tagline,
        titleId: "defiscalisation-hero-title",
        taglineHighlightAfter: content.taglineHighlightAfter,
      }}
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "Nos expertises", href: SERVICES_BASE_HREF },
        { label: content.category },
      ]}
    >
      <DefiscalisationServiceClient content={content} otherServices={otherServices} />
    </MarketingSubpage>
  );
}
