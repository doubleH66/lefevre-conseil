"use client";

import * as React from "react";
import {
  ClipboardCheck,
  FileWarning,
  Inbox,
  Plus,
  TrendingUp,
  Users,
} from "lucide-react";
import { AdminDashboardAiPanel } from "@/components/portal/admin/admin-dashboard-ai-panel";
import {
  AdminBarChart,
  AdminDashboardKpiGrid,
  AdminDonutChart,
} from "@/components/portal/admin/admin-dashboard-charts";
import { AdminDashboardClientsMini } from "@/components/portal/admin/admin-dashboard-clients-mini";
import { AdminDocumentDetailModal } from "@/components/portal/admin/admin-document-detail-modal";
import { AdminLeadDetailModal } from "@/components/portal/admin/admin-lead-detail-modal";
import {
  AdminBtn,
  AdminDataTable,
  AdminPageHeader,
  AdminPanel,
} from "@/components/portal/admin/admin-ui";
import { DocumentRequestModal } from "@/components/portal/DocumentRequestModal";
import { StatusBadge } from "@/components/portal/StatusBadge";
import { usePortal } from "@/components/portal/portal-provider";
import {
  clientStatusBreakdown,
  leadsActivityByMonth,
  pipelineBreakdown,
} from "@/lib/portal/dashboard-analytics";
import type { PortalDocument, PortalSiteLead } from "@/components/portal/types";

export function AdminDashboardView() {
  const {
    clients,
    projects,
    documents,
    demands,
    siteLeads,
    mutuelleLeads,
    notifications,
    activityLog,
    selectedClientId,
    setSelectedClientId,
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

  const analyticsInput = React.useMemo(
    () => ({
      clients,
      documents,
      siteLeads,
      mutuelleLeads,
      demands,
      activityLog,
    }),
    [clients, documents, siteLeads, mutuelleLeads, demands, activityLog],
  );

  const stats = React.useMemo(
    () => ({
      clientsActifs: clients.filter((c) => c.status === "Actif").length,
      aDeposer: documents.filter((d) => d.status === "Demandé").length,
      aValider: documents.filter((d) => d.status === "Envoyé").length,
      aCorriger: documents.filter((d) => d.status === "À corriger").length,
      demandesOuvertes:
        demands.filter((d) => d.status !== "Traitée").length +
        siteLeads.filter((l) => l.status !== "Traitée" && l.status !== "Archivée").length +
        mutuelleLeads.filter(
          (l) => l.status !== "draft" && l.status !== "Traitée" && l.status !== "Archivée",
        ).length,
    }),
    [clients, documents, demands, siteLeads, mutuelleLeads],
  );

  const activityChart = React.useMemo(() => leadsActivityByMonth(analyticsInput), [analyticsInput]);
  const pipelineChart = React.useMemo(() => pipelineBreakdown(analyticsInput), [analyticsInput]);
  const clientsChart = React.useMemo(() => clientStatusBreakdown(clients), [clients]);

  const priorityDocs = documents.filter((d) => d.status === "Envoyé" || d.status === "À corriger").slice(0, 6);
  const unreadNotifications = notifications.filter((n) => !n.readAt).slice(0, 5);
  const recentLeads = siteLeads.slice(0, 5);

  return (
    <>
      <AdminPageHeader
        title="Tableau de bord"
        description="Analytics, clients et priorités du cabinet"
        actions={
          <AdminBtn variant="primary" onClick={() => setShowRequestModal(true)}>
            <Plus className="size-3.5" aria-hidden />
            Demander une pièce
          </AdminBtn>
        }
      />

      <AdminDashboardKpiGrid
        items={[
          {
            label: "Clients actifs",
            value: stats.clientsActifs,
            hint: `${clients.length} au total`,
            icon: Users,
            accent: "#1f2a7c",
          },
          {
            label: "Demandes ouvertes",
            value: stats.demandesOuvertes,
            hint: "Site, mutuelle, portail",
            icon: Inbox,
            accent: "#2d3a9e",
          },
          {
            label: "À valider",
            value: stats.aValider,
            hint: "Pièces reçues",
            icon: ClipboardCheck,
            accent: "#4a5bc4",
          },
          {
            label: "À déposer",
            value: stats.aDeposer,
            hint: "En attente client",
            icon: FileWarning,
            accent: "#6b7ad6",
          },
          {
            label: "À corriger",
            value: stats.aCorriger,
            hint: "Relances documents",
            icon: TrendingUp,
            accent: "#8b96e0",
          },
        ]}
      />

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <AdminBarChart
          className="lg:col-span-2"
          title="Activité des demandes"
          subtitle="6 derniers mois — contact, mutuelle et portail"
          data={activityChart}
        />
        <AdminDonutChart
          title="Pipeline en cours"
          subtitle="Répartition des dossiers à traiter"
          data={pipelineChart}
        />
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <AdminDashboardAiPanel />
          <AdminDashboardClientsMini
            clients={clients}
            onViewClient={(id) => setSelectedClientId(id)}
          />
        </div>

        <div className="space-y-4">
          {clientsChart.length > 0 ? (
            <AdminDonutChart
              title="Répartition clients"
              subtitle="Par statut de suivi"
              data={clientsChart}
            />
          ) : null}

          {unreadNotifications.length > 0 ? (
            <AdminPanel title="Notifications">
              <ul className="divide-y divide-neutral-100">
                {unreadNotifications.map((n) => (
                  <li key={n.id} className="flex items-center justify-between gap-2 px-3 py-2.5 text-sm">
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
              <ul className="max-h-48 divide-y divide-neutral-100 overflow-y-auto">
                {activityLog.slice(0, 8).map((entry) => (
                  <li key={entry.id} className="flex justify-between gap-2 px-3 py-2 text-xs">
                    <span className="text-neutral-700">{entry.action.replaceAll("_", " ")}</span>
                    <span className="shrink-0 text-neutral-400">{entry.createdAt}</span>
                  </li>
                ))}
              </ul>
            </AdminPanel>
          ) : null}
        </div>
      </div>

      <div className="mt-5 space-y-4">
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
                  cell: (d) => clients.find((c) => c.id === d.clientId)?.companyName ?? "-",
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
      </div>

      <AdminDocumentDetailModal
        open={!!detailDoc}
        document={detailDoc}
        client={detailDoc ? clients.find((c) => c.id === detailDoc.clientId) : undefined}
        onClose={() => setDetailDoc(null)}
        onValidate={async () => {
          if (detailDoc) await validateDocument(detailDoc.id);
        }}
        onRefuse={async (c) => {
          if (detailDoc) await refuseDocument(detailDoc.id, c);
        }}
        onDownload={async () => {
          if (detailDoc?.storagePath) await downloadDocument(detailDoc.storagePath);
        }}
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
