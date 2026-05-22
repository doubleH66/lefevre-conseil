export type ViewMode = "client" | "admin";

export type ProjectStatus = "En attente" | "En cours" | "En validation" | "Terminé";
export type DocumentStatus = "Demandé" | "Envoyé" | "Validé" | "Refusé" | "À corriger";
export type DemandStatus = "Reçue" | "En cours" | "Traitée";
export type ClientStatus = "Actif" | "En attente" | "À relancer";
export type Priority = "Normal" | "Important" | "Urgent";
export type MessageStatus = "Envoyé" | "Lu" | "En attente";

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

