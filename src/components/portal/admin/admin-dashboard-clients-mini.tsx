"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { StatusBadge } from "@/components/portal/StatusBadge";
import { ROUTES } from "@/lib/content/routes";
import type { PortalClient } from "@/components/portal/types";

export function AdminDashboardClientsMini({
  clients,
  onViewClient,
}: {
  clients: PortalClient[];
  onViewClient?: (id: string) => void;
}) {
  const featured = [...clients]
    .sort((a, b) => {
      const rank = (s: PortalClient["status"]) =>
        s === "À relancer" ? 0 : s === "En attente" ? 1 : 2;
      return rank(a.status) - rank(b.status);
    })
    .slice(0, 5);

  return (
    <section className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
      <header className="flex items-center justify-between gap-2 border-b border-neutral-100 bg-neutral-50/60 px-3 py-2">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-600">Clients</h2>
        <Link
          href={ROUTES.espaceAdminClients}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#1f2a7c] hover:underline"
        >
          Tous les clients
          <ArrowRight className="size-3.5" aria-hidden />
        </Link>
      </header>

      {featured.length === 0 ? (
        <p className="px-3 py-8 text-center text-sm text-neutral-500">Aucun client pour le moment.</p>
      ) : (
        <ul className="divide-y divide-neutral-100">
          {featured.map((client) => (
            <li
              key={client.id}
              className="flex items-center justify-between gap-3 px-3 py-2.5 text-sm"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="truncate font-medium text-neutral-900">{client.companyName}</span>
                <StatusBadge status={client.status} />
                <span className="truncate text-xs text-neutral-500 max-sm:hidden">{client.email}</span>
              </div>
              {onViewClient ? (
                <button
                  type="button"
                  onClick={() => onViewClient(client.id)}
                  className="shrink-0 rounded-lg px-2 py-1 text-xs font-semibold text-[#1f2a7c] hover:bg-[#1f2a7c]/5"
                >
                  Fiche
                </button>
              ) : (
                <Link
                  href={ROUTES.espaceAdminClients}
                  className="shrink-0 rounded-lg px-2 py-1 text-xs font-semibold text-[#1f2a7c] hover:bg-[#1f2a7c]/5"
                >
                  Ouvrir
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
