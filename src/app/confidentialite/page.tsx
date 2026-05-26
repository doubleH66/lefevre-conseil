import type { Metadata } from "next";
import { LegalPage } from "@/components/pages/legal-page";
import { BreadcrumbJsonLd } from "@/components/seo/page-jsonld";
import { CONFIDENTIALITE_SECTIONS, LEGAL_UPDATED_AT } from "@/lib/content/legal-content";
import { PAGE_HEROES } from "@/lib/content/page-heroes";
import { ROUTES } from "@/lib/content/routes";

export const metadata: Metadata = {
  title: "Confidentialité & RGPD | Lefèvre Conseil",
  description:
    "Politique de confidentialité, protection des données personnelles et exercice de vos droits RGPD.",
  alternates: { canonical: ROUTES.confidentialite },
};

export default function Page() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Accueil", path: "/" },
          { name: "Confidentialité", path: ROUTES.confidentialite },
        ]}
      />
      <LegalPage
        hero={PAGE_HEROES.confidentialite}
        breadcrumbLabel="Confidentialité"
        updatedAt={LEGAL_UPDATED_AT}
        intro="Lefèvre Conseil s'engage à protéger vos données personnelles conformément au RGPD et à la loi Informatique et Libertés."
        sections={CONFIDENTIALITE_SECTIONS}
      />
    </>
  );
}
