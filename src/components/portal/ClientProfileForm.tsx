"use client";

import * as React from "react";
import type { PortalClient } from "@/components/portal/types";
import { ProfileAvatarField } from "@/components/portal/ProfileAvatarField";
import { createClient } from "@/lib/supabase/client";
import { formatPortalError } from "@/lib/portal/errors";
import { updateClientProfile } from "@/lib/portal/update-client-profile";
import { usePortal } from "@/components/portal/portal-provider";

function syncFormFromClient(client: PortalClient) {
  return {
    companyName: client.companyName,
    contactName: client.contactName,
    phone: client.phone,
    address: client.address,
    website: client.website,
  };
}

export function ClientProfileForm({ client }: { client: PortalClient }) {
  const { authUser, patchClient, updateAuthAvatar, updateAuthFullName } = usePortal();
  const [companyName, setCompanyName] = React.useState(client.companyName);
  const [contactName, setContactName] = React.useState(client.contactName);
  const [phone, setPhone] = React.useState(client.phone);
  const [address, setAddress] = React.useState(client.address);
  const [website, setWebsite] = React.useState(client.website);
  const [busy, setBusy] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);
  const [messageTone, setMessageTone] = React.useState<"ok" | "error">("ok");
  const [isDirty, setIsDirty] = React.useState(false);
  const lastSyncedClientId = React.useRef(client.id);

  // Resynchroniser seulement si on change de compte client (pas à chaque re-render parent).
  React.useEffect(() => {
    if (client.id !== lastSyncedClientId.current) {
      lastSyncedClientId.current = client.id;
      const next = syncFormFromClient(client);
      setCompanyName(next.companyName);
      setContactName(next.contactName);
      setPhone(next.phone);
      setAddress(next.address);
      setWebsite(next.website);
      setIsDirty(false);
      return;
    }
    if (!isDirty) {
      const next = syncFormFromClient(client);
      setCompanyName(next.companyName);
      setContactName(next.contactName);
      setPhone(next.phone);
      setAddress(next.address);
      setWebsite(next.website);
    }
  }, [
    client.id,
    client.companyName,
    client.contactName,
    client.phone,
    client.address,
    client.website,
    isDirty,
  ]);

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
      const saved = await updateClientProfile(supabase, {
        clientId: client.id,
        companyName: trimmedCompany,
        contactName: trimmedContact,
        phone: phone.trim(),
        address: address.trim(),
        website: website.trim(),
      });

      if (authUser?.id) {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({ full_name: trimmedContact })
          .eq("id", authUser.id);
        if (profileError) throw profileError;
        updateAuthFullName(trimmedContact);
      }

      lastSyncedClientId.current = saved.id;

      patchClient(saved.id, {
        companyName: saved.companyName,
        contactName: saved.contactName,
        phone: saved.phone,
        address: saved.address,
        website: saved.website,
        email: saved.email,
      });

      setCompanyName(saved.companyName);
      setContactName(saved.contactName);
      setPhone(saved.phone);
      setAddress(saved.address);
      setWebsite(saved.website);
      setIsDirty(false);
      setMessageTone("ok");
      setMessage("Profil enregistré.");
    } catch (err) {
      setMessageTone("error");
      setMessage(formatPortalError(err));
    } finally {
      setBusy(false);
    }
  };

  if (!authUser) {
    return (
      <p className="py-6 text-center text-sm text-neutral-600">
        Connexion en cours… Si cet écran reste vide, rechargez la page.
      </p>
    );
  }

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
