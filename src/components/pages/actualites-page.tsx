import { MarketingSubpage } from "@/components/layout/marketing-subpage";
import { ActualitesBlogClient } from "@/components/client/actualites-blog-client";
import { PAGE_HEROES } from "@/lib/content/page-heroes";

export function ActualitesPage() {
  return (
    <MarketingSubpage
      hero={PAGE_HEROES.conseils}
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "Conseils" },
      ]}
      hideBilanCta={false}
    >
      <ActualitesBlogClient />
    </MarketingSubpage>
  );
}
