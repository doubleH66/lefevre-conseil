"use client";

import * as React from "react";
import {
  AdminBtn,
  AdminDetailRow,
  AdminModal,
  adminFieldClass,
  adminSelectClass,
} from "@/components/portal/admin/admin-ui";
import { StatusBadge } from "@/components/portal/StatusBadge";
import { profileTypeLabel } from "@/lib/mutuelle/labels-map";
import type { MutuelleLeadStatus, PortalMutuelleLead } from "@/components/portal/types";

const STATUS_OPTIONS: MutuelleLeadStatus[] = ["Reçue", "En cours", "Traitée", "Archivée"];

function displayStatus(status: MutuelleLeadStatus): string {
  return status === "draft" ? "Brouillon" : status;
}

export function AdminMutuelleLeadDetailModal({
  open,
  lead,
  onClose,
  onUpdateStatus,
}: {
  open: boolean;
  lead: PortalMutuelleLead | null;
  onClose: () => void;
  onUpdateStatus: (status: MutuelleLeadStatus, adminNotes?: string) => Promise<void>;
}) {
  const [status, setStatus] = React.useState<MutuelleLeadStatus>("Reçue");
  const [notes, setNotes] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (lead) {
      setStatus(lead.status === "draft" ? "Reçue" : lead.status);
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
      subtitle="Demande simulateur mutuelle"
      size="lg"
      footer={
        <div className="flex justify-end gap-2">
          <AdminBtn variant="secondary" onClick={onClose}>
            Fermer
          </AdminBtn>
          {lead.status !== "draft" ? (
            <AdminBtn variant="primary" onClick={() => void save()} disabled={saving}>
              {saving ? "Enregistrement…" : "Enregistrer"}
            </AdminBtn>
          ) : null}
        </div>
      }
    >
      <div className="space-y-1">
        <AdminDetailRow label="Statut">
          <StatusBadge status={displayStatus(lead.status)} />
        </AdminDetailRow>
        <AdminDetailRow label="E-mail">{lead.email}</AdminDetailRow>
        {lead.phone ? <AdminDetailRow label="Téléphone">{lead.phone}</AdminDetailRow> : null}
        <AdminDetailRow label="Code postal">{lead.postalCode || "—"}</AdminDetailRow>
        <AdminDetailRow label="Naissance">{lead.birthDate || "—"}</AdminDetailRow>
        <AdminDetailRow label="Profil">{profileTypeLabel(lead.profileType)}</AdminDetailRow>
        <AdminDetailRow label="Synthèse">
          <p className="text-sm text-neutral-800">{lead.summary}</p>
        </AdminDetailRow>
        {lead.sourcePage ? <AdminDetailRow label="Source">{lead.sourcePage}</AdminDetailRow> : null}
        {lead.apiStatus ? <AdminDetailRow label="API Alptis">{lead.apiStatus}</AdminDetailRow> : null}
        <AdminDetailRow label="Reçue le">{lead.createdAt}</AdminDetailRow>
      </div>

      {lead.status !== "draft" ? (
        <div className="mt-4 space-y-2 border-t border-neutral-100 pt-3">
          <label className="block text-xs font-medium text-neutral-600">
            Nouveau statut
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as MutuelleLeadStatus)}
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
      ) : (
        <p className="mt-4 text-sm text-amber-800">Brouillon — le prospect n&apos;a pas finalisé sa demande.</p>
      )}
    </AdminModal>
  );
}
