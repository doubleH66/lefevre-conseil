import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LoginAccountSection } from "@/components/auth/login-account-section";
import { SubpageShell } from "@/components/layout/subpage-shell";
import { BreadcrumbJsonLd } from "@/components/seo/page-jsonld";
import { LOGIN_HREF } from "@/lib/content/routes";
import { sanitizeInternalPath } from "@/lib/sanitize-internal-path";
import { isSupabasePublicConfigured } from "@/lib/supabase/public-env";

const LOGIN_BREADCRUMBS = [
  { label: "Accueil", href: "/" },
  { label: "Compte" },
] as const;

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
      <SubpageShell breadcrumbs={[...LOGIN_BREADCRUMBS]} hideBilanCta>
        <main className="mx-auto max-w-md flex-1 px-4 py-12">
          <h1 className="text-center text-2xl font-semibold text-neutral-900">Connexion et inscription</h1>
          <p className="mt-2 text-center text-sm text-neutral-600">
            Connectez-vous avec e-mail et mot de passe, ou créez un compte depuis l’onglet inscription.
          </p>

          {!configured ? (
            <div className="mt-8 space-y-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
              <p className="font-medium">Supabase n’est pas configuré sur ce déploiement.</p>
              <p>
                Ajoutez{" "}
                <code className="rounded bg-amber-100/80 px-1 py-0.5 text-xs">NEXT_PUBLIC_SUPABASE_URL</code> et{" "}
                <code className="rounded bg-amber-100/80 px-1 py-0.5 text-xs">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>,
                puis redémarrez le serveur ou redéployez.
              </p>
            </div>
          ) : (
            <LoginAccountSection nextPath={nextPath} initialMode={initialMode} />
          )}

          {sp.error === "auth" ? (
            <p className="mt-4 text-center text-sm text-red-600">Échec de la connexion. Réessayez.</p>
          ) : null}
          {sp.error === "config" ? (
            <p className="mt-4 text-center text-sm text-red-600">Supabase n’est pas configuré.</p>
          ) : null}

          <div className="mt-10 flex justify-center">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 rounded-full border border-neutral-200/90 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 shadow-sm transition-all hover:border-[#1f2a7c]/30 hover:text-[#1f2a7c]"
            >
              <ArrowLeft
                className="h-4 w-4 shrink-0 text-neutral-400 transition-transform group-hover:-translate-x-0.5 group-hover:text-[#1f2a7c]"
                aria-hidden
              />
              Retour à l’accueil
            </Link>
          </div>
        </main>
      </SubpageShell>
    </>
  );
}
