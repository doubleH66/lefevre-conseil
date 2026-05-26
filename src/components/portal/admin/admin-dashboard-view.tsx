"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { AdminDocumentDetailModal } from "@/components/portal/admin/admin-document-detail-modal";
import { AdminLeadDetailModal } from "@/components/portal/admin/admin-lead-detail-modal";
import {
  AdminBtn,
  AdminDataTable,
  AdminPageHeader,
  AdminPanel,
  AdminStatStrip,
} from "@/components/portal/admin/admin-ui";
import { DocumentRequestModal } from "@/components/portal/DocumentRequestModal";
import { StatusBadge } from "@/components/portal/StatusBadge";
import { usePortal } from "@/components/portal/portal-provider";
import type { PortalDocument, PortalSiteLead } from "@/components/portal/types";

export function AdminDashboardView() {
  const {
    clients,
    projects,
    documents,
    demands,
    siteLeads,
    notifications,
    activityLog,
    selectedClientId,
    validateDocument,
    refuseDocument,
    downloadDocument,
    requestDocument,
    updateDemandStatus,
    updateSiteLeadStatus,
    markNotificationRead,
  } = usePortal();

  const [showRequestModal, setShowRequestModal] = React.useState(false);
  const [detailDoc, setDetailDoc] = React.useState<PortalDocument | null>(null);
  const [detailLead, setDetailLead] = React.useState<PortalSiteLead | null>(null);

  const stats = React.useMemo(
    () => ({
      clientsActifs: clients.filter((c) => c.status === "Actif").length,
      aDeposer: documents.filter((d) => d.status === "Demandé").length,
      aValider: documents.filter((d) => d.status === "Envoyé").length,
      aCorriger: documents.filter((d) => d.status === "À corriger").length,
      demandesOuvertes:
        demands.filter((d) => d.status !== "Traitée").length +
        siteLeads.filter((l) => l.status !== "Traitée" && l.status !== "Archivée").length,
    }),
    [clients, documents, demands, siteLeads],
  );

  const priorityDocs = documents.filter((d) => d.status === "Envoyé" || d.status === "À corriger").slice(0, 8);
  const unreadNotifications = notifications.filter((n) => !n.readAt).slice(0, 5);
  const recentLeads = siteLeads.slice(0, 5);

  return (
    <>
      <AdminPageHeader
        title="Tableau de bord"
        description="Vue d'ensemble — ouvrez une ligne pour le détail"
        actions={
          <AdminBtn variant="primary" onClick={() => setShowRequestModal(true)}>
            <Plus className="size-3.5" aria-hidden />
            Demander une pièce
          </AdminBtn>
        }
      />

      <AdminStatStrip
        items={[
          { label: "Clients actifs", value: stats.clientsActifs },
          { label: "À déposer", value: stats.aDeposer },
          { label: "À valider", value: stats.aValider },
          { label: "À corriger", value: stats.aCorriger },
          { label: "Demandes", value: stats.demandesOuvertes },
        ]}
      />

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {unreadNotifications.length > 0 ? (
          <AdminPanel title="Notifications">
            <ul className="divide-y divide-neutral-100">
              {unreadNotifications.map((n) => (
                <li key={n.id} className="flex items-center justify-between gap-2 px-3 py-2 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-neutral-900">{n.title}</p>
                    {n.body ? <p className="truncate text-xs text-neutral-500">{n.body}</p> : null}
                  </div>
                  <AdminBtn variant="ghost" onClick={() => void markNotificationRead(n.id)}>
                    Lu
                  </AdminBtn>
                </li>
              ))}
            </ul>
          </AdminPanel>
        ) : null}

        {activityLog.length > 0 ? (
          <AdminPanel title="Activité récente">
            <ul className="max-h-40 divide-y divide-neutral-100 overflow-y-auto">
              {activityLog.slice(0, 6).map((entry) => (
                <li key={entry.id} className="flex justify-between gap-2 px-3 py-2 text-xs">
                  <span className="text-neutral-700">{entry.action.replaceAll("_", " ")}</span>
                  <span className="shrink-0 text-neutral-400">{entry.createdAt}</span>
                </li>
              ))}
            </ul>
          </AdminPanel>
        ) : null}
      </div>

      <div className="mt-4 space-y-4">
        <AdminPanel title="Pièces prioritaires">
          {priorityDocs.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-neutral-500">Rien en attente.</p>
          ) : (
            <AdminDataTable
              data={priorityDocs}
              getRowKey={(d) => d.id}
              onRowClick={setDetailDoc}
              columns={[
                {
                  key: "client",
                  header: "Client",
                  cell: (d) => clients.find((c) => c.id === d.clientId)?.companyName ?? "—",
                },
                { key: "name", header: "Pièce", cell: (d) => d.name },
                { key: "status", header: "Statut", cell: (d) => <StatusBadge status={d.status} /> },
              ]}
            />
          )}
        </AdminPanel>

        {recentLeads.length > 0 ? (
          <AdminPanel title="Dernières demandes site">
            <AdminDataTable
              data={recentLeads}
              getRowKey={(l) => l.id}
              onRowClick={setDetailLead}
              columns={[
                {
                  key: "name",
                  header: "Contact",
                  cell: (l) => (
                    <span className="font-medium">
                      {l.firstName} {l.lastName}
                    </span>
                  ),
                },
                { key: "type", header: "Type", cell: (l) => l.requestType },
                { key: "status", header: "Statut", cell: (l) => <StatusBadge status={l.status} /> },
                { key: "date", header: "Date", cell: (l) => l.createdAt },
              ]}
            />
          </AdminPanel>
        ) : null}

        {demands.filter((d) => d.status !== "Traitée").length > 0 ? (
          <AdminPanel title="Demandes portail client">
            <AdminDataTable
              data={demands.filter((d) => d.status !== "Traitée").slice(0, 6)}
              getRowKey={(d) => d.id}
              columns={[
                {
                  key: "client",
                  header: "Client",
                  cell: (d) => clients.find((c) => c.id === d.clientId)?.companyName ?? "—",
                },
                {
                  key: "msg",
                  header: "Message",
                  cell: (d) => <span className="line-clamp-1 max-w-[200px]">{d.content}</span>,
                },
                { key: "status", header: "Statut", cell: (d) => <StatusBadge status={d.status} /> },
                {
                  key: "action",
                  header: "",
                  className: "text-right",
                  cell: (d) => (
                    <AdminBtn variant="ghost" onClick={() => void updateDemandStatus(d.id, "Traitée")}>
                      Traiter
                    </AdminBtn>
                  ),
                },
              ]}
            />
          </AdminPanel>
        ) : null}
      </div>

      <AdminDocumentDetailModal
        open={!!detailDoc}
        document={detailDoc}
        client={detailDoc ? clients.find((c) => c.id === detailDoc.clientId) : undefined}
        onClose={() => setDetailDoc(null)}
        onValidate={async () => detailDoc && (await validateDocument(detailDoc.id))}
        onRefuse={async (c) => detailDoc && (await refuseDocument(detailDoc.id, c))}
        onDownload={async () => detailDoc?.storagePath && (await downloadDocument(detailDoc.storagePath))}
      />

      <AdminLeadDetailModal
        open={!!detailLead}
        lead={detailLead}
        onClose={() => setDetailLead(null)}
        onUpdateStatus={(status, adminNotes) =>
          detailLead ? updateSiteLeadStatus(detailLead.id, status, adminNotes) : Promise.resolve()
        }
      />

      <DocumentRequestModal
        open={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        clients={clients}
        projects={projects}
        defaultClientId={selectedClientId}
        onSubmit={requestDocument}
      />
    </>
  );
}
