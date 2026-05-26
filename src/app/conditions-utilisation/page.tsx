import type { Metadata } from "next";
import { LegalPage } from "@/components/pages/legal-page";
import { BreadcrumbJsonLd } from "@/components/seo/page-jsonld";
import { CONDITIONS_UTILISATION_SECTIONS, LEGAL_UPDATED_AT } from "@/lib/content/legal-content";
import { PAGE_HEROES } from "@/lib/content/page-heroes";
import { ROUTES } from "@/lib/content/routes";

export const metadata: Metadata = {
  title: "Conditions d’utilisation | Lefèvre Conseil",
  description: "Conditions générales d’utilisation du site et de l’espace client Lefèvre Conseil.",
  alternates: { canonical: ROUTES.conditionsUtilisation },
};

export default function Page() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Accueil", path: "/" },
          { name: "Conditions d’utilisation", path: ROUTES.conditionsUtilisation },
        ]}
      />
      <LegalPage
        hero={PAGE_HEROES.conditionsUtilisation}
        breadcrumbLabel="Conditions d’utilisation"
        updatedAt={LEGAL_UPDATED_AT}
        sections={CONDITIONS_UTILISATION_SECTIONS}
      />
    </>
  );
}
