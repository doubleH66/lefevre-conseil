"use client";

import * as React from "react";
import { AdminLeadDetailModal } from "@/components/portal/admin/admin-lead-detail-modal";
import { AdminMutuelleLeadDetailModal } from "@/components/portal/admin/admin-mutuelle-lead-detail-modal";
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
import { profileTypeLabel } from "@/lib/mutuelle/labels-map";
import type { PortalDemand, PortalMutuelleLead, PortalSiteLead } from "@/components/portal/types";

function mutuelleStatusLabel(lead: PortalMutuelleLead): string {
  return lead.status === "draft" ? "Brouillon" : lead.status;
}

export function AdminDemandesView() {
  const {
    siteLeads,
    mutuelleLeads,
    demands,
    clients,
    updateSiteLeadStatus,
    updateMutuelleLeadStatus,
    updateDemandStatus,
  } = usePortal();
  const [detailLead, setDetailLead] = React.useState<PortalSiteLead | null>(null);
  const [detailMutuelle, setDetailMutuelle] = React.useState<PortalMutuelleLead | null>(null);
  const [detailDemand, setDetailDemand] = React.useState<PortalDemand | null>(null);

  const submittedMutuelle = mutuelleLeads.filter((l) => l.status !== "draft");
  const openMutuelle = submittedMutuelle.filter(
    (l) => l.status !== "Traitée" && l.status !== "Archivée",
  );
  const openLeads = siteLeads.filter((l) => l.status !== "Traitée" && l.status !== "Archivée");
  const openPortal = demands.filter((d) => d.status !== "Traitée");

  return (
    <>
      <AdminPageHeader
        title="Demandes"
        description="Site public, simulateur mutuelle et portail client - cliquez sur une ligne"
      />

      <AdminStatStrip
        items={[
          { label: "Mutuelle ouvertes", value: openMutuelle.length },
          { label: "Site ouvertes", value: openLeads.length },
          { label: "Portail ouvertes", value: openPortal.length },
        ]}
      />

      <div className="mt-4 space-y-4">
        <AdminPanel title="Demandes mutuelle (simulateur)">
          {submittedMutuelle.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-neutral-500">
              Aucune demande mutuelle finalisée.
              {mutuelleLeads.some((l) => l.status === "draft")
                ? ` (${mutuelleLeads.filter((l) => l.status === "draft").length} brouillon(s) en cours)`
                : null}
            </p>
          ) : (
            <AdminDataTable
              data={submittedMutuelle}
              getRowKey={(l) => l.id}
              onRowClick={setDetailMutuelle}
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
                {
                  key: "profil",
                  header: "Profil",
                  cell: (l) => profileTypeLabel(l.profileType),
                },
                {
                  key: "synth",
                  header: "Synthèse",
                  cell: (l) => <span className="line-clamp-2 max-w-[280px] text-xs">{l.summary}</span>,
                },
                { key: "date", header: "Date", cell: (l) => l.createdAt },
                {
                  key: "status",
                  header: "Statut",
                  cell: (l) => <StatusBadge status={mutuelleStatusLabel(l)} />,
                },
              ]}
            />
          )}
        </AdminPanel>

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
                  cell: (d) => clients.find((c) => c.id === d.clientId)?.companyName ?? "-",
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

      <AdminMutuelleLeadDetailModal
        open={!!detailMutuelle}
        lead={detailMutuelle}
        onClose={() => setDetailMutuelle(null)}
        onUpdateStatus={(status, adminNotes) =>
          detailMutuelle
            ? updateMutuelleLeadStatus(detailMutuelle.id, status, adminNotes)
            : Promise.resolve()
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
          <div className="space-y-1">
            <AdminDetailRow label="Statut">
              <StatusBadge status={detailDemand.status} />
            </AdminDetailRow>
            <AdminDetailRow label="Date">{detailDemand.createdAt}</AdminDetailRow>
            <AdminDetailRow label="Message">
              <p className="whitespace-pre-wrap text-sm">{detailDemand.content}</p>
            </AdminDetailRow>
          </div>
        ) : null}
      </AdminModal>
    </>
  );
}
