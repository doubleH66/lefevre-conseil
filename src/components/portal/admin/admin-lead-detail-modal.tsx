"use client";

import * as React from "react";
import { AdminBtn, AdminDetailRow, AdminModal, adminFieldClass, adminSelectClass } from "@/components/portal/admin/admin-ui";
import { StatusBadge } from "@/components/portal/StatusBadge";
import type { PortalSiteLead, SiteLeadStatus } from "@/components/portal/types";

const STATUS_OPTIONS: SiteLeadStatus[] = ["Reçue", "En cours", "Traitée", "Archivée"];

export function AdminLeadDetailModal({
  open,
  lead,
  onClose,
  onUpdateStatus,
}: {
  open: boolean;
  lead: PortalSiteLead | null;
  onClose: () => void;
  onUpdateStatus: (status: SiteLeadStatus, adminNotes?: string) => Promise<void>;
}) {
  const [status, setStatus] = React.useState<SiteLeadStatus>("Reçue");
  const [notes, setNotes] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (lead) {
      setStatus(lead.status);
      setNotes(lead.adminNotes);
    }
  }, [lead]);

  if (!lead) return null;

  async function save() {
    setSaving(true);
    try {
      await onUpdateStatus(status, notes);
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminModal
      open={open}
      onClose={onClose}
      title={`${lead.firstName} ${lead.lastName}`}
      subtitle="Demande site public"
      size="lg"
      footer={
        <div className="flex justify-end gap-2">
          <AdminBtn variant="secondary" onClick={onClose}>
            Fermer
          </AdminBtn>
          <AdminBtn variant="primary" onClick={() => void save()} disabled={saving}>
            {saving ? "Enregistrement…" : "Enregistrer"}
          </AdminBtn>
        </div>
      }
    >
      <div className="space-y-1">
        <AdminDetailRow label="Statut">
          <StatusBadge status={lead.status} />
        </AdminDetailRow>
        <AdminDetailRow label="E-mail">{lead.email}</AdminDetailRow>
        {lead.phone ? <AdminDetailRow label="Téléphone">{lead.phone}</AdminDetailRow> : null}
        <AdminDetailRow label="Type">{lead.requestType}</AdminDetailRow>
        {lead.currentSituation ? (
          <AdminDetailRow label="Situation">{lead.currentSituation}</AdminDetailRow>
        ) : null}
        {lead.patrimonialGoal ? <AdminDetailRow label="Objectif">{lead.patrimonialGoal}</AdminDetailRow> : null}
        {lead.approximateAmount ? (
          <AdminDetailRow label="Montant">{lead.approximateAmount}</AdminDetailRow>
        ) : null}
        <AdminDetailRow label="Contact">{lead.contactPreference}</AdminDetailRow>
        <AdminDetailRow label="Reçue le">{lead.createdAt}</AdminDetailRow>
        {lead.message ? (
          <AdminDetailRow label="Message">
            <p className="whitespace-pre-wrap text-sm">{lead.message}</p>
          </AdminDetailRow>
        ) : null}
      </div>

      <div className="mt-4 space-y-2 border-t border-neutral-100 pt-3">
        <label className="block text-xs font-medium text-neutral-600">
          Nouveau statut
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as SiteLeadStatus)}
            className={`${adminSelectClass} mt-1 w-full`}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-xs font-medium text-neutral-600">
          Note interne
          <input value={notes} onChange={(e) => setNotes(e.target.value)} className={`${adminFieldClass} mt-1`} />
        </label>
      </div>
    </AdminModal>
  );
}
