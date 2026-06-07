"use client";

import type { PortalClient } from "@/components/portal/types";

function displayOptional(value: string): string {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : "Non renseigné";
}

type ProfileViewProps = {
  client: PortalClient;
  onEdit: () => void;
  notice?: string | null;
};

/** Fiche profil en lecture --- source de vérité : le `client` du store portail. */
export function ProfileView({ client, onEdit, notice }: ProfileViewProps) {
  const rows: { label: string; value: string; optional?: boolean }[] = [
    { label: "Entreprise", value: client.companyName },
    { label: "Contact", value: client.contactName },
    { label: "Email", value: client.email },
    { label: "Téléphone", value: displayOptional(client.phone), optional: true },
    { label: "Adresse", value: displayOptional(client.address), optional: true },
    { label: "Site web", value: displayOptional(client.website), optional: true },
  ];

  return (
    <div className="space-y-4 border-t border-neutral-100 pt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-neutral-900">Vos informations</h3>
        <button
          type="button"
          onClick={onEdit}
          className="rounded-xl bg-[#1f2a7c] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1a2468]"
        >
          Modifier mes informations
        </button>
      </div>

      {notice ? (
        <p className="text-sm text-emerald-800" role="status">
          {notice}
        </p>
      ) : null}

      <dl className="divide-y divide-neutral-100 rounded-xl border border-neutral-200 bg-neutral-50/50">
        {rows.map((row) => (
          <div key={row.label} className="grid gap-1 px-4 py-3 sm:grid-cols-[9rem_1fr] sm:gap-4">
            <dt className="text-xs font-medium uppercase tracking-wide text-neutral-500">{row.label}</dt>
            <dd
              className={
                row.optional && row.value === "Non renseigné"
                  ? "text-sm text-neutral-400"
                  : "text-sm font-medium text-neutral-900"
              }
            >
              {row.value}
            </dd>
          </div>
        ))}
      </dl>

      {client.lastActivity ? (
        <p className="text-xs text-neutral-500">Dernière mise à jour : {client.lastActivity}</p>
      ) : null}
    </div>
  );
}
