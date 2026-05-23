import type { PortalClient } from "@/components/portal/types";
import type { SavedClientProfile } from "@/lib/portal/save-client-profile";

/** Applique la réponse serveur au store portail (évite champs vides après refresh). */
export function portalClientPatchFromSaved(saved: SavedClientProfile): Partial<PortalClient> {
  return {
    companyName: saved.companyName,
    contactName: saved.contactName,
    phone: saved.phone,
    address: saved.address,
    website: saved.website,
    lastActivity: saved.lastActivity,
    updatedAtIso: saved.updatedAtIso,
  };
}

export type ProfileFormFields = {
  companyName: string;
  contactName: string;
  phone: string;
  address: string;
  website: string;
};

export function profileFieldsFromSaved(saved: SavedClientProfile): ProfileFormFields {
  return {
    companyName: saved.companyName,
    contactName: saved.contactName,
    phone: saved.phone,
    address: saved.address,
    website: saved.website,
  };
}

export function profileFieldsFromClient(client: PortalClient): ProfileFormFields {
  return {
    companyName: client.companyName,
    contactName: client.contactName,
    phone: client.phone,
    address: client.address,
    website: client.website,
  };
}
