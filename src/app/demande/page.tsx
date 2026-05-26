import type { Metadata } from "next";
import { DemandePageClient } from "@/components/pages/demande-page";
import { SubpageShell } from "@/components/layout/subpage-shell";
import { ROUTES } from "@/lib/content/routes";

const PATH = ROUTES.demande;
const TITLE = "Demande de rendez-vous | Lefèvre Conseil";
const DESCRIPTION =
  "Décrivez votre situation patrimoniale : un conseiller Lefèvre Conseil vous recontacte rapidement pour un premier échange confidentiel.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: TITLE, description: DESCRIPTION, url: PATH, type: "website" },
};

export default function Page() {
  return (
    <SubpageShell
      heroLead={{
        title: "Parlez-nous de votre projet",
        tagline: "Formulaire de demande — réponse sous 24 h ouvrées",
        intro:
          "Complétez ce formulaire : votre demande est enregistrée et transmise au cabinet. Vous recevez une confirmation par e-mail.",
      }}
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "Demande", href: PATH },
      ]}
    >
      <div data-nav-theme="light" className="relative z-0 flex flex-1 flex-col px-4 py-10 sm:px-6 lg:px-8">
        <DemandePageClient />
      </div>
    </SubpageShell>
  );
}
