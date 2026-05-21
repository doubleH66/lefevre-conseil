import Link from "next/link";
import { ROUTES } from "@/lib/content/routes";

type PageStubProps = {
  title: string;
  description?: string;
};

export function PageStub({ title, description }: PageStubProps) {
  return (
    <div
      data-nav-theme="light"
      className="mx-auto max-w-3xl px-4 py-24 pt-28 sm:px-6 sm:py-28"
    >
      <h1 className="text-3xl font-medium text-[#1f2a7c]">{title}</h1>
      {description && <p className="mt-4 max-w-2xl text-neutral-600">{description}</p>}
      <Link href={ROUTES.home} className="btn-primary mt-8 inline-flex">
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
