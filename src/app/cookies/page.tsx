import type { Metadata } from "next";
import { CookiesPage } from "@/components/pages/cookies-page";
import { BreadcrumbJsonLd } from "@/components/seo/page-jsonld";
import { ROUTES } from "@/lib/content/routes";

const PATH = ROUTES.cookies;
const TITLE = "Cookies | Lefèvre Conseil";
const DESCRIPTION = "Informations sur les cookies et traceurs utilisés sur le site Lefèvre Conseil.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
};

export default function Page() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Accueil", path: "/" },
          { name: "Cookies", path: PATH },
        ]}
      />
      <CookiesPage />
    </>
  );
}
