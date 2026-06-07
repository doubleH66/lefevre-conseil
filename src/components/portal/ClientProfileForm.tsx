"use client";

import * as React from "react";
import type { PortalClient } from "@/components/portal/types";
import { ProfileAvatarField } from "@/components/portal/ProfileAvatarField";
import { ProfileEditForm } from "@/components/portal/ProfileEditForm";
import { ProfileView } from "@/components/portal/ProfileView";
import { portalClientPatchFromSaved } from "@/lib/portal/portal-client-patch";
import type { SavedClientProfile } from "@/lib/portal/save-client-profile";
import { usePortal } from "@/components/portal/portal-provider";

/**
 * Page profil - fiche persistante (lecture depuis le store) + édition à la demande.
 * L’affichage principal ne dépend jamais de states locaux du formulaire.
 */
export function ClientProfileForm({ client }: { client: PortalClient }) {
  const { authUser, patchClient, updateAuthAvatar, updateAuthFullName } = usePortal();
  const [editing, setEditing] = React.useState(false);
  const [notice, setNotice] = React.useState<string | null>(null);

  const handleSaved = React.useCallback(
    (saved: SavedClientProfile) => {
      patchClient(saved.id, portalClientPatchFromSaved(saved));
      updateAuthFullName(saved.contactName);
      setEditing(false);
      setNotice("Profil enregistré.");
    },
    [patchClient, updateAuthFullName],
  );

  const handleEdit = () => {
    setNotice(null);
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setNotice(null);
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
        displayName={client.contactName || authUser.fullName || ""}
        email={authUser.email}
        avatarUrl={authUser.avatarUrl}
        onUpdated={updateAuthAvatar}
      />

      {editing ? (
        <ProfileEditForm
          key={`${client.id}-${client.updatedAtIso}`}
          client={client}
          onCancel={handleCancel}
          onSaved={handleSaved}
        />
      ) : (
        <ProfileView client={client} onEdit={handleEdit} notice={notice} />
      )}
    </div>
  );
}
