import type { Metadata } from "next";
import { InstallationPage } from "@/components/pages/installation-page";
import { BreadcrumbJsonLd } from "@/components/seo/page-jsonld";
import { INSTALLATION_HREF } from "@/lib/content/routes";

const PATH = INSTALLATION_HREF;
const TITLE = "Installer l’application | Lefèvre Conseil";
const DESCRIPTION = "Ajoutez Lefèvre Conseil sur votre écran d’accueil (iPhone, Android, ordinateur).";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  // Page utilitaire PWA : non indexée et absente du sitemap (Run 3).
  robots: { index: false, follow: true },
  openGraph: { title: TITLE, description: DESCRIPTION, url: PATH, type: "website" },
};

export default function Page() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Accueil", path: "/" },
          { name: "Installer l’app", path: PATH },
        ]}
      />
      <InstallationPage />
    </>
  );
}
