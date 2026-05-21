import type { Metadata } from "next";
import { LegalPage } from "@/components/pages/legal-page";
import { PAGE_HEROES } from "@/lib/content/page-heroes";
import { ROUTES } from "@/lib/content/routes";

export const metadata: Metadata = {
  title: "Conditions d’utilisation | Lefèvre Conseil",
  description: "Conditions générales d’utilisation du site Lefèvre Conseil.",
  alternates: { canonical: ROUTES.conditionsUtilisation },
};

export default function Page() {
  return (
    <LegalPage
      hero={PAGE_HEROES.conditionsUtilisation}
      breadcrumbLabel="Conditions d’utilisation"
      updatedAt="20 mai 2026"
      sections={[
        {
          title: "Accès au site",
          body: [
            "Le site est destiné à un usage personnel et informatif. L’accès peut être suspendu pour maintenance.",
          ],
        },
        {
          title: "Compte client",
          body: [
            "L’utilisateur est responsable de la confidentialité de ses identifiants et des informations transmises via son espace.",
          ],
        },
        {
          title: "Contenus",
          body: [
            "Les contenus ne constituent pas une offre contractuelle ni une recommandation d’investissement personnalisée.",
          ],
        },
        {
          title: "Responsabilité",
          body: [
            "Lefèvre Conseil ne saurait être tenu responsable des dommages indirects liés à l’utilisation du site, dans les limites légales.",
          ],
        },
      ]}
    />
  );
}
