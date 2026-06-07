"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Phone, X } from "lucide-react";
import { CONTACT_HREF } from "@/lib/content/routes";
import { ADVISOR_ROUND_AVATAR_IMAGE_URL, ADVISOR_ROUND_AVATAR_OBJECT_POSITION, CABINET_CONTACT } from "@/lib/content/site";
import { heroCtaPrimaryCompactClassName } from "@/lib/styles/cta";
import { cn } from "@/lib/utils";

export type FloatingConsultPosition = {
  bottom?: string;
  right?: string;
  left?: string;
  top?: string;
};

export type FloatingConsultButtonProps = {
  buttonSize?: number;
  imageSize?: number;
  imageSrc?: string;
  imageAlt?: string;
  revolvingText?: string;
  revolvingSpeed?: number;
  popupHeading?: string;
  popupDescription?: string;
  popupBadgeText?: string;
  ctaButtonText?: string;
  /** Si omis, navigation vers `CONTACT_HREF`. */
  ctaHref?: string;
  position?: FloatingConsultPosition;
  /** Pastille optionnelle au-dessus du rond (ex. promo) - laisser vide pour ne rien afficher. */
  cornerBadgeText?: string;
  className?: string;
};

const HIDDEN_PATH_TESTERS: readonly ((p: string) => boolean)[] = [
  (p) => p.startsWith("/espace-admin"),
  (p) => p.startsWith("/espace-client"),
  (p) => p === "/login",
  (p) => p.startsWith("/auth/"),
];

export function FloatingConsultButton({
  buttonSize,
  imageSize,
  imageSrc = ADVISOR_ROUND_AVATAR_IMAGE_URL,
  imageAlt = CABINET_CONTACT.name,
  revolvingText = `PRENDRE RENDEZ-VOUS - ${CABINET_CONTACT.name.toUpperCase()} - PATRIMOINE - `,
  revolvingSpeed = 14,
  popupHeading = "Prendre rendez-vous",
  popupDescription = "",
  popupBadgeText = "Réponse sous 24 h",
  ctaButtonText = "Prendre rendez-vous",
  ctaHref = CONTACT_HREF,
  position,
  cornerBadgeText,
  className,
}: FloatingConsultButtonProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const pathId = React.useId().replace(/:/g, "");
  const reduceMotion = useReducedMotion();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const hide = pathname != null && HIDDEN_PATH_TESTERS.some((t) => t(pathname));
  if (hide) return null;

  const mergedPosition: React.CSSProperties = {
    bottom: "max(0.5rem, env(safe-area-inset-bottom, 0px))",
    right: "max(1rem, env(safe-area-inset-right, 0px))",
    ...position,
  };

  const onCta = () => {
    setIsOpen(false);
    router.push(ctaHref);
  };

  const sheetTransition = reduceMotion
    ? { duration: 0.15 }
    : { type: "tween" as const, duration: 0.34, ease: [0.22, 1, 0.36, 1] as const };

  const bottomSheet =
    mounted && typeof document !== "undefined" ? (
      createPortal(
        <AnimatePresence>
          {isOpen ? (
            <motion.div
              key="floating-consult-shell"
              className="fixed inset-0 z-[200] flex items-end justify-center md:justify-end"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <button
                type="button"
                className="absolute inset-0 bg-neutral-950/40 backdrop-blur-[1px]"
                aria-label="Fermer la fenêtre de contact"
                onClick={() => setIsOpen(false)}
              />
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-labelledby="floating-consult-title"
                className={cn(
                  "relative z-10 w-full max-w-lg overflow-hidden border border-b-0 border-[#1f2a7c]/10 bg-white",
                  "rounded-t-[1.25rem] shadow-[0_-12px_48px_rgba(15,23,42,0.14)]",
                  "pb-[max(0.5rem,env(safe-area-inset-bottom,0px))]",
                  "md:w-[min(100vw-1.5rem,22.5rem)] md:max-w-none md:rounded-t-2xl",
                  "md:mr-[max(1rem,env(safe-area-inset-right,0px))]",
                )}
                initial={reduceMotion ? { opacity: 0 } : { y: "100%" }}
                animate={{ y: 0, opacity: 1 }}
                exit={reduceMotion ? { opacity: 0 } : { y: "100%" }}
                transition={sheetTransition}
              >
                <div className="mx-auto mt-2.5 h-1 w-9 shrink-0 rounded-full bg-neutral-300/90 md:hidden" aria-hidden />

                <div className="px-5 py-5 sm:px-6 sm:py-5">
                  <div className="flex items-center gap-3">
                    <div className="relative size-12 shrink-0 overflow-hidden rounded-full ring-2 ring-[#1f2a7c]/10">
                      <Image
                        src={imageSrc}
                        alt={imageAlt}
                        fill
                        sizes="48px"
                        className="object-cover"
                        style={{ objectPosition: ADVISOR_ROUND_AVATAR_OBJECT_POSITION }}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3
                        id="floating-consult-title"
                        className="text-sm font-semibold tracking-tight text-[#1f2a7c]"
                      >
                        Philippe Lefèvre
                      </h3>
                      <p className="mt-0.5 text-xs text-[#1f2a7c]/55">{popupBadgeText}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="grid size-8 shrink-0 place-items-center rounded-full text-[#1f2a7c]/70 transition-colors hover:bg-[#1f2a7c]/[0.06]"
                      aria-label="Fermer"
                    >
                      <X className="size-4" aria-hidden />
                    </button>
                  </div>

                  {popupDescription ? (
                    <p className="mt-4 text-sm leading-snug text-[#1f2a7c]/65">{popupDescription}</p>
                  ) : null}

                  <div className={cn("space-y-2", popupDescription ? "mt-4" : "mt-5")}>
                    <button
                      type="button"
                      className={cn(heroCtaPrimaryCompactClassName, "w-full sm:w-full sm:min-w-0")}
                      onClick={onCta}
                    >
                      <span className="inline-flex items-center gap-2">
                        {ctaButtonText}
                        <ArrowUpRight className="size-4" aria-hidden />
                      </span>
                    </button>
                    <a
                      href={`tel:${CABINET_CONTACT.phoneTel}`}
                      className="flex h-10 w-full items-center justify-center gap-2 text-sm font-medium text-[#1f2a7c]/75 transition-colors hover:text-[#1f2a7c]"
                    >
                      <Phone className="size-3.5" aria-hidden />
                      {CABINET_CONTACT.phone}
                    </a>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>,
        document.body,
      )
    ) : null;

  return (
    <>
      {bottomSheet}

      <div
        className={cn(
          "pointer-events-none fixed z-[70] site-chrome-method-shift-floating transition-opacity duration-200",
          isOpen && "opacity-0",
          className,
        )}
        style={mergedPosition}
        aria-hidden={isOpen}
      >
        <div className={cn("pointer-events-auto flex flex-col items-end", isOpen && "pointer-events-none")}>
          {cornerBadgeText ? (
            <span
              className="mb-1 rounded-full bg-[#1f2a7c] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white shadow-sm sm:text-[10px]"
              aria-hidden
            >
              {cornerBadgeText}
            </span>
          ) : null}
          <motion.button
            type="button"
            aria-expanded={isOpen}
            aria-haspopup="dialog"
            aria-label={`Ouvrir : ${popupHeading}`}
            className={cn(
              "relative cursor-pointer",
              buttonSize == null && "size-[7.25rem] lg:size-[9rem]",
            )}
            style={
              buttonSize != null
                ? { width: buttonSize, height: buttonSize }
                : undefined
            }
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={() => setIsOpen((v) => !v)}
          >
            <motion.div
              className="absolute inset-0 overflow-visible text-neutral-600"
              animate={reduceMotion ? { rotate: 0 } : { rotate: 360 }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: revolvingSpeed, repeat: Infinity, ease: "linear" }
              }
            >
              <svg viewBox="0 0 200 200" className="size-full overflow-visible" aria-hidden>
                <defs>
                  <path
                    id={pathId}
                    d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
                  />
                </defs>
                <text className="fill-neutral-500 text-[10px] font-semibold uppercase tracking-[0.32em] lg:text-[11px] lg:tracking-[0.36em]">
                  <textPath href={`#${pathId}`} startOffset="0%">
                    {revolvingText}
                  </textPath>
                </text>
              </svg>
            </motion.div>

            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className={cn(
                  "relative overflow-hidden rounded-full bg-neutral-900 shadow-lg ring-2 ring-white/90",
                  imageSize == null && "size-[4.5rem] lg:size-[5.5rem]",
                )}
                style={
                  imageSize != null
                    ? { width: imageSize, height: imageSize }
                    : undefined
                }
              >
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  fill
                  sizes="96px"
                  className="object-cover"
                  style={{ objectPosition: ADVISOR_ROUND_AVATAR_OBJECT_POSITION }}
                />
              </div>
            </div>
          </motion.button>
        </div>
      </div>
    </>
  );
}
