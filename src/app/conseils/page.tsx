import type { Metadata } from "next";
import { ActualitesPage } from "@/components/pages/actualites-page";
import { BreadcrumbJsonLd } from "@/components/seo/page-jsonld";
import { CONSEILS_HREF } from "@/lib/content/routes";
import { ARTICLES_PUBLISHED } from "@/lib/content/articles";

const PATH = CONSEILS_HREF;
const TITLE = "Conseils patrimoniaux";
const DESCRIPTION =
  "Articles et décryptages du cabinet Lefèvre Conseil : fiscalité, épargne, retraite et gestion de patrimoine.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  // Tant qu'aucun article n'est publié, on évite d'indexer une page hub vide.
  ...(ARTICLES_PUBLISHED ? {} : { robots: { index: false, follow: true } }),
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
