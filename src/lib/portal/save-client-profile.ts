import type { SupabaseClient } from "@supabase/supabase-js";
import {
  parseClientProfileFormData,
  type ClientProfileFields,
} from "@/lib/portal/client-profile-form";

type RpcRow = {
  company_name: string;
  contact_name: string;
  phone: string | null;
  address: string | null;
  website: string | null;
};

function rpcRowToFields(row: RpcRow): ClientProfileFields {
  return {
    companyName: row.company_name,
    contactName: row.contact_name,
    phone: row.phone ?? "",
    address: row.address ?? "",
    website: row.website ?? "",
  };
}

export type SaveClientProfileResult =
  | { ok: true; profile: ClientProfileFields }
  | { ok: false; error: string };

/** Enregistrement profil — même client Supabase que le chargement du portail (session navigateur). */
export async function saveClientProfile(
  supabase: SupabaseClient,
  formData: FormData,
): Promise<SaveClientProfileResult> {
  const parsed = parseClientProfileFormData(formData);
  if ("error" in parsed) return { ok: false, error: parsed.error };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Session expirée. Reconnectez-vous." };

  const { data: rows, error } = await supabase.rpc("update_my_client_account", {
    p_company_name: parsed.companyName,
    p_contact_name: parsed.contactName,
    p_phone: parsed.phone || null,
    p_address: parsed.address || null,
    p_website: parsed.website || null,
  });

  if (error) return { ok: false, error: error.message };

  const row = (Array.isArray(rows) ? rows[0] : rows) as RpcRow | null;
  if (!row) {
    return { ok: false, error: "Enregistrement impossible. Réessayez." };
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ full_name: parsed.contactName })
    .eq("id", user.id);
  if (profileError) return { ok: false, error: profileError.message };

  return { ok: true, profile: rpcRowToFields(row) };
}
