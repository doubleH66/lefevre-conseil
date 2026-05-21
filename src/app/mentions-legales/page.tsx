import type { Metadata } from "next";
import { LegalPage } from "@/components/pages/legal-page";
import { PAGE_HEROES } from "@/lib/content/page-heroes";
import { ROUTES } from "@/lib/content/routes";

export const metadata: Metadata = {
  title: "Mentions légales | Lefèvre Conseil",
  description: "Informations légales du site Lefèvre Conseil.",
  alternates: { canonical: ROUTES.mentionsLegales },
};

export default function Page() {
  return (
    <LegalPage
      hero={PAGE_HEROES.mentionsLegales}
      breadcrumbLabel="Mentions légales"
      updatedAt="20 mai 2026"
      sections={[
        {
          title: "Éditeur du site",
          body: [
            "Le site est édité par Lefèvre Conseil, cabinet indépendant de conseil en gestion de patrimoine à Perpignan.",
            "Les informations administratives complètes (forme juridique, immatriculation, ORIAS) doivent être confirmées par le cabinet avant publication définitive.",
          ],
        },
        {
          title: "Contact",
          body: ["Pour toute demande : contact@lefevre-conseil.fr — 04 68 86 36 22."],
        },
        {
          title: "Hébergement",
          body: ["Le site est hébergé par le prestataire technique retenu pour le déploiement en production."],
        },
        {
          title: "Propriété intellectuelle",
          body: [
            "L’ensemble des contenus (textes, visuels, structure) est protégé par le droit de la propriété intellectuelle.",
            "Toute reproduction non autorisée est interdite.",
          ],
        },
        {
          title: "Responsabilité",
          body: [
            "Les informations publiées sont fournies à titre informatif et ne constituent pas un conseil personnalisé.",
            "Toute stratégie patrimoniale doit faire l’objet d’une analyse individualisée.",
          ],
        },
      ]}
    />
  );
}
