"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import type { AccountSession } from "@/components/auth/use-account-session";
import { marketingCardClass, marketingKickerClass } from "@/components/marketing/marketing-styles";
import { heroCtaPrimaryCompactClassName } from "@/components/ui/hero-cta";
import { navGlassBlue } from "@/lib/styles/glass";
import { cn } from "@/lib/utils";

export function AccountConnectedPanel({
  session,
  embedded,
  onNavigate,
  onSignOut,
  signingOut,
}: {
  session: Extract<AccountSession, { status: "authenticated" }>;
  embedded?: boolean;
  onNavigate?: () => void;
  onSignOut: () => void | Promise<void>;
  signingOut?: boolean;
}) {
  const displayName = session.fullName || session.email.split("@")[0] || "Compte";
  const spaceLabel = session.role === "admin" ? "Espace administration" : "Espace client";

  return (
    <section className={cn(marketingCardClass, "overflow-hidden", embedded && "shadow-none")}>
      <div className="border-b border-emerald-200/60 bg-emerald-50/50 px-6 py-5 sm:px-8">
        <p className={marketingKickerClass}>Session active</p>
        <p className="mt-2 text-lg font-semibold tracking-tight text-emerald-950">Déjà connecté</p>
        <p className="mt-1 text-sm text-emerald-900/85">
          Connecté en tant que <span className="font-medium text-[#1f2a7c]">{displayName}</span>
        </p>
        <p className="mt-0.5 text-xs text-[#1f2a7c]/55">{session.email}</p>
      </div>

      <div className="flex flex-col gap-3 px-6 py-6 sm:flex-row sm:px-8">
        <Link
          href={session.destinationPath}
          onClick={onNavigate}
          className={cn(
            heroCtaPrimaryCompactClassName,
            "inline-flex flex-1 items-center justify-center !w-full sm:!min-w-0",
          )}
        >
          Accéder à {spaceLabel.toLowerCase()}
        </Link>
        <button
          type="button"
          disabled={signingOut}
          onClick={() => void onSignOut()}
          className={cn(
            "inline-flex h-11 min-h-11 flex-1 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition-[background-color,box-shadow] duration-150 disabled:opacity-60",
            navGlassBlue,
            "hover:bg-white/[0.16] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f2a7c]/20",
          )}
        >
          <LogOut className="size-4 shrink-0" aria-hidden />
          {signingOut ? "Déconnexion…" : "Se déconnecter"}
        </button>
      </div>
    </section>
  );
}
