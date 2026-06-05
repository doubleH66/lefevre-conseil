import type { Metadata } from "next";
import { ContactPage } from "@/components/pages/contact-page";
import { BreadcrumbJsonLd, ContactPageJsonLd } from "@/components/seo/page-jsonld";
import { CONTACT_SUBJECTS } from "@/lib/content/site";

const PATH = "/contact";
const TITLE = "Prendre rendez-vous avec Lefèvre Conseil à Perpignan";
const DESCRIPTION =
  "Contactez Lefèvre Conseil, cabinet de conseil en gestion de patrimoine à Perpignan : placements, retraite, transmission, fiscalité et prévoyance. Premier échange offert, au cabinet ou à distance.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: TITLE, description: DESCRIPTION, url: PATH, type: "website" },
};

function resolveContactSubject(raw: string | undefined): string {
  if (!raw) return "";
  const decoded = decodeURIComponent(raw).trim();
  return (CONTACT_SUBJECTS as readonly string[]).includes(decoded) ? decoded : "";
}

type PageProps = {
  searchParams: Promise<{ objet?: string }>;
};

export default async function Page({ searchParams }: PageProps) {
  const { objet } = await searchParams;

  return (
    <>
      <ContactPageJsonLd path={PATH} />
      <BreadcrumbJsonLd
        items={[
          { name: "Accueil", path: "/" },
          { name: "Prendre rendez-vous", path: PATH },
        ]}
      />
      <ContactPage initialSubject={resolveContactSubject(objet)} />
    </>
  );
}
