"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { ensureClientMembership } from "@/lib/portal/load-portal-data";
import { updateClientProfile } from "@/lib/portal/update-client-profile";
import type { SavedClientProfile } from "@/lib/portal/update-client-profile";

/** Enregistre le profil lié à la session (cookies) : RPC puis profil utilisateur si besoin. */
export async function saveClientProfileAction(fields: {
  companyName: string;
  contactName: string;
  phone: string;
  address: string;
  website: string;
}): Promise<SavedClientProfile> {
  const companyName = fields.companyName.trim();
  const contactName = fields.contactName.trim();

  if (!companyName || !contactName) {
    throw new Error("Entreprise et nom de contact sont obligatoires.");
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Session expirée. Reconnectez-vous.");
  }

  const clientId = await ensureClientMembership(supabase);
  if (!clientId) {
    throw new Error("Impossible d'associer votre compte client.");
  }

  const saved = await updateClientProfile(supabase, {
    clientId,
    companyName,
    contactName,
    phone: fields.phone.trim(),
    address: fields.address.trim(),
    website: fields.website.trim(),
  });

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ full_name: contactName })
    .eq("id", user.id);

  if (profileError) {
    throw new Error(profileError.message || "Erreur lors de la mise à jour du profil utilisateur.");
  }

  revalidatePath("/espace-client", "layout");
  revalidatePath("/espace-client/profil");

  return saved;
}
