import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mon profil | Lefèvre Conseil",
  description: "Consultez et mettez à jour vos informations personnelles dans votre espace client.",
  robots: { index: false, follow: false },
};

/** Le rendu métier vit dans `PortalWorkspace` (pathname → `ClientPortal`). Ce segment apporte uniquement SEO / metadata. */
export default function EspaceClientProfilPage() {
  return null;
}
