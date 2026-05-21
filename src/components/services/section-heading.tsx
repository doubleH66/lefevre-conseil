import { cn } from "@/lib/utils";

export type SectionHeadingProps = {
  title: string;
  eyebrow?: string;
  description?: string;
  align?: "left" | "center";
  titleId?: string;
  className?: string;
};

export function SectionHeading({
  title,
  eyebrow,
  description,
  align = "left",
  titleId,
  className,
}: SectionHeadingProps) {
  const isCenter = align === "center";

  return (
    <div
      className={cn(
        isCenter ? "mx-auto max-w-3xl text-center" : "max-w-3xl text-left",
        className,
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            "inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1f2a7c]/70",
            isCenter && "justify-center",
          )}
        >
          <span aria-hidden className="inline-block h-px w-5 bg-[#1f2a7c]/40" />
          {eyebrow}
        </p>
      ) : null}
      <h2
        id={titleId}
        className={cn(
          "mt-4 text-balance text-[clamp(1.35rem,3vw,2rem)] font-semibold leading-[1.15] tracking-tight text-neutral-900 sm:text-[clamp(1.45rem,2.6vw,2.15rem)]",
          !eyebrow && "mt-0",
        )}
      >
        {title}
      </h2>
      {description ? (
        <p className="mx-auto mt-4 max-w-2xl text-pretty text-[15px] leading-relaxed text-neutral-600 sm:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}
