import { createClient } from "@/lib/supabase/client";
import { isSupabasePublicConfigured } from "@/lib/supabase/public-env";

type NotifyPayload = {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  clientName?: string;
};

function enabled() {
  return isSupabasePublicConfigured();
}

async function invokeNotify(payload: NotifyPayload) {
  if (!enabled()) return;
  try {
    const supabase = createClient();
    await supabase.functions.invoke("portal-notify", { body: payload });
  } catch (error) {
    console.warn("portal-notify invocation failed:", error);
  }
}

export async function syncClientDemand(input: {
  clientId: string;
  content: string;
  clientName: string;
  clientEmail: string;
}) {
  if (!enabled()) return;
  try {
    const supabase = createClient();
    await supabase.from("client_demands").insert({
      client_id: input.clientId,
      content: input.content,
      status: "Reçue",
    });
  } catch (error) {
    console.warn("sync client demand failed:", error);
  }

  await invokeNotify({
    to: input.clientEmail,
    subject: "Votre demande a bien été reçue",
    clientName: input.clientName,
    text: `Bonjour,\n\nVotre demande a bien été enregistrée :\n"${input.content}"\n\nL'équipe revient vers vous rapidement.`,
  });
}

export async function syncDocumentRequest(input: {
  clientId: string;
  projectId: string;
  name: string;
  description?: string;
  dueDate?: string;
  priority: "Normal" | "Important" | "Urgent";
  message?: string;
  clientName: string;
  clientEmail: string;
}) {
  if (!enabled()) return;
  try {
    const supabase = createClient();
    await supabase.from("document_requests").insert({
      client_id: input.clientId,
      project_id: input.projectId,
      name: input.name,
      description: input.description ?? null,
      due_date: input.dueDate || null,
      priority: input.priority,
      status: "Demandé",
      message: input.message ?? null,
    });
  } catch (error) {
    console.warn("sync document request failed:", error);
  }

  await invokeNotify({
    to: input.clientEmail,
    subject: `Nouvelle pièce demandée : ${input.name}`,
    clientName: input.clientName,
    text:
      `Bonjour,\n\nUne nouvelle pièce est demandée dans votre espace client.\n` +
      `Pièce : ${input.name}\nPriorité : ${input.priority}\n` +
      `${input.dueDate ? `Date limite : ${input.dueDate}\n` : ""}` +
      `${input.message ? `Message : ${input.message}\n` : ""}`,
  });
}

export async function syncProjectCreation(input: {
  clientId: string;
  name: string;
  description?: string;
  owner?: string;
  startDate?: string;
  targetDate?: string;
  nextStep?: string;
  internalNotes?: string;
  clientName: string;
  clientEmail: string;
}) {
  if (!enabled()) return;
  try {
    const supabase = createClient();
    await supabase.from("projects").insert({
      client_id: input.clientId,
      name: input.name,
      description: input.description ?? null,
      status: "En attente",
      progress: 5,
      start_date: input.startDate || null,
      target_date: input.targetDate || null,
      next_step: input.nextStep || null,
      owner_name: input.owner || null,
      internal_notes: input.internalNotes || null,
    });
  } catch (error) {
    console.warn("sync project creation failed:", error);
  }

  await invokeNotify({
    to: input.clientEmail,
    subject: `Nouveau projet créé : ${input.name}`,
    clientName: input.clientName,
    text: `Bonjour,\n\nUn nouveau projet a été créé dans votre espace : ${input.name}.`,
  });
}

export async function syncPortalMessage(input: {
  clientId: string;
  senderType: "client" | "team";
  body: string;
}) {
  if (!enabled()) return;
  try {
    const supabase = createClient();
    await supabase.from("portal_messages").insert({
      client_id: input.clientId,
      sender_type: input.senderType,
      body: input.body,
      status: "Envoyé",
    });
  } catch (error) {
    console.warn("sync portal message failed:", error);
  }
}

export async function syncDocumentUpload(input: {
  clientId: string;
  projectId?: string;
  documentName: string;
  comment?: string;
  clientName: string;
  clientEmail: string;
}) {
  if (!enabled()) return;
  try {
    const supabase = createClient();
    await supabase.from("documents").insert({
      client_id: input.clientId,
      project_id: input.projectId ?? null,
      storage_path: `${input.clientId}/mock/${Date.now()}-${slugify(input.documentName)}.txt`,
      original_name: input.documentName,
      status: "Reçu",
      comment: input.comment ?? null,
    });
  } catch (error) {
    console.warn("sync document upload failed:", error);
  }

  await invokeNotify({
    to: input.clientEmail,
    subject: `Document reçu : ${input.documentName}`,
    clientName: input.clientName,
    text: `Bonjour,\n\nVotre document "${input.documentName}" a bien été reçu.`,
  });
}

export async function syncDocumentStatusNotice(input: {
  clientName: string;
  clientEmail: string;
  documentName: string;
  status: "Validé" | "Refusé" | "À corriger";
  comment?: string;
}) {
  if (!enabled()) return;
  await invokeNotify({
    to: input.clientEmail,
    subject: `Document ${input.status.toLowerCase()} : ${input.documentName}`,
    clientName: input.clientName,
    text:
      `Bonjour,\n\nLe document "${input.documentName}" est maintenant : ${input.status}.` +
      `${input.comment ? `\nCommentaire : ${input.comment}` : ""}`,
  });
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

