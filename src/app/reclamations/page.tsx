import type { Metadata } from "next";
import { LegalPage } from "@/components/pages/legal-page";
import { BreadcrumbJsonLd } from "@/components/seo/page-jsonld";
import { LEGAL_UPDATED_AT, RECLAMATIONS_SECTIONS } from "@/lib/content/legal-content";
import { PAGE_HEROES } from "@/lib/content/page-heroes";
import { ROUTES } from "@/lib/content/routes";

export const metadata: Metadata = {
  title: "Réclamations clients | Lefèvre Conseil",
  description:
    "Procédure de réclamation et médiation pour les clients Lefèvre Conseil — courtage en assurance à Perpignan.",
  alternates: { canonical: ROUTES.reclamations },
};

export default function Page() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Accueil", path: "/" },
          { name: "Réclamations clients", path: ROUTES.reclamations },
        ]}
      />
      <LegalPage
        hero={PAGE_HEROES.reclamations}
        breadcrumbLabel="Réclamations clients"
        updatedAt={LEGAL_UPDATED_AT}
        sections={RECLAMATIONS_SECTIONS}
      />
    </>
  );
}
