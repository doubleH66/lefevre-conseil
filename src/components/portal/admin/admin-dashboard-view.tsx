"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { AdminDashboardAiPanel } from "@/components/portal/admin/admin-dashboard-ai-panel";
import {
  AdminBarChart,
  AdminDashboardKpiGrid,
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
import { leadsActivityByMonth } from "@/lib/portal/dashboard-analytics";
import type { PortalDocument, PortalSiteLead } from "@/components/portal/types";

export function AdminDashboardView() {
  const {
    clients,
    projects,
    documents,
    demands,
    siteLeads,
    mutuelleLeads,
    selectedClientId,
    setSelectedClientId,
    validateDocument,
    refuseDocument,
    downloadDocument,
    requestDocument,
    updateSiteLeadStatus,
  } = usePortal();

  const [showRequestModal, setShowRequestModal] = React.useState(false);
  const [detailDoc, setDetailDoc] = React.useState<PortalDocument | null>(null);
  const [detailLead, setDetailLead] = React.useState<PortalSiteLead | null>(null);

  const stats = React.useMemo(
    () => ({
      clientsActifs: clients.filter((c) => c.status === "Actif").length,
      demandesOuvertes:
        demands.filter((d) => d.status !== "Traitée").length +
        siteLeads.filter((l) => l.status !== "Traitée" && l.status !== "Archivée").length +
        mutuelleLeads.filter(
          (l) => l.status !== "draft" && l.status !== "Traitée" && l.status !== "Archivée",
        ).length,
      aValider: documents.filter((d) => d.status === "Envoyé").length,
      aDeposer: documents.filter((d) => d.status === "Demandé").length,
    }),
    [clients, documents, demands, siteLeads, mutuelleLeads],
  );

  const activityChart = React.useMemo(
    () => leadsActivityByMonth({ clients, documents, siteLeads, mutuelleLeads, demands, activityLog: [] }),
    [clients, documents, siteLeads, mutuelleLeads, demands],
  );

  const recentLeads = siteLeads.slice(0, 5);

  return (
    <>
      <AdminPageHeader
        title="Tableau de bord"
        description="Vue d'ensemble du cabinet"
        actions={
          <AdminBtn variant="primary" onClick={() => setShowRequestModal(true)}>
            <Plus className="size-3.5" aria-hidden />
            Demander une pièce
          </AdminBtn>
        }
      />

      <AdminDashboardKpiGrid
        items={[
          { label: "Clients actifs", value: stats.clientsActifs },
          { label: "Demandes ouvertes", value: stats.demandesOuvertes },
          { label: "À valider", value: stats.aValider },
          { label: "À déposer", value: stats.aDeposer },
        ]}
      />

      <div className="mt-4">
        <AdminBarChart
          title="Activité des demandes"
          subtitle="6 derniers mois — contact, mutuelle et portail"
          data={activityChart}
        />
      </div>

      <div className="mt-4">
        <AdminDashboardAiPanel />
      </div>

      <div className="mt-4">
        <AdminDashboardClientsMini clients={clients} onViewClient={(id) => setSelectedClientId(id)} />
      </div>

      {recentLeads.length > 0 ? (
        <div className="mt-4">
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
        </div>
      ) : null}

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
