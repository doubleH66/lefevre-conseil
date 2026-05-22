import type { SupabaseClient } from "@supabase/supabase-js";
import { formatDateTimeFr } from "@/lib/portal/format";
import { profileClientSnapshot, profileLog } from "@/lib/portal/profile-debug-log";

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
  profileLog("updateClientProfile — entrée", {
    clientId: input.clientId,
    payload: {
      companyName: input.companyName,
      contactName: input.contactName,
      phone: input.phone,
      address: input.address,
      website: input.website,
    },
  });

  const { data: rpcData, error: rpcError } = await supabase.rpc("update_my_client_account", {
    p_company_name: input.companyName,
    p_contact_name: input.contactName,
    p_phone: input.phone || null,
    p_address: input.address || null,
    p_website: input.website || null,
  });

  profileLog("updateClientProfile — RPC update_my_client_account", {
    rpcError: rpcError?.message ?? null,
    rpcCode: rpcError?.code ?? null,
    rpcDataPreview: rpcData,
  });

  if (!rpcError && rpcData) {
    const row = (Array.isArray(rpcData) ? rpcData[0] : rpcData) as ClientAccountRow | undefined;
    if (row?.id) {
      const mapped = mapRow(row);
      profileLog("updateClientProfile — OK via RPC", profileClientSnapshot(mapped));
      return mapped;
    }
  }

  const isMissingRpc =
    rpcError?.message?.includes("update_my_client_account") ||
    rpcError?.code === "42883" ||
    rpcError?.code === "PGRST202";

  if (!isMissingRpc && rpcError) throw rpcError;

  profileLog("updateClientProfile — repli UPDATE direct client_accounts", {
    isMissingRpc,
    clientId: input.clientId,
  });

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

  profileLog("updateClientProfile — repli UPDATE résultat", {
    error: error?.message ?? null,
    rows: data ? 1 : 0,
    data,
  });

  if (error) throw error;
  if (!data) {
    throw new Error(
      "Enregistrement refusé. Exécutez les migrations 004 et 010 dans Supabase, puis réessayez.",
    );
  }

  const mapped = mapRow(data as ClientAccountRow);
  profileLog("updateClientProfile — OK via repli", profileClientSnapshot(mapped));
  return mapped;
}
