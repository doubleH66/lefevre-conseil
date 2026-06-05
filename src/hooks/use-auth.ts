"use client";

import * as React from "react";
import type { Session, User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { isSupabasePublicConfigured } from "@/lib/supabase/public-env";

export type AuthRole = "admin" | "client";

export type AuthState = {
  user: User | null;
  session: Session | null;
  role: AuthRole | null;
  fullName: string | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
};

async function loadRole(userId: string): Promise<{ role: AuthRole; fullName: string | null }> {
  const supabase = createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", userId)
    .maybeSingle();

  return {
    role: profile?.role === "admin" ? "admin" : "client",
    fullName: profile?.full_name?.trim() || null,
  };
}

export type UseAuthOptions = {
  /** Désactivé sur les pages marketing tant que le tiroir compte est fermé. */
  enabled?: boolean;
};

/** Session Supabase — même logique que DAS Bâtiment (onAuthStateChange + getSession). */
export function useAuth(options?: UseAuthOptions): AuthState {
  const enabled = options?.enabled ?? true;
  const [user, setUser] = React.useState<User | null>(null);
  const [session, setSession] = React.useState<Session | null>(null);
  const [role, setRole] = React.useState<AuthRole | null>(null);
  const [fullName, setFullName] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  const applySession = React.useCallback(async (next: Session | null) => {
    setSession(next);
    const nextUser = next?.user ?? null;
    setUser(nextUser);

    if (!nextUser) {
      setRole(null);
      setFullName(null);
      setLoading(false);
      return;
    }

    try {
      const profile = await loadRole(nextUser.id);
      setRole(profile.role);
      setFullName(profile.fullName);
    } catch {
      setRole("client");
      setFullName(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = React.useCallback(async () => {
    if (!enabled || !isSupabasePublicConfigured()) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const {
        data: { session: existing },
      } = await supabase.auth.getSession();
      await applySession(existing);
    } catch {
      setLoading(false);
    }
  }, [applySession, enabled]);

  React.useEffect(() => {
    if (!enabled || !isSupabasePublicConfigured()) {
      setLoading(false);
      return;
    }

    let mounted = true;
    const supabase = createClient();

    const sync = (next: Session | null) => {
      if (!mounted) return;
      void applySession(next);
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      sync(nextSession);
    });

    supabase.auth
      .getSession()
      .then(({ data: { session: existing } }) => {
        sync(existing);
      })
      .catch(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [applySession, enabled]);

  const signOut = React.useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setRole(null);
    setFullName(null);
  }, []);

  return { user, session, role, fullName, loading, signOut, refresh };
}
