import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SupabaseConfigNotice } from "@/components/auth/supabase-config-notice";
import { LoginAccountSection } from "@/components/auth/login-account-section";
import { MarketingSubpage } from "@/components/layout/marketing-subpage";
import { MarketingPageStack } from "@/components/marketing/marketing-section";
import { marketingInnerClass, marketingPageShellClass } from "@/components/marketing/marketing-styles";
import { PAGE_HEROES } from "@/lib/content/page-heroes";
import { cn } from "@/lib/utils";
import { navGlassBlue } from "@/lib/styles/glass";

type LoginPageProps = {
  nextPath: string;
  initialMode: "login" | "register";
  configured: boolean;
  error?: string;
};

export function LoginPage({ nextPath, initialMode, configured, error }: LoginPageProps) {
  return (
    <MarketingSubpage
      hero={PAGE_HEROES.login}
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "Compte" },
      ]}
      hideBilanCta
    >
      <MarketingPageStack className={marketingPageShellClass}>
        <div className={cn(marketingInnerClass, "max-w-md")}>
          {!configured ? (
            <SupabaseConfigNotice />
          ) : (
            <LoginAccountSection nextPath={nextPath} initialMode={initialMode} />
          )}

          {error === "auth" ? (
            <p className="mt-4 text-center text-sm text-red-600">Échec de la connexion. Réessayez.</p>
          ) : null}
          {error === "config" ? (
            <p className="mt-4 text-center text-sm text-red-600">Supabase n'est pas configuré.</p>
          ) : null}

          <div className="mt-10 flex justify-center">
            <Link
              href="/"
              className={cn(
                "group inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-[background-color,box-shadow] duration-150",
                navGlassBlue,
                "hover:bg-white/[0.16] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f2a7c]/20",
              )}
            >
              <ArrowLeft
                className="size-4 shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5"
                aria-hidden
              />
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </MarketingPageStack>
    </MarketingSubpage>
  );
}
