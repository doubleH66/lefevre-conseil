"use client";

import * as React from "react";
import { Check, Copy, Link2, Trash2, Upload } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import {
  deletePublicMediaFile,
  formatBytes,
  listPublicMediaFiles,
  type PublicMediaFile,
  uploadPublicMediaFiles,
} from "@/lib/portal/public-media";

function filesFromDataTransfer(dt: DataTransfer | null): File[] {
  if (!dt?.files?.length) return [];
  return Array.from(dt.files);
}

export function AdminPublicMediaPage() {
  const [files, setFiles] = React.useState<PublicMediaFile[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [copiedAll, setCopiedAll] = React.useState(false);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const [dragActive, setDragActive] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const dragDepthRef = React.useRef(0);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const list = await listPublicMediaFiles(supabase);
      setFiles(list);
    } catch {
      setError("Impossible de charger les fichiers. Vérifiez la migration 007_public_media_bucket.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void load();
  }, [load]);

  const allUrls = files.map((f) => f.publicUrl).join("\n");

  const copyText = async (text: string, id?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      if (id) {
        setCopiedId(id);
        window.setTimeout(() => setCopiedId(null), 2000);
      } else {
        setCopiedAll(true);
        window.setTimeout(() => setCopiedAll(false), 2000);
      }
    } catch {
      setError("Copie impossible dans le presse-papiers.");
    }
  };

  const onFilesSelected = async (list: FileList | File[] | null) => {
    const picked = list instanceof FileList ? Array.from(list) : list ? [...list] : [];
    if (!picked.length) return;
    setUploading(true);
    setError(null);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Session expirée");

      const added = await uploadPublicMediaFiles(supabase, picked, user.id);
      setFiles((prev) => [...added, ...prev]);
      if (inputRef.current) inputRef.current.value = "";
    } catch (e) {
      setError(e instanceof Error ? e.message : "Échec de l’envoi.");
    } finally {
      setUploading(false);
    }
  };

  const onDelete = async (file: PublicMediaFile) => {
    if (!window.confirm(`Supprimer « ${file.originalName} » ?`)) return;
    try {
      const supabase = createClient();
      await deletePublicMediaFile(supabase, file.id, file.storagePath);
      setFiles((prev) => prev.filter((f) => f.id !== file.id));
    } catch {
      setError("Suppression impossible.");
    }
  };

  const bumpDragDepth = (delta: number) => {
    dragDepthRef.current = Math.max(0, dragDepthRef.current + delta);
    setDragActive(dragDepthRef.current > 0);
  };

  const onDropZoneDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (uploading) return;
    bumpDragDepth(1);
  };

  const onDropZoneDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    bumpDragDepth(-1);
  };

  const onDropZoneDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (uploading) return;
    e.dataTransfer.dropEffect = "copy";
  };

  const onDropZoneDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragDepthRef.current = 0;
    setDragActive(false);
    if (uploading) return;
    void onFilesSelected(filesFromDataTransfer(e.dataTransfer));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900">Fichiers publics</h2>
          <p className="mt-1 max-w-xl text-sm text-neutral-600">
            Déposez plusieurs fichiers d’un coup. Chaque fichier reçoit une URL publique permanente,
            copiable individuellement ou en liste.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={!files.length}
            onClick={() => void copyText(allUrls)}
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-800 hover:bg-neutral-50 disabled:opacity-50"
          >
            {copiedAll ? <Check className="size-4 text-emerald-600" /> : <Copy className="size-4" />}
            Copier toutes les URLs
          </button>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 rounded-xl bg-[#1f2a7c] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            <Upload className="size-4" />
            {uploading ? "Envoi…" : "Ajouter des fichiers"}
          </button>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        className="sr-only"
        onChange={(e) => void onFilesSelected(e.target.files)}
      />

      <div
        role="button"
        tabIndex={0}
        onClick={() => {
          if (!uploading) inputRef.current?.click();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (!uploading) inputRef.current?.click();
          }
        }}
        onDragEnter={onDropZoneDragEnter}
        onDragLeave={onDropZoneDragLeave}
        onDragOver={onDropZoneDragOver}
        onDrop={onDropZoneDrop}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#1f2a7c]/30",
          dragActive
            ? "border-[#1f2a7c] bg-[#1f2a7c]/[0.08]"
            : "border-neutral-300 bg-neutral-50/80 hover:border-[#1f2a7c]/35 hover:bg-[#1f2a7c]/[0.03]",
          uploading && "pointer-events-none opacity-60",
        )}
      >
        <Upload className={cn("size-8", dragActive ? "text-[#1f2a7c]" : "text-[#1f2a7c]/50")} aria-hidden />
        <span className="mt-3 text-sm font-semibold text-neutral-800">
          {dragActive ? "Relâchez pour envoyer" : "Glissez-déposez ou cliquez pour sélectionner plusieurs fichiers"}
        </span>
        <span className="mt-1 text-xs text-neutral-500">Images, PDF, vidéos - bucket public Supabase</span>
      </div>

      {error ? <p className="text-sm text-rose-700">{error}</p> : null}

      {loading ? (
        <p className="text-sm text-neutral-600">Chargement…</p>
      ) : files.length === 0 ? (
        <p className="rounded-xl border border-neutral-200 bg-white px-4 py-8 text-center text-sm text-neutral-500">
          Aucun fichier pour le moment.
        </p>
      ) : (
        <ul className="space-y-3">
          {files.map((file) => (
            <li
              key={file.id}
              className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-neutral-900">{file.originalName}</p>
                  <p className="mt-0.5 text-xs text-neutral-500">
                    {file.createdAt} · {formatBytes(file.sizeBytes)}
                    {file.contentType ? ` · ${file.contentType}` : ""}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <a
                    href={file.publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 px-2.5 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
                  >
                    <Link2 className="size-3.5" />
                    Ouvrir
                  </a>
                  <button
                    type="button"
                    onClick={() => void copyText(file.publicUrl, file.id)}
                    className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 px-2.5 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
                  >
                    {copiedId === file.id ? (
                      <Check className="size-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="size-3.5" />
                    )}
                    Copier
                  </button>
                  <button
                    type="button"
                    onClick={() => void onDelete(file)}
                    className="inline-flex items-center gap-1 rounded-lg border border-rose-200 px-2.5 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
              <div className="mt-3 flex items-start gap-2 rounded-xl bg-neutral-50 px-3 py-2">
                <code className="min-w-0 flex-1 break-all text-xs text-neutral-700">{file.publicUrl}</code>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
