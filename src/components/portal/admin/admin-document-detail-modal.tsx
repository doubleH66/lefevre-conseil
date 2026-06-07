"use client";

import * as React from "react";
import { AdminBtn, AdminDetailRow, AdminModal, adminFieldClass } from "@/components/portal/admin/admin-ui";
import { StatusBadge } from "@/components/portal/StatusBadge";
import type { PortalClient, PortalDocument } from "@/components/portal/types";

export function AdminDocumentDetailModal({
  open,
  document,
  client,
  onClose,
  onValidate,
  onRefuse,
  onDownload,
}: {
  open: boolean;
  document: PortalDocument | null;
  client: PortalClient | undefined;
  onClose: () => void;
  onValidate: () => Promise<void>;
  onRefuse: (comment: string) => Promise<void>;
  onDownload: () => Promise<void>;
}) {
  const [refuseComment, setRefuseComment] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    if (open) setRefuseComment("");
  }, [open, document?.id]);

  if (!document) return null;

  async function run(action: () => Promise<void>) {
    setBusy(true);
    try {
      await action();
      onClose();
    } finally {
      setBusy(false);
    }
  }

  return (
    <AdminModal
      open={open}
      onClose={onClose}
      title={document.name}
      subtitle={client?.companyName ?? "Client"}
      size="md"
      footer={
        <div className="flex flex-wrap justify-end gap-2">
          {document.storagePath ? (
            <AdminBtn variant="secondary" disabled={busy} onClick={() => void run(onDownload)}>
              Télécharger
            </AdminBtn>
          ) : null}
          {document.status === "Envoyé" ? (
            <>
              <AdminBtn variant="secondary" disabled={busy} onClick={() => void run(onValidate)}>
                Valider
              </AdminBtn>
              <AdminBtn
                variant="primary"
                disabled={busy}
                onClick={() => void run(() => onRefuse(refuseComment || "Merci de corriger et renvoyer."))}
              >
                Demander correction
              </AdminBtn>
            </>
          ) : null}
        </div>
      }
    >
      <div className="space-y-1">
        <AdminDetailRow label="Statut">
          <StatusBadge status={document.status} />
        </AdminDetailRow>
        <AdminDetailRow label="Client">{client?.companyName ?? "-"}</AdminDetailRow>
        <AdminDetailRow label="Demandé le">{document.requestedAt}</AdminDetailRow>
        <AdminDetailRow label="Échéance">{document.dueDate || "-"}</AdminDetailRow>
        {document.comment ? <AdminDetailRow label="Commentaire">{document.comment}</AdminDetailRow> : null}
        {document.uploadedBy ? <AdminDetailRow label="Fichier">{document.uploadedBy}</AdminDetailRow> : null}
      </div>

      {document.status === "Envoyé" ? (
        <label className="mt-3 block text-xs font-medium text-neutral-600">
          Motif de correction (optionnel)
          <input
            value={refuseComment}
            onChange={(e) => setRefuseComment(e.target.value)}
            className={`${adminFieldClass} mt-1`}
            placeholder="Précisez ce qui doit être corrigé…"
          />
        </label>
      ) : null}
    </AdminModal>
  );
}
