"use client";

import * as React from "react";
import { Plus, Search } from "lucide-react";
import { AdminTable } from "@/components/portal/AdminTable";
import { ClientCard } from "@/components/portal/ClientCard";
import { DocumentCard } from "@/components/portal/DocumentCard";
import { AdminPublicMediaPage } from "@/components/portal/AdminPublicMediaPage";
import { DocumentRequestModal } from "@/components/portal/DocumentRequestModal";
import { EmptyState } from "@/components/portal/EmptyState";
import { StatCard } from "@/components/portal/StatCard";
import { StatusBadge } from "@/components/portal/StatusBadge";
import { usePortal } from "@/components/portal/portal-provider";
import type { DocumentStatus } from "@/components/portal/types";
export type AdminPageKey =
  | "admin-dashboard"
  | "admin-clients"
  | "admin-documents"
  | "admin-settings";

type AdminPortalProps = {
  activePage: AdminPageKey;
};

const STATUS_FILTERS: { value: "" | DocumentStatus; label: string }[] = [
  { value: "", label: "Tous les statuts" },
  { value: "Demandé", label: "Demandé" },
  { value: "Envoyé", label: "À valider" },
  { value: "À corriger", label: "À corriger" },
  { value: "Validé", label: "Validé" },
];

export function AdminPortal({ activePage }: AdminPortalProps) {
  const {
    clients,
    projects,
    documents,
    demands,
    selectedClientId,
    setSelectedClientId,
    validateDocument,
    refuseDocument,
    downloadDocument,
    requestDocument,
    updateDemandStatus,
  } = usePortal();

  const [showRequestModal, setShowRequestModal] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"" | DocumentStatus>("");
  const [clientFilter, setClientFilter] = React.useState("");
  const [refuseById, setRefuseById] = React.useState<Record<string, string>>({});

  const selectedClient = clients.find((c) => c.id === selectedClientId) ?? clients[0] ?? null;

  const filteredDocuments = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return documents.filter((doc) => {
      if (statusFilter && doc.status !== statusFilter) return false;
      if (clientFilter && doc.clientId !== clientFilter) return false;
      if (!q) return true;
      const client = clients.find((c) => c.id === doc.clientId);
      return (
        doc.name.toLowerCase().includes(q) ||
        (client?.companyName.toLowerCase().includes(q) ?? false) ||
        (client?.contactName.toLowerCase().includes(q) ?? false)
      );
    });
  }, [clients, clientFilter, documents, search, statusFilter]);

  const stats = React.useMemo(
    () => ({
      clientsActifs: clients.filter((c) => c.status === "Actif").length,
      aDeposer: documents.filter((d) => d.status === "Demandé").length,
      aValider: documents.filter((d) => d.status === "Envoyé").length,
      aCorriger: documents.filter((d) => d.status === "À corriger").length,
      demandesOuvertes: demands.filter((d) => d.status !== "Traitée").length,
    }),
    [clients, documents, demands],
  );

  if (activePage === "admin-dashboard") {
    return (
      <>
        <section className="space-y-5">
          <header>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1f2a7c]/70">
              Administration
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-neutral-900">Tableau de bord</h1>
            <p className="mt-1 text-sm text-neutral-600">
              Suivi des pièces justificatives et des demandes clients.
            </p>
          </header>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <StatCard label="Clients actifs" value={stats.clientsActifs} />
            <StatCard label="Pièces demandées" value={stats.aDeposer} />
            <StatCard label="À valider" value={stats.aValider} />
            <StatCard label="À corriger" value={stats.aCorriger} />
            <StatCard label="Demandes ouvertes" value={stats.demandesOuvertes} />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setShowRequestModal(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#1f2a7c] px-4 py-2.5 text-sm font-semibold text-white"
            >
              <Plus className="size-4" aria-hidden />
              Demander une pièce
            </button>
          </div>

          <article className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5">
            <h2 className="text-sm font-semibold text-neutral-900">Pièces à traiter en priorité</h2>
            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              {documents
                .filter((d) => d.status === "Envoyé" || d.status === "À corriger")
                .slice(0, 6)
                .map((doc) => {
                  const client = clients.find((c) => c.id === doc.clientId);
                  return (
                    <DocumentCard
                      key={doc.id}
                      document={doc}
                      actions={
                        <p className="text-xs text-neutral-500">
                          Client : <span className="font-medium text-neutral-800">{client?.companyName}</span>
                        </p>
                      }
                    />
                  );
                })}
              {documents.filter((d) => d.status === "Envoyé" || d.status === "À corriger").length === 0 ? (
                <p className="text-sm text-neutral-500">Aucune pièce en attente de traitement.</p>
              ) : null}
            </div>
          </article>

          {demands.length > 0 ? (
            <article className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5">
              <h2 className="text-sm font-semibold text-neutral-900">Messages / demandes clients</h2>
              <div className="mt-3 overflow-x-auto">
                <AdminTable
                  headers={["Client", "Message", "Date", "Statut", "Action"]}
                  rows={demands.slice(0, 8).map((demand) => {
                    const client = clients.find((c) => c.id === demand.clientId);
                    return [
                      client?.companyName ?? "-",
                      <span key={`${demand.id}-c`} className="max-w-xs truncate block">
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
            </article>
          ) : null}
        </section>

        <RequestModal
          open={showRequestModal}
          onClose={() => setShowRequestModal(false)}
          clients={clients}
          projects={projects}
          selectedClientId={selectedClientId}
          onSubmit={requestDocument}
        />
      </>
    );
  }

  if (activePage === "admin-clients") {
    return (
      <>
        <section className="space-y-5">
          <header className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold text-neutral-900">Clients</h1>
              <p className="mt-1 text-sm text-neutral-600">{clients.length} compte(s) client</p>
            </div>
            <button
              type="button"
              onClick={() => setShowRequestModal(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#1f2a7c] px-4 py-2.5 text-sm font-semibold text-white"
            >
              <Plus className="size-4" aria-hidden />
              Demander une pièce
            </button>
          </header>

          <div className="grid gap-3 lg:grid-cols-2">
            {clients.map((client) => (
              <ClientCard
                key={client.id}
                client={client}
                onView={(id) => setSelectedClientId(id)}
              />
            ))}
          </div>

          {selectedClient ? (
            <article className="rounded-2xl border border-neutral-200 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h2 className="text-lg font-semibold text-neutral-900">{selectedClient.companyName}</h2>
                  <p className="text-sm text-neutral-600">{selectedClient.contactName}</p>
                  <p className="mt-1 text-sm text-neutral-600">{selectedClient.email}</p>
                  {selectedClient.phone ? (
                    <p className="text-sm text-neutral-600">{selectedClient.phone}</p>
                  ) : null}
                </div>
                <StatusBadge status={selectedClient.status} />
              </div>
              <p className="mt-3 text-xs text-neutral-500">
                {selectedClient.pendingDocuments} pièce(s) en attente côté client
              </p>
              <button
                type="button"
                onClick={() => {
                  setClientFilter(selectedClient.id);
                  setShowRequestModal(true);
                }}
                className="mt-4 rounded-xl border border-[#1f2a7c]/25 bg-[#1f2a7c]/5 px-4 py-2 text-sm font-semibold text-[#1f2a7c]"
              >
                Demander une pièce à ce client
              </button>
            </article>
          ) : null}
        </section>

        <RequestModal
          open={showRequestModal}
          onClose={() => setShowRequestModal(false)}
          clients={clients}
          projects={projects}
          selectedClientId={selectedClientId}
          onSubmit={requestDocument}
        />
      </>
    );
  }

  if (activePage === "admin-documents") {
    return (
      <>
        <section className="space-y-5">
          <header className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold text-neutral-900">Pièces justificatives</h1>
              <p className="mt-1 text-sm text-neutral-600">
                Validez, demandez une correction ou téléchargez les fichiers reçus.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowRequestModal(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#1f2a7c] px-4 py-2.5 text-sm font-semibold text-white"
            >
              <Plus className="size-4" aria-hidden />
              Nouvelle demande
            </button>
          </header>

          <div className="grid gap-3 lg:grid-cols-3">
            <label className="relative lg:col-span-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher…"
                className="h-11 w-full rounded-xl border border-neutral-200 pl-10 pr-3 text-sm outline-none focus:border-[#1f2a7c]/40 focus:ring-2 focus:ring-[#1f2a7c]/15"
              />
            </label>
            <select
              value={clientFilter}
              onChange={(e) => setClientFilter(e.target.value)}
              className="h-11 rounded-xl border border-neutral-200 px-3 text-sm"
            >
              <option value="">Tous les clients</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.companyName}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "" | DocumentStatus)}
              className="h-11 rounded-xl border border-neutral-200 px-3 text-sm"
            >
              {STATUS_FILTERS.map((f) => (
                <option key={f.label} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>

          {filteredDocuments.length === 0 ? (
            <EmptyState title="Aucun document" description="Modifiez les filtres ou créez une nouvelle demande de pièce." />
          ) : (
            <div className="grid gap-4 xl:grid-cols-2">
              {filteredDocuments.map((doc) => {
                const client = clients.find((c) => c.id === doc.clientId);
                const refuseComment = refuseById[doc.id] ?? "";
                return (
                  <DocumentCard
                    key={doc.id}
                    document={{
                      ...doc,
                      comment: doc.comment
                        ? `${doc.comment}${client ? ` · ${client.companyName}` : ""}`
                        : client?.companyName,
                    }}
                    actions={
                      <div className="flex w-full flex-col gap-2">
                        {doc.storagePath ? (
                          <button
                            type="button"
                            onClick={() => void downloadDocument(doc.storagePath!)}
                            className="rounded-xl border border-neutral-300 px-3 py-2 text-sm font-medium hover:bg-neutral-50"
                          >
                            Télécharger le fichier
                          </button>
                        ) : null}
                        {doc.status === "Envoyé" ? (
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => void validateDocument(doc.id)}
                              className="rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800"
                            >
                              Valider
                            </button>
                            <input
                              value={refuseComment}
                              onChange={(e) =>
                                setRefuseById((prev) => ({ ...prev, [doc.id]: e.target.value }))
                              }
                              placeholder="Motif de correction…"
                              className="min-w-[180px] flex-1 rounded-xl border border-neutral-200 px-3 py-2 text-sm"
                            />
                            <button
                              type="button"
                              onClick={() => void refuseDocument(doc.id, refuseComment)}
                              className="rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-900"
                            >
                              Demander correction
                            </button>
                          </div>
                        ) : null}
                        {doc.status === "Demandé" ? (
                          <p className="text-xs text-neutral-500">En attente du dépôt client.</p>
                        ) : null}
                      </div>
                    }
                  />
                );
              })}
            </div>
          )}
        </section>

        <RequestModal
          open={showRequestModal}
          onClose={() => setShowRequestModal(false)}
          clients={clients}
          projects={projects}
          selectedClientId={selectedClientId}
          initialClientFilter={clientFilter}
          onSubmit={requestDocument}
        />
      </>
    );
  }

  if (activePage === "admin-settings") {
    return (
      <section className="space-y-5">
        <header>
          <h1 className="text-2xl font-semibold text-neutral-900">Médias du site</h1>
          <p className="mt-1 text-sm text-neutral-600">
            Fichiers publics (images, PDF) hébergés sur Supabase — migration 007 requise.
          </p>
        </header>
        <AdminPublicMediaPage />
      </section>
    );
  }

  return null;
}

function RequestModal({
  open,
  onClose,
  clients,
  projects,
  selectedClientId,
  initialClientFilter,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  clients: { id: string; companyName: string }[];
  projects: { id: string; name: string; clientId: string }[];
  selectedClientId: string;
  initialClientFilter?: string;
  onSubmit: Parameters<typeof DocumentRequestModal>[0]["onSubmit"];
}) {
  return (
    <DocumentRequestModal
      open={open}
      onClose={onClose}
      clients={clients}
      projects={projects}
      defaultClientId={initialClientFilter || selectedClientId}
      onSubmit={onSubmit}
    />
  );
}
