import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  AdminActivityEntry,
  AdminNotification,
  ClientStatus,
  DemandStatus,
  DocumentStatus,
  InternalNote,
  PortalClient,
  PortalDemand,
  PortalDocument,
  PortalMessage,
  PortalProject,
  PortalMutuelleLead,
  PortalSiteLead,
  ProjectStatus,
  SiteLeadStatus,
  MutuelleLeadStatus,
} from "@/components/portal/types";
import { formatMutuelleLeadSummary } from "@/lib/mutuelle/labels-map";
import { formatDateFr, formatDateTimeFr } from "@/lib/portal/format";
import { formatPortalError } from "@/lib/portal/errors";

function assertNoError(error: { message: string } | null, context: string): void {
  if (error) throw new Error(formatPortalError({ message: `${context} : ${error.message}` }));
}

type ClientAccountRow = {
  id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string | null;
  address: string | null;
  website: string | null;
  status: ClientStatus;
  updated_at: string;
};

type ProjectRow = {
  id: string;
  client_id: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  progress: number;
  start_date: string | null;
  target_date: string | null;
  next_step: string | null;
  owner_name: string | null;
  client_todo: string | null;
  internal_notes: string | null;
  updated_at: string;
};

type DocumentRequestRow = {
  id: string;
  client_id: string;
  project_id: string | null;
  name: string;
  description: string | null;
  due_date: string | null;
  priority: string;
  status: DocumentStatus;
  message: string | null;
  created_at: string;
};

type DemandRow = {
  id: string;
  client_id: string;
  content: string;
  status: DemandStatus;
  created_at: string;
};

type UploadedDocRow = {
  request_id: string | null;
  storage_path: string;
  original_name: string;
  created_at: string;
};

type MessageRow = {
  id: string;
  client_id: string;
  sender_type: "client" | "team";
  body: string;
  status: string;
  created_at: string;
};

type MutuelleLeadRow = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  postal_code: string | null;
  birth_date: string | null;
  profile_type: string | null;
  professional_status: string | null;
  has_current_mutuelle: boolean | null;
  desired_change_date: string | null;
  coverage_level: string | null;
  health_priorities: string[] | null;
  monthly_budget_range: string | null;
  children_count: number | null;
  source_page: string | null;
  status: string;
  admin_notes: string | null;
  api_status: string | null;
  created_at: string;
  updated_at: string;
};

type SiteLeadRow = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  current_situation: string | null;
  request_type: string;
  patrimonial_goal: string | null;
  approximate_amount: string | null;
  message: string | null;
  contact_preference: "email" | "phone" | "either";
  status: SiteLeadStatus;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
};

type AdminNotificationRow = {
  id: string;
  kind: string;
  title: string;
  body: string | null;
  link: string | null;
  read_at: string | null;
  created_at: string;
};

type InternalNoteRow = {
  id: string;
  client_id: string;
  project_id: string | null;
  note: string;
  created_at: string;
};

type AdminActivityRow = {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
};

function normalizeMutuelleStatus(status: string): MutuelleLeadStatus {
  if (status === "new") return "Reçue";
  if (status === "draft") return "draft";
  if (
    status === "Reçue" ||
    status === "En cours" ||
    status === "Traitée" ||
    status === "Archivée"
  ) {
    return status;
  }
  return "Reçue";
}

function mapMutuelleLead(row: MutuelleLeadRow): PortalMutuelleLead {
  const priorities = Array.isArray(row.health_priorities) ? row.health_priorities : [];
  return {
    id: row.id,
    firstName: row.first_name ?? "",
    lastName: row.last_name ?? "",
    email: row.email ?? "",
    phone: row.phone ?? "",
    postalCode: row.postal_code ?? "",
    birthDate: row.birth_date ? formatDateFr(row.birth_date) : "",
    profileType: row.profile_type ?? "",
    professionalStatus: row.professional_status ?? "",
    hasCurrentMutuelle: row.has_current_mutuelle,
    desiredChangeDate: row.desired_change_date ?? "",
    coverageLevel: row.coverage_level ?? "",
    healthPriorities: priorities,
    monthlyBudgetRange: row.monthly_budget_range ?? "",
    childrenCount: row.children_count ?? 0,
    summary: formatMutuelleLeadSummary({
      profileType: row.profile_type,
      professionalStatus: row.professional_status,
      coverageLevel: row.coverage_level,
      monthlyBudgetRange: row.monthly_budget_range,
      desiredChangeDate: row.desired_change_date,
      hasCurrentMutuelle: row.has_current_mutuelle,
      healthPriorities: priorities,
      childrenCount: row.children_count,
    }),
    sourcePage: row.source_page ?? "",
    status: normalizeMutuelleStatus(row.status),
    adminNotes: row.admin_notes ?? "",
    apiStatus: row.api_status ?? "",
    createdAt: formatDateTimeFr(row.created_at),
    updatedAt: formatDateTimeFr(row.updated_at),
  };
}

function mapSiteLead(row: SiteLeadRow): PortalSiteLead {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone ?? "",
    currentSituation: row.current_situation ?? "",
    requestType: row.request_type,
    patrimonialGoal: row.patrimonial_goal ?? "",
    approximateAmount: row.approximate_amount ?? "",
    message: row.message ?? "",
    contactPreference: row.contact_preference,
    status: row.status,
    adminNotes: row.admin_notes ?? "",
    createdAt: formatDateTimeFr(row.created_at),
    updatedAt: formatDateTimeFr(row.updated_at),
  };
}

function mapAdminNotification(row: AdminNotificationRow): AdminNotification {
  return {
    id: row.id,
    kind: row.kind,
    title: row.title,
    body: row.body ?? "",
    link: row.link ?? "",
    readAt: row.read_at,
    createdAt: formatDateTimeFr(row.created_at),
  };
}

function mapInternalNote(row: InternalNoteRow): InternalNote {
  return {
    id: row.id,
    clientId: row.client_id,
    projectId: row.project_id,
    note: row.note,
    createdAt: formatDateTimeFr(row.created_at),
  };
}

function mapAdminActivity(row: AdminActivityRow): AdminActivityEntry {
  return {
    id: row.id,
    action: row.action,
    entityType: row.entity_type,
    entityId: row.entity_id,
    metadata: row.metadata ?? {},
    createdAt: formatDateTimeFr(row.created_at),
  };
}

function mapClient(row: ClientAccountRow, stats: { projects: number; pendingDocs: number }): PortalClient {
  return {
    id: row.id,
    companyName: row.company_name,
    contactName: row.contact_name,
    email: row.email,
    phone: row.phone ?? "",
    address: row.address ?? "",
    website: row.website ?? "",
    status: row.status,
    lastActivity: formatDateTimeFr(row.updated_at),
    updatedAtIso: row.updated_at ?? "",
    projectsCount: stats.projects,
    pendingDocuments: stats.pendingDocs,
  };
}

function mapProject(row: ProjectRow): PortalProject {
  return {
    id: row.id,
    clientId: row.client_id,
    name: row.name,
    description: row.description ?? "",
    status: row.status,
    progress: row.progress ?? 0,
    startDate: formatDateFr(row.start_date),
    targetDate: formatDateFr(row.target_date),
    nextStep: row.next_step ?? "-",
    owner: row.owner_name ?? "Cabinet Lefèvre",
    timeline: [],
    steps: [],
    linkedDocuments: [],
    comments: row.internal_notes ? [row.internal_notes] : [],
    nextAction: row.next_step ?? "En attente de prochaine étape.",
    clientTodo: row.client_todo ?? "Aucune action requise pour le moment.",
  };
}

function mapDocumentRequest(row: DocumentRequestRow): PortalDocument {
  return {
    id: row.id,
    clientId: row.client_id,
    projectId: row.project_id ?? "",
    name: row.name,
    status: row.status,
    requestedAt: formatDateFr(row.created_at),
    dueDate: formatDateFr(row.due_date),
    urgent: row.priority === "Urgent",
    comment: row.message ?? row.description ?? undefined,
  };
}

function mapDemand(row: DemandRow): PortalDemand {
  return {
    id: row.id,
    clientId: row.client_id,
    content: row.content,
    status: row.status,
    createdAt: formatDateFr(row.created_at),
  };
}

function mapMessage(row: MessageRow): PortalMessage {
  return {
    id: row.id,
    clientId: row.client_id,
    from: row.sender_type,
    text: row.body,
    at: formatDateTimeFr(row.created_at),
    status: row.status === "Lu" ? "Lu" : row.status === "En attente" ? "En attente" : "Envoyé",
  };
}

/** Lie l’utilisateur à un compte client via RPC security definer (évite 403 RLS au 1er accès). */
export async function ensureClientMembership(supabase: SupabaseClient): Promise<string | null> {
  const { data, error } = await supabase.rpc("ensure_client_portal_access");

  if (error) {
    console.warn("ensure_client_portal_access:", error);
    return null;
  }

  return typeof data === "string" ? data : null;
}

export async function loadClientPortalData(
  supabase: SupabaseClient,
  clientId: string,
): Promise<{
  client: PortalClient;
  projects: PortalProject[];
  documents: PortalDocument[];
  demands: PortalDemand[];
  messages: PortalMessage[];
}> {
  const { data: account, error: accountError } = await supabase
    .from("client_accounts")
    .select("*")
    .eq("id", clientId)
    .single();

  if (accountError || !account) {
    throw new Error("Compte client introuvable.");
  }

  const [projectsRes, docsRes, uploadsRes, demandsRes, messagesRes] = await Promise.all([
    supabase.from("projects").select("*").eq("client_id", clientId).order("updated_at", { ascending: false }),
    supabase
      .from("document_requests")
      .select("*")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false }),
    supabase
      .from("documents")
      .select("request_id, storage_path, original_name, created_at")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false }),
    supabase.from("client_demands").select("*").eq("client_id", clientId).order("created_at", { ascending: false }),
    supabase.from("portal_messages").select("*").eq("client_id", clientId).order("created_at", { ascending: true }),
  ]);

  assertNoError(projectsRes.error, "Chargement des projets");
  assertNoError(docsRes.error, "Chargement des pièces demandées");
  assertNoError(uploadsRes.error, "Chargement des fichiers déposés");
  assertNoError(demandsRes.error, "Chargement des demandes");
  assertNoError(messagesRes.error, "Chargement des messages");

  const projectRows = (projectsRes.data ?? []) as ProjectRow[];
  const docRows = (docsRes.data ?? []) as DocumentRequestRow[];
  const uploadByRequest = new Map<string, UploadedDocRow>();
  for (const u of (uploadsRes.data ?? []) as UploadedDocRow[]) {
    if (u.request_id && !uploadByRequest.has(u.request_id)) {
      uploadByRequest.set(u.request_id, u);
    }
  }
  const pendingDocs = docRows.filter((d) => d.status === "Demandé" || d.status === "À corriger" || d.status === "Refusé").length;

  const client = mapClient(account as ClientAccountRow, {
    projects: projectRows.length,
    pendingDocs,
  });

  return {
    client,
    projects: projectRows.map(mapProject),
    documents: docRows.map((row) => {
      const doc = mapDocumentRequest(row);
      const upload = uploadByRequest.get(row.id);
      if (upload) {
        doc.storagePath = upload.storage_path;
        doc.uploadedBy = upload.original_name;
      }
      return doc;
    }),
    demands: ((demandsRes.data ?? []) as DemandRow[]).map(mapDemand),
    messages: ((messagesRes.data ?? []) as MessageRow[]).map(mapMessage),
  };
}

export async function loadAdminPortalData(supabase: SupabaseClient): Promise<{
  clients: PortalClient[];
  projects: PortalProject[];
  documents: PortalDocument[];
  demands: PortalDemand[];
  messages: PortalMessage[];
  siteLeads: PortalSiteLead[];
  mutuelleLeads: PortalMutuelleLead[];
  notifications: AdminNotification[];
  internalNotes: InternalNote[];
  activityLog: AdminActivityEntry[];
}> {
  const [
    clientsRes,
    projectsRes,
    docsRes,
    uploadsRes,
    demandsRes,
    messagesRes,
    siteLeadsRes,
    mutuelleLeadsRes,
    notificationsRes,
    notesRes,
    activityRes,
  ] = await Promise.all([
    supabase.from("client_accounts").select("*").order("updated_at", { ascending: false }),
    supabase.from("projects").select("*").order("updated_at", { ascending: false }),
    supabase.from("document_requests").select("*").order("created_at", { ascending: false }),
    supabase
      .from("documents")
      .select("request_id, storage_path, original_name, created_at")
      .order("created_at", { ascending: false }),
    supabase.from("client_demands").select("*").order("created_at", { ascending: false }),
    supabase.from("portal_messages").select("*").order("created_at", { ascending: false }),
    supabase.from("site_leads").select("*").order("created_at", { ascending: false }),
    supabase.from("mutuelle_leads").select("*").order("created_at", { ascending: false }),
    supabase.from("admin_notifications").select("*").order("created_at", { ascending: false }).limit(50),
    supabase.from("internal_notes").select("*").order("created_at", { ascending: false }),
    supabase.from("admin_activity_log").select("*").order("created_at", { ascending: false }).limit(100),
  ]);

  assertNoError(clientsRes.error, "Chargement des clients");
  assertNoError(projectsRes.error, "Chargement des projets");
  assertNoError(docsRes.error, "Chargement des pièces");
  assertNoError(uploadsRes.error, "Chargement des fichiers");
  assertNoError(demandsRes.error, "Chargement des demandes clients");
  assertNoError(messagesRes.error, "Chargement des messages");
  if (siteLeadsRes.error && !siteLeadsRes.error.message.includes("site_leads")) {
    assertNoError(siteLeadsRes.error, "Chargement des demandes site");
  }
  if (mutuelleLeadsRes.error && !mutuelleLeadsRes.error.message.includes("mutuelle_leads")) {
    assertNoError(mutuelleLeadsRes.error, "Chargement des demandes mutuelle");
  }
  if (notificationsRes.error && !notificationsRes.error.message.includes("admin_notifications")) {
    assertNoError(notificationsRes.error, "Chargement des notifications");
  }
  if (notesRes.error && !notesRes.error.message.includes("internal_notes")) {
    assertNoError(notesRes.error, "Chargement des notes internes");
  }
  if (activityRes.error && !activityRes.error.message.includes("admin_activity_log")) {
    assertNoError(activityRes.error, "Chargement de l'historique");
  }

  const projectRows = (projectsRes.data ?? []) as ProjectRow[];
  const docRows = (docsRes.data ?? []) as DocumentRequestRow[];
  const demandRows = (demandsRes.data ?? []) as DemandRow[];

  const projectsByClient = new Map<string, number>();
  const pendingByClient = new Map<string, number>();
  for (const p of projectRows) {
    projectsByClient.set(p.client_id, (projectsByClient.get(p.client_id) ?? 0) + 1);
  }
  for (const d of docRows) {
    if (d.status === "Demandé" || d.status === "À corriger" || d.status === "Refusé") {
      pendingByClient.set(d.client_id, (pendingByClient.get(d.client_id) ?? 0) + 1);
    }
  }

  const clients = ((clientsRes.data ?? []) as ClientAccountRow[]).map((row) =>
    mapClient(row, {
      projects: projectsByClient.get(row.id) ?? 0,
      pendingDocs: pendingByClient.get(row.id) ?? 0,
    }),
  );

  const uploadByRequest = new Map<string, UploadedDocRow>();
  for (const u of (uploadsRes.data ?? []) as UploadedDocRow[]) {
    if (u.request_id && !uploadByRequest.has(u.request_id)) {
      uploadByRequest.set(u.request_id, u);
    }
  }

  return {
    clients,
    projects: projectRows.map(mapProject),
    documents: docRows.map((row) => {
      const doc = mapDocumentRequest(row);
      const upload = uploadByRequest.get(row.id);
      if (upload) {
        doc.storagePath = upload.storage_path;
        doc.uploadedBy = upload.original_name;
      }
      return doc;
    }),
    demands: demandRows.map(mapDemand),
    messages: ((messagesRes.data ?? []) as MessageRow[]).map(mapMessage),
    siteLeads: ((siteLeadsRes.data ?? []) as SiteLeadRow[]).map(mapSiteLead),
    mutuelleLeads: ((mutuelleLeadsRes.data ?? []) as MutuelleLeadRow[]).map(mapMutuelleLead),
    notifications: ((notificationsRes.data ?? []) as AdminNotificationRow[]).map(mapAdminNotification),
    internalNotes: ((notesRes.data ?? []) as InternalNoteRow[]).map(mapInternalNote),
    activityLog: ((activityRes.data ?? []) as AdminActivityRow[]).map(mapAdminActivity),
  };
}
