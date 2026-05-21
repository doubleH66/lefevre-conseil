import type { SupabaseClient, User } from "@supabase/supabase-js";

export type ProfileRow = { full_name: string | null; role: string };

/**
 * Charge le profil ou crée une ligne minimale si le trigger SQL n’a pas tourné.
 * Rôle par défaut `client` (promotion admin reste côté base / back-office).
 */
export async function loadOrCreateProfile(
  supabase: SupabaseClient,
  user: User,
): Promise<ProfileRow | null> {
  const { data: existing, error: selectError } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .maybeSingle();

  if (selectError) return null;
  if (existing) return existing as ProfileRow;

  const meta = user.user_metadata;
  const fullName =
    (typeof meta?.full_name === "string" && meta.full_name.trim()) ||
    (user.email ? user.email.split("@")[0] : null);

  const { data: created, error: insertError } = await supabase
    .from("profiles")
    .insert({ id: user.id, full_name: fullName, role: "client" })
    .select("full_name, role")
    .maybeSingle();

  if (!insertError && created) return created as ProfileRow;

  if (insertError?.code === "23505") {
    const { data: again } = await supabase
      .from("profiles")
      .select("full_name, role")
      .eq("id", user.id)
      .maybeSingle();
    return again ? (again as ProfileRow) : null;
  }

  const { data: race } = await supabase.from("profiles").select("full_name, role").eq("id", user.id).maybeSingle();
  return race ? (race as ProfileRow) : null;
}
