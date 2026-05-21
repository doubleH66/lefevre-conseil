import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: import.meta.dirname,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.helloklik.com", pathname: "/**" },
      {
        protocol: "https",
        hostname: "qhiyxnbcegbxtvydcjhf.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      { protocol: "https", hostname: "lh3.googleusercontent.com", pathname: "/**" },
      { protocol: "https", hostname: "www.dasbatiment.fr", pathname: "/**" },
    ],
  },
  async redirects() {
    return [
      { source: "/a-propos", destination: "/notre-cabinet", permanent: true },
      { source: "/conseils", destination: "/actualites", permanent: true },
      { source: "/conseils/:slug", destination: "/actualites/:slug", permanent: true },
      {
        source: "/services/defiscalisation",
        destination: "/services/fiscalite-investissement",
        permanent: true,
      },
      {
        source: "/services/optimisation-fiscale",
        destination: "/services/fiscalite-investissement",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
