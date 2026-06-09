import type { Metadata } from "next";
import { ServicesHub } from "@/components/client/services-hub";
import { ExpertisesToolsSection } from "@/components/client/expertises-tools-section";
import { MarketingSubpage } from "@/components/layout/marketing-subpage";
import { BreadcrumbJsonLd } from "@/components/seo/page-jsonld";
import { PAGE_HEROES } from "@/lib/content/page-heroes";
import { EXPERTISES_BASE_HREF } from "@/lib/content/routes";

const PATH = EXPERTISES_BASE_HREF;
const TITLE = "Expertises en gestion de patrimoine";
const DESCRIPTION =
  "Lefèvre Conseil accompagne ses clients à Perpignan et à distance : gestion de patrimoine, placements, retraite, transmission, fiscalité patrimoniale, prévoyance et protection familiale.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: TITLE, description: DESCRIPTION, url: PATH, type: "website" },
};

export default function ServicesPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Accueil", path: "/" },
          { name: "Nos expertises", path: PATH },
        ]}
      />
      <MarketingSubpage
        hero={PAGE_HEROES.expertises}
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: "Nos expertises" },
        ]}
      >
        <ServicesHub />
        <ExpertisesToolsSection />
      </MarketingSubpage>
    </>
  );
}
