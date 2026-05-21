import { StatusBadge } from "@/components/portal/StatusBadge";
import type { PortalDocument } from "@/components/portal/types";
import type { ReactNode } from "react";

export function DocumentCard({
  document,
  actions,
}: {
  document: PortalDocument;
  actions?: ReactNode;
}) {
  return (
    <article className="rounded-2xl border border-neutral-200 bg-white p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-neutral-900">{document.name}</p>
          <p className="mt-1 text-xs text-neutral-500">
            Demandé le {document.requestedAt} - Échéance {document.dueDate}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {document.urgent ? <StatusBadge status="Urgent" /> : null}
          <StatusBadge status={document.status} />
        </div>
      </div>
      {document.comment ? <p className="mt-3 text-sm text-neutral-600">{document.comment}</p> : null}
      {actions ? <div className="mt-3 flex flex-wrap gap-2">{actions}</div> : null}
    </article>
  );
}
