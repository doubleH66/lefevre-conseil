import Link from "next/link";
import { CONTACT_HREF } from "@/lib/content/routes";
import { navGlassBlue, navGlassRest } from "@/lib/styles/glass";
import { cn } from "@/lib/utils";

type ContactGlassLinkProps = {
  href?: string;
  children?: React.ReactNode;
  /** `true` sur fond sombre (hero, bandeaux) — même rendu que Contact dans la navbar. */
  light?: boolean;
  /** `nav` = taille navbar ; `hero` = taille CTA hero / bandeaux. */
  layout?: "nav" | "hero";
  className?: string;
};

/**
 * Bouton Contact verre — style identique à la navbar (`NavLiquidButton`).
 */
export function ContactGlassLink({
  href = CONTACT_HREF,
  children = "Contact",
  light = true,
  layout = "hero",
  className,
}: ContactGlassLinkProps) {
  const glass = light ? navGlassRest : navGlassBlue;

  const layoutClass =
    layout === "nav"
      ? "h-10 px-4 text-[13px] font-semibold tracking-tight sm:px-5 xl:h-11 xl:px-6 xl:text-sm"
      : "h-12 min-h-12 min-w-0 flex-1 px-4 text-sm font-semibold leading-none sm:min-w-[160px] sm:flex-none sm:px-7 sm:text-base xl:h-11 xl:min-w-[10.25rem] xl:px-8 xl:text-[15px]";

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full outline-none transition-[background-color,color,box-shadow] duration-150 focus-visible:ring-[3px]",
        layoutClass,
        glass,
        light ? "hover:bg-white/[0.16] focus-visible:ring-white/30" : "hover:bg-white/[0.16] focus-visible:ring-[#1f2a7c]/20",
        className,
      )}
    >
      {children}
    </Link>
  );
}
