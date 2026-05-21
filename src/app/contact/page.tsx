import type { Metadata } from "next";
import { ContactPage } from "@/components/pages/contact-page";
import { BreadcrumbJsonLd, ContactPageJsonLd } from "@/components/seo/page-jsonld";

const PATH = "/contact";
const TITLE = "Contact | Lefèvre Conseil";
const DESCRIPTION =
  "Contactez Lefèvre Conseil à Perpignan : téléphone, e-mail, rendez-vous au cabinet ou à distance partout en France.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: TITLE, description: DESCRIPTION, url: PATH, type: "website" },
};

export default function Page() {
  return (
    <>
      <ContactPageJsonLd path={PATH} />
      <BreadcrumbJsonLd
        items={[
          { name: "Accueil", path: "/" },
          { name: "Contact", path: PATH },
        ]}
      />
      <ContactPage />
    </>
  );
}
