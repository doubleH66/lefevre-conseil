"use client";

import * as React from "react";
import Link from "next/link";
import { BrandDialog } from "@/components/ui/brand-dialog";
import { AccountConnectedPanel } from "@/components/auth/account-connected-panel";
import { AuthPanel } from "@/components/auth/auth-panel";
import { useAccountSession } from "@/components/auth/use-account-session";
import { LOGIN_HREF } from "@/lib/content/routes";
import { sanitizeInternalPath } from "@/lib/sanitize-internal-path";
import { isSupabasePublicConfigured } from "@/lib/supabase/public-env";
import { heroCtaPrimaryCompactClassName } from "@/components/ui/hero-cta";
import { marketingCardClass } from "@/components/marketing/marketing-styles";
import { cn } from "@/lib/utils";

const DIALOG_TITLE_ID = "account-auth-dialog-title";

export type AccountAuthSheetProps = {
  open: boolean;
  onClose: () => void;
  resolveHref: (href: string) => string;
};

/** Modale Compte - session existante ou formulaire connexion / inscription. */
export function AccountAuthSheet({ open, onClose, resolveHref }: AccountAuthSheetProps) {
  const [nextPath, setNextPath] = React.useState("/espace-client");
  const [signingOut, setSigningOut] = React.useState(false);
  const { session, signOut } = useAccountSession(open);

  React.useEffect(() => {
    if (!open || typeof window === "undefined") return;
    const q = new URLSearchParams(window.location.search).get("next");
    setNextPath(sanitizeInternalPath(q, "/espace-client"));
  }, [open]);

  React.useEffect(() => {
    if (session.status === "authenticated") {
      setNextPath(session.destinationPath);
    }
  }, [session]);

  const loginFullPageHref = resolveHref(LOGIN_HREF);
  const supabaseReady = isSupabasePublicConfigured();

  const subtitle =
    session.status === "authenticated"
      ? "Vous êtes déjà connecté."
      : "Connexion ou inscription - directement ici.";

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <BrandDialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
      title="Compte"
      description={subtitle}
      titleId={DIALOG_TITLE_ID}
      backdropLabel="Fermer la fenêtre compte"
      panelClassName="md:max-h-[min(80dvh,560px)]"
    >
      {!supabaseReady ? (
        <div className="space-y-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
          <p className="font-medium">Connexion indisponible sur cet environnement.</p>
          <p className="text-amber-900/90">
            Configurez <code className="rounded bg-amber-100/80 px-1 text-xs">NEXT_PUBLIC_SUPABASE_URL</code> et une
            clé publique Supabase, puis redéployez.
          </p>
          <Link
            href={loginFullPageHref}
            onClick={onClose}
            className={cn(heroCtaPrimaryCompactClassName, "inline-flex w-full items-center justify-center")}
          >
            Page compte (infos)
          </Link>
        </div>
      ) : session.status === "loading" ? (
        <p className={cn(marketingCardClass, "px-4 py-8 text-center text-sm text-[#1f2a7c]/65")}>
          Vérification de la session…
        </p>
      ) : session.status === "authenticated" ? (
        <AccountConnectedPanel
          session={session}
          embedded
          onNavigate={onClose}
          onSignOut={handleSignOut}
          signingOut={signingOut}
        />
      ) : (
        <>
          <AuthPanel nextPath={nextPath} embedded hideHeader idSuffix="-sheet" onSuccess={onClose} />
          <p className="mt-4 text-center text-xs text-[#1f2a7c]/60">
            <Link
              href={loginFullPageHref}
              onClick={onClose}
              className="font-medium text-[#1f2a7c] underline-offset-2 hover:underline"
            >
              Ouvrir la page compte
            </Link>
          </p>
        </>
      )}
    </BrandDialog>
  );
}
