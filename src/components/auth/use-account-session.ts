"use client";

import { useAuth } from "@/hooks/use-auth";
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
  const { user, role, fullName, loading, signOut, refresh } = useAuth();

  const session: AccountSession = !active
    ? { status: "guest" }
    : !isSupabasePublicConfigured()
      ? { status: "guest" }
      : loading
        ? { status: "loading" }
        : !user || !role
          ? { status: "guest" }
          : {
              status: "authenticated",
              email: user.email ?? "",
              fullName,
              role,
              destinationPath: resolvePortalDestination(role),
            };

  return { session, refresh, signOut };
}
