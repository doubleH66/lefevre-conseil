"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import type { AccountSession } from "@/components/auth/use-account-session";
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

  const cardClass = embedded
    ? "rounded-xl border border-emerald-200/80 bg-emerald-50/40 p-5"
    : "rounded-2xl border border-emerald-200/80 bg-emerald-50/40 p-6";

  return (
    <div className={cardClass}>
      <p className="text-sm font-semibold text-emerald-950">Déjà connecté</p>
      <p className="mt-1 text-sm text-emerald-900/85">
        Connecté en tant que <span className="font-medium text-neutral-900">{displayName}</span>
      </p>
      <p className="mt-0.5 text-xs text-neutral-600">{session.email}</p>

      <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
        <Link
          href={session.destinationPath}
          onClick={onNavigate}
          className={cn(
            "inline-flex min-h-11 flex-1 items-center justify-center rounded-xl bg-[#1f2a7c] px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#18226b]",
          )}
        >
          Accéder à {spaceLabel.toLowerCase()}
        </Link>
        <button
          type="button"
          disabled={signingOut}
          onClick={() => void onSignOut()}
          className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 text-sm font-semibold text-neutral-800 transition-colors hover:bg-neutral-50 disabled:opacity-60"
        >
          <LogOut className="size-4 shrink-0" aria-hidden />
          {signingOut ? "Déconnexion…" : "Se déconnecter"}
        </button>
      </div>
    </div>
  );
}
