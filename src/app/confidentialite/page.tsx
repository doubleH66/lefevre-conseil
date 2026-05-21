import type { Metadata } from "next";
import { LegalPage } from "@/components/pages/legal-page";
import { PAGE_HEROES } from "@/lib/content/page-heroes";
import { ROUTES } from "@/lib/content/routes";

export const metadata: Metadata = {
  title: "Confidentialité | Lefèvre Conseil",
  description: "Politique de confidentialité et protection des données personnelles.",
  alternates: { canonical: ROUTES.confidentialite },
};

export default function Page() {
  return (
    <LegalPage
      hero={PAGE_HEROES.confidentialite}
      breadcrumbLabel="Confidentialité"
      updatedAt="20 mai 2026"
      sections={[
        {
          title: "Données collectées",
          body: [
            "Identité, coordonnées, données patrimoniales et fiscales transmises via les formulaires ou lors des rendez-vous.",
          ],
        },
        {
          title: "Finalités",
          body: [
            "Réponse aux demandes, préparation des rendez-vous, suivi de la relation client et obligations légales du cabinet.",
          ],
        },
        {
          title: "Base légale",
          body: [
            "Exécution de mesures précontractuelles, intérêt légitime du cabinet et, le cas échéant, consentement pour certains traceurs.",
          ],
        },
        {
          title: "Conservation",
          body: [
            "Durées adaptées à la finalité et aux obligations légales (comptables, réglementaires, prescription).",
          ],
        },
        {
          title: "Vos droits",
          body: [
            "Accès, rectification, effacement, limitation, opposition et portabilité : contact@lefevre-conseil.fr.",
            "Réclamation possible auprès de la CNIL.",
          ],
        },
        {
          title: "Sécurité",
          body: ["Mesures techniques et organisationnelles pour protéger vos données contre l’accès non autorisé."],
        },
      ]}
    />
  );
}
