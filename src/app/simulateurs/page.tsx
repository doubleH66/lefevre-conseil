import type { Metadata } from "next";
import { SimulateursPage } from "@/components/pages/simulateurs-page";
import { BreadcrumbJsonLd } from "@/components/seo/page-jsonld";
import { ROUTES } from "@/lib/content/routes";

const PATH = ROUTES.simulateurs;

export const metadata: Metadata = {
  title: "Mutuelle santé et assurance emprunteur | Lefèvre Conseil",
  description:
    "Demandez une proposition mutuelle en ligne, ou comparez votre assurance de prêt. Un conseiller affine ensuite garanties et budget avec vous.",
  alternates: { canonical: PATH },
};

export default function Page() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Accueil", path: "/" },
          { name: "Simulateurs", path: PATH },
        ]}
      />
      <SimulateursPage />
    </>
  );
}
