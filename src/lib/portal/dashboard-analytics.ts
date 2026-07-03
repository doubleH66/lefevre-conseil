import type {
  AdminActivityEntry,
  PortalClient,
  PortalDocument,
  PortalSiteLead,
} from "@/components/portal/types";

export type ChartPoint = { label: string; value: number };

export type DashboardAnalyticsInput = {
  clients: PortalClient[];
  documents: PortalDocument[];
  siteLeads: PortalSiteLead[];
  mutuelleLeads: { status: string; createdAt: string }[];
  demands: { status: string; createdAt: string }[];
  activityLog: AdminActivityEntry[];
};

/** Parse les dates affichées en fr-FR (ex. 04/06/2026, 14:30). */
export function parsePortalDate(value: string): Date | null {
  if (!value || value === "-") return null;
  const direct = new Date(value);
  if (!Number.isNaN(direct.getTime())) return direct;
  const m = value.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (!m) return null;
  const d = new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
  return Number.isNaN(d.getTime()) ? null : d;
}

const MONTH_LABELS = ["jan.", "fév.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."] as const;

/** Activité sur les 6 derniers mois (demandes site + portail). */
export function leadsActivityByMonth(input: DashboardAnalyticsInput): ChartPoint[] {
  const now = new Date();
  const buckets: ChartPoint[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = MONTH_LABELS[d.getMonth()] ?? "";
    buckets.push({ label, value: 0 });
  }

  const bump = (date: Date | null) => {
    if (!date) return;
    for (let i = 0; i < buckets.length; i++) {
      const offset = 5 - i;
      const bucketDate = new Date(now.getFullYear(), now.getMonth() - offset, 1);
      if (
        date.getFullYear() === bucketDate.getFullYear() &&
        date.getMonth() === bucketDate.getMonth()
      ) {
        buckets[i]!.value += 1;
        return;
      }
    }
  };

  for (const lead of input.siteLeads) bump(parsePortalDate(lead.createdAt));
  for (const lead of input.mutuelleLeads) {
    if (lead.status === "draft") continue;
    bump(parsePortalDate(lead.createdAt));
  }
  for (const demand of input.demands) bump(parsePortalDate(demand.createdAt));

  return buckets;
}

export function pipelineBreakdown(input: DashboardAnalyticsInput): ChartPoint[] {
  const openLeads = input.siteLeads.filter(
    (l) => l.status !== "Traitée" && l.status !== "Archivée",
  ).length;
  const openMutuelle = input.mutuelleLeads.filter(
    (l) => l.status !== "draft" && l.status !== "Traitée" && l.status !== "Archivée",
  ).length;
  const openDemands = input.demands.filter((d) => d.status !== "Traitée").length;
  const docsToValidate = input.documents.filter(
    (d) => d.status === "Envoyé" || d.status === "À corriger",
  ).length;
  const docsRequested = input.documents.filter((d) => d.status === "Demandé").length;

  return [
    { label: "Demandes site", value: openLeads },
    { label: "Mutuelle", value: openMutuelle },
    { label: "Portail", value: openDemands },
    { label: "Pièces", value: docsToValidate + docsRequested },
  ];
}

export function clientStatusBreakdown(clients: PortalClient[]): ChartPoint[] {
  const counts = { Actif: 0, "En attente": 0, "À relancer": 0 } as Record<string, number>;
  for (const c of clients) counts[c.status] = (counts[c.status] ?? 0) + 1;
  return Object.entries(counts)
    .filter(([, v]) => v > 0)
    .map(([label, value]) => ({ label, value }));
}

export function buildWeeklyActions(input: DashboardAnalyticsInput) {
  const actions: { id: string; label: string; category: string }[] = [];
  const docs = input.documents.filter((d) => d.status === "Envoyé" || d.status === "À corriger");
  for (const d of docs.slice(0, 3)) {
    actions.push({ id: `doc-${d.id}`, label: `Valider : ${d.name}`, category: "Opérations" });
  }
  for (const lead of input.siteLeads.filter((l) => l.status === "Reçue").slice(0, 2)) {
    actions.push({
      id: `lead-${lead.id}`,
      label: `Recontacter ${lead.firstName} ${lead.lastName}`,
      category: "Suivi",
    });
  }
  for (const c of input.clients.filter((x) => x.status === "À relancer").slice(0, 2)) {
    actions.push({
      id: `client-${c.id}`,
      label: `Relancer ${c.companyName}`,
      category: "Clients",
    });
  }
  if (actions.length < 4) {
    actions.push({
      id: "content",
      label: "Publier un billet dans la rubrique Conseils",
      category: "Contenu",
    });
  }
  return actions;
}
