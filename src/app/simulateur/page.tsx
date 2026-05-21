import type { Metadata } from "next";
import { SimulateurPage } from "@/components/pages/simulateur-page";
import { BreadcrumbJsonLd } from "@/components/seo/page-jsonld";
import { ROUTES } from "@/lib/content/routes";

const PATH = ROUTES.simulateur;

export const metadata: Metadata = {
  title: "Simulateur patrimonial | Lefèvre Conseil",
  description: "Préparez votre simulation patrimoniale en ligne avec Lefèvre Conseil.",
  alternates: { canonical: PATH },
};

export default function Page() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Accueil", path: "/" },
          { name: "Simulateur", path: PATH },
        ]}
      />
      <SimulateurPage />
    </>
  );
}
