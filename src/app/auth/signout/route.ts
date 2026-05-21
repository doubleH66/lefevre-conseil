import { createClient } from "@/lib/supabase/server";
import { isSupabasePublicConfigured } from "@/lib/supabase/public-env";
import { redirect } from "next/navigation";

export async function POST() {
  if (!isSupabasePublicConfigured()) {
    redirect("/");
  }
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
