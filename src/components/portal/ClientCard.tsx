import { StatusBadge } from "@/components/portal/StatusBadge";
import type { PortalClient } from "@/components/portal/types";

export function ClientCard({
  client,
  onView,
}: {
  client: PortalClient;
  onView: (id: string) => void;
}) {
  return (
    <article className="flex flex-col gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2.5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:py-2">
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-neutral-900">{client.companyName}</h3>
          <p className="truncate text-xs text-neutral-600">{client.contactName}</p>
        </div>
        <StatusBadge status={client.status} />
        <div className="flex min-w-0 flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-neutral-600 sm:ml-1">
          <span className="max-w-[11rem] truncate sm:max-w-[9rem]">{client.email}</span>
          <span className="text-neutral-300 max-sm:hidden" aria-hidden>
            |
          </span>
          <span>{client.phone}</span>
          <span className="text-neutral-300" aria-hidden>
            |
          </span>
          <span>
            Proj. {client.projectsCount} · Docs {client.pendingDocuments}
          </span>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onView(client.id)}
        className="shrink-0 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs font-semibold text-neutral-800 transition-colors hover:bg-neutral-100 sm:py-1"
      >
        Voir
      </button>
    </article>
  );
}

