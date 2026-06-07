"use client";

import * as React from "react";
import type { PortalClient } from "@/components/portal/types";
import { createClient } from "@/lib/supabase/client";
import { formatPortalError } from "@/lib/portal/errors";
import { profileFieldsFromClient } from "@/lib/portal/portal-client-patch";
import { saveClientProfile, type SavedClientProfile } from "@/lib/portal/save-client-profile";

type ProfileEditFormProps = {
  client: PortalClient;
  onCancel: () => void;
  onSaved: (saved: SavedClientProfile) => void;
};

/** Formulaire d’édition - states locaux uniquement pendant la session d’édition. */
export function ProfileEditForm({ client, onCancel, onSaved }: ProfileEditFormProps) {
  const initial = profileFieldsFromClient(client);
  const [companyName, setCompanyName] = React.useState(initial.companyName);
  const [contactName, setContactName] = React.useState(initial.contactName);
  const [phone, setPhone] = React.useState(initial.phone);
  const [address, setAddress] = React.useState(initial.address);
  const [website, setWebsite] = React.useState(initial.website);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);

    const payload = {
      companyName: companyName.trim(),
      contactName: contactName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      website: website.trim(),
    };

    if (!payload.companyName || !payload.contactName) {
      setError("Entreprise et nom de contact sont obligatoires.");
      setBusy(false);
      return;
    }

    try {
      const supabase = createClient();
      const result = await saveClientProfile(supabase, payload);
      if (!result.ok) {
        throw new Error(result.error);
      }
      onSaved(result.saved);
    } catch (err) {
      setError(formatPortalError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form
      onSubmit={(e) => void handleSubmit(e)}
      className="grid gap-3 border-t border-neutral-100 pt-6 text-sm text-neutral-700"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-semibold text-neutral-900">Modifier vos informations</h3>
      </div>

      <label>
        Entreprise
        <input
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          required
          autoComplete="organization"
          className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2"
        />
      </label>
      <label>
        Contact
        <input
          value={contactName}
          onChange={(e) => setContactName(e.target.value)}
          required
          autoComplete="name"
          className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2"
        />
      </label>
      <label>
        Email
        <input
          value={client.email}
          readOnly
          className="mt-1 w-full rounded-xl border border-neutral-100 bg-neutral-50 px-3 py-2 text-neutral-500"
        />
      </label>
      <label>
        Téléphone
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          autoComplete="tel"
          className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2"
        />
      </label>
      <label>
        Adresse
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          autoComplete="street-address"
          className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2"
        />
      </label>
      <label>
        Site web
        <input
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          autoComplete="url"
          className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2"
        />
      </label>

      <div className="mt-1 flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={busy}
          className="rounded-xl bg-[#1f2a7c] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {busy ? "Enregistrement…" : "Enregistrer"}
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={onCancel}
          className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-800 hover:bg-neutral-50 disabled:opacity-50"
        >
          Annuler
        </button>
      </div>

      {error ? (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}
