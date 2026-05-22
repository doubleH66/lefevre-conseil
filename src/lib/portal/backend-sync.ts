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

function normalizeRecipients(to: string | string[]): string[] {
  const list = Array.isArray(to) ? to : [to];
  return list.map((e) => e.trim()).filter((e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));
}

/** E-mails transactionnels (optionnels). N'échoue jamais l'action portail principale. */
async function invokeNotify(payload: NotifyPayload) {
  if (!enabled()) return;

  const recipients = normalizeRecipients(payload.to);
  if (recipients.length === 0) return;

  try {
    const supabase = createClient();
    const { data, error } = await supabase.functions.invoke("portal-notify", {
      body: { ...payload, to: recipients.length === 1 ? recipients[0] : recipients },
    });

    if (error) {
      console.warn("portal-notify:", error.message);
      return;
    }

    const result = data as { ok?: boolean; skipped?: boolean; reason?: string; error?: string } | null;
    if (result?.skipped) {
      if (process.env.NODE_ENV === "development") {
        console.info("portal-notify ignoré:", result.reason ?? "non configuré");
      }
      return;
    }
    if (result && result.ok === false && result.error) {
      console.warn("portal-notify:", result.error, result);
    }
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
  void input;
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

  await invokeNotify({
    to: input.clientEmail,
    subject: `Document reçu : ${input.documentName}`,
    clientName: input.clientName,
    text: `Bonjour,\n\nVotre document "${input.documentName}" a bien été reçu par le cabinet.`,
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
