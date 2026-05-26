import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { CONSEILS_HREF } from "@/lib/content/routes";

export const metadata: Metadata = {
  title: "Conseils | Lefèvre Conseil",
  robots: { index: false, follow: false },
};

/** Articles non publiés : redirection vers la liste (évite l'indexation de contenu vide). */
export default function ArticleSlugRedirectPage() {
  permanentRedirect(CONSEILS_HREF);
}
