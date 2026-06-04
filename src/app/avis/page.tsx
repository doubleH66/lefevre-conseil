import type { Metadata } from "next";
import { AvisPage } from "@/components/pages/avis-page";
import { BreadcrumbJsonLd, WebPageJsonLd } from "@/components/seo/page-jsonld";
import { reviewsJsonLd } from "@/lib/seo/jsonld";
import { AVIS_HREF } from "@/lib/content/routes";

const PATH = AVIS_HREF;
const TITLE = "Avis clients Lefèvre Conseil";
const DESCRIPTION =
  "Avis et retours d’expérience des clients de Lefèvre Conseil, cabinet de gestion de patrimoine à Perpignan : bilan patrimonial, retraite, fiscalité, transmission. Note 5/5 sur Google.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: TITLE, description: DESCRIPTION, url: PATH, type: "website" },
};

export default function Page() {
  return (
    <>
      <WebPageJsonLd name={TITLE} description={DESCRIPTION} path={PATH} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewsJsonLd()) }}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Accueil", path: "/" },
          { name: "Avis clients", path: PATH },
        ]}
      />
      <AvisPage />
    </>
  );
}
