export type ViewMode = "client" | "admin";

export type ProjectStatus = "En attente" | "En cours" | "En validation" | "Terminé";
export type DocumentStatus = "Demandé" | "Envoyé" | "Validé" | "Refusé" | "À corriger";
export type DemandStatus = "Reçue" | "En cours" | "Traitée";
export type ClientStatus = "Actif" | "En attente" | "À relancer";
export type Priority = "Normal" | "Important" | "Urgent";
export type MessageStatus = "Envoyé" | "Lu" | "En attente";

export type SiteLeadStatus = "Reçue" | "En cours" | "Traitée" | "Archivée";

export type MutuelleLeadStatus = SiteLeadStatus | "draft";

export type PortalMutuelleLead = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  postalCode: string;
  birthDate: string;
  profileType: string;
  professionalStatus: string;
  hasCurrentMutuelle: boolean | null;
  desiredChangeDate: string;
  coverageLevel: string;
  healthPriorities: string[];
  monthlyBudgetRange: string;
  childrenCount: number;
  summary: string;
  sourcePage: string;
  status: MutuelleLeadStatus;
  adminNotes: string;
  apiStatus: string;
  createdAt: string;
  updatedAt: string;
};

export type PortalSiteLead = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  currentSituation: string;
  requestType: string;
  patrimonialGoal: string;
  approximateAmount: string;
  message: string;
  contactPreference: "email" | "phone" | "either";
  status: SiteLeadStatus;
  adminNotes: string;
  createdAt: string;
  updatedAt: string;
};

export type AdminNotification = {
  id: string;
  kind: string;
  title: string;
  body: string;
  link: string;
  readAt: string | null;
  createdAt: string;
};

export type InternalNote = {
  id: string;
  clientId: string;
  projectId: string | null;
  note: string;
  createdAt: string;
};

export type AdminActivityEntry = {
  id: string;
  action: string;
  entityType: string;
  entityId: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
};

export type PortalClient = {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  lastActivity: string;
  /** Valeur brute `client_accounts.updated_at` (ISO) pour resync fiable du formulaire. */
  updatedAtIso: string;
  projectsCount: number;
  pendingDocuments: number;
  status: ClientStatus;
  address: string;
  website: string;
};

export type PortalProjectStep = {
  id: string;
  title: string;
  done: boolean;
  dueLabel: string;
};

export type PortalProject = {
  id: string;
  clientId: string;
  name: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  startDate: string;
  targetDate: string;
  nextStep: string;
  owner: string;
  timeline: { date: string; label: string; detail: string }[];
  steps: PortalProjectStep[];
  linkedDocuments: string[];
  comments: string[];
  nextAction: string;
  clientTodo: string;
};

export type PortalDocument = {
  id: string;
  clientId: string;
  projectId: string;
  name: string;
  status: DocumentStatus;
  requestedAt: string;
  dueDate: string;
  urgent: boolean;
  comment?: string;
  previewUrl?: string;
  storagePath?: string;
  uploadedBy?: string;
};

export type PortalDemand = {
  id: string;
  clientId: string;
  createdAt: string;
  content: string;
  status: DemandStatus;
};

export type PortalMessage = {
  id: string;
  clientId: string;
  from: "client" | "team";
  text: string;
  at: string;
  status: MessageStatus;
};

export type WeeklyAction = {
  id: string;
  label: string;
  category: string;
};

export type ConnectionItem = {
  id: string;
  name: string;
  status: "Connecté" | "Non connecté" | "Bientôt disponible";
};

