import type { PortalClient } from "@/components/portal/types";

export type ClientProfileFields = {
  companyName: string;
  contactName: string;
  phone: string;
  address: string;
  website: string;
};

export function portalClientToFields(client: PortalClient): ClientProfileFields {
  return {
    companyName: client.companyName,
    contactName: client.contactName,
    phone: client.phone,
    address: client.address,
    website: client.website,
  };
}

export function parseClientProfileFormData(formData: FormData): ClientProfileFields | { error: string } {
  const companyName = String(formData.get("companyName") ?? "").trim();
  const contactName = String(formData.get("contactName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const website = String(formData.get("website") ?? "").trim();

  if (!companyName || !contactName) {
    return { error: "Entreprise et contact sont obligatoires." };
  }

  return { companyName, contactName, phone, address, website };
}

export function fieldsToFormData(fields: ClientProfileFields): FormData {
  const fd = new FormData();
  fd.set("companyName", fields.companyName);
  fd.set("contactName", fields.contactName);
  fd.set("phone", fields.phone);
  fd.set("address", fields.address);
  fd.set("website", fields.website);
  return fd;
}
