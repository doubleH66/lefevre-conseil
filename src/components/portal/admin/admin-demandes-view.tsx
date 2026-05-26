"use client";

import * as React from "react";
import { AdminTable } from "@/components/portal/AdminTable";
import { StatusBadge } from "@/components/portal/StatusBadge";
import { usePortal } from "@/components/portal/portal-provider";
import type { SiteLeadStatus } from "@/components/portal/types";

const STATUS_OPTIONS: SiteLeadStatus[] = ["Reçue", "En cours", "Traitée", "Archivée"];

export function AdminDemandesView() {
  const { siteLeads, demands, clients, updateSiteLeadStatus, updateDemandStatus } = usePortal();
  const [leadNotes, setLeadNotes] = React.useState<Record<string, string>>({});

  const openLeads = siteLeads.filter((l) => l.status !== "Traitée" && l.status !== "Archivée");

  return (
    <section className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold text-neutral-900">Demandes</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Prospects depuis le site ({openLeads.length} ouverte{openLeads.length > 1 ? "s" : ""}) et demandes portail client (
          {demands.filter((d) => d.status !== "Traitée").length} ouverte
          {demands.filter((d) => d.status !== "Traitée").length > 1 ? "s" : ""}).
        </p>
      </header>

      <article className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5">
        <h2 className="text-sm font-semibold text-neutral-900">Demandes site public</h2>
        {siteLeads.length === 0 ? (
          <p className="mt-3 text-sm text-neutral-500">Aucune demande reçue via le formulaire /demande.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <AdminTable
              headers={["Contact", "Type", "Date", "Statut", "Actions"]}
              rows={siteLeads.map((lead) => [
                <div key={`${lead.id}-c`} className="min-w-[160px]">
                  <p className="font-medium text-neutral-900">
                    {lead.firstName} {lead.lastName}
                  </p>
                  <p className="text-xs text-neutral-500">{lead.email}</p>
                  {lead.phone ? <p className="text-xs text-neutral-500">{lead.phone}</p> : null}
                </div>,
                <span key={`${lead.id}-t`} className="max-w-[140px] block text-sm">
                  {lead.requestType}
                </span>,
                lead.createdAt,
                <StatusBadge key={`${lead.id}-s`} status={lead.status} />,
                <div key={`${lead.id}-a`} className="flex min-w-[220px] flex-col gap-2">
                  <select
                    value={lead.status}
                    onChange={(e) =>
                      void updateSiteLeadStatus(lead.id, e.target.value as SiteLeadStatus, leadNotes[lead.id])
                    }
                    className="h-9 rounded-lg border border-neutral-200 px-2 text-xs"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <input
                    value={leadNotes[lead.id] ?? lead.adminNotes}
                    onChange={(e) => setLeadNotes((prev) => ({ ...prev, [lead.id]: e.target.value }))}
                    placeholder="Note interne…"
                    className="h-9 rounded-lg border border-neutral-200 px-2 text-xs"
                  />
                  {lead.message ? (
                    <p className="text-xs text-neutral-600 line-clamp-2">{lead.message}</p>
                  ) : null}
                </div>,
              ])}
            />
          </div>
        )}
      </article>

      <article className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5">
        <h2 className="text-sm font-semibold text-neutral-900">Demandes espace client</h2>
        {demands.length === 0 ? (
          <p className="mt-3 text-sm text-neutral-500">Aucune demande depuis le portail client.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <AdminTable
              headers={["Client", "Message", "Date", "Statut", "Action"]}
              rows={demands.map((demand) => {
                const client = clients.find((c) => c.id === demand.clientId);
                return [
                  client?.companyName ?? "-",
                  <span key={`${demand.id}-m`} className="max-w-xs truncate block">
                    {demand.content}
                  </span>,
                  demand.createdAt,
                  <StatusBadge key={`${demand.id}-s`} status={demand.status} />,
                  demand.status !== "Traitée" ? (
                    <button
                      key={`${demand.id}-b`}
                      type="button"
                      onClick={() => void updateDemandStatus(demand.id, "Traitée")}
                      className="rounded-lg border border-neutral-300 px-2 py-1 text-xs font-medium hover:bg-neutral-50"
                    >
                      Marquer traitée
                    </button>
                  ) : (
                    "—"
                  ),
                ];
              })}
            />
          </div>
        )}
      </article>
    </section>
  );
}
