import type { SupabaseClient } from "@supabase/supabase-js";

const BUCKET = "profile-avatars";
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);

export function validateAvatarFile(file: File): string | null {
  if (!ALLOWED.has(file.type)) {
    return "Format accepté : PNG, JPEG, WebP ou GIF.";
  }
  if (file.size > MAX_BYTES) {
    return "Image trop lourde (max. 5 Mo).";
  }
  return null;
}

export async function uploadProfileAvatar(
  supabase: SupabaseClient,
  userId: string,
  file: File,
): Promise<string> {
  const validation = validateAvatarFile(file);
  if (validation) throw new Error(validation);

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const safeExt = ["png", "jpeg", "jpg", "webp", "gif"].includes(ext) ? ext.replace("jpeg", "jpg") : "jpg";
  const path = `${userId}/${Date.now()}-avatar.${safeExt}`;

  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, {
    upsert: true,
    contentType: file.type,
  });
  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  if (!data.publicUrl) throw new Error("URL publique indisponible.");

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ avatar_url: data.publicUrl })
    .eq("id", userId);
  if (profileError) throw profileError;

  return data.publicUrl;
}

export async function removeProfileAvatar(supabase: SupabaseClient, userId: string, avatarUrl: string | null) {
  if (avatarUrl) {
    const marker = `/object/public/${BUCKET}/`;
    const idx = avatarUrl.indexOf(marker);
    if (idx >= 0) {
      const storagePath = avatarUrl.slice(idx + marker.length);
      await supabase.storage.from(BUCKET).remove([storagePath]);
    }
  }

  const { error } = await supabase.from("profiles").update({ avatar_url: null }).eq("id", userId);
  if (error) throw error;
}
