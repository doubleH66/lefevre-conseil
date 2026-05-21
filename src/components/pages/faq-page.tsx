import { MarketingSubpage } from "@/components/layout/marketing-subpage";
import { FaqPageClient } from "@/components/client/faq-page-client";
import { PAGE_HEROES } from "@/lib/content/page-heroes";

export function FaqPage() {
  return (
    <MarketingSubpage
      hero={PAGE_HEROES.faq}
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "FAQ" },
      ]}
    >
      <FaqPageClient />
    </MarketingSubpage>
  );
}
