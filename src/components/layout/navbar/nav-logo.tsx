import Link from "next/link";
import { SITE_LOGO_URL } from "@/lib/content/site";
import { cn } from "@/lib/utils";

export function NavLogo({ light }: { light: boolean }) {
  return (
    <Link
      href="/"
      aria-label="Lefèvre Conseil — accueil"
      className="flex h-10 max-w-[150px] shrink-0 items-center rounded-xl outline-none transition focus-visible:ring-2 focus-visible:ring-[#1f2a7c]/30 sm:h-11 sm:max-w-[180px] lg:h-12 lg:max-w-[220px]"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={SITE_LOGO_URL}
        alt="Lefèvre Conseil"
        draggable={false}
        className={cn(
          "h-full w-auto max-w-full object-contain object-left transition-[filter] duration-200",
          light ? "brightness-0 invert" : "",
        )}
      />
    </Link>
  );
}
