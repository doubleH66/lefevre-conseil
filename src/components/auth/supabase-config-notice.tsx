"use client";

import Link from "next/link";
import { heroCtaPrimaryCompactClassName } from "@/components/ui/hero-cta";
import { LOGIN_HREF } from "@/lib/content/routes";
import { cn } from "@/lib/utils";

function isLocalDevHost() {
  if (typeof window === "undefined") return false;
  const h = window.location.hostname;
  return h === "localhost" || h === "127.0.0.1" || h.endsWith(".local");
}

type SupabaseConfigNoticeProps = {
  loginHref?: string;
  onNavigate?: () => void;
  className?: string;
};

/** Message affiché quand Supabase n'est pas configuré (modale Compte, page login). */
export function SupabaseConfigNotice({ loginHref = LOGIN_HREF, onNavigate, className }: SupabaseConfigNoticeProps) {
  const local = isLocalDevHost();

  return (
    <div className={cn("space-y-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950", className)}>
      <p className="font-medium">Connexion indisponible sur cet environnement.</p>
      {local ? (
        <>
          <p className="text-amber-900/90">
            En local, créez <code className="rounded bg-amber-100/80 px-1 text-xs">.env.local</code> à la racine du
            projet avec l’URL Supabase et la clé <strong>anon</strong>, puis redémarrez le serveur.
          </p>
          <ol className="list-decimal space-y-1 pl-5 text-amber-900/90">
            <li>
              <code className="rounded bg-amber-100/80 px-1 text-xs">cp .env.example .env.local</code>
            </li>
            <li>
              Collez la clé anon depuis{" "}
              <a
                href="https://supabase.com/dashboard/project/qhiyxnbcegbxtvydcjhf/settings/api"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-amber-950 underline underline-offset-2"
              >
                Supabase → API
              </a>
            </li>
            <li>
              <code className="rounded bg-amber-100/80 px-1 text-xs">npm run check:env</code> puis{" "}
              <code className="rounded bg-amber-100/80 px-1 text-xs">npm run dev -- -p 8089</code>
            </li>
          </ol>
        </>
      ) : (
        <p className="text-amber-900/90">
          Sur Vercel, ajoutez{" "}
          <code className="rounded bg-amber-100/80 px-1 text-xs">NEXT_PUBLIC_SUPABASE_URL</code> et{" "}
          <code className="rounded bg-amber-100/80 px-1 text-xs">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> (environnement{" "}
          <strong>Production</strong>), puis redéployez. Le site{" "}
          <a
            href="https://lefevre-conseil.vercel.app"
            className="font-medium text-amber-950 underline underline-offset-2"
          >
            lefevre-conseil.vercel.app
          </a>{" "}
          est déjà configuré si vous testez une autre URL ou une preview sans variables.
        </p>
      )}
      <Link
        href={loginHref}
        onClick={onNavigate}
        className={cn(heroCtaPrimaryCompactClassName, "inline-flex w-full items-center justify-center")}
      >
        Page compte
      </Link>
    </div>
  );
}
