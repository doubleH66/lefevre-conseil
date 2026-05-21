import type { Metadata } from "next";
import { FaqPage } from "@/components/pages/faq-page";
import { BreadcrumbJsonLd, FAQPageJsonLd } from "@/components/seo/page-jsonld";
import { FAQ_HREF } from "@/lib/content/routes";
import { SITE_PUBLIC_FAQ_ITEMS } from "@/lib/content/site-faq";

const PATH = FAQ_HREF;
const TITLE = "FAQ | Lefèvre Conseil";
const DESCRIPTION = "Questions fréquentes sur le cabinet, les rendez-vous et l’accompagnement patrimonial.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: TITLE, description: DESCRIPTION, url: PATH, type: "website" },
};

const FAQ_EXTRA = [
  {
    q: "Puis-je faire une simulation avant un rendez-vous ?",
    a: "Oui. Le simulateur patrimonial en ligne vous permet d’obtenir une première piste chiffrée.",
  },
  {
    q: "Comment accéder à mon espace client ?",
    a: "Connectez-vous depuis l’icône « Compte » dans la barre de navigation.",
  },
] as const;

export default function Page() {
  return (
    <>
      <FAQPageJsonLd items={[...SITE_PUBLIC_FAQ_ITEMS, ...FAQ_EXTRA]} />
      <BreadcrumbJsonLd
        items={[
          { name: "Accueil", path: "/" },
          { name: "FAQ", path: PATH },
        ]}
      />
      <FaqPage />
    </>
  );
}
