"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Phone, X } from "lucide-react";
import { CONTACT_HREF } from "@/lib/content/routes";
import { CONSULT_POPUP_OPEN_EVENT } from "@/lib/consult-popup";
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
  const [mdUp, setMdUp] = React.useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const pathId = React.useId().replace(/:/g, "");
  const reduceMotion = useReducedMotion();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setMdUp(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  React.useEffect(() => {
    const onOpen = () => setIsOpen(true);
    window.addEventListener(CONSULT_POPUP_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(CONSULT_POPUP_OPEN_EVENT, onOpen);
  }, []);

  const hide = pathname != null && HIDDEN_PATH_TESTERS.some((t) => t(pathname));
  if (hide) return null;

  const mergedPosition: React.CSSProperties = {
    bottom: "max(0.5rem, env(safe-area-inset-bottom, 0px))",
    right: "max(1rem, env(safe-area-inset-right, 0px))",
    ...position,
  };

  const onContactPage = pathname === CONTACT_HREF;
  const effectiveCtaText = onContactPage ? "Accéder au formulaire" : ctaButtonText;

  const onCta = () => {
    setIsOpen(false);
    if (pathname === CONTACT_HREF) {
      document.getElementById("contact-form-title")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
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
              className="fixed inset-0 z-[200] flex items-end justify-center md:items-center md:p-6 md:pr-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <button
                type="button"
                className="absolute inset-0 bg-neutral-950/45 backdrop-blur-[2px]"
                aria-label="Fermer la fenêtre de contact"
                onClick={() => setIsOpen(false)}
              />
              <motion.div
                className="relative z-10 w-full max-w-lg md:max-w-md"
                initial={
                  reduceMotion
                    ? { opacity: 0 }
                    : mdUp
                      ? { opacity: 0, scale: 0.96, y: 0 }
                      : { y: "100%", opacity: 1, scale: 1 }
                }
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={
                  reduceMotion
                    ? { opacity: 0 }
                    : mdUp
                      ? { opacity: 0, scale: 0.96, y: 0 }
                      : { y: "100%", opacity: 1, scale: 1 }
                }
                transition={sheetTransition}
              >
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="absolute left-full top-0 z-20 ml-4 hidden size-11 place-items-center rounded-full bg-white text-[#1f2a7c] shadow-lg ring-1 ring-[#1f2a7c]/10 transition hover:bg-white hover:shadow-xl md:grid"
                  aria-label="Fermer"
                >
                  <X className="size-5" strokeWidth={1.75} aria-hidden />
                </button>
                <motion.div
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="floating-consult-title"
                  className={cn(
                    "overflow-hidden border border-[#1f2a7c]/10 bg-white shadow-2xl",
                    "rounded-t-[1.25rem] border-b-0 pb-[max(0.5rem,env(safe-area-inset-bottom,0px))]",
                    "md:rounded-2xl md:border md:pb-0",
                  )}
                  initial={false}
                  animate={{ y: 0 }}
                  exit={{ y: 0 }}
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
                        unoptimized
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
                      className="grid size-8 shrink-0 place-items-center rounded-full text-[#1f2a7c]/70 transition-colors hover:bg-[#1f2a7c]/[0.06] md:hidden"
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
                        {effectiveCtaText}
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
                  unoptimized
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
