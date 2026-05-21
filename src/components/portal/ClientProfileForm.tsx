"use client";

import * as React from "react";
import type { PortalClient } from "@/components/portal/types";
import { ProfileAvatarField } from "@/components/portal/ProfileAvatarField";
import { createClient } from "@/lib/supabase/client";
import { usePortal } from "@/components/portal/portal-provider";

export function ClientProfileForm({ client }: { client: PortalClient }) {
  const { authUser, refresh, updateAuthAvatar } = usePortal();
  const [companyName, setCompanyName] = React.useState(client.companyName);
  const [contactName, setContactName] = React.useState(client.contactName);
  const [phone, setPhone] = React.useState(client.phone);
  const [address, setAddress] = React.useState(client.address);
  const [website, setWebsite] = React.useState(client.website);
  const [busy, setBusy] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    setCompanyName(client.companyName);
    setContactName(client.contactName);
    setPhone(client.phone);
    setAddress(client.address);
    setWebsite(client.website);
  }, [client]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("client_accounts")
        .update({
          company_name: companyName.trim(),
          contact_name: contactName.trim(),
          phone: phone.trim() || null,
          address: address.trim() || null,
          website: website.trim() || null,
          status: "Actif",
        })
        .eq("id", client.id);
      if (error) throw error;

      if (authUser?.id) {
        await supabase.from("profiles").update({ full_name: contactName.trim() }).eq("id", authUser.id);
      }

      setMessage("Profil enregistré.");
      await refresh();
    } catch {
      setMessage("Impossible d’enregistrer. Réessayez ou contactez le cabinet.");
    } finally {
      setBusy(false);
    }
  };

  if (!authUser) return null;

  return (
    <div className="space-y-6">
      <ProfileAvatarField
        userId={authUser.id}
        displayName={contactName || authUser.fullName || ""}
        email={authUser.email}
        avatarUrl={authUser.avatarUrl}
        onUpdated={updateAuthAvatar}
      />

      <form onSubmit={(e) => void handleSave(e)} className="grid gap-3 border-t border-neutral-100 pt-6 text-sm text-neutral-700">
        <label>
          Entreprise
          <input
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2"
          />
        </label>
        <label>
          Contact
          <input
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2"
          />
        </label>
        <label>
          Email
          <input value={client.email} readOnly className="mt-1 w-full rounded-xl border border-neutral-100 bg-neutral-50 px-3 py-2 text-neutral-500" />
        </label>
        <label>
          Téléphone
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2"
          />
        </label>
        <label>
          Adresse
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2"
          />
        </label>
        <label>
          Site web
          <input
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2"
          />
        </label>
        <button
          type="submit"
          disabled={busy}
          className="mt-1 w-fit rounded-xl bg-[#1f2a7c] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {busy ? "Enregistrement…" : "Enregistrer"}
        </button>
        {message ? <p className="text-sm text-neutral-600">{message}</p> : null}
      </form>
    </div>
  );
}
