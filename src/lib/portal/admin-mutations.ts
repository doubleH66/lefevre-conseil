import type { SupabaseClient } from "@supabase/supabase-js";
import type { ClientStatus, MutuelleLeadStatus, SiteLeadStatus } from "@/components/portal/types";
import { formatPortalError } from "@/lib/portal/errors";

function rpcError(error: { message: string } | null, context: string): void {
  if (error) throw new Error(formatPortalError({ message: `${context} : ${error.message}` }));
}

export async function adminCreateClientAccount(
  supabase: SupabaseClient,
  input: {
    companyName: string;
    contactName: string;
    email: string;
    phone?: string;
    address?: string;
    website?: string;
    status?: ClientStatus;
  },
) {
  const { data, error } = await supabase.rpc("admin_create_client_account", {
    p_company_name: input.companyName,
    p_contact_name: input.contactName,
    p_email: input.email,
    p_phone: input.phone ?? null,
    p_address: input.address ?? null,
    p_website: input.website ?? null,
    p_status: input.status ?? "Actif",
  });
  rpcError(error, "Création client");
  return data;
}

export async function adminUpdateClientAccount(
  supabase: SupabaseClient,
  input: {
    clientId: string;
    companyName: string;
    contactName: string;
    email: string;
    phone?: string;
    address?: string;
    website?: string;
    status?: ClientStatus;
  },
) {
  const { data, error } = await supabase.rpc("admin_update_client_account", {
    p_client_id: input.clientId,
    p_company_name: input.companyName,
    p_contact_name: input.contactName,
    p_email: input.email,
    p_phone: input.phone ?? null,
    p_address: input.address ?? null,
    p_website: input.website ?? null,
    p_status: input.status ?? "Actif",
  });
  rpcError(error, "Mise à jour client");
  return data;
}

export async function adminUpdateMutuelleLeadStatus(
  supabase: SupabaseClient,
  leadId: string,
  status: MutuelleLeadStatus,
  adminNotes?: string,
) {
  const { data, error } = await supabase.rpc("admin_update_mutuelle_lead_status", {
    p_lead_id: leadId,
    p_status: status,
    p_admin_notes: adminNotes ?? null,
  });
  rpcError(error, "Mise à jour demande mutuelle");
  return data;
}

export async function adminUpdateSiteLeadStatus(
  supabase: SupabaseClient,
  leadId: string,
  status: SiteLeadStatus,
  adminNotes?: string,
) {
  const { data, error } = await supabase.rpc("admin_update_site_lead_status", {
    p_lead_id: leadId,
    p_status: status,
    p_admin_notes: adminNotes ?? null,
  });
  rpcError(error, "Mise à jour demande");
  return data;
}

export async function adminAddInternalNote(
  supabase: SupabaseClient,
  clientId: string,
  note: string,
  projectId?: string | null,
) {
  const { data, error } = await supabase.rpc("admin_add_internal_note", {
    p_client_id: clientId,
    p_note: note,
    p_project_id: projectId ?? null,
  });
  rpcError(error, "Ajout note interne");
  return data;
}

export async function adminSendPortalMessage(supabase: SupabaseClient, clientId: string, body: string) {
  const { data, error } = await supabase.rpc("admin_send_portal_message", {
    p_client_id: clientId,
    p_body: body,
  });
  rpcError(error, "Envoi message");
  return data;
}

export async function markAdminNotificationRead(supabase: SupabaseClient, notificationId: string) {
  const { error } = await supabase
    .from("admin_notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("id", notificationId);
  if (error) throw error;
}
