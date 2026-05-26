import type { SupabaseClient } from "@supabase/supabase-js";
import { resolvePortalDestination } from "@/lib/portal/resolve-portal-destination";

export async function resolvePostAuthRedirect(
  supabase: SupabaseClient,
  requestedPath: string,
): Promise<string> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return requestedPath;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const role = profile?.role === "admin" ? "admin" : "client";
  return resolvePortalDestination(role, requestedPath);
}
