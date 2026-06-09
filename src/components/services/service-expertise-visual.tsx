import Image from "next/image";
import { cn } from "@/lib/utils";

type ServiceExpertiseVisualProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  /** Bandeau horizontal entre deux blocs texte. */
  variant?: "panel" | "break";
};

/** Visuel expertise (carrousel / hub) — panneau latéral ou respiration entre sections. */
export function ServiceExpertiseVisual({
  src,
  alt,
  className,
  priority = false,
  variant = "panel",
}: ServiceExpertiseVisualProps) {
  const isBreak = variant === "break";

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden bg-neutral-100",
        isBreak
          ? "aspect-[21/9] rounded-[1.25rem] sm:aspect-[2.4/1] sm:rounded-[1.5rem]"
          : "aspect-[4/3] rounded-[1.75rem] md:rounded-[2rem] lg:aspect-auto lg:min-h-[18rem] lg:h-full xl:min-h-[22rem]",
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover object-center"
        sizes={
          isBreak
            ? "(max-width: 1024px) 100vw, 80vw"
            : "(max-width: 1024px) 100vw, 42vw"
        }
        priority={priority}
      />
      <div
        className={cn(
          "pointer-events-none absolute inset-0",
          isBreak
            ? "bg-gradient-to-t from-[#1f2a7c]/20 via-transparent to-transparent"
            : "bg-gradient-to-t from-[#1f2a7c]/25 via-transparent to-transparent",
        )}
        aria-hidden
      />
    </div>
  );
}
