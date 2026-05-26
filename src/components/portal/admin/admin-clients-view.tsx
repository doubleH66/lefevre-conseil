"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { AdminClientDetailModal } from "@/components/portal/admin/admin-client-detail-modal";
import { ClientFormModal } from "@/components/portal/admin/client-form-modal";
import {
  AdminBtn,
  AdminDataTable,
  AdminPageHeader,
  AdminPanel,
  AdminSearchInput,
  AdminToolbar,
} from "@/components/portal/admin/admin-ui";
import { DocumentRequestModal } from "@/components/portal/DocumentRequestModal";
import { StatusBadge } from "@/components/portal/StatusBadge";
import { usePortal } from "@/components/portal/portal-provider";
import type { PortalClient } from "@/components/portal/types";

export function AdminClientsView() {
  const {
    clients,
    projects,
    internalNotes,
    selectedClientId,
    setSelectedClientId,
    createClientAccount,
    updateClientAccount,
    addInternalNote,
    requestDocument,
  } = usePortal();

  const [search, setSearch] = React.useState("");
  const [detailClient, setDetailClient] = React.useState<PortalClient | null>(null);
  const [showClientModal, setShowClientModal] = React.useState(false);
  const [editingClientId, setEditingClientId] = React.useState<string | null>(null);
  const [showRequestModal, setShowRequestModal] = React.useState(false);
  const [requestClientId, setRequestClientId] = React.useState("");

  const editingClient = editingClientId ? clients.find((c) => c.id === editingClientId) : null;

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter(
      (c) =>
        c.companyName.toLowerCase().includes(q) ||
        c.contactName.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q),
    );
  }, [clients, search]);

  const clientNotes = detailClient
    ? internalNotes.filter((n) => n.clientId === detailClient.id)
    : [];

  return (
    <>
      <AdminPageHeader
        title="Clients"
        description={`${clients.length} compte(s) — cliquez sur une ligne pour la fiche`}
        actions={
          <>
            <AdminBtn
              variant="secondary"
              onClick={() => {
                setEditingClientId(null);
                setShowClientModal(true);
              }}
            >
              <Plus className="size-3.5" aria-hidden />
              Nouveau
            </AdminBtn>
            <AdminBtn
              variant="primary"
              onClick={() => {
                setRequestClientId(selectedClientId || clients[0]?.id || "");
                setShowRequestModal(true);
              }}
            >
              Demander une pièce
            </AdminBtn>
          </>
        }
      />

      <AdminToolbar>
        <AdminSearchInput value={search} onChange={setSearch} placeholder="Rechercher un client…" />
      </AdminToolbar>

      <AdminPanel>
        <AdminDataTable
          data={filtered}
          getRowKey={(c) => c.id}
          onRowClick={(c) => {
            setSelectedClientId(c.id);
            setDetailClient(c);
          }}
          emptyMessage="Aucun client."
          columns={[
            {
              key: "company",
              header: "Raison sociale",
              cell: (c) => <span className="font-medium text-neutral-900">{c.companyName}</span>,
            },
            {
              key: "contact",
              header: "Contact",
              cell: (c) => c.contactName,
            },
            {
              key: "email",
              header: "E-mail",
              cell: (c) => <span className="text-xs">{c.email}</span>,
            },
            {
              key: "status",
              header: "Statut",
              cell: (c) => <StatusBadge status={c.status} />,
            },
            {
              key: "pending",
              header: "Pièces",
              className: "text-right",
              cell: (c) => (
                <span className="tabular-nums">{c.pendingDocuments > 0 ? c.pendingDocuments : "—"}</span>
              ),
            },
          ]}
        />
      </AdminPanel>

      <AdminClientDetailModal
        open={!!detailClient}
        client={detailClient}
        notes={clientNotes}
        onClose={() => setDetailClient(null)}
        onEdit={() => {
          if (!detailClient) return;
          setEditingClientId(detailClient.id);
          setShowClientModal(true);
        }}
        onRequestDocument={() => {
          if (!detailClient) return;
          setRequestClientId(detailClient.id);
          setShowRequestModal(true);
        }}
        onAddNote={async (note) => {
          if (!detailClient) return;
          await addInternalNote(detailClient.id, note);
        }}
      />

      <ClientFormModal
        open={showClientModal}
        onClose={() => {
          setShowClientModal(false);
          setEditingClientId(null);
        }}
        initial={
          editingClient
            ? {
                clientId: editingClient.id,
                companyName: editingClient.companyName,
                contactName: editingClient.contactName,
                email: editingClient.email,
                phone: editingClient.phone,
                address: editingClient.address,
                website: editingClient.website,
                status: editingClient.status,
              }
            : undefined
        }
        onSubmit={async (payload) => {
          if (payload.clientId) {
            await updateClientAccount({ ...payload, clientId: payload.clientId });
          } else {
            await createClientAccount(payload);
          }
        }}
      />

      <DocumentRequestModal
        open={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        clients={clients}
        projects={projects}
        defaultClientId={requestClientId || selectedClientId}
        onSubmit={requestDocument}
      />
    </>
  );
}
