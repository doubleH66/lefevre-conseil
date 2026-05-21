"use client";

import { AccountConnectedPanel } from "@/components/auth/account-connected-panel";
import { AuthPanel } from "@/components/auth/auth-panel";
import { useAccountSession } from "@/components/auth/use-account-session";
import * as React from "react";

export function LoginAccountSection({
  nextPath,
  initialMode,
}: {
  nextPath: string;
  initialMode: "login" | "register";
}) {
  const [signingOut, setSigningOut] = React.useState(false);
  const { session, signOut } = useAccountSession(true);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
    } finally {
      setSigningOut(false);
    }
  };

  if (session.status === "loading") {
    return (
      <p className="mt-8 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-8 text-center text-sm text-neutral-600">
        Vérification de la session…
      </p>
    );
  }

  if (session.status === "authenticated") {
    return (
      <div className="mt-8">
        <AccountConnectedPanel session={session} onSignOut={handleSignOut} signingOut={signingOut} />
      </div>
    );
  }

  return <AuthPanel nextPath={nextPath} initialMode={initialMode} />;
}
