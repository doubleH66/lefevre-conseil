import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ContactGlassLink } from "@/components/ui/contact-glass-link";
import { navGlassBlue, navGlassRest } from "@/lib/styles/glass";
import { cn } from "@/lib/utils";

export function NavTextLink({
  href,
  children,
  light,
}: {
  href: string;
  children: React.ReactNode;
  light: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-full px-3.5 py-2.5 text-[15px] font-semibold tracking-tight transition-colors duration-150",
        light ? "text-white hover:bg-white/10" : "text-[#1f2a7c] hover:bg-[#1f2a7c]/5",
      )}
    >
      {children}
    </Link>
  );
}

/** @deprecated Utiliser `ContactGlassLink` pour Contact ; conservé pour autres usages éventuels. */
export function NavLiquidButton({
  href,
  children,
  light,
  className = "",
}: {
  href?: string;
  children: React.ReactNode;
  light: boolean;
  className?: string;
}) {
  if (href) {
    return (
      <ContactGlassLink href={href} light={light} layout="nav" className={className}>
        {children}
      </ContactGlassLink>
    );
  }

  const classes = cn(
    "inline-flex h-10 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full px-4 text-[13px] font-semibold tracking-tight outline-none transition-[background-color,color,box-shadow] duration-150 focus-visible:ring-[3px] sm:px-5 xl:h-11 xl:px-6 xl:text-sm",
    light
      ? `${navGlassRest} hover:bg-white/[0.16] focus-visible:ring-white/30`
      : `${navGlassBlue} hover:bg-white/[0.16] focus-visible:ring-[#1f2a7c]/20`,
    className,
  );

  return (
    <button type="button" className={classes}>
      {children}
    </button>
  );
}

export function NavPrimaryButton({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#1f2a7c] px-5 text-[13px] font-semibold tracking-tight text-white shadow-[0_14px_30px_-18px_rgba(31,42,124,.8)] transition-colors duration-150 hover:bg-[#182268] xl:h-11 xl:px-6 xl:text-sm",
        className,
      )}
    >
      {children}
      <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 xl:h-4 xl:w-4" />
    </Link>
  );
}

export function NavIconButton({
  children,
  light,
  onClick,
  ariaLabel,
  href,
}: {
  children: React.ReactNode;
  light: boolean;
  onClick?: () => void;
  ariaLabel: string;
  href?: string;
}) {
  const className = cn(
    "grid h-10 w-10 shrink-0 place-items-center rounded-full transition-[background-color,color,box-shadow] duration-150 hover:bg-white/[0.16] xl:h-11 xl:w-11",
    light ? navGlassRest : navGlassBlue,
  );

  if (href) {
    return (
      <Link href={href} aria-label={ariaLabel} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" aria-label={ariaLabel} onClick={onClick} className={className}>
      {children}
    </button>
  );
}

export function NavHamburger({ open }: { open: boolean }) {
  return (
    <span className="relative block h-5 w-5" aria-hidden="true">
      <span
        className={cn(
          "absolute left-1/2 top-1/2 h-[2px] rounded-full bg-current transition-all duration-300 ease-out",
          open ? "w-5 -translate-x-1/2 -translate-y-1/2 rotate-45" : "w-5 -translate-x-1/2 -translate-y-[5px] rotate-0",
        )}
      />
      <span
        className={cn(
          "absolute left-1/2 top-1/2 h-[2px] rounded-full bg-current transition-all duration-300 ease-out",
          open ? "w-5 -translate-x-1/2 -translate-y-1/2 -rotate-45" : "w-3.5 -translate-x-[32%] translate-y-[5px] rotate-0",
        )}
      />
    </span>
  );
}
