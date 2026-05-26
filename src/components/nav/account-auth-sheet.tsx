"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { User, X } from "lucide-react";
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

/**
 * Tiroir / modale Compte : session existante → déjà connecté + déconnexion ;
 * sinon formulaire connexion / inscription inline.
 */
export function AccountAuthSheet({ open, onClose, resolveHref }: AccountAuthSheetProps) {
  const [mounted, setMounted] = React.useState(false);
  const [mdUp, setMdUp] = React.useState(false);
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

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setMdUp(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  const loginFullPageHref = resolveHref(LOGIN_HREF);
  const supabaseReady = isSupabasePublicConfigured();

  const subtitle =
    session.status === "authenticated"
      ? "Vous êtes déjà connecté."
      : "Connexion ou inscription — directement ici.";

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
    } finally {
      setSigningOut(false);
    }
  };

  const modal = (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="account-auth-dialog-shell"
          className="fixed inset-0 z-[200] flex items-end justify-center md:items-center md:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            className="absolute inset-0 bg-neutral-950/45 backdrop-blur-[2px]"
            aria-label="Fermer la fenêtre compte"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={DIALOG_TITLE_ID}
            className={cn(
              "relative z-10 flex w-full max-w-lg flex-col overflow-y-auto bg-white shadow-2xl outline-none",
              "max-h-[min(88dvh,640px)] rounded-t-[1.35rem] border border-[#1f2a7c]/10 p-6 pb-[max(1.25rem,env(safe-area-inset-bottom))]",
              "md:max-h-[min(80dvh,560px)] md:rounded-2xl md:p-7 md:pb-7",
            )}
            initial={mdUp ? { opacity: 0, scale: 0.96, y: 0 } : { opacity: 1, y: "100%" }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={mdUp ? { opacity: 0, scale: 0.96, y: 0 } : { opacity: 1, y: "100%" }}
            transition={{ type: "tween", duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mx-auto mb-3 h-1 w-10 shrink-0 rounded-full bg-neutral-300 md:hidden" aria-hidden />
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#1f2a7c]/[0.08] text-[#1f2a7c]">
                  <User className="size-5" aria-hidden />
                </span>
                <div className="min-w-0">
                  <h2 id={DIALOG_TITLE_ID} className="text-base font-semibold tracking-tight text-[#1f2a7c]">
                    Compte
                  </h2>
                  <p className="mt-1 text-sm leading-relaxed text-[#1f2a7c]/75">{subtitle}</p>
                </div>
              </div>
              <button
                type="button"
                className="grid size-9 shrink-0 place-items-center rounded-full border border-[#1f2a7c]/15 text-[#1f2a7c] transition-colors hover:bg-[#1f2a7c]/[0.06]"
                aria-label="Fermer"
                onClick={onClose}
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>

            <div className="mt-5 min-h-0 w-full flex-1">
              {!supabaseReady ? (
                <div className="mt-2 space-y-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
                  <p className="font-medium">Connexion indisponible sur cet environnement.</p>
                  <p className="text-amber-900/90">
                    Configurez <code className="rounded bg-amber-100/80 px-1 text-xs">NEXT_PUBLIC_SUPABASE_URL</code>{" "}
                    et une clé publique Supabase, puis redéployez.
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
                <p
                  className={cn(
                    marketingCardClass,
                    "px-4 py-8 text-center text-sm text-[#1f2a7c]/65",
                  )}
                >
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
                  <AuthPanel
                    nextPath={nextPath}
                    embedded
                    hideHeader
                    idSuffix="-sheet"
                    onSuccess={onClose}
                  />
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
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );

  return mounted && typeof document !== "undefined" ? createPortal(modal, document.body) : null;
}
