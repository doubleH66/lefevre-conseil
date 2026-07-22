import type { Metadata } from "next";
import { ComparateurPage } from "@/components/pages/comparateur-page";
import { BreadcrumbJsonLd } from "@/components/seo/page-jsonld";
import { ROUTES } from "@/lib/content/routes";

const PATH = ROUTES.comparateur;

export const metadata: Metadata = {
  title: "Assurance de prêt | Comparateur emprunteur | Lefèvre Conseil",
  description:
    "Comparez votre assurance emprunteur en ligne. Délégation possible (loi Lemoine). Un conseiller affine ensuite garanties et budget avec vous.",
  alternates: { canonical: PATH },
};

export default function Page() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Accueil", path: "/" },
          { name: "Simulateurs", path: ROUTES.simulateurs },
          { name: "Assurance de prêt", path: PATH },
        ]}
      />
      <ComparateurPage />
    </>
  );
}
