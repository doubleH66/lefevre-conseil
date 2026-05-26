import Link from "next/link";
import { LegalPage } from "@/components/pages/legal-page";
import { COOKIES_POLICY_SECTIONS, LEGAL_UPDATED_AT } from "@/lib/content/legal-content";
import { PAGE_HEROES } from "@/lib/content/page-heroes";
import { ROUTES } from "@/lib/content/routes";

export function CookiesPage() {
  return (
    <LegalPage
      hero={PAGE_HEROES.cookies}
      breadcrumbLabel="Cookies"
      updatedAt={LEGAL_UPDATED_AT}
      intro={
        <>
          Gérez vos préférences via le bandeau affiché lors de votre première visite. Politique complémentaire :{" "}
          <Link href={ROUTES.confidentialite} className="font-semibold text-[#1f2a7c] underline-offset-2 hover:underline">
            confidentialité
          </Link>
          .
        </>
      }
      sections={COOKIES_POLICY_SECTIONS}
    />
  );
}
