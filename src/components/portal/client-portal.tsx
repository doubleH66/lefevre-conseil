"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { DocumentCard } from "@/components/portal/DocumentCard";
import { ClientProfileForm } from "@/components/portal/ClientProfileForm";
import { ClientSettingsPage } from "@/components/portal/ClientSettingsPage";
import { EmptyState } from "@/components/portal/EmptyState";
import { StatCard } from "@/components/portal/StatCard";
import { UploadZone } from "@/components/portal/UploadZone";
import { usePortal } from "@/components/portal/portal-provider";
import type { PortalDocument } from "@/components/portal/types";
import { CONTACT_HREF } from "@/lib/content/routes";
import { cn } from "@/lib/utils";

export type ClientPageKey = "client-documents" | "client-profile" | "client-settings";

type DocumentsTab = "overview" | "upload" | "review" | "validated";

const UPLOADABLE: PortalDocument["status"][] = ["Demandé", "À corriger", "Refusé"];

const TABS: { id: DocumentsTab; label: string; badgeKey?: "upload" | "review" }[] = [
  { id: "overview", label: "Vue d'ensemble" },
  { id: "upload", label: "À déposer", badgeKey: "upload" },
  { id: "review", label: "En vérification", badgeKey: "review" },
  { id: "validated", label: "Validées" },
];

function canUpload(status: PortalDocument["status"]) {
  return UPLOADABLE.includes(status);
}

export function ClientPortal({ activePage }: { activePage: ClientPageKey }) {
  const { clients, selectedClientId, documents, uploadClientDocument, downloadDocument, loading, error } =
    usePortal();
  const client = clients.find((c) => c.id === selectedClientId) ?? clients[0];
  const [tab, setTab] = React.useState<DocumentsTab>("overview");

  const toUpload = documents.filter((d) => canUpload(d.status));
  const pendingReview = documents.filter((d) => d.status === "Envoyé");
  const validated = documents.filter((d) => d.status === "Validé");

  const badgeCounts = { upload: toUpload.length, review: pendingReview.length };

  if (activePage === "client-profile") {
    return (
      <div className="space-y-6">
        <PageHeader title="Mon profil" lead="Vos coordonnées partagées avec le cabinet." />
        <section className="mx-auto max-w-2xl rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6">
          {loading ? (
            <p className="py-8 text-center text-sm text-neutral-600">Chargement de votre profil…</p>
          ) : error ? (
            <p className="py-8 text-center text-sm text-rose-700">{error}</p>
          ) : client ? (
            <ClientProfileForm client={client} />
          ) : (
            <p className="py-8 text-center text-sm text-neutral-600">
              Impossible d’afficher votre profil. Rechargez la page ou reconnectez-vous.
            </p>
          )}
        </section>
      </div>
    );
  }

  if (activePage === "client-settings") {
    return (
      <div className="space-y-6">
        <PageHeader title="Réglages" lead="Compte, déconnexion et liens utiles." />
        {loading ? (
          <p className="py-8 text-center text-sm text-neutral-600">Chargement…</p>
        ) : client ? (
          <ClientSettingsPage client={client} />
        ) : (
          <p className="py-8 text-center text-sm text-neutral-600">Espace client indisponible.</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mes pièces justificatives"
        lead={
          client
            ? `Bonjour ${client.contactName}, déposez ici les documents demandés par le cabinet.`
            : "Déposez les documents demandés par votre conseiller."
        }
      />

      <div
        className="flex gap-1 overflow-x-auto rounded-2xl border border-neutral-200 bg-neutral-50/90 p-1"
        role="tablist"
        aria-label="Étapes des pièces justificatives"
      >
        {TABS.map((t) => {
          const badge = t.badgeKey ? badgeCounts[t.badgeKey] : 0;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "shrink-0 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors sm:px-4",
                tab === t.id
                  ? "bg-white text-[#1f2a7c] shadow-sm"
                  : "text-neutral-600 hover:bg-white/60 hover:text-neutral-900",
              )}
            >
              <span className="flex items-center gap-2">
                {t.label}
                {badge > 0 ? (
                  <span className="rounded-full bg-rose-100 px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-rose-800">
                    {badge}
                  </span>
                ) : null}
              </span>
            </button>
          );
        })}
      </div>

      {documents.length === 0 ? (
        <EmptyState
          title="Aucune demande de pièce"
          description="Votre conseiller n'a pas encore demandé de document. Revenez plus tard ou contactez le cabinet."
        />
      ) : null}

      {tab === "overview" && documents.length > 0 ? (
        <div className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-3">
            <StatCard label="À déposer" value={toUpload.length} />
            <StatCard label="En vérification" value={pendingReview.length} />
            <StatCard label="Validées" value={validated.length} />
          </div>

          {toUpload.length > 0 ? (
            <section className="rounded-2xl border border-amber-200/80 bg-amber-50/50 p-4 sm:p-5">
              <h2 className="text-sm font-semibold text-amber-950">Action requise</h2>
              <p className="mt-1 text-sm text-amber-900/80">
                {toUpload.length} pièce{toUpload.length > 1 ? "s" : ""} à déposer — onglet « À déposer ».
              </p>
              <button
                type="button"
                onClick={() => setTab("upload")}
                className="mt-3 text-sm font-semibold text-[#1f2a7c] underline-offset-2 hover:underline"
              >
                Aller aux dépôts →
              </button>
            </section>
          ) : (
            <p className="rounded-2xl border border-emerald-200/70 bg-emerald-50/40 px-4 py-3 text-sm text-emerald-900">
              Aucune pièce en attente de dépôt.
            </p>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <QuickLinkCard
              href={CONTACT_HREF}
              title="Une question ?"
              description="Contactez le cabinet pour toute précision."
            />
            <QuickLinkCard href="/" title="Site du cabinet" description="Informations publiques Lefèvre Conseil." />
          </div>
        </div>
      ) : null}

      {tab === "upload" ? (
        <DocumentList
          documents={toUpload}
          emptyTitle="Aucune pièce à déposer"
          emptyDescription="Le cabinet vous informera lorsqu'un nouveau document sera demandé."
          renderActions={(doc) => (
            <UploadZone onUpload={(file, comment) => uploadClientDocument(doc.id, file, comment)} />
          )}
        />
      ) : null}

      {tab === "review" ? (
        <DocumentList
          documents={pendingReview}
          emptyTitle="Aucun document en cours de vérification"
          emptyDescription=""
          renderActions={(doc) =>
            doc.storagePath ? (
              <button
                type="button"
                onClick={() => void downloadDocument(doc.storagePath!)}
                className="rounded-xl border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-50"
              >
                Voir le fichier envoyé
              </button>
            ) : null
          }
        />
      ) : null}

      {tab === "validated" ? (
        <DocumentList
          documents={validated}
          emptyTitle="Aucune pièce validée"
          emptyDescription=""
          renderActions={(doc) =>
            doc.storagePath ? (
              <button
                type="button"
                onClick={() => void downloadDocument(doc.storagePath!)}
                className="rounded-xl border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-50"
              >
                Télécharger
              </button>
            ) : null
          }
        />
      ) : null}
    </div>
  );
}

function DocumentList({
  documents,
  emptyTitle,
  emptyDescription,
  renderActions,
}: {
  documents: PortalDocument[];
  emptyTitle: string;
  emptyDescription: string;
  renderActions: (doc: PortalDocument) => React.ReactNode;
}) {
  if (documents.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 px-6 py-10 text-center text-sm text-neutral-600">
        <span className="font-medium text-neutral-800">{emptyTitle}</span>
        {emptyDescription ? ` — ${emptyDescription}` : null}
      </p>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {documents.map((doc) => (
        <DocumentCard key={doc.id} document={doc} actions={renderActions(doc)} />
      ))}
    </div>
  );
}

function PageHeader({ title, lead }: { title: string; lead: string }) {
  return (
    <header className="border-b border-neutral-100 pb-5">
      <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-[1.65rem]">{title}</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600">{lead}</p>
    </header>
  );
}

function QuickLinkCard({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-2xl border border-neutral-200 bg-white p-4 transition-colors hover:border-[#1f2a7c]/25 hover:bg-[#1f2a7c]/[0.03]"
    >
      <span className="flex items-center justify-between gap-2 text-sm font-semibold text-neutral-900">
        {title}
        <ArrowUpRight className="size-4 text-neutral-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </span>
      <span className="mt-1 text-xs leading-relaxed text-neutral-600">{description}</span>
    </Link>
  );
}
