import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/public-env";
import { formatDateTimeFr } from "@/lib/portal/format";

export const PUBLIC_MEDIA_BUCKET = "public-media";

export type PublicMediaFile = {
  id: string;
  originalName: string;
  storagePath: string;
  publicUrl: string;
  contentType: string | null;
  sizeBytes: number | null;
  createdAt: string;
};

type Row = {
  id: string;
  original_name: string;
  storage_path: string;
  content_type: string | null;
  size_bytes: number | null;
  created_at: string;
};

export function buildPublicMediaUrl(storagePath: string): string {
  const base = getSupabaseUrl();
  if (!base) return "";
  const encoded = storagePath
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  return `${base}/storage/v1/object/public/${PUBLIC_MEDIA_BUCKET}/${encoded}`;
}

function mapRow(row: Row): PublicMediaFile {
  return {
    id: row.id,
    originalName: row.original_name,
    storagePath: row.storage_path,
    publicUrl: buildPublicMediaUrl(row.storage_path),
    contentType: row.content_type,
    sizeBytes: row.size_bytes,
    createdAt: formatDateTimeFr(row.created_at),
  };
}

function safeStorageName(name: string): string {
  return name.replace(/[^\w.\-() ]+/g, "_").replace(/\s+/g, "-");
}

export async function listPublicMediaFiles(supabase: SupabaseClient): Promise<PublicMediaFile[]> {
  const { data, error } = await supabase
    .from("public_media_files")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return ((data ?? []) as Row[]).map(mapRow);
}

export async function uploadPublicMediaFiles(
  supabase: SupabaseClient,
  files: File[],
  userId: string,
): Promise<PublicMediaFile[]> {
  const uploaded: PublicMediaFile[] = [];

  for (const file of files) {
    const storagePath = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeStorageName(file.name)}`;

    const { error: uploadError } = await supabase.storage.from(PUBLIC_MEDIA_BUCKET).upload(storagePath, file, {
      upsert: false,
      contentType: file.type || undefined,
    });
    if (uploadError) throw uploadError;

    const { data: row, error: insertError } = await supabase
      .from("public_media_files")
      .insert({
        original_name: file.name,
        storage_path: storagePath,
        content_type: file.type || null,
        size_bytes: file.size,
        created_by: userId,
      })
      .select("*")
      .single();

    if (insertError) {
      await supabase.storage.from(PUBLIC_MEDIA_BUCKET).remove([storagePath]);
      throw insertError;
    }

    uploaded.push(mapRow(row as Row));
  }

  return uploaded;
}

export async function deletePublicMediaFile(supabase: SupabaseClient, id: string, storagePath: string) {
  const { error: storageError } = await supabase.storage.from(PUBLIC_MEDIA_BUCKET).remove([storagePath]);
  if (storageError) throw storageError;

  const { error } = await supabase.from("public_media_files").delete().eq("id", id);
  if (error) throw error;
}

export function formatBytes(size: number | null): string {
  if (size == null || size <= 0) return "-";
  if (size < 1024) return `${size} o`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} Ko`;
  return `${(size / (1024 * 1024)).toFixed(1)} Mo`;
}
