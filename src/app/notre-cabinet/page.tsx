import type { Metadata } from "next";
import { NotreCabinetPage } from "@/components/pages/notre-cabinet-page";
import { BreadcrumbJsonLd } from "@/components/seo/page-jsonld";
import { NOTRE_CABINET_HREF } from "@/lib/content/routes";

const PATH = NOTRE_CABINET_HREF;
const TITLE = "Notre cabinet | Lefèvre Conseil";
const DESCRIPTION =
  "Lefèvre Conseil, cabinet indépendant de gestion de patrimoine à Perpignan : expertise, indépendance et accompagnement national.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: TITLE, description: DESCRIPTION, url: PATH, type: "website" },
};

export default function Page() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Accueil", path: "/" },
          { name: "Notre cabinet", path: PATH },
        ]}
      />
      <NotreCabinetPage />
    </>
  );
}
