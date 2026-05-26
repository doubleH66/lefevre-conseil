"use client";

import * as React from "react";
import {
  AdminBtn,
  AdminDetailRow,
  AdminModal,
  adminFieldClass,
} from "@/components/portal/admin/admin-ui";
import { StatusBadge } from "@/components/portal/StatusBadge";
import type { InternalNote, PortalClient } from "@/components/portal/types";

export function AdminClientDetailModal({
  open,
  client,
  notes,
  onClose,
  onEdit,
  onRequestDocument,
  onAddNote,
}: {
  open: boolean;
  client: PortalClient | null;
  notes: InternalNote[];
  onClose: () => void;
  onEdit: () => void;
  onRequestDocument: () => void;
  onAddNote: (note: string) => Promise<void>;
}) {
  const [noteDraft, setNoteDraft] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (open) setNoteDraft("");
  }, [open, client?.id]);

  if (!client) return null;

  async function handleAddNote(e: React.FormEvent) {
    e.preventDefault();
    if (!noteDraft.trim()) return;
    setSaving(true);
    try {
      await onAddNote(noteDraft.trim());
      setNoteDraft("");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminModal
      open={open}
      onClose={onClose}
      title={client.companyName}
      subtitle={client.contactName}
      size="lg"
      footer={
        <div className="flex flex-wrap justify-end gap-2">
          <AdminBtn variant="secondary" onClick={onEdit}>
            Modifier
          </AdminBtn>
          <AdminBtn variant="primary" onClick={onRequestDocument}>
            Demander une pièce
          </AdminBtn>
        </div>
      }
    >
      <div className="space-y-1">
        <AdminDetailRow label="Statut">
          <StatusBadge status={client.status} />
        </AdminDetailRow>
        <AdminDetailRow label="E-mail">{client.email}</AdminDetailRow>
        {client.phone ? <AdminDetailRow label="Téléphone">{client.phone}</AdminDetailRow> : null}
        {client.address ? <AdminDetailRow label="Adresse">{client.address}</AdminDetailRow> : null}
        {client.website ? <AdminDetailRow label="Site web">{client.website}</AdminDetailRow> : null}
        <AdminDetailRow label="Pièces en attente">{client.pendingDocuments}</AdminDetailRow>
        <AdminDetailRow label="Projets">{client.projectsCount}</AdminDetailRow>
        <AdminDetailRow label="Activité">{client.lastActivity}</AdminDetailRow>
      </div>

      <div className="mt-4 border-t border-neutral-100 pt-3">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">Notes internes</p>
        {notes.length === 0 ? (
          <p className="text-xs text-neutral-500">Aucune note.</p>
        ) : (
          <ul className="mb-3 max-h-32 space-y-1.5 overflow-y-auto">
            {notes.map((n) => (
              <li key={n.id} className="rounded-lg bg-neutral-50 px-2.5 py-2 text-xs text-neutral-700">
                {n.note}
                <span className="mt-0.5 block text-[10px] text-neutral-400">{n.createdAt}</span>
              </li>
            ))}
          </ul>
        )}
        <form onSubmit={(e) => void handleAddNote(e)} className="flex gap-2">
          <input
            value={noteDraft}
            onChange={(e) => setNoteDraft(e.target.value)}
            placeholder="Nouvelle note…"
            className={adminFieldClass}
          />
          <AdminBtn type="submit" variant="primary" disabled={saving || !noteDraft.trim()}>
            {saving ? "…" : "Ajouter"}
          </AdminBtn>
        </form>
      </div>
    </AdminModal>
  );
}
