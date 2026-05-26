"use client";

import * as React from "react";
import { createClient } from "@/lib/supabase/client";
import { resolvePortalDestination } from "@/lib/portal/resolve-portal-destination";
import { isSupabasePublicConfigured } from "@/lib/supabase/public-env";

export type AccountSession =
  | { status: "loading" }
  | { status: "guest" }
  | {
      status: "authenticated";
      email: string;
      fullName: string | null;
      role: "client" | "admin";
      destinationPath: string;
    };

export function useAccountSession(active: boolean) {
  const [session, setSession] = React.useState<AccountSession>({ status: "loading" });

  const refresh = React.useCallback(async () => {
    if (!isSupabasePublicConfigured()) {
      setSession({ status: "guest" });
      return;
    }

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setSession({ status: "guest" });
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role, full_name")
      .eq("id", user.id)
      .maybeSingle();

    const role = profile?.role === "admin" ? "admin" : "client";
    setSession({
      status: "authenticated",
      email: user.email ?? "",
      fullName: profile?.full_name?.trim() || null,
      role,
      destinationPath: resolvePortalDestination(role),
    });
  }, []);

  React.useEffect(() => {
    if (!active) return;
    void refresh();

    if (!isSupabasePublicConfigured()) return;

    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      void refresh();
    });

    return () => subscription.unsubscribe();
  }, [active, refresh]);

  const signOut = React.useCallback(async () => {
    if (!isSupabasePublicConfigured()) return;
    const supabase = createClient();
    await supabase.auth.signOut();
    setSession({ status: "guest" });
  }, []);

  return { session, refresh, signOut };
}
