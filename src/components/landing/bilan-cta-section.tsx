"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { BILAN_CTA_CONTENT, BILAN_CTA_IMAGE } from "@/lib/content/bilan-cta";
import { LANDING_CTA_SECTION_CLASS } from "@/lib/content/landing-layout";
import { heroCtaPrimaryCompactClassName } from "@/lib/styles/cta";
import { cn } from "@/lib/utils";

export const bilanCtaSectionClassName = LANDING_CTA_SECTION_CLASS;

const REVEAL = {
  hidden: { opacity: 0, y: 22 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.52,
      delay: index * 0.09,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

/**
 * Bandeau CTA final — révélation au scroll, texte unique, une seule section sémantique.
 */
export function BilanCtaSection({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, {
    once: true,
    amount: 0.42,
    margin: "0px 0px -6% 0px",
  });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const bgScale = useTransform(scrollYProgress, [0, 0.5, 1], reduceMotion ? [1, 1, 1] : [1.08, 1.03, 1.02]);
  const bgY = useTransform(scrollYProgress, [0, 1], reduceMotion ? ["0%", "0%"] : ["-3%", "3%"]);
  const revealed = reduceMotion || inView;

  return (
    <div data-nav-theme="light" className={className ?? bilanCtaSectionClassName}>
      <section
        ref={sectionRef}
        aria-labelledby="bilan-cta-title"
        className="relative isolate overflow-hidden rounded-3xl border border-[#1f2a7c]/15 text-white shadow-[0_24px_60px_-30px_rgba(15,23,42,0.5)]"
      >
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden will-change-transform"
          style={{ scale: bgScale, y: bgY }}
        >
          <Image
            src={BILAN_CTA_IMAGE}
            alt=""
            fill
            className="object-cover object-center"
            sizes="(min-width: 1024px) 896px, 100vw"
          />
          <div className="absolute inset-0 bg-black/[0.58]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/68 to-black/52 xl:bg-gradient-to-r xl:from-black/[0.88] xl:via-black/62 xl:to-black/38" />
        </motion.div>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_55%)]"
        />

        <div className="relative z-[2] mx-auto flex w-full max-w-2xl flex-col items-center justify-center gap-6 px-6 py-10 text-center sm:gap-7 sm:px-9 sm:py-11 lg:max-w-xl lg:px-12 lg:py-12">
          <motion.h2
            id="bilan-cta-title"
            className="mx-auto w-full max-w-xl text-balance text-center text-[clamp(1.35rem,4vw,1.875rem)] font-semibold leading-[1.12] tracking-[-0.03em] text-white sm:text-3xl"
            variants={REVEAL}
            initial="hidden"
            animate={revealed ? "visible" : "hidden"}
            custom={0}
          >
            {BILAN_CTA_CONTENT.title}
          </motion.h2>

          <motion.p
            className="mx-auto w-full max-w-md text-balance text-center text-[15px] leading-relaxed text-white/78 sm:max-w-lg"
            variants={REVEAL}
            initial="hidden"
            animate={revealed ? "visible" : "hidden"}
            custom={1}
          >
            {BILAN_CTA_CONTENT.supporting}
          </motion.p>

          <motion.div
            className="flex w-full justify-center"
            variants={REVEAL}
            initial="hidden"
            animate={revealed ? "visible" : "hidden"}
            custom={2}
          >
            <Link
              href={BILAN_CTA_CONTENT.primaryHref}
              className={cn(heroCtaPrimaryCompactClassName, "group sm:min-w-[12.5rem]")}
            >
              {BILAN_CTA_CONTENT.primaryLabel}
              <ArrowUpRight
                aria-hidden
                className="size-4 shrink-0 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
