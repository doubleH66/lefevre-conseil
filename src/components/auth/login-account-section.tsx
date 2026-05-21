"use client";

import { AccountConnectedPanel } from "@/components/auth/account-connected-panel";
import { AuthPanel } from "@/components/auth/auth-panel";
import { useAccountSession } from "@/components/auth/use-account-session";
import { marketingCardClass } from "@/components/marketing/marketing-styles";
import { cn } from "@/lib/utils";
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
      <p
        className={cn(
          marketingCardClass,
          "px-6 py-10 text-center text-sm text-[#1f2a7c]/65",
        )}
      >
        Vérification de la session…
      </p>
    );
  }

  if (session.status === "authenticated") {
    return (
      <AccountConnectedPanel session={session} onSignOut={handleSignOut} signingOut={signingOut} />
    );
  }

  return <AuthPanel nextPath={nextPath} initialMode={initialMode} />;
}
