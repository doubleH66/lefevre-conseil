"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useTransform, type MotionValue } from "framer-motion";
import { AnimatedTextCycle } from "@/components/ui/animated-text-cycle";
import { CONTACT_HREF } from "@/lib/content/routes";
import { SITE_PROMO_BAR_HEIGHT, readPromoBarHeight } from "@/lib/nav-styles";
import { cn } from "@/lib/utils";

const promoMessages = [
  "Conseil patrimonial indépendant à Perpignan · Rendez-vous au cabinet ou à distance",
  "Premier échange offert · Cabinet indépendant à Perpignan · Accompagnement possible à distance",
] as const;

export function SitePromoBar({
  enabled,
  promoHide,
}: {
  enabled: boolean;
  promoHide: MotionValue<number>;
}) {
  const [promoHeight, setPromoHeight] = useState(SITE_PROMO_BAR_HEIGHT);

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
            "flex h-9 items-center justify-center bg-white px-3 text-center text-[13px] font-medium leading-snug tracking-[-0.01em] text-[#1f2a7c] backdrop-blur-md sm:text-sm site-chrome-method-shift-promo",
            !enabled && "-translate-y-full opacity-0",
          )}
        >
        <Link
          href={CONTACT_HREF}
          aria-label="Prendre rendez-vous avec Lefèvre Conseil"
          className="inline-flex max-w-[min(100%,44rem)] items-center gap-2 transition-opacity hover:opacity-80"
        >
          <span className="relative flex size-2 shrink-0" aria-hidden>
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400/40" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>
          <span className="min-w-0 truncate sm:max-w-none sm:overflow-visible sm:whitespace-normal">
            <AnimatedTextCycle words={[...promoMessages]} interval={4500} />
          </span>
        </Link>
      </div>
    </motion.div>
  );
}
