"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { AdminDocumentDetailModal } from "@/components/portal/admin/admin-document-detail-modal";
import {
  AdminBtn,
  AdminDataTable,
  AdminPageHeader,
  AdminPanel,
  AdminSearchInput,
  AdminToolbar,
  adminSelectClass,
} from "@/components/portal/admin/admin-ui";
import { DocumentRequestModal } from "@/components/portal/DocumentRequestModal";
import { EmptyState } from "@/components/portal/EmptyState";
import { StatusBadge } from "@/components/portal/StatusBadge";
import { usePortal } from "@/components/portal/portal-provider";
import type { DocumentStatus, PortalDocument } from "@/components/portal/types";

const STATUS_FILTERS: { value: "" | DocumentStatus; label: string }[] = [
  { value: "", label: "Tous" },
  { value: "Demandé", label: "Demandé" },
  { value: "Envoyé", label: "À valider" },
  { value: "À corriger", label: "À corriger" },
  { value: "Validé", label: "Validé" },
];

export function AdminDocumentsView() {
  const {
    clients,
    projects,
    documents,
    selectedClientId,
    validateDocument,
    refuseDocument,
    downloadDocument,
    requestDocument,
  } = usePortal();

  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"" | DocumentStatus>("");
  const [clientFilter, setClientFilter] = React.useState("");
  const [detailDoc, setDetailDoc] = React.useState<PortalDocument | null>(null);
  const [showRequestModal, setShowRequestModal] = React.useState(false);

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return documents.filter((doc) => {
      if (statusFilter && doc.status !== statusFilter) return false;
      if (clientFilter && doc.clientId !== clientFilter) return false;
      if (!q) return true;
      const client = clients.find((c) => c.id === doc.clientId);
      return (
        doc.name.toLowerCase().includes(q) ||
        (client?.companyName.toLowerCase().includes(q) ?? false)
      );
    });
  }, [clients, clientFilter, documents, search, statusFilter]);

  const detailClient = detailDoc ? clients.find((c) => c.id === detailDoc.clientId) : undefined;

  return (
    <>
      <AdminPageHeader
        title="Pièces justificatives"
        description="Cliquez sur une ligne pour valider, corriger ou télécharger"
        actions={
          <AdminBtn variant="primary" onClick={() => setShowRequestModal(true)}>
            <Plus className="size-3.5" aria-hidden />
            Nouvelle demande
          </AdminBtn>
        }
      />

      <AdminToolbar>
        <AdminSearchInput value={search} onChange={setSearch} />
        <select
          value={clientFilter}
          onChange={(e) => setClientFilter(e.target.value)}
          className={adminSelectClass}
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
          className={adminSelectClass}
        >
          {STATUS_FILTERS.map((f) => (
            <option key={f.label} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </AdminToolbar>

      {filtered.length === 0 ? (
        <EmptyState title="Aucun document" description="Modifiez les filtres ou créez une demande." />
      ) : (
        <AdminPanel>
          <AdminDataTable
            data={filtered}
            getRowKey={(d) => d.id}
            onRowClick={setDetailDoc}
            columns={[
              {
                key: "client",
                header: "Client",
                cell: (d) => clients.find((c) => c.id === d.clientId)?.companyName ?? "—",
              },
              { key: "name", header: "Pièce", cell: (d) => <span className="font-medium">{d.name}</span> },
              { key: "status", header: "Statut", cell: (d) => <StatusBadge status={d.status} /> },
              { key: "due", header: "Échéance", cell: (d) => d.dueDate || "—" },
              {
                key: "file",
                header: "Fichier",
                className: "text-right",
                cell: (d) => (d.storagePath ? "Reçu" : "—"),
              },
            ]}
          />
        </AdminPanel>
      )}

      <AdminDocumentDetailModal
        open={!!detailDoc}
        document={detailDoc}
        client={detailClient}
        onClose={() => setDetailDoc(null)}
        onValidate={async () => {
          if (!detailDoc) return;
          await validateDocument(detailDoc.id);
        }}
        onRefuse={async (comment) => {
          if (!detailDoc) return;
          await refuseDocument(detailDoc.id, comment);
        }}
        onDownload={async () => {
          if (!detailDoc?.storagePath) return;
          await downloadDocument(detailDoc.storagePath);
        }}
      />

      <DocumentRequestModal
        open={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        clients={clients}
        projects={projects}
        defaultClientId={clientFilter || selectedClientId}
        onSubmit={requestDocument}
      />
    </>
  );
}
