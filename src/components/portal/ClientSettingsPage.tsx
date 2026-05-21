"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ChangePasswordForm } from "@/components/portal/ChangePasswordForm";
import { CONTACT_HREF } from "@/lib/content/routes";
import type { PortalClient } from "@/components/portal/types";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { usePortal } from "@/components/portal/portal-provider";

export function ClientSettingsPage({ client }: { client: PortalClient }) {
  const { authUser } = usePortal();
  const loginEmail = authUser?.email ?? client.email;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <section className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6">
        <h3 className="text-base font-semibold text-neutral-900">Compte de connexion</h3>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between">
            <dt className="text-neutral-500">E-mail de connexion</dt>
            <dd className="font-medium text-neutral-900">{loginEmail}</dd>
          </div>
        </dl>
        <p className="mt-3 text-xs text-neutral-500">
          Pour modifier l’adresse e-mail de connexion, contactez le cabinet (validation manuelle).
        </p>
      </section>

      <section className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6">
        <h3 className="text-base font-semibold text-neutral-900">Mot de passe</h3>
        <p className="mt-1 text-sm text-neutral-600">
          Choisissez un mot de passe d’au moins 8 caractères. Vous devrez saisir l’ancien mot de passe pour confirmer.
        </p>
        <ChangePasswordForm email={loginEmail} />
      </section>

      <section className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6">
        <h3 className="text-base font-semibold text-neutral-900">Session</h3>
        <p className="mt-1 text-sm text-neutral-600">Déconnectez-vous sur cet appareil.</p>
        <form action="/auth/signout" method="post" className="mt-4">
          <LiquidButton
            type="submit"
            variant="stable"
            plain
            className="h-10 border border-neutral-200 bg-white text-sm font-semibold text-neutral-800 hover:bg-neutral-50"
          >
            Se déconnecter
          </LiquidButton>
        </form>
      </section>

      <section className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6">
        <h3 className="text-base font-semibold text-neutral-900">Site & assistance</h3>
        <ul className="mt-4 space-y-2">
          <li>
            <Link
              href="/"
              className="group flex items-center justify-between rounded-xl border border-neutral-200 px-4 py-3 text-sm font-medium text-neutral-800 transition-colors hover:border-[#1f2a7c]/25 hover:bg-[#1f2a7c]/[0.04]"
            >
              Retour au site public
              <ArrowUpRight className="size-4 text-neutral-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </li>
          <li>
            <Link
              href={CONTACT_HREF}
              className="group flex items-center justify-between rounded-xl border border-neutral-200 px-4 py-3 text-sm font-medium text-neutral-800 transition-colors hover:border-[#1f2a7c]/25 hover:bg-[#1f2a7c]/[0.04]"
            >
              Contacter le cabinet
              <ArrowUpRight className="size-4 text-neutral-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
