"use client";

import * as React from "react";
import type { PortalClient } from "@/components/portal/types";
import { ProfileAvatarField } from "@/components/portal/ProfileAvatarField";
import { createClient } from "@/lib/supabase/client";
import { formatPortalError } from "@/lib/portal/errors";
import {
  portalClientPatchFromSaved,
  profileFieldsFromClient,
  profileFieldsFromSaved,
  type ProfileFormFields,
} from "@/lib/portal/portal-client-patch";
import { saveClientProfile } from "@/lib/portal/save-client-profile";
import {
  profileClientSnapshot,
  profileDebugLog,
  ProfileDebugPanel,
} from "@/lib/portal/profile-debug";
import { getSupabaseUrl } from "@/lib/supabase/public-env";
import { usePortal } from "@/components/portal/portal-provider";

function applyFields(
  setters: {
    setCompanyName: (v: string) => void;
    setContactName: (v: string) => void;
    setPhone: (v: string) => void;
    setAddress: (v: string) => void;
    setWebsite: (v: string) => void;
  },
  fields: ProfileFormFields,
) {
  setters.setCompanyName(fields.companyName);
  setters.setContactName(fields.contactName);
  setters.setPhone(fields.phone);
  setters.setAddress(fields.address);
  setters.setWebsite(fields.website);
}

/** Profil client — lecture et écriture via le même client Supabase navigateur (comme les médias publics). */
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
  const syncedIsoRef = React.useRef(client.updatedAtIso);

  React.useEffect(() => {
    profileDebugLog("initial portal client", profileClientSnapshot(client));
    profileDebugLog("initial form state", profileFieldsFromClient(client));
    profileDebugLog("supabase url", { url: getSupabaseUrl() ?? "(non configuré)" });
  }, []);

  const fieldSetters = React.useMemo(
    () => ({
      setCompanyName,
      setContactName,
      setPhone,
      setAddress,
      setWebsite,
    }),
    [],
  );

  React.useEffect(() => {
    if (isDirty || busy) return;
    const iso = client.updatedAtIso;
    if (!iso || iso === syncedIsoRef.current) return;
    if (iso < syncedIsoRef.current) {
      profileDebugLog("effect resync — ignoré (portal stale)", {
        portalIso: iso,
        syncedIso: syncedIsoRef.current,
      });
      return;
    }
    syncedIsoRef.current = iso;
    const next = profileFieldsFromClient(client);
    applyFields(fieldSetters, next);
    profileDebugLog("effect resync — appliqué", {
      portalIso: iso,
      formState: next,
      portalClient: profileClientSnapshot(client),
    });
  }, [client.updatedAtIso, client.companyName, client.contactName, client.phone, client.address, client.website, isDirty, busy, fieldSetters]);

  const markDirty = () => {
    setIsDirty(true);
    if (messageTone === "ok" && message) setMessage(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMessage(null);

    const payload = {
      companyName: companyName.trim(),
      contactName: contactName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      website: website.trim(),
    };

    if (!payload.companyName || !payload.contactName) {
      setMessageTone("error");
      setMessage("Entreprise et nom de contact sont obligatoires.");
      setBusy(false);
      return;
    }

    try {
      const supabase = createClient();
      const result = await saveClientProfile(supabase, payload);

      if (!result.ok) {
        throw new Error(result.error);
      }

      const { saved } = result;
      if (saved.id !== client.id) {
        profileDebugLog("⚠ id mismatch", {
          displayedClientId: client.id,
          savedClientId: saved.id,
        });
      }
      patchClient(client.id, portalClientPatchFromSaved(saved));
      const applied = profileFieldsFromSaved(saved);
      applyFields(fieldSetters, applied);
      profileDebugLog("form state applied", applied);
      syncedIsoRef.current = saved.updatedAtIso;
      updateAuthFullName(saved.contactName);
      setIsDirty(false);
      setMessageTone("ok");
      setMessage("Profil enregistré.");
    } catch (err) {
      profileDebugLog("save error", { message: formatPortalError(err) });
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

      <form onSubmit={(e) => void handleSave(e)} className="grid gap-3 border-t border-neutral-100 pt-6 text-sm text-neutral-700">
        <label>
          Entreprise
          <input
            value={companyName}
            onChange={(e) => {
              markDirty();
              setCompanyName(e.target.value);
            }}
            required
            autoComplete="organization"
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
            onChange={(e) => {
              markDirty();
              setPhone(e.target.value);
            }}
            autoComplete="tel"
            placeholder="Optionnel — laissez vide pour effacer"
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
            autoComplete="street-address"
            placeholder="Optionnel — laissez vide pour effacer"
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
            autoComplete="url"
            placeholder="Optionnel — laissez vide pour effacer"
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

      <ProfileDebugPanel />
    </div>
  );
}
