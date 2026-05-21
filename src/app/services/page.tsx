import type { Metadata } from "next";
import { ServicesHub } from "@/components/client/services-hub";
import { MarketingSubpage } from "@/components/layout/marketing-subpage";
import { BreadcrumbJsonLd } from "@/components/seo/page-jsonld";
import { PAGE_HEROES } from "@/lib/content/page-heroes";
import { SERVICES_BASE_HREF } from "@/lib/content/routes";

const PATH = SERVICES_BASE_HREF;
const TITLE = "Nos expertises | Lefèvre Conseil";
const DESCRIPTION =
  "Six expertises pour structurer, protéger et transmettre votre patrimoine : gestion de patrimoine, épargne, retraite, fiscalité, prévoyance et investissement dans l’art.";

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
        hero={PAGE_HEROES.services}
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: "Nos expertises" },
        ]}
      >
        <ServicesHub />
      </MarketingSubpage>
    </>
  );
}
