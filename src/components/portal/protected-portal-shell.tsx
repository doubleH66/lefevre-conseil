"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { ROUTES } from "@/lib/content/routes";
import { isSupabasePublicConfigured } from "@/lib/supabase/public-env";
import { SupabaseConfigNotice } from "@/components/auth/supabase-config-notice";

type ProtectedPortalShellProps = {
  children: ReactNode;
  /** Espace attendu : admin ou client. */
  mode: "admin" | "client";
};

/**
 * Garde d’accès côté client (modèle DAS Bâtiment) - pas de redirect middleware.
 * Spinner pendant la session, puis redirection vers /login si non connecté.
 */
export function ProtectedPortalShell({ children, mode }: ProtectedPortalShellProps) {
  const { user, role, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      const next = encodeURIComponent(pathname || ROUTES.espaceClient);
      router.replace(`${ROUTES.login}?next=${next}`);
      return;
    }

    if (mode === "admin" && role !== "admin") {
      router.replace(ROUTES.espaceClient);
      return;
    }

    if (mode === "client" && role === "admin") {
      router.replace(ROUTES.espaceAdmin);
    }
  }, [loading, user, role, mode, pathname, router]);

  if (!isSupabasePublicConfigured()) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-white p-6">
        <SupabaseConfigNotice className="max-w-md" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-white">
        <div
          className="size-8 animate-spin rounded-full border-2 border-[#1f2a7c]/20 border-t-[#1f2a7c]"
          aria-label="Chargement"
        />
      </div>
    );
  }

  if (!user) return null;
  if (mode === "admin" && role !== "admin") return null;
  if (mode === "client" && role === "admin") return null;

  return <>{children}</>;
}
