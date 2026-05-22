"use client";

import * as React from "react";
import type { PortalClient } from "@/components/portal/types";
import { ProfileAvatarField } from "@/components/portal/ProfileAvatarField";
import { saveClientProfileAction } from "@/app/espace-client/actions";
import { formatPortalError } from "@/lib/portal/errors";
import { profileClientSnapshot, profileLog } from "@/lib/portal/profile-debug-log";
import { profileFormRemountKey } from "@/lib/portal/profile-form-remount-key";
import { usePortal } from "@/components/portal/portal-provider";

/**
 * Les champs reflètent le `client` passé au **premier montage**.
 * Au changement réel des données venant du portail (nouvel `updatedAtIso`),
 * le parent passe une nouvelle `key` → **remount** sans `useEffect`.
 */
export function ClientProfileForm({ client }: { client: PortalClient }) {
  const { authUser, refresh, updateAuthAvatar, updateAuthFullName } = usePortal();
  const [companyName, setCompanyName] = React.useState(client.companyName);
  const [contactName, setContactName] = React.useState(client.contactName);
  const [phone, setPhone] = React.useState(client.phone);
  const [address, setAddress] = React.useState(client.address);
  const [website, setWebsite] = React.useState(client.website);
  const [busy, setBusy] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);
  const [messageTone, setMessageTone] = React.useState<"ok" | "error">("ok");
  const [isDirty, setIsDirty] = React.useState(false);

  React.useEffect(() => {
    profileLog("ClientProfileForm — mount", {
      remountKey: profileFormRemountKey(client),
      clientProp: profileClientSnapshot(client),
      stateInit: {
        companyName: client.companyName,
        contactName: client.contactName,
        phone: client.phone,
        address: client.address,
        website: client.website,
      },
    });
  }, []);

  const markDirty = () => {
    setIsDirty(true);
    profileLog("ClientProfileForm — dirty");
  };

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

    const payload = {
      companyName: trimmedCompany,
      contactName: trimmedContact,
      phone: phone.trim(),
      address: address.trim(),
      website: website.trim(),
    };

    try {
      profileLog("ClientProfileForm — submit (champs UI)", payload);

      const saved = await saveClientProfileAction(payload);
      profileLog("ClientProfileForm — saveClientProfileAction OK", profileClientSnapshot(saved));

      updateAuthFullName(trimmedContact);
      profileLog("ClientProfileForm — refresh({ silent: true }) — début");
      await refresh({ silent: true });
      profileLog("ClientProfileForm — refresh({ silent: true }) — fin (voir logs portal-provider)");

      setIsDirty(false);
      setMessageTone("ok");
      setMessage("Profil enregistré.");
    } catch (err) {
      profileLog("ClientProfileForm — erreur", err);
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
              messageTone === "error" ? "text-sm text-red-700" : "text-sm text-emerald-800"
            }
            role={messageTone === "error" ? "alert" : "status"}
          >
            {message}
          </p>
        ) : null}
        {isDirty ? (
          <p className="text-xs text-neutral-500">
            Modifications non enregistrées — cliquez sur Enregistrer.
          </p>
        ) : null}
      </form>
    </div>
  );
}
