import type { Metadata } from "next";
import { FaqPage } from "@/components/pages/faq-page";
import { BreadcrumbJsonLd, FAQPageJsonLd } from "@/components/seo/page-jsonld";
import { FAQ_HREF } from "@/lib/content/routes";
import { FAQ_PUBLIC_ITEMS } from "@/lib/content/site-faq-public";

const PATH = FAQ_HREF;
const TITLE = "FAQ gestion de patrimoine";
const DESCRIPTION = "Questions fréquentes sur le cabinet, les rendez-vous et l’accompagnement patrimonial.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: TITLE, description: DESCRIPTION, url: PATH, type: "website" },
};

export default function Page() {
  return (
    <>
      <FAQPageJsonLd items={FAQ_PUBLIC_ITEMS} />
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
