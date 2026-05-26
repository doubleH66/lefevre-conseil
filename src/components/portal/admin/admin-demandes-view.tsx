"use client";

import * as React from "react";
import { AdminLeadDetailModal } from "@/components/portal/admin/admin-lead-detail-modal";
import {
  AdminBtn,
  AdminDataTable,
  AdminModal,
  AdminDetailRow,
  AdminPageHeader,
  AdminPanel,
  AdminStatStrip,
} from "@/components/portal/admin/admin-ui";
import { StatusBadge } from "@/components/portal/StatusBadge";
import { usePortal } from "@/components/portal/portal-provider";
import type { PortalDemand, PortalSiteLead } from "@/components/portal/types";

export function AdminDemandesView() {
  const { siteLeads, demands, clients, updateSiteLeadStatus, updateDemandStatus } = usePortal();
  const [detailLead, setDetailLead] = React.useState<PortalSiteLead | null>(null);
  const [detailDemand, setDetailDemand] = React.useState<PortalDemand | null>(null);

  const openLeads = siteLeads.filter((l) => l.status !== "Traitée" && l.status !== "Archivée");
  const openPortal = demands.filter((d) => d.status !== "Traitée");

  return (
    <>
      <AdminPageHeader
        title="Demandes"
        description="Site public et portail client — cliquez sur une ligne"
      />

      <AdminStatStrip
        items={[
          { label: "Site ouvertes", value: openLeads.length },
          { label: "Portail ouvertes", value: openPortal.length },
        ]}
      />

      <div className="mt-4 space-y-4">
        <AdminPanel title="Demandes site (/demande, contact…)">
          {siteLeads.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-neutral-500">Aucune demande site.</p>
          ) : (
            <AdminDataTable
              data={siteLeads}
              getRowKey={(l) => l.id}
              onRowClick={setDetailLead}
              columns={[
                {
                  key: "contact",
                  header: "Contact",
                  cell: (l) => (
                    <div>
                      <p className="font-medium text-neutral-900">
                        {l.firstName} {l.lastName}
                      </p>
                      <p className="text-xs text-neutral-500">{l.email}</p>
                    </div>
                  ),
                },
                { key: "type", header: "Type", cell: (l) => l.requestType },
                { key: "date", header: "Date", cell: (l) => l.createdAt },
                { key: "status", header: "Statut", cell: (l) => <StatusBadge status={l.status} /> },
              ]}
            />
          )}
        </AdminPanel>

        <AdminPanel title="Demandes espace client">
          {demands.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-neutral-500">Aucune demande portail.</p>
          ) : (
            <AdminDataTable
              data={demands}
              getRowKey={(d) => d.id}
              onRowClick={setDetailDemand}
              columns={[
                {
                  key: "client",
                  header: "Client",
                  cell: (d) => clients.find((c) => c.id === d.clientId)?.companyName ?? "—",
                },
                {
                  key: "msg",
                  header: "Message",
                  cell: (d) => <span className="line-clamp-1 max-w-[240px]">{d.content}</span>,
                },
                { key: "date", header: "Date", cell: (d) => d.createdAt },
                { key: "status", header: "Statut", cell: (d) => <StatusBadge status={d.status} /> },
              ]}
            />
          )}
        </AdminPanel>
      </div>

      <AdminLeadDetailModal
        open={!!detailLead}
        lead={detailLead}
        onClose={() => setDetailLead(null)}
        onUpdateStatus={(status, adminNotes) =>
          detailLead ? updateSiteLeadStatus(detailLead.id, status, adminNotes) : Promise.resolve()
        }
      />

      <AdminModal
        open={!!detailDemand}
        onClose={() => setDetailDemand(null)}
        title="Demande portail"
        subtitle={detailDemand ? clients.find((c) => c.id === detailDemand.clientId)?.companyName : undefined}
        footer={
          detailDemand && detailDemand.status !== "Traitée" ? (
            <div className="flex justify-end">
              <AdminBtn
                variant="primary"
                onClick={() => {
                  void updateDemandStatus(detailDemand.id, "Traitée").then(() => setDetailDemand(null));
                }}
              >
                Marquer comme traitée
              </AdminBtn>
            </div>
          ) : null
        }
      >
        {detailDemand ? (
          <>
            <AdminDetailRow label="Statut">
              <StatusBadge status={detailDemand.status} />
            </AdminDetailRow>
            <AdminDetailRow label="Date">{detailDemand.createdAt}</AdminDetailRow>
            <AdminDetailRow label="Message">
              <p className="whitespace-pre-wrap text-sm">{detailDemand.content}</p>
            </AdminDetailRow>
          </>
        ) : null}
      </AdminModal>
    </>
  );
}
