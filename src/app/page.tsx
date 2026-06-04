import type { Metadata } from "next";
import { LandingPage } from "@/components/landing/landing-page";

const DESCRIPTION =
  "Lefèvre Conseil, conseiller en gestion de patrimoine indépendant à Perpignan (Pyrénées-Orientales, Occitanie) : bilan patrimonial, épargne, retraite, fiscalité, prévoyance et transmission. Accompagnement au cabinet et à distance partout en France.";

export const metadata: Metadata = {
  title: "Conseiller en gestion de patrimoine à Perpignan",
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: "Conseiller en gestion de patrimoine à Perpignan · Lefèvre Conseil",
    description: DESCRIPTION,
    url: "/",
    type: "website",
  },
};

export default function HomePage() {
  return <LandingPage />;
}
