import type { Metadata } from "next";
import { ComparateurPage } from "@/components/pages/comparateur-page";
import { BreadcrumbJsonLd } from "@/components/seo/page-jsonld";
import { ROUTES } from "@/lib/content/routes";

const PATH = ROUTES.comparateur;

export const metadata: Metadata = {
  title: "Comparateur assurance | Lefèvre Conseil",
  description: "Comparez les offres d’assurance en ligne avec Lefèvre Conseil.",
  alternates: { canonical: PATH },
};

export default function Page() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Accueil", path: "/" },
          { name: "Comparateur", path: PATH },
        ]}
      />
      <ComparateurPage />
    </>
  );
}
