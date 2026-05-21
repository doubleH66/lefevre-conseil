"use client";

import * as React from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { CONTACT_HREF } from "@/lib/content/routes";
import { CABINET_CONTACT } from "@/lib/content/site";
import { ADVISOR_ROUND_AVATAR_IMAGE_URL, ADVISOR_ROUND_AVATAR_OBJECT_POSITION } from "@/lib/content/site";
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
  /** Pastille optionnelle au-dessus du rond (ex. promo) — laisser vide pour ne rien afficher. */
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
  revolvingText = `ME CONTACTER - ${CABINET_CONTACT.name.toUpperCase()} - PATRIMOINE - `,
  revolvingSpeed = 14,
  popupHeading = "Échange avec le cabinet",
  popupDescription = `Une prise de contact simple : nous revenons vers vous sous 24h. Conseil en gestion de patrimoine à ${CABINET_CONTACT.address.city}, ouvert sur toute la France.`,
  popupBadgeText = "Sans engagement",
  ctaButtonText = "Accéder au contact",
  ctaHref = CONTACT_HREF,
  position,
  cornerBadgeText,
  className,
}: FloatingConsultButtonProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const pathId = React.useId().replace(/:/g, "");
  const reduceMotion = useReducedMotion();

  const hide = pathname != null && HIDDEN_PATH_TESTERS.some((t) => t(pathname));
  if (hide) return null;

  const mergedPosition: React.CSSProperties = {
    /** Plus bas sur l’écran (demande utilisateur) ; garde un minimum lisible au-dessus de la safe area. */
    bottom: "max(0.5rem, env(safe-area-inset-bottom, 0px))",
    right: "max(1rem, env(safe-area-inset-right, 0px))",
    ...position,
  };

  const onCta = () => {
    setIsOpen(false);
    router.push(ctaHref);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            key="floating-consult-backdrop"
            role="presentation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[80] bg-black/25 backdrop-blur-[2px]"
            onClick={() => setIsOpen(false)}
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            key="floating-consult-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="floating-consult-title"
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            className={cn(
              "fixed z-[90] w-[min(100vw-2rem,26rem)] rounded-3xl border border-neutral-200/90 bg-white p-6 shadow-2xl sm:p-8",
              /* Carte au-dessus du rond : même écart qu’avant, recalé pour le FAB plus bas */
              "bottom-[calc(8.5rem+env(safe-area-inset-bottom,0px))] right-4 sm:right-6",
              "lg:bottom-[calc(10.5rem+env(safe-area-inset-bottom,0px))] lg:right-8",
            )}
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute right-3 top-3 rounded-full p-2 text-neutral-500 outline-none transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus-visible:ring-2 focus-visible:ring-[#1f2a7c]/30"
              aria-label="Fermer la fenêtre"
            >
              <X className="size-5" strokeWidth={2} />
            </button>

            <div className="space-y-5 pr-10 pt-1 sm:pr-12">
              <div className="flex flex-col gap-3">
                <h3
                  id="floating-consult-title"
                  className="text-balance pr-2 text-2xl font-semibold leading-tight tracking-tight text-[#1f2a7c] sm:text-3xl"
                >
                  {popupHeading}
                </h3>
                <span className="w-fit rounded-full border-2 border-[#1f2a7c]/25 bg-[#1f2a7c]/[0.06] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#1f2a7c]">
                  {popupBadgeText}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-neutral-600 sm:text-base">{popupDescription}</p>
              <button
                type="button"
                className="h-12 w-full rounded-full bg-[#1f2a7c] text-base font-semibold text-white hover:bg-[#1f2a7c]/90"
                onClick={onCta}
              >
                {ctaButtonText}
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className={cn("pointer-events-none fixed z-[70]", className)} style={mergedPosition}>
        <div className="pointer-events-auto flex flex-col items-end">
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
                  unoptimized
                />
              </div>
            </div>
          </motion.button>
        </div>
      </div>
    </>
  );
}
