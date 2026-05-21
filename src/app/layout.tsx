import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { SiteChrome } from "@/components/layout/site-chrome";
import { defaultMetadata, SITE_NAME, SITE_URL } from "@/lib/seo/metadata";
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
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#1f2a7c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} font-sans antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(financialServiceJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
        />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
