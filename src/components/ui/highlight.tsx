import { cn } from "@/lib/utils";

type HighlightProps = {
  children: React.ReactNode;
  variant: "dark" | "light";
  className?: string;
  /** Délai d’animation CSS (équivalent heritage `delay="hero"`). */
  delay?: "none" | "hero";
};

/** Surlignage CSS pur — pas de Framer, compatible Server Component. */
export function Highlight({ children, variant, className, delay = "none" }: HighlightProps) {
  return (
    <span
      className={cn(
        "highlight-reveal-base highlight-reveal--animate",
        variant === "dark" ? "highlight-reveal--dark" : "highlight-reveal--light",
        delay === "hero" && "highlight-reveal--animate-delayed",
        className,
      )}
    >
      {children}
    </span>
  );
}
