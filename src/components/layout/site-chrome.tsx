"use client";

import { usePathname } from "next/navigation";
import { CookieConsentBanner } from "@/components/client/cookie-banner";
import { FloatingConsultButton } from "@/components/client/floating-contact";
import { SiteNavbar } from "@/components/layout/navbar";

/** Pages portail / auth : pas de navbar marketing ni bouton flottant contact. */
function hidePublicChrome(pathname: string) {
  return (
    pathname.startsWith("/espace-client") ||
    pathname.startsWith("/espace-admin") ||
    pathname === "/login" ||
    pathname.startsWith("/auth/")
  );
}

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/";
  const minimal = hidePublicChrome(pathname);

  return (
    <>
      {!minimal ? <SiteNavbar /> : null}
      {children}
      {!minimal ? <FloatingConsultButton /> : null}
      <CookieConsentBanner />
    </>
  );
}
