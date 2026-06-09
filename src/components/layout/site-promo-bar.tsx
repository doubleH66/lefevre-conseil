"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useTransform, type MotionValue } from "framer-motion";
import { AnimatedTextCycle } from "@/components/ui/animated-text-cycle";
import { CONTACT_HREF } from "@/lib/content/routes";
import { SITE_PROMO_BAR_HEIGHT, readPromoBarHeight } from "@/lib/nav-styles";
import { cn } from "@/lib/utils";

const promoMessagesDesktop = [
  "Conseil patrimonial indépendant à Perpignan · Rendez-vous au cabinet ou à distance",
  "Premier échange offert · Cabinet indépendant à Perpignan · Accompagnement possible à distance",
] as const;

const promoMessagesMobile = [
  "Patrimoine à Perpignan · Cabinet ou distance",
  "Premier échange offert · Sans engagement",
] as const;

function useIsSmUp() {
  const [smUp, setSmUp] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const sync = () => setSmUp(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return smUp;
}

export function SitePromoBar({
  enabled,
  promoHide,
}: {
  enabled: boolean;
  promoHide: MotionValue<number>;
}) {
  const [promoHeight, setPromoHeight] = useState(SITE_PROMO_BAR_HEIGHT);
  const smUp = useIsSmUp();
  const promoMessages = smUp ? promoMessagesDesktop : promoMessagesMobile;

  useEffect(() => {
    const sync = () => setPromoHeight(readPromoBarHeight());
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  const promoY = useTransform(promoHide, [0, 1], [0, -promoHeight]);
  const promoOpacity = useTransform(promoHide, [0, 0.65, 1], [1, 0.4, 0]);

  return (
    <motion.div
      className={cn(
        "site-chrome-promo fixed inset-x-0 top-0 z-[55] will-change-transform supports-[padding:max(0px)]:pt-[env(safe-area-inset-top,0px)]",
        !enabled && "pointer-events-none",
      )}
      style={enabled ? { y: promoY, opacity: promoOpacity } : undefined}
    >
        <div
          className={cn(
            "flex h-7 items-center justify-center bg-white px-2 text-center text-[11px] font-medium leading-none tracking-[-0.01em] text-[#1f2a7c] backdrop-blur-md sm:h-9 sm:px-3 sm:text-[13px] sm:leading-snug sm:text-sm site-chrome-method-shift-promo",
            !enabled && "-translate-y-full opacity-0",
          )}
        >
        <Link
          href={CONTACT_HREF}
          aria-label="Prendre rendez-vous avec Lefèvre Conseil"
          className="inline-flex max-w-[min(100%,44rem)] items-center gap-1.5 transition-opacity hover:opacity-80 sm:gap-2"
        >
          <span className="relative flex size-1.5 shrink-0 sm:size-2" aria-hidden>
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400/40" />
            <span className="relative inline-flex size-full rounded-full bg-emerald-500" />
          </span>
          <span className="min-w-0 sm:max-w-none sm:overflow-visible sm:whitespace-normal">
            <AnimatedTextCycle words={[...promoMessages]} interval={4500} />
          </span>
        </Link>
      </div>
    </motion.div>
  );
}
