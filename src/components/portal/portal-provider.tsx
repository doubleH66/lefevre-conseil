"use client";

import * as React from "react";
import type { ReactNode } from "react";
import type {
  PortalClient,
  PortalDemand,
  PortalDocument,
  PortalMessage,
  PortalProject,
  Priority,
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
import {
  ensureClientMembership,
  loadAdminPortalData,
  loadClientPortalData,
} from "@/lib/portal/load-portal-data";
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
  refresh: () => Promise<void>;
  selectedClientId: string;
  setSelectedClientId: (id: string) => void;
  clients: PortalClient[];
  projects: PortalProject[];
  documents: PortalDocument[];
  demands: PortalDemand[];
  messages: PortalMessage[];
  toasts: PortalToast[];
  dismissToast: (id: string) => void;
  updateAuthAvatar: (url: string | null) => void;
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
  const [toasts, setToasts] = React.useState<PortalToast[]>([]);

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

  const refresh = React.useCallback(async () => {
    if (!isSupabasePublicConfigured()) {
      setError("Connexion Supabase non configurée. Ajoutez les variables d'environnement du projet.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setAuthUser(null);
        setError("Session expirée. Reconnectez-vous.");
        setLoading(false);
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
      setCanSwitchMode(isAdmin && !lockClientMode);

      if (mode === "admin" && isAdmin) {
        const data = await loadAdminPortalData(supabase);
        setClients(data.clients);
        setProjects(data.projects);
        setDocuments(data.documents);
        setDemands(data.demands);
        setMessages(data.messages);
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
          setLoading(false);
          return;
        }

        const data = await loadClientPortalData(supabase, clientId);
        setClients([data.client]);
        setProjects(data.projects);
        setDocuments(data.documents);
        setDemands(data.demands);
        setMessages(data.messages);
        setSelectedClientId(clientId);
      }
    } catch (e) {
      console.warn("portal refresh failed:", e);
      setError(e instanceof Error ? e.message : "Erreur lors du chargement de l'espace.");
    } finally {
      setLoading(false);
    }
  }, [lockClientMode, mode]);

  React.useEffect(() => {
    void refresh();
  }, [refresh]);

  const submitClientDemand = React.useCallback(
    async (content: string) => {
      if (!content.trim() || !selectedClientId || !userId) return;
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
    },
    [getClientMeta, pushToast, refresh, selectedClientId, userId],
  );

  const uploadClientDocument = React.useCallback(
    async (documentId: string, file: File, comment?: string) => {
      const target = documents.find((doc) => doc.id === documentId);
      if (!target || !userId) return;
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
    },
    [documents, getClientMeta, pushToast, refresh, userId],
  );

  const downloadDocument = React.useCallback(
    async (storagePath: string) => {
      const supabase = createClient();
      const url = await getSignedDocumentUrl(supabase, storagePath);
      window.open(url, "_blank", "noopener,noreferrer");
    },
    [],
  );

  const sendMessage = React.useCallback(
    async (text: string) => {
      if (!text.trim() || !selectedClientId || !userId) return;
      const supabase = createClient();
      const senderType = mode === "client" ? "client" : "team";
      await insertPortalMessage(supabase, {
        clientId: selectedClientId,
        senderType,
        body: text.trim(),
        userId,
      });
      void syncPortalMessage({
        clientId: selectedClientId,
        senderType,
        body: text.trim(),
      });
      pushToast("Message envoyé.", "success");
      await refresh();
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
      if (!userId) return;
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
    },
    [getClientMeta, pushToast, refresh, userId],
  );

  const validateDocument = React.useCallback(
    async (id: string) => {
      const target = documents.find((doc) => doc.id === id);
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
    },
    [documents, getClientMeta, pushToast, refresh],
  );

  const refuseDocument = React.useCallback(
    async (id: string, comment: string) => {
      const target = documents.find((doc) => doc.id === id);
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
    },
    [documents, getClientMeta, pushToast, refresh],
  );

  const updateDemandStatus = React.useCallback(
    async (id: string, status: "Reçue" | "En cours" | "Traitée") => {
      const supabase = createClient();
      await updateClientDemandStatus(supabase, id, status);
      pushToast("Demande mise à jour.", "success");
      await refresh();
    },
    [pushToast, refresh],
  );

  const createProject = React.useCallback(
    async (payload: NewProjectPayload) => {
      if (!userId) return;
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
    },
    [getClientMeta, pushToast, refresh, userId],
  );

  const updateProjectProgress = React.useCallback(
    async (id: string, progress: number) => {
      const supabase = createClient();
      const next = Math.max(0, Math.min(100, progress));
      await updateProjectProgressDb(supabase, id, next);
      pushToast("Progression mise à jour.", "info");
      await refresh();
    },
    [pushToast, refresh],
  );

  const updateAuthAvatar = React.useCallback((url: string | null) => {
    setAuthUser((prev) => (prev ? { ...prev, avatarUrl: url } : prev));
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
        selectedClientId,
        setSelectedClientId,
        clients,
        projects,
        documents,
        demands,
        messages,
        toasts,
        dismissToast,
        updateAuthAvatar,
        submitClientDemand,
        uploadClientDocument,
        downloadDocument,
        sendMessage,
        requestDocument,
        validateDocument,
        refuseDocument,
        updateDemandStatus,
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
