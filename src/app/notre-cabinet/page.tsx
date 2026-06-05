import type { Metadata } from "next";
import { NotreCabinetPage } from "@/components/pages/notre-cabinet-page";
import { BreadcrumbJsonLd, PersonJsonLd, WebPageJsonLd } from "@/components/seo/page-jsonld";
import { NOTRE_CABINET_HREF } from "@/lib/content/routes";

const PATH = NOTRE_CABINET_HREF;
const TITLE = "Cabinet de conseil patrimonial à Perpignan | Lefèvre Conseil";
const DESCRIPTION =
  "Découvrez Lefèvre Conseil, cabinet indépendant à Perpignan spécialisé en gestion de patrimoine, placements, retraite, transmission, fiscalité patrimoniale et prévoyance.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: TITLE, description: DESCRIPTION, url: PATH, type: "website" },
};

export default function Page() {
  return (
    <>
      <WebPageJsonLd name={TITLE} description={DESCRIPTION} path={PATH} />
      <PersonJsonLd
        name="Philippe Lefèvre"
        jobTitle="Conseiller en gestion de patrimoine"
        path={PATH}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Accueil", path: "/" },
          { name: "Notre cabinet", path: PATH },
        ]}
      />
      <NotreCabinetPage />
    </>
  );
}
