"use client";

import * as React from "react";
import { Camera, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { removeProfileAvatar, uploadProfileAvatar } from "@/lib/portal/profile-avatar";
import { cn } from "@/lib/utils";

function initials(name: string, email: string) {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (email.split("@")[0] ?? "?").slice(0, 2).toUpperCase();
}

export function ProfileAvatarField({
  userId,
  displayName,
  email,
  avatarUrl,
  onUpdated,
}: {
  userId: string;
  displayName: string;
  email: string;
  avatarUrl: string | null;
  onUpdated: (url: string | null) => void;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [preview, setPreview] = React.useState<string | null>(avatarUrl);
  const [busy, setBusy] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    setPreview(avatarUrl);
  }, [avatarUrl]);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    setMessage(null);
    try {
      const supabase = createClient();
      const url = await uploadProfileAvatar(supabase, userId, file);
      setPreview(url);
      onUpdated(url);
      setMessage("Photo enregistrée.");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Impossible d’envoyer la photo.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleRemove = async () => {
    setBusy(true);
    setMessage(null);
    try {
      const supabase = createClient();
      await removeProfileAvatar(supabase, userId, preview);
      setPreview(null);
      onUpdated(null);
      setMessage("Photo supprimée.");
    } catch {
      setMessage("Impossible de supprimer la photo.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative shrink-0">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element -- URL Supabase dynamique
          <img
            src={preview}
            alt=""
            className="size-20 rounded-2xl border border-neutral-200 object-cover shadow-sm"
          />
        ) : (
          <div
            className={cn(
              "grid size-20 place-items-center rounded-2xl bg-gradient-to-br text-lg font-bold text-white shadow-sm",
              "from-[#1f2a7c] to-[#0f164a]",
            )}
            aria-hidden
          >
            {initials(displayName, email)}
          </div>
        )}
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="absolute -bottom-1 -right-1 grid size-8 place-items-center rounded-full border border-neutral-200 bg-white text-neutral-700 shadow-sm hover:bg-neutral-50 disabled:opacity-50"
          aria-label="Changer la photo"
        >
          <Camera className="size-4" aria-hidden />
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="sr-only"
          onChange={(e) => void handleFile(e.target.files?.[0])}
        />
      </div>

      <div className="min-w-0 flex-1 text-sm">
        <p className="font-medium text-neutral-900">Photo de profil</p>
        <p className="mt-0.5 text-neutral-600">PNG, JPEG, WebP ou GIF — 5 Mo max.</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            className="rounded-xl border border-neutral-200 px-3 py-1.5 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 disabled:opacity-50"
          >
            {busy ? "Envoi…" : "Choisir une image"}
          </button>
          {preview ? (
            <button
              type="button"
              disabled={busy}
              onClick={() => void handleRemove()}
              className="inline-flex items-center gap-1 rounded-xl border border-neutral-200 px-3 py-1.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 disabled:opacity-50"
            >
              <Trash2 className="size-3.5" aria-hidden />
              Supprimer
            </button>
          ) : null}
        </div>
        {message ? <p className="mt-2 text-xs text-neutral-600">{message}</p> : null}
      </div>
    </div>
  );
}
