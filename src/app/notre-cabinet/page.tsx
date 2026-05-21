import type { Metadata } from "next";
import { NotreCabinetPage } from "@/components/pages/notre-cabinet-page";
import { BreadcrumbJsonLd } from "@/components/seo/page-jsonld";
import { NOTRE_CABINET_HREF } from "@/lib/content/routes";

const PATH = NOTRE_CABINET_HREF;
const TITLE = "Notre cabinet | Lefèvre Conseil";
const DESCRIPTION =
  "Découvrez Lefèvre Conseil, cabinet indépendant à Perpignan, spécialisé en gestion de patrimoine, épargne, prévoyance et conseil.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: TITLE, description: DESCRIPTION, url: PATH, type: "website" },
};

export default function Page() {
  return (
    <>
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
