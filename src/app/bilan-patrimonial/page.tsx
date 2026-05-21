import type { Metadata } from "next";
import { BilanPatrimonialPage } from "@/components/pages/bilan-patrimonial-page";
import {
  BreadcrumbJsonLd,
  FAQPageJsonLd,
  ServiceJsonLd,
} from "@/components/seo/page-jsonld";
import { ROUTES } from "@/lib/content/routes";

const PATH = ROUTES.bilanPatrimonial;
const TITLE = "Bilan patrimonial à Perpignan | Lefèvre Conseil";
const DESCRIPTION =
  "Réalisez un bilan patrimonial avec Lefèvre Conseil pour faire le point sur votre épargne, votre retraite, votre fiscalité et vos projets.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: TITLE, description: DESCRIPTION, url: PATH, type: "website" },
};

const BILAN_FAQ = [
  {
    q: "Le bilan patrimonial est-il payant ?",
    a: "Le premier échange et le cadrage de votre situation sont réalisés dans un cadre transparent. Nous vous expliquons la suite de l’accompagnement avant tout engagement.",
  },
  {
    q: "Combien de temps dure un bilan ?",
    a: "Comptez un rendez-vous d’environ une heure pour recueillir les informations essentielles, puis un délai d’analyse avant la restitution personnalisée.",
  },
  {
    q: "Puis-je réaliser un bilan à distance ?",
    a: "Oui. Nous accompagnons nos clients à Perpignan et partout en France en visioconférence.",
  },
] as const;

export default function Page() {
  return (
    <>
      <ServiceJsonLd
        name="Bilan patrimonial"
        description={DESCRIPTION}
        path={PATH}
        category="Gestion de patrimoine"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Accueil", path: "/" },
          { name: "Bilan patrimonial", path: PATH },
        ]}
      />
      <FAQPageJsonLd items={[...BILAN_FAQ]} />
      <BilanPatrimonialPage faq={[...BILAN_FAQ]} />
    </>
  );
}
