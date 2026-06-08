import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { SiteChrome } from "@/components/layout/site-chrome";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { PwaRegister } from "@/components/client/pwa-register";
import { MaintenanceGate } from "@/components/client/maintenance-gate";
import { defaultMetadata, SITE_NAME, SITE_URL } from "@/lib/seo/metadata";
import { IS_INDEXABLE } from "@/lib/content/site";
import { MAINTENANCE_ENABLED, MAINTENANCE_PREPAINT_SCRIPT } from "@/lib/maintenance";
import { financialServiceJsonLd, websiteJsonLd } from "@/lib/seo/jsonld";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: defaultMetadata.title,
    template: `%s · ${SITE_NAME}`,
  },
  description: defaultMetadata.description,
  applicationName: SITE_NAME,
  keywords: [...defaultMetadata.keywords],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: defaultMetadata.title,
    description: defaultMetadata.description,
  },
  twitter: {
    card: "summary_large_image",
    title: defaultMetadata.title,
    description: defaultMetadata.description,
  },
  robots: IS_INDEXABLE
    ? { index: true, follow: true, googleBot: { index: true, follow: true } }
    : { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export const viewport: Viewport = {
  themeColor: "#1f2a7c",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} font-sans antialiased`}>
        {MAINTENANCE_ENABLED ? (
          <script dangerouslySetInnerHTML={{ __html: MAINTENANCE_PREPAINT_SCRIPT }} />
        ) : null}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(financialServiceJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
        />
        <SiteChrome>{children}</SiteChrome>
        <Analytics />
        <SpeedInsights />
        <PwaRegister />
        {MAINTENANCE_ENABLED ? <MaintenanceGate /> : null}
      </body>
    </html>
  );
}
