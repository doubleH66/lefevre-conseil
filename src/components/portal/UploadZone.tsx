"use client";

import * as React from "react";

export function UploadZone({
  onUpload,
  disabled,
}: {
  onUpload: (file: File, comment: string) => void | Promise<void>;
  disabled?: boolean;
}) {
  const [comment, setComment] = React.useState("");
  const [file, setFile] = React.useState<File | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    if (!file || busy || disabled) return;
    setBusy(true);
    setUploadError(null);
    try {
      await onUpload(file, comment);
      setComment("");
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "Échec de l'envoi du fichier.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-4">
      <p className="text-sm font-semibold text-neutral-900">Déposer un fichier</p>
      <p className="mt-1 text-xs text-neutral-500">PDF, images ou Word - 50 Mo max.</p>
      {uploadError ? (
        <p className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800" role="alert">
          {uploadError}
        </p>
      ) : null}
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx,application/pdf,image/*"
        disabled={disabled || busy}
        className="mt-3 block w-full text-sm text-neutral-600 file:mr-3 file:rounded-lg file:border-0 file:bg-[#1f2a7c]/10 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-[#1f2a7c]"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={2}
        disabled={disabled || busy}
        className="mt-3 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-[#1f2a7c]/40"
        placeholder="Commentaire pour l'équipe (optionnel)…"
      />
      <button
        type="button"
        disabled={!file || busy || disabled}
        onClick={() => void handleSubmit()}
        className="mt-3 rounded-xl bg-[#1f2a7c] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {busy ? "Envoi…" : "Envoyer le document"}
      </button>
    </div>
  );
}
