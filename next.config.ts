import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** Garantit l’inlining des NEXT_PUBLIC_* côté client (modale compte, auth). */
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  },
  turbopack: {
    root: import.meta.dirname,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "cdn.helloklik.com", pathname: "/**" },
      {
        protocol: "https",
        hostname: "gyisrwfapphqqdbpujtb.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      { protocol: "https", hostname: "lh3.googleusercontent.com", pathname: "/**" },
      { protocol: "https", hostname: "cdn.heyaurenis.com", pathname: "/**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "api.qrserver.com", pathname: "/**" },
      { protocol: "https", hostname: "lefevre-conseil.fr", pathname: "/**" },
      { protocol: "https", hostname: "www.lefevre-conseil.fr", pathname: "/**" },
    ],
  },
  async headers() {
    const securityHeaders = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
      },
      {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      },
    ];
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return [
      { source: "/a-propos", destination: "/notre-cabinet", permanent: true },
      { source: "/actualites", destination: "/conseils", permanent: true },
      { source: "/actualites/:slug", destination: "/conseils/:slug", permanent: true },
      { source: "/services", destination: "/expertises", permanent: true },
      { source: "/services/:slug", destination: "/expertises/:slug", permanent: true },
      // Parcours unifié : la prise de rendez-vous passe désormais par /contact.
      { source: "/bilan-patrimonial", destination: "/contact", permanent: true },
      { source: "/bilan-patrimonial/", destination: "/contact", permanent: true },
      { source: "/demande", destination: "/contact", permanent: true },
      { source: "/demande/", destination: "/contact", permanent: true },
      {
        source: "/defiscalisation",
        destination: "/expertises/fiscalite-investissement",
        permanent: true,
      },
      {
        source: "/expertises/defiscalisation",
        destination: "/expertises/fiscalite-investissement",
        permanent: true,
      },
      {
        source: "/services/defiscalisation",
        destination: "/expertises/fiscalite-investissement",
        permanent: true,
      },
      {
        source: "/expertises/optimisation-fiscale",
        destination: "/expertises/fiscalite-investissement",
        permanent: true,
      },
      {
        source: "/services/optimisation-fiscale",
        destination: "/expertises/fiscalite-investissement",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
