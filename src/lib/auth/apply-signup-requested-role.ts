import type { SupabaseClient } from "@supabase/supabase-js";

/** Applique requested_role=admin sur profiles après inscription (migration 016). */
export async function applySignupRequestedRole(supabase: SupabaseClient): Promise<void> {
  const { error } = await supabase.rpc("apply_signup_requested_role");
  if (error && !/apply_signup_requested_role/i.test(error.message)) {
    console.warn("[auth] apply_signup_requested_role:", error.message);
  }
}
