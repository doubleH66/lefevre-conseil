import type { Metadata } from "next";
import { LandingPage } from "@/components/landing/landing-page";
import { HOME_FAQ } from "@/components/landing/home-content-sections";
import { FAQPageJsonLd, WebPageJsonLd } from "@/components/seo/page-jsonld";

const TITLE = "Conseil en gestion de patrimoine à Perpignan | Lefèvre Conseil";
const DESCRIPTION =
  "Lefèvre Conseil accompagne particuliers, dirigeants et professions libérales à Perpignan : placements, retraite, transmission, fiscalité patrimoniale et prévoyance. Au cabinet ou à distance partout en France.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/",
    type: "website",
  },
};

export default function HomePage() {
  return (
    <>
      <WebPageJsonLd name={TITLE} description={DESCRIPTION} path="/" />
      <FAQPageJsonLd items={HOME_FAQ.map((item) => ({ q: item.q, a: item.a }))} path="/" />
      <LandingPage />
    </>
  );
}
