import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Home } from "lucide-react";
import { CONTACT_HREF, ROUTES } from "@/lib/content/routes";

export const metadata: Metadata = {
  title: { absolute: "Page introuvable · Lefèvre Conseil" },
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center bg-white px-6 py-20 text-center text-[#1f2a7c]">
      <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-[#1f2a7c]/45">Erreur 404</p>
      <h1 className="mt-4 text-balance text-[clamp(1.9rem,5vw,3rem)] font-normal leading-[1.05] tracking-[-0.035em]">
        Page introuvable
      </h1>
      <p className="mx-auto mt-5 max-w-xl text-balance text-[15px] leading-relaxed text-[#1f2a7c]/70 sm:text-base">
        La page que vous cherchez n’existe plus ou a été déplacée. Vous pouvez revenir à l’accueil ou prendre
        rendez-vous avec le cabinet.
      </p>

      <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          href={ROUTES.home}
          className="inline-flex h-12 min-w-[12rem] items-center justify-center gap-2 rounded-full border border-[#1f2a7c]/15 bg-white px-6 text-sm font-semibold text-[#1f2a7c] shadow-sm transition-colors hover:bg-[#1f2a7c]/[0.05]"
        >
          <Home className="size-4" aria-hidden />
          Retour à l’accueil
        </Link>
        <Link
          href={CONTACT_HREF}
          className="group inline-flex h-12 min-w-[12rem] items-center justify-center gap-2 rounded-full bg-[#1f2a7c] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#18226b]"
        >
          Prendre rendez-vous
          <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </main>
  );
}
