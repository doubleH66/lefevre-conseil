"use client";

import * as React from "react";
import type { ClientStatus } from "@/components/portal/types";

const fieldClass =
  "h-11 w-full rounded-xl border border-neutral-200 px-3 text-sm outline-none focus:border-[#1f2a7c]/40 focus:ring-2 focus:ring-[#1f2a7c]/15";

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

  if (!open) return null;

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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="client-form-title"
        className="max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-xl"
      >
        <h2 id="client-form-title" className="text-lg font-semibold text-neutral-900">
          {initial?.clientId ? "Modifier le client" : "Nouveau client"}
        </h2>
        <form onSubmit={(e) => void handleSubmit(e)} className="mt-4 space-y-3">
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-neutral-700">Raison sociale / nom</span>
            <input required value={companyName} onChange={(e) => setCompanyName(e.target.value)} className={fieldClass} />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-neutral-700">Contact principal</span>
            <input required value={contactName} onChange={(e) => setContactName(e.target.value)} className={fieldClass} />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-neutral-700">E-mail</span>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={fieldClass} />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-neutral-700">Téléphone</span>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className={fieldClass} />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-neutral-700">Adresse</span>
            <input value={address} onChange={(e) => setAddress(e.target.value)} className={fieldClass} />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-neutral-700">Site web</span>
            <input value={website} onChange={(e) => setWebsite(e.target.value)} className={fieldClass} />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-neutral-700">Statut dossier</span>
            <select value={status} onChange={(e) => setStatus(e.target.value as ClientStatus)} className={fieldClass}>
              <option value="Actif">Actif</option>
              <option value="En attente">En attente</option>
              <option value="À relancer">À relancer</option>
            </select>
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="rounded-xl border border-neutral-300 px-4 py-2 text-sm font-medium">
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-[#1f2a7c] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {loading ? "Enregistrement…" : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
