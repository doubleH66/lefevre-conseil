import type { Metadata } from "next";
import { ActualitesPage } from "@/components/pages/actualites-page";
import { BreadcrumbJsonLd } from "@/components/seo/page-jsonld";
import { ACTUALITES_HREF } from "@/lib/content/routes";

const PATH = ACTUALITES_HREF;
const TITLE = "Conseils & actualités | Lefèvre Conseil";
const DESCRIPTION =
  "Articles et décryptages du cabinet Lefèvre Conseil : fiscalité, épargne, retraite et gestion de patrimoine.";

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
          { name: "Conseils", path: PATH },
        ]}
      />
      <ActualitesPage />
    </>
  );
}
