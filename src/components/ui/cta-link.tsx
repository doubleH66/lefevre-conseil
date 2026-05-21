import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  heroCtaPrimaryClassName,
  heroCtaSecondaryOnDarkClassName,
  heroCtaRowClassName,
} from "@/lib/styles/cta";

export { heroCtaRowClassName };

type CtaLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export function CtaPrimaryLink({ href, children, className }: CtaLinkProps) {
  return (
    <Link href={href} className={cn(heroCtaPrimaryClassName, className)}>
      {children}
    </Link>
  );
}

/** @deprecated Utiliser `ContactGlassLink` pour le bouton Contact. */
export function CtaSecondaryLink({ href, children, className }: CtaLinkProps) {
  return (
    <Link href={href} className={cn(heroCtaSecondaryOnDarkClassName, className)}>
      {children}
    </Link>
  );
}
