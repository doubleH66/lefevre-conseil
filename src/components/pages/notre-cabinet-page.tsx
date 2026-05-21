import { MarketingSubpage } from "@/components/layout/marketing-subpage";
import { CabinetIntro } from "@/components/landing/cabinet-intro";
import { PartnersStrip } from "@/components/landing/partners-strip";
import { MarketingPageStack } from "@/components/marketing/marketing-section";
import { marketingPageShellClass } from "@/components/marketing/marketing-styles";
import { PAGE_HEROES } from "@/lib/content/page-heroes";

export function NotreCabinetPage() {
  return (
    <MarketingSubpage
      hero={PAGE_HEROES.notreCabinet}
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "Notre cabinet" },
      ]}
    >
      <MarketingPageStack className={marketingPageShellClass}>
        <CabinetIntro />
        <div className="mx-2.5 mt-3 bg-white lg:mx-4 lg:mt-4">
          <PartnersStrip layout="page" />
        </div>
      </MarketingPageStack>
    </MarketingSubpage>
  );
}
