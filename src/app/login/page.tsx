import type { Metadata } from "next";
import { LoginPage } from "@/components/pages/login-page";
import { BreadcrumbJsonLd } from "@/components/seo/page-jsonld";
import { LOGIN_HREF } from "@/lib/content/routes";
import { sanitizeInternalPath } from "@/lib/sanitize-internal-path";
import { isSupabasePublicConfigured } from "@/lib/supabase/public-env";

export const metadata: Metadata = {
  title: "Compte | Lefèvre Conseil",
  description: "Connexion et inscription à votre espace client Lefèvre Conseil.",
  alternates: { canonical: LOGIN_HREF },
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string; tab?: string }>;
}) {
  const sp = await searchParams;
  const nextPath = sanitizeInternalPath(sp.next, "/espace-client");
  const initialMode =
    sp.tab === "inscription" || sp.tab === "register" ? ("register" as const) : ("login" as const);
  const configured = isSupabasePublicConfigured();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Accueil", path: "/" },
          { name: "Compte", path: LOGIN_HREF },
        ]}
      />
      <LoginPage
        nextPath={nextPath}
        initialMode={initialMode}
        configured={configured}
        error={sp.error}
      />
    </>
  );
}
