import type { SupabaseClient } from "@supabase/supabase-js";
import type { DocumentStatus, Priority } from "@/components/portal/types";

const PORTAL_BUCKET = "portal-documents";

export async function insertClientDemand(supabase: SupabaseClient, clientId: string, content: string, userId: string) {
  const { error } = await supabase.from("client_demands").insert({
    client_id: clientId,
    content,
    status: "Reçue",
    created_by: userId,
  });
  if (error) throw error;
}

export async function insertPortalMessage(
  supabase: SupabaseClient,
  input: { clientId: string; senderType: "client" | "team"; body: string; userId: string },
) {
  const { error } = await supabase.from("portal_messages").insert({
    client_id: input.clientId,
    sender_type: input.senderType,
    body: input.body,
    sender_id: input.userId,
    status: "Envoyé",
  });
  if (error) throw error;
}

export async function insertDocumentRequest(
  supabase: SupabaseClient,
  payload: {
    clientId: string;
    projectId: string;
    name: string;
    description: string;
    dueDate: string;
    priority: Priority;
    message: string;
    requestedBy: string;
  },
) {
  const { error } = await supabase.from("document_requests").insert({
    client_id: payload.clientId,
    project_id: payload.projectId?.trim() ? payload.projectId : null,
    name: payload.name,
    description: payload.description || null,
    due_date: payload.dueDate || null,
    priority: payload.priority,
    status: "Demandé",
    message: payload.message || null,
    requested_by: payload.requestedBy,
  });
  if (error) throw error;
}

export async function updateDocumentRequestStatus(
  supabase: SupabaseClient,
  id: string,
  status: DocumentStatus,
  comment?: string,
) {
  const { error } = await supabase
    .from("document_requests")
    .update({
      status,
      ...(comment !== undefined ? { message: comment } : {}),
    })
    .eq("id", id);
  if (error) throw error;
}

/** Refus avec possibilité de renvoi par le client. */
export async function requestDocumentCorrection(
  supabase: SupabaseClient,
  id: string,
  comment: string,
) {
  return updateDocumentRequestStatus(supabase, id, "À corriger", comment);
}

export async function updateClientDemandStatus(
  supabase: SupabaseClient,
  id: string,
  status: "Reçue" | "En cours" | "Traitée",
) {
  const { error } = await supabase.from("client_demands").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function insertProject(
  supabase: SupabaseClient,
  payload: {
    clientId: string;
    name: string;
    description: string;
    owner: string;
    startDate: string;
    targetDate: string;
    nextStep: string;
    internalNotes: string;
    createdBy: string;
  },
) {
  const { error } = await supabase.from("projects").insert({
    client_id: payload.clientId,
    name: payload.name,
    description: payload.description || null,
    status: "En attente",
    progress: 5,
    start_date: payload.startDate || null,
    target_date: payload.targetDate || null,
    next_step: payload.nextStep || null,
    owner_name: payload.owner || null,
    internal_notes: payload.internalNotes || null,
    created_by: payload.createdBy,
  });
  if (error) throw error;
}

export async function updateProjectProgressDb(supabase: SupabaseClient, id: string, progress: number) {
  const status = progress >= 100 ? "Terminé" : progress > 0 ? "En cours" : "En attente";
  const { error } = await supabase.from("projects").update({ progress, status }).eq("id", id);
  if (error) throw error;
}

export async function uploadDocumentForRequest(
  supabase: SupabaseClient,
  input: {
    clientId: string;
    requestId: string;
    projectId: string | null;
    file: File;
    comment?: string;
    userId: string;
  },
) {
  const safeName = input.file.name.replace(/[^\w.\-() ]+/g, "_");
  const path = `${input.clientId}/${input.projectId ?? "general"}/${Date.now()}-${safeName}`;

  const { error: uploadError } = await supabase.storage.from(PORTAL_BUCKET).upload(path, input.file, {
    upsert: false,
    contentType: input.file.type || undefined,
  });
  if (uploadError) throw uploadError;

  const { error: docError } = await supabase.from("documents").insert({
    client_id: input.clientId,
    project_id: input.projectId,
    request_id: input.requestId,
    storage_path: path,
    original_name: input.file.name,
    status: "Reçu",
    comment: input.comment ?? null,
    uploaded_by: input.userId,
  });
  if (docError) throw docError;

  const { error: reqError } = await supabase
    .from("document_requests")
    .update({ status: "Envoyé" })
    .eq("id", input.requestId);
  if (reqError) throw reqError;

  return path;
}

export async function getSignedDocumentUrl(supabase: SupabaseClient, storagePath: string) {
  const { data, error } = await supabase.storage.from(PORTAL_BUCKET).createSignedUrl(storagePath, 3600);
  if (error) throw error;
  return data.signedUrl;
}
