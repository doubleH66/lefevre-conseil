import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "glass" | "glass-light";
  className?: string;
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className,
}: ButtonLinkProps) {
  const variantClass =
    variant === "primary"
      ? "btn-primary"
      : variant === "glass"
        ? "btn-glass"
        : "btn-glass-light";

  return (
    <Link href={href} className={cn(variantClass, className)}>
      {children}
    </Link>
  );
}
