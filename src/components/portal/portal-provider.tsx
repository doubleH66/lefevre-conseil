"use client";

import * as React from "react";
import type { ReactNode } from "react";
import type {
  AdminActivityEntry,
  AdminNotification,
  ClientStatus,
  InternalNote,
  PortalClient,
  PortalDemand,
  PortalDocument,
  PortalMessage,
  PortalProject,
  PortalSiteLead,
  Priority,
  SiteLeadStatus,
  ViewMode,
} from "@/components/portal/types";
import { createClient } from "@/lib/supabase/client";
import { isSupabasePublicConfigured } from "@/lib/supabase/public-env";
import {
  syncClientDemand,
  syncDocumentStatusNotice,
  syncDocumentRequest,
  syncDocumentUpload,
  syncPortalMessage,
  syncProjectCreation,
} from "@/lib/portal/backend-sync";
import { formatPortalError } from "@/lib/portal/errors";
import { ROUTES } from "@/lib/content/routes";
import {
  ensureClientMembership,
  loadAdminPortalData,
  loadClientPortalData,
} from "@/lib/portal/load-portal-data";
import { profileClientSnapshot, profileDebugLog } from "@/lib/portal/profile-debug";
import {
  adminAddInternalNote,
  adminCreateClientAccount,
  adminSendPortalMessage,
  adminUpdateClientAccount,
  adminUpdateSiteLeadStatus,
  markAdminNotificationRead,
} from "@/lib/portal/admin-mutations";
import {
  insertClientDemand,
  insertDocumentRequest,
  insertPortalMessage,
  insertProject,
  updateClientDemandStatus,
  updateDocumentRequestStatus,
  updateProjectProgressDb,
  uploadDocumentForRequest,
  getSignedDocumentUrl,
  requestDocumentCorrection,
} from "@/lib/portal/mutations";

type ToastType = "success" | "info" | "warning";

type PortalToast = {
  id: string;
  type: ToastType;
  message: string;
};

type NewProjectPayload = {
  clientId: string;
  name: string;
  description: string;
  owner: string;
  startDate: string;
  targetDate: string;
  nextStep: string;
  requiredDocs: string;
  internalNotes: string;
};

export type PortalAuthUser = {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
};

type PortalStore = {
  mode: ViewMode;
  lockClientMode: boolean;
  canSwitchMode: boolean;
  authUser: PortalAuthUser | null;
  loading: boolean;
  error: string | null;
  refresh: (options?: { silent?: boolean }) => Promise<void>;
  patchClient: (id: string, patch: Partial<PortalClient>) => void;
  selectedClientId: string;
  setSelectedClientId: (id: string) => void;
  clients: PortalClient[];
  projects: PortalProject[];
  documents: PortalDocument[];
  demands: PortalDemand[];
  messages: PortalMessage[];
  siteLeads: PortalSiteLead[];
  notifications: AdminNotification[];
  internalNotes: InternalNote[];
  activityLog: AdminActivityEntry[];
  toasts: PortalToast[];
  dismissToast: (id: string) => void;
  updateAuthAvatar: (url: string | null) => void;
  updateAuthFullName: (name: string) => void;
  submitClientDemand: (content: string) => Promise<void>;
  uploadClientDocument: (documentId: string, file: File, comment?: string) => Promise<void>;
  downloadDocument: (storagePath: string) => Promise<void>;
  sendMessage: (text: string) => Promise<void>;
  requestDocument: (payload: {
    clientId: string;
    projectId: string;
    name: string;
    description: string;
    dueDate: string;
    priority: Priority;
    message: string;
  }) => Promise<void>;
  validateDocument: (id: string) => Promise<void>;
  refuseDocument: (id: string, comment: string) => Promise<void>;
  updateDemandStatus: (id: string, status: "Reçue" | "En cours" | "Traitée") => Promise<void>;
  updateSiteLeadStatus: (id: string, status: SiteLeadStatus, adminNotes?: string) => Promise<void>;
  createClientAccount: (payload: {
    companyName: string;
    contactName: string;
    email: string;
    phone?: string;
    address?: string;
    website?: string;
    status?: ClientStatus;
  }) => Promise<void>;
  updateClientAccount: (payload: {
    clientId: string;
    companyName: string;
    contactName: string;
    email: string;
    phone?: string;
    address?: string;
    website?: string;
    status?: ClientStatus;
  }) => Promise<void>;
  addInternalNote: (clientId: string, note: string) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  createProject: (payload: NewProjectPayload) => Promise<void>;
  updateProjectProgress: (id: string, progress: number) => Promise<void>;
};

const PortalContext = React.createContext<PortalStore | null>(null);

export function PortalProvider({
  children,
  initialMode = "client",
}: {
  children: ReactNode;
  initialMode?: ViewMode;
}) {
  const lockClientMode = initialMode === "client";
  const [mode] = React.useState<ViewMode>(initialMode);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [userId, setUserId] = React.useState<string | null>(null);
  const [authUser, setAuthUser] = React.useState<PortalAuthUser | null>(null);
  const [canSwitchMode, setCanSwitchMode] = React.useState(false);
  const [selectedClientId, setSelectedClientId] = React.useState("");
  const [clients, setClients] = React.useState<PortalClient[]>([]);
  const [projects, setProjects] = React.useState<PortalProject[]>([]);
  const [documents, setDocuments] = React.useState<PortalDocument[]>([]);
  const [demands, setDemands] = React.useState<PortalDemand[]>([]);
  const [messages, setMessages] = React.useState<PortalMessage[]>([]);
  const [siteLeads, setSiteLeads] = React.useState<PortalSiteLead[]>([]);
  const [notifications, setNotifications] = React.useState<AdminNotification[]>([]);
  const [internalNotes, setInternalNotes] = React.useState<InternalNote[]>([]);
  const [activityLog, setActivityLog] = React.useState<AdminActivityEntry[]>([]);
  const [toasts, setToasts] = React.useState<PortalToast[]>([]);
  const hasLoadedOnceRef = React.useRef(false);

  const pushToast = React.useCallback((message: string, type: ToastType = "success") => {
    const id = `toast-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const dismissToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const getClientMeta = React.useCallback(
    (clientId: string) => {
      const client = clients.find((c) => c.id === clientId);
      return {
        companyName: client?.companyName ?? "Client",
        email: client?.email ?? "",
      };
    },
    [clients],
  );

  const patchClient = React.useCallback((id: string, patch: Partial<PortalClient>) => {
    profileDebugLog("patchClient", { id, patch, mergeOrder: "{ ...oldClient, ...patch }" });
    setClients((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }, []);

  const refresh = React.useCallback(async (options?: { silent?: boolean }) => {
    const silent = options?.silent ?? false;
    profileDebugLog("refresh — début", { silent, mode });

    if (!isSupabasePublicConfigured()) {
      setError("Connexion Supabase non configurée. Ajoutez les variables d'environnement du projet.");
      if (!silent && !hasLoadedOnceRef.current) setLoading(false);
      return;
    }

    const showFullPageLoader = !silent && !hasLoadedOnceRef.current;
    if (showFullPageLoader) setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setAuthUser(null);
        setError("Session expirée. Reconnectez-vous.");
        if (showFullPageLoader) setLoading(false);
        return;
      }

      setUserId(user.id);

      const { data: profile } = await supabase
        .from("profiles")
        .select("role, full_name, avatar_url")
        .eq("id", user.id)
        .maybeSingle();
      setAuthUser({
        id: user.id,
        email: user.email ?? "",
        fullName: profile?.full_name?.trim() || null,
        avatarUrl: profile?.avatar_url?.trim() || null,
      });
      const isAdmin = profile?.role === "admin";
      setCanSwitchMode(false);

      if (isAdmin && lockClientMode) {
        window.location.replace(ROUTES.espaceAdmin);
        return;
      }

      if (mode === "admin" && isAdmin) {
        const data = await loadAdminPortalData(supabase);
        setClients(data.clients);
        setProjects(data.projects);
        setDocuments(data.documents);
        setDemands(data.demands);
        setMessages(data.messages);
        setSiteLeads(data.siteLeads);
        setNotifications(data.notifications);
        setInternalNotes(data.internalNotes);
        setActivityLog(data.activityLog);
        setSelectedClientId((prev) => {
          if (prev && data.clients.some((c) => c.id === prev)) return prev;
          return data.clients[0]?.id ?? "";
        });
      } else {
        const clientId = await ensureClientMembership(supabase);

        if (!clientId) {
          setError(
            "Impossible d'ouvrir votre espace client. Vérifiez que la migration Supabase « 005_ensure_client_portal_access » est appliquée, puis reconnectez-vous. Sinon, contactez le cabinet.",
          );
          setClients([]);
          setProjects([]);
          setDocuments([]);
          setDemands([]);
          setMessages([]);
          setSiteLeads([]);
          setNotifications([]);
          setInternalNotes([]);
          setActivityLog([]);
          if (showFullPageLoader) setLoading(false);
          return;
        }

        const data = await loadClientPortalData(supabase, clientId);
        profileDebugLog("refresh — client chargé", {
          clientId,
          client: profileClientSnapshot(data.client),
        });
        setClients([data.client]);
        setProjects(data.projects);
        setDocuments(data.documents);
        setDemands(data.demands);
        setMessages(data.messages);
        setSelectedClientId(clientId);
      }

      hasLoadedOnceRef.current = true;
      profileDebugLog("refresh — succès");
    } catch (e) {
      profileDebugLog("refresh — erreur", { message: e instanceof Error ? e.message : String(e) });
      console.warn("portal refresh failed:", e);
      setError(formatPortalError(e));
    } finally {
      if (showFullPageLoader) setLoading(false);
    }
  }, [lockClientMode, mode]);

  const refreshRef = React.useRef(refresh);
  refreshRef.current = refresh;

  React.useEffect(() => {
    void refreshRef.current();
  }, []);

  const submitClientDemand = React.useCallback(
    async (content: string) => {
      if (!content.trim() || !selectedClientId || !userId) return;
      try {
        const supabase = createClient();
        await insertClientDemand(supabase, selectedClientId, content.trim(), userId);
        const clientMeta = getClientMeta(selectedClientId);
        void syncClientDemand({
          clientId: selectedClientId,
          content: content.trim(),
          clientName: clientMeta.companyName,
          clientEmail: clientMeta.email,
        });
        pushToast("Demande enregistrée.", "success");
        await refresh();
      } catch (e) {
        pushToast(formatPortalError(e), "warning");
        throw e;
      }
    },
    [getClientMeta, pushToast, refresh, selectedClientId, userId],
  );

  const uploadClientDocument = React.useCallback(
    async (documentId: string, file: File, comment?: string) => {
      const target = documents.find((doc) => doc.id === documentId);
      if (!target || !userId) {
        throw new Error("Document introuvable ou session expirée.");
      }
      try {
        const supabase = createClient();
        await uploadDocumentForRequest(supabase, {
          clientId: target.clientId,
          requestId: documentId,
          projectId: target.projectId || null,
          file,
          comment,
          userId,
        });
        const clientMeta = getClientMeta(target.clientId);
        void syncDocumentUpload({
          clientId: target.clientId,
          projectId: target.projectId || undefined,
          documentName: target.name,
          comment,
          clientName: clientMeta.companyName,
          clientEmail: clientMeta.email,
        });
        pushToast("Document envoyé.", "success");
        await refresh();
      } catch (e) {
        pushToast(formatPortalError(e), "warning");
        throw e;
      }
    },
    [documents, getClientMeta, pushToast, refresh, userId],
  );

  const downloadDocument = React.useCallback(
    async (storagePath: string) => {
      try {
        const supabase = createClient();
        const url = await getSignedDocumentUrl(supabase, storagePath);
        window.open(url, "_blank", "noopener,noreferrer");
      } catch (e) {
        pushToast(formatPortalError(e), "warning");
        throw e;
      }
    },
    [pushToast],
  );

  const sendMessage = React.useCallback(
    async (text: string) => {
      if (!text.trim() || !selectedClientId || !userId) return;
      try {
        const supabase = createClient();
        const senderType = mode === "client" ? "client" : "team";
        if (mode === "admin") {
          await adminSendPortalMessage(supabase, selectedClientId, text.trim());
        } else {
          await insertPortalMessage(supabase, {
            clientId: selectedClientId,
            senderType,
            body: text.trim(),
            userId,
          });
        }
        void syncPortalMessage({
          clientId: selectedClientId,
          senderType,
          body: text.trim(),
        });
        pushToast("Message envoyé.", "success");
        await refresh();
      } catch (e) {
        pushToast(formatPortalError(e), "warning");
        throw e;
      }
    },
    [mode, pushToast, refresh, selectedClientId, userId],
  );

  const requestDocument = React.useCallback(
    async (payload: {
      clientId: string;
      projectId: string;
      name: string;
      description: string;
      dueDate: string;
      priority: Priority;
      message: string;
    }) => {
      if (!userId) throw new Error("Session expirée. Reconnectez-vous.");
      try {
        const supabase = createClient();
        await insertDocumentRequest(supabase, { ...payload, requestedBy: userId });
        const clientMeta = getClientMeta(payload.clientId);
        void syncDocumentRequest({
          ...payload,
          clientName: clientMeta.companyName,
          clientEmail: clientMeta.email,
        });
        pushToast("Demande de pièce envoyée.", "success");
        await refresh();
      } catch (e) {
        pushToast(formatPortalError(e), "warning");
        throw e;
      }
    },
    [getClientMeta, pushToast, refresh, userId],
  );

  const validateDocument = React.useCallback(
    async (id: string) => {
      const target = documents.find((doc) => doc.id === id);
      try {
        const supabase = createClient();
        await updateDocumentRequestStatus(supabase, id, "Validé");
        pushToast("Document validé.", "success");
        if (target) {
          const clientMeta = getClientMeta(target.clientId);
          void syncDocumentStatusNotice({
            clientName: clientMeta.companyName,
            clientEmail: clientMeta.email,
            documentName: target.name,
            status: "Validé",
          });
        }
        await refresh();
      } catch (e) {
        pushToast(formatPortalError(e), "warning");
        throw e;
      }
    },
    [documents, getClientMeta, pushToast, refresh],
  );

  const refuseDocument = React.useCallback(
    async (id: string, comment: string) => {
      const target = documents.find((doc) => doc.id === id);
      try {
        const supabase = createClient();
        await requestDocumentCorrection(
          supabase,
          id,
          comment || "Merci de corriger et renvoyer le document.",
        );
        pushToast("Correction demandée au client.", "warning");
        if (target) {
          const clientMeta = getClientMeta(target.clientId);
          void syncDocumentStatusNotice({
            clientName: clientMeta.companyName,
            clientEmail: clientMeta.email,
            documentName: target.name,
            status: "À corriger",
            comment,
          });
        }
        await refresh();
      } catch (e) {
        pushToast(formatPortalError(e), "warning");
        throw e;
      }
    },
    [documents, getClientMeta, pushToast, refresh],
  );

  const updateDemandStatus = React.useCallback(
    async (id: string, status: "Reçue" | "En cours" | "Traitée") => {
      try {
        const supabase = createClient();
        await updateClientDemandStatus(supabase, id, status);
        pushToast("Demande mise à jour.", "success");
        await refresh();
      } catch (e) {
        pushToast(formatPortalError(e), "warning");
        throw e;
      }
    },
    [pushToast, refresh],
  );

  const updateSiteLeadStatus = React.useCallback(
    async (id: string, status: SiteLeadStatus, adminNotes?: string) => {
      try {
        const supabase = createClient();
        await adminUpdateSiteLeadStatus(supabase, id, status, adminNotes);
        pushToast("Demande site mise à jour.", "success");
        await refresh();
      } catch (e) {
        pushToast(formatPortalError(e), "warning");
        throw e;
      }
    },
    [pushToast, refresh],
  );

  const createClientAccount = React.useCallback(
    async (payload: {
      companyName: string;
      contactName: string;
      email: string;
      phone?: string;
      address?: string;
      website?: string;
      status?: ClientStatus;
    }) => {
      try {
        const supabase = createClient();
        await adminCreateClientAccount(supabase, payload);
        pushToast("Client créé.", "success");
        await refresh();
      } catch (e) {
        pushToast(formatPortalError(e), "warning");
        throw e;
      }
    },
    [pushToast, refresh],
  );

  const updateClientAccount = React.useCallback(
    async (payload: {
      clientId: string;
      companyName: string;
      contactName: string;
      email: string;
      phone?: string;
      address?: string;
      website?: string;
      status?: ClientStatus;
    }) => {
      try {
        const supabase = createClient();
        await adminUpdateClientAccount(supabase, payload);
        pushToast("Fiche client mise à jour.", "success");
        await refresh();
      } catch (e) {
        pushToast(formatPortalError(e), "warning");
        throw e;
      }
    },
    [pushToast, refresh],
  );

  const addInternalNote = React.useCallback(
    async (clientId: string, note: string) => {
      try {
        const supabase = createClient();
        await adminAddInternalNote(supabase, clientId, note);
        pushToast("Note interne ajoutée.", "success");
        await refresh();
      } catch (e) {
        pushToast(formatPortalError(e), "warning");
        throw e;
      }
    },
    [pushToast, refresh],
  );

  const markNotificationRead = React.useCallback(
    async (id: string) => {
      try {
        const supabase = createClient();
        await markAdminNotificationRead(supabase, id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, readAt: new Date().toISOString() } : n)),
        );
      } catch (e) {
        pushToast(formatPortalError(e), "warning");
      }
    },
    [pushToast],
  );

  const createProject = React.useCallback(
    async (payload: NewProjectPayload) => {
      if (!userId) throw new Error("Session expirée. Reconnectez-vous.");
      try {
        const supabase = createClient();
        await insertProject(supabase, {
          clientId: payload.clientId,
          name: payload.name,
          description: payload.description,
          owner: payload.owner,
          startDate: payload.startDate,
          targetDate: payload.targetDate,
          nextStep: payload.nextStep,
          internalNotes: payload.internalNotes,
          createdBy: userId,
        });
        const clientMeta = getClientMeta(payload.clientId);
        void syncProjectCreation({
          clientId: payload.clientId,
          name: payload.name,
          description: payload.description,
          owner: payload.owner,
          startDate: payload.startDate,
          targetDate: payload.targetDate,
          nextStep: payload.nextStep,
          internalNotes: payload.internalNotes,
          clientName: clientMeta.companyName,
          clientEmail: clientMeta.email,
        });
        pushToast("Projet créé.", "success");
        await refresh();
      } catch (e) {
        pushToast(formatPortalError(e), "warning");
        throw e;
      }
    },
    [getClientMeta, pushToast, refresh, userId],
  );

  const updateProjectProgress = React.useCallback(
    async (id: string, progress: number) => {
      try {
        const supabase = createClient();
        const next = Math.max(0, Math.min(100, progress));
        await updateProjectProgressDb(supabase, id, next);
        pushToast("Progression mise à jour.", "info");
        await refresh();
      } catch (e) {
        pushToast(formatPortalError(e), "warning");
        throw e;
      }
    },
    [pushToast, refresh],
  );

  const updateAuthAvatar = React.useCallback((url: string | null) => {
    setAuthUser((prev) => (prev ? { ...prev, avatarUrl: url } : prev));
  }, []);

  const updateAuthFullName = React.useCallback((name: string) => {
    const trimmed = name.trim();
    setAuthUser((prev) => (prev ? { ...prev, fullName: trimmed || null } : prev));
  }, []);

  return (
    <PortalContext.Provider
      value={{
        mode,
        lockClientMode,
        canSwitchMode,
        authUser,
        loading,
        error,
        refresh,
        patchClient,
        selectedClientId,
        setSelectedClientId,
        clients,
        projects,
        documents,
        demands,
        messages,
        siteLeads,
        notifications,
        internalNotes,
        activityLog,
        toasts,
        dismissToast,
        updateAuthAvatar,
        updateAuthFullName,
        submitClientDemand,
        uploadClientDocument,
        downloadDocument,
        sendMessage,
        requestDocument,
        validateDocument,
        refuseDocument,
        updateDemandStatus,
        updateSiteLeadStatus,
        createClientAccount,
        updateClientAccount,
        addInternalNote,
        markNotificationRead,
        createProject,
        updateProjectProgress,
      }}
    >
      {children}
    </PortalContext.Provider>
  );
}

export function usePortal() {
  const ctx = React.useContext(PortalContext);
  if (!ctx) {
    throw new Error("usePortal doit être utilisé dans PortalProvider.");
  }
  return ctx;
}
