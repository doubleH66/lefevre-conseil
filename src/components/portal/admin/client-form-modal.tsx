"use client";

import * as React from "react";
import { AdminBtn, AdminModal, adminFieldClass, adminSelectClass } from "@/components/portal/admin/admin-ui";
import type { ClientStatus } from "@/components/portal/types";

export function ClientFormModal({
  open,
  onClose,
  initial,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  initial?: {
    clientId?: string;
    companyName: string;
    contactName: string;
    email: string;
    phone: string;
    address: string;
    website: string;
    status: ClientStatus;
  };
  onSubmit: (payload: {
    clientId?: string;
    companyName: string;
    contactName: string;
    email: string;
    phone?: string;
    address?: string;
    website?: string;
    status?: ClientStatus;
  }) => Promise<void>;
}) {
  const [companyName, setCompanyName] = React.useState("");
  const [contactName, setContactName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [website, setWebsite] = React.useState("");
  const [status, setStatus] = React.useState<ClientStatus>("Actif");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    setCompanyName(initial?.companyName ?? "");
    setContactName(initial?.contactName ?? "");
    setEmail(initial?.email ?? "");
    setPhone(initial?.phone ?? "");
    setAddress(initial?.address ?? "");
    setWebsite(initial?.website ?? "");
    setStatus(initial?.status ?? "Actif");
  }, [open, initial]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({
        clientId: initial?.clientId,
        companyName: companyName.trim(),
        contactName: contactName.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        address: address.trim() || undefined,
        website: website.trim() || undefined,
        status,
      });
      onClose();
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminModal
      open={open}
      onClose={onClose}
      title={initial?.clientId ? "Modifier le client" : "Nouveau client"}
      size="md"
      footer={
        <div className="flex justify-end gap-2">
          <AdminBtn variant="secondary" onClick={onClose}>
            Annuler
          </AdminBtn>
          <AdminBtn type="submit" form="client-form" variant="primary" disabled={loading}>
            {loading ? "Enregistrement…" : "Enregistrer"}
          </AdminBtn>
        </div>
      }
    >
      <form id="client-form" onSubmit={(e) => void handleSubmit(e)} className="grid gap-3 sm:grid-cols-2">
        <label className="block text-xs font-medium text-neutral-600 sm:col-span-2">
          Raison sociale *
          <input required value={companyName} onChange={(e) => setCompanyName(e.target.value)} className={`${adminFieldClass} mt-1`} />
        </label>
        <label className="block text-xs font-medium text-neutral-600">
          Contact *
          <input required value={contactName} onChange={(e) => setContactName(e.target.value)} className={`${adminFieldClass} mt-1`} />
        </label>
        <label className="block text-xs font-medium text-neutral-600">
          E-mail *
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`${adminFieldClass} mt-1`} />
        </label>
        <label className="block text-xs font-medium text-neutral-600">
          Téléphone
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className={`${adminFieldClass} mt-1`} />
        </label>
        <label className="block text-xs font-medium text-neutral-600">
          Statut
          <select value={status} onChange={(e) => setStatus(e.target.value as ClientStatus)} className={`${adminSelectClass} mt-1 w-full`}>
            <option value="Actif">Actif</option>
            <option value="En attente">En attente</option>
            <option value="À relancer">À relancer</option>
          </select>
        </label>
        <label className="block text-xs font-medium text-neutral-600 sm:col-span-2">
          Adresse
          <input value={address} onChange={(e) => setAddress(e.target.value)} className={`${adminFieldClass} mt-1`} />
        </label>
        <label className="block text-xs font-medium text-neutral-600 sm:col-span-2">
          Site web
          <input value={website} onChange={(e) => setWebsite(e.target.value)} className={`${adminFieldClass} mt-1`} />
        </label>
      </form>
    </AdminModal>
  );
}
