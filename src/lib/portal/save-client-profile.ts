import type { SupabaseClient } from "@supabase/supabase-js";
import { formatDateTimeFr } from "@/lib/portal/format";
import { profileDebugLog } from "@/lib/portal/profile-debug";
import {
  parseClientProfileFormData,
  type ClientProfileFields,
} from "@/lib/portal/client-profile-form";

export type SavedClientProfile = {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  lastActivity: string;
  updatedAtIso: string;
};

type RpcRow = {
  id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string | null;
  address: string | null;
  website: string | null;
  updated_at?: string;
};

function mapRpcRow(row: RpcRow): SavedClientProfile {
  return {
    id: row.id,
    companyName: row.company_name,
    contactName: row.contact_name,
    email: row.email,
    phone: row.phone ?? "",
    address: row.address ?? "",
    website: row.website ?? "",
    lastActivity: formatDateTimeFr(row.updated_at),
    updatedAtIso: row.updated_at ?? "",
  };
}

export type SaveClientProfileResult =
  | { ok: true; saved: SavedClientProfile }
  | { ok: false; error: string };

/**
 * Enregistrement profil via le client Supabase navigateur (même session que le chargement).
 * Même pattern que AdminPublicMediaPage / ProfileAvatarField : RPC directe, pas de Server Action.
 */
export async function saveClientProfile(
  supabase: SupabaseClient,
  input: FormData | ClientProfileFields,
): Promise<SaveClientProfileResult> {
  const fields = input instanceof FormData ? parseClientProfileFormData(input) : input;

  if ("error" in fields) {
    return { ok: false, error: fields.error };
  }

  profileDebugLog("save payload", fields);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    profileDebugLog("save error", { reason: "no_session" });
    return { ok: false, error: "Session expirée. Reconnectez-vous." };
  }

  const { data: rows, error } = await supabase.rpc("update_my_client_account", {
    p_company_name: fields.companyName,
    p_contact_name: fields.contactName,
    p_phone: fields.phone || null,
    p_address: fields.address || null,
    p_website: fields.website || null,
  });

  profileDebugLog("rpc response", { error: error?.message ?? null, rows });

  if (error) {
    return { ok: false, error: error.message };
  }

  const row = (Array.isArray(rows) ? rows[0] : rows) as RpcRow | null;
  if (!row?.id) {
    profileDebugLog("save error", { reason: "empty_rpc_row" });
    return { ok: false, error: "Enregistrement impossible. Réessayez." };
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ full_name: fields.contactName })
    .eq("id", user.id);

  if (profileError) {
    profileDebugLog("profiles.update error", { message: profileError.message });
    return { ok: false, error: profileError.message };
  }

  const saved = mapRpcRow(row);
  profileDebugLog("save OK", saved);
  return { ok: true, saved };
}
