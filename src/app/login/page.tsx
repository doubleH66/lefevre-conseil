import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginPage } from "@/components/pages/login-page";
import { BreadcrumbJsonLd } from "@/components/seo/page-jsonld";
import { LOGIN_HREF } from "@/lib/content/routes";
import { resolvePortalDestination } from "@/lib/portal/resolve-portal-destination";
import { sanitizeInternalPath } from "@/lib/sanitize-internal-path";
import { createClient } from "@/lib/supabase/server";
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

  if (configured) {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle();
        const role = profile?.role === "admin" ? "admin" : "client";
        redirect(resolvePortalDestination(role, nextPath));
      }
    } catch {
      /* Supabase indisponible : afficher la page login */
    }
  }

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
