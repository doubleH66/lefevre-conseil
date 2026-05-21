import Link from "next/link";
import { ROUTES } from "@/lib/content/routes";

type PageShellProps = {
  title: string;
  description?: string;
};

export function PageShell({ title, description }: PageShellProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
      <h1 className="text-3xl font-medium text-[#1f2a7c]">{title}</h1>
      {description ? <p className="mt-4 text-neutral-600">{description}</p> : null}
      <Link href={ROUTES.home} className="btn-primary mt-8 inline-flex">
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
