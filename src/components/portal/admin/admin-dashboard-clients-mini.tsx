"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Building2, Mail, Phone } from "lucide-react";
import { AdminBtn } from "@/components/portal/admin/admin-ui";
import { StatusBadge } from "@/components/portal/StatusBadge";
import { ROUTES } from "@/lib/content/routes";
import type { PortalClient } from "@/components/portal/types";
import { cn } from "@/lib/utils";

function clientInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0] ?? ""}${parts[1]![0] ?? ""}`.toUpperCase();
}

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
    .slice(0, 6);

  return (
    <section className="overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-[0_8px_30px_rgba(31,42,124,0.05)]">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-100 bg-gradient-to-r from-[#1f2a7c]/[0.04] to-transparent px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold text-neutral-900">Clients</h2>
          <p className="text-xs text-neutral-500">Vue rapide — statut, contact et suivi</p>
        </div>
        <Link
          href={ROUTES.espaceAdminClients}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#1f2a7c] hover:underline"
        >
          Tous les clients
          <ArrowRight className="size-3.5" aria-hidden />
        </Link>
      </header>

      {featured.length === 0 ? (
        <p className="px-4 py-8 text-center text-sm text-neutral-500">Aucun client pour le moment.</p>
      ) : (
        <ul className="grid gap-px bg-neutral-100 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((client) => (
            <li key={client.id} className="bg-white">
              <article className="flex h-full flex-col p-4 transition-colors hover:bg-[#1f2a7c]/[0.02]">
                <div className="flex items-start gap-3">
                  <span
                    className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#1f2a7c] text-xs font-bold text-white"
                    aria-hidden
                  >
                    {clientInitials(client.companyName)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate text-sm font-semibold text-neutral-900">{client.companyName}</h3>
                      <StatusBadge status={client.status} />
                    </div>
                    <p className="mt-0.5 truncate text-xs text-neutral-600">{client.contactName}</p>
                  </div>
                </div>

                <dl className="mt-3 space-y-1.5 text-[11px] text-neutral-600">
                  <div className="flex items-center gap-2">
                    <Mail className="size-3 shrink-0 text-neutral-400" aria-hidden />
                    <span className="truncate">{client.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="size-3 shrink-0 text-neutral-400" aria-hidden />
                    <span>{client.phone || "—"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="size-3 shrink-0 text-neutral-400" aria-hidden />
                    <span>
                      {client.projectsCount} projet{client.projectsCount > 1 ? "s" : ""} · {client.pendingDocuments}{" "}
                      doc{client.pendingDocuments > 1 ? "s" : ""} en cours
                    </span>
                  </div>
                </dl>

                <div className="mt-3 flex items-center justify-between gap-2 border-t border-neutral-100 pt-3">
                  <span className="text-[10px] text-neutral-400">Actif {client.lastActivity}</span>
                  {onViewClient ? (
                    <AdminBtn variant="ghost" className="!px-2" onClick={() => onViewClient(client.id)}>
                      Fiche
                    </AdminBtn>
                  ) : (
                    <Link
                      href={ROUTES.espaceAdminClients}
                      className={cn(
                        "rounded-lg px-2 py-1 text-[11px] font-semibold text-[#1f2a7c] hover:bg-[#1f2a7c]/5",
                      )}
                    >
                      Ouvrir
                    </Link>
                  )}
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
