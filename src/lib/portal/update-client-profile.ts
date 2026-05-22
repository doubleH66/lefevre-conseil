import type { SupabaseClient } from "@supabase/supabase-js";
import { formatDateTimeFr } from "@/lib/portal/format";

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

type ClientAccountRow = {
  id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string | null;
  address: string | null;
  website: string | null;
  updated_at?: string;
};

function mapRow(row: ClientAccountRow): SavedClientProfile {
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

/** Sauvegarde via RPC security definer (migration 010) ou repli direct sur client_accounts. */
export async function updateClientProfile(
  supabase: SupabaseClient,
  input: {
    clientId: string;
    companyName: string;
    contactName: string;
    phone: string;
    address: string;
    website: string;
  },
): Promise<SavedClientProfile> {
  const { data: rpcData, error: rpcError } = await supabase.rpc("update_my_client_account", {
    p_company_name: input.companyName,
    p_contact_name: input.contactName,
    p_phone: input.phone || null,
    p_address: input.address || null,
    p_website: input.website || null,
  });

  if (!rpcError && rpcData) {
    const row = (Array.isArray(rpcData) ? rpcData[0] : rpcData) as ClientAccountRow | undefined;
    if (row?.id) return mapRow(row);
  }

  const isMissingRpc =
    rpcError?.message?.includes("update_my_client_account") ||
    rpcError?.code === "42883" ||
    rpcError?.code === "PGRST202";

  if (!isMissingRpc && rpcError) throw rpcError;

  const { data, error } = await supabase
    .from("client_accounts")
    .update({
      company_name: input.companyName,
      contact_name: input.contactName,
      phone: input.phone || null,
      address: input.address || null,
      website: input.website || null,
    })
    .eq("id", input.clientId)
    .select("id, company_name, contact_name, email, phone, address, website, updated_at")
    .maybeSingle();

  if (error) throw error;
  if (!data) {
    throw new Error(
      "Enregistrement refusé. Exécutez les migrations 004 et 010 dans Supabase, puis réessayez.",
    );
  }

  return mapRow(data as ClientAccountRow);
}
