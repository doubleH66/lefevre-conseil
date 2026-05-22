"use client";

import * as React from "react";
import type { PortalClient } from "@/components/portal/types";
import { ProfileAvatarField } from "@/components/portal/ProfileAvatarField";
import { createClient } from "@/lib/supabase/client";
import { formatPortalError } from "@/lib/portal/errors";
import { usePortal } from "@/components/portal/portal-provider";

export function ClientProfileForm({ client }: { client: PortalClient }) {
  const { authUser, refresh, patchClient, updateAuthAvatar } = usePortal();
  const [companyName, setCompanyName] = React.useState(client.companyName);
  const [contactName, setContactName] = React.useState(client.contactName);
  const [phone, setPhone] = React.useState(client.phone);
  const [address, setAddress] = React.useState(client.address);
  const [website, setWebsite] = React.useState(client.website);
  const [busy, setBusy] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);
  const [messageTone, setMessageTone] = React.useState<"ok" | "error">("ok");
  const [isDirty, setIsDirty] = React.useState(false);

  // Synchroniser depuis le serveur uniquement tant que l'utilisateur n'a pas modifié le formulaire.
  React.useEffect(() => {
    if (isDirty) return;
    setCompanyName(client.companyName);
    setContactName(client.contactName);
    setPhone(client.phone);
    setAddress(client.address);
    setWebsite(client.website);
  }, [client, isDirty]);

  const markDirty = () => setIsDirty(true);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMessage(null);

    const trimmedCompany = companyName.trim();
    const trimmedContact = contactName.trim();

    if (!trimmedCompany || !trimmedContact) {
      setMessageTone("error");
      setMessage("Entreprise et nom de contact sont obligatoires.");
      setBusy(false);
      return;
    }

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("client_accounts")
        .update({
          company_name: trimmedCompany,
          contact_name: trimmedContact,
          phone: phone.trim() || null,
          address: address.trim() || null,
          website: website.trim() || null,
        })
        .eq("id", client.id)
        .select("company_name, contact_name, phone, address, website")
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        throw new Error(
          "Enregistrement refusé. Vérifiez la migration 004 (droits client) ou contactez le cabinet.",
        );
      }

      if (authUser?.id) {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({ full_name: trimmedContact })
          .eq("id", authUser.id);
        if (profileError) throw profileError;
      }

      const saved = {
        companyName: data.company_name,
        contactName: data.contact_name,
        phone: data.phone ?? "",
        address: data.address ?? "",
        website: data.website ?? "",
      };

      patchClient(client.id, saved);
      setCompanyName(saved.companyName);
      setContactName(saved.contactName);
      setPhone(saved.phone);
      setAddress(saved.address);
      setWebsite(saved.website);
      setIsDirty(false);
      setMessageTone("ok");
      setMessage("Profil enregistré.");

      await refresh({ silent: true });
    } catch (err) {
      setMessageTone("error");
      setMessage(formatPortalError(err));
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

      <form
        onSubmit={(e) => void handleSave(e)}
        className="grid gap-3 border-t border-neutral-100 pt-6 text-sm text-neutral-700"
      >
        <label>
          Entreprise
          <input
            value={companyName}
            onChange={(e) => {
              markDirty();
              setCompanyName(e.target.value);
            }}
            required
            className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2"
          />
        </label>
        <label>
          Contact
          <input
            value={contactName}
            onChange={(e) => {
              markDirty();
              setContactName(e.target.value);
            }}
            required
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
            onChange={(e) => {
              markDirty();
              setPhone(e.target.value);
            }}
            className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2"
          />
        </label>
        <label>
          Adresse
          <input
            value={address}
            onChange={(e) => {
              markDirty();
              setAddress(e.target.value);
            }}
            className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2"
          />
        </label>
        <label>
          Site web
          <input
            value={website}
            onChange={(e) => {
              markDirty();
              setWebsite(e.target.value);
            }}
            className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2"
          />
        </label>
        <button
          type="submit"
          disabled={busy || !isDirty}
          className="mt-1 w-fit rounded-xl bg-[#1f2a7c] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? "Enregistrement…" : "Enregistrer"}
        </button>
        {message ? (
          <p
            className={
              messageTone === "error"
                ? "text-sm text-red-700"
                : "text-sm text-emerald-800"
            }
            role={messageTone === "error" ? "alert" : "status"}
          >
            {message}
          </p>
        ) : null}
        {isDirty ? (
          <p className="text-xs text-neutral-500">Modifications non enregistrées — cliquez sur Enregistrer.</p>
        ) : null}
      </form>
    </div>
  );
}
