import Image from "next/image";
import { ClipboardList, Compass, RefreshCw, Target } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  LANDING_SCROLL_MARGIN,
  LANDING_SECTION_INNER_Y,
  LANDING_SECTION_INSET,
  LANDING_SECTION_SHELL,
} from "@/lib/content/landing-layout";
import { METHOD_STEP_IMAGES, type MethodStepImageId } from "@/lib/content/media";
import { cn } from "@/lib/utils";

type MethodStep = {
  id: MethodStepImageId;
  tab: string;
  icon: LucideIcon;
  title: string;
  text: string;
  image: string;
};

const METHOD_STEPS: MethodStep[] = [
  {
    id: "situation",
    tab: "Situation",
    icon: Compass,
    title: "Comprendre votre situation",
    text: "Nous faisons le point sur votre situation personnelle, professionnelle, familiale et fiscale afin d’identifier vos priorités.",
    image: METHOD_STEP_IMAGES.situation,
  },
  {
    id: "objectifs",
    tab: "Objectifs",
    icon: Target,
    title: "Définir vos objectifs",
    text: "Retraite, transmission, épargne, prévoyance, fiscalité ou projet d’investissement : nous clarifions les objectifs à court, moyen et long terme.",
    image: METHOD_STEP_IMAGES.objectifs,
  },
  {
    id: "strategie",
    tab: "Stratégie",
    icon: ClipboardList,
    title: "Construire une stratégie adaptée",
    text: "Le cabinet étudie les solutions possibles et vous explique les avantages, limites, frais et risques de chaque orientation.",
    image: METHOD_STEP_IMAGES.strategie,
  },
  {
    id: "suivi",
    tab: "Suivi",
    icon: RefreshCw,
    title: "Suivre et ajuster dans le temps",
    text: "Votre patrimoine évolue. L’accompagnement permet d’ajuster les décisions selon votre situation, vos projets et le cadre réglementaire.",
    image: METHOD_STEP_IMAGES.suivi,
  },
];

function MethodIntroHeader() {
  return (
    <div className="mx-auto max-w-3xl text-center lg:max-w-4xl">
      <h2
        id="home-method-title"
        className="text-balance text-[clamp(1.4rem,3vw,2.25rem)] font-normal leading-[1.1] tracking-[-0.03em] text-[#1f2a7c]"
      >
        Une méthode claire pour prendre de meilleures décisions patrimoniales
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-[#1f2a7c]/75 sm:mt-5 sm:text-base">
        Chaque situation patrimoniale est différente. Lefèvre Conseil privilégie une approche
        progressive, pédagogique et personnalisée.
      </p>
    </div>
  );
}

function MethodStepCard({
  step,
  index,
}: {
  step: MethodStep;
  index: number;
}) {
  const Icon = step.icon;

  return (
    <article className="overflow-hidden rounded-[1.5rem] border border-[#1f2a7c]/10 bg-white shadow-[0_18px_50px_rgba(23,33,59,0.07)] ring-1 ring-[#1f2a7c]/[0.04]">
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#1f2a7c]/[0.04] sm:aspect-[2/1]">
        <Image
          src={step.image}
          alt={step.title}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 420px"
        />
      </div>
      <div className="flex items-start gap-5 p-6 sm:gap-7 sm:p-8">
        <div className="flex shrink-0 flex-col items-center gap-3">
          <span className="text-[clamp(2rem,4.5vw,3rem)] font-semibold leading-none tracking-[-0.04em] text-[#1f2a7c]/15 tabular-nums">
            0{index + 1}
          </span>
          <span className="flex size-11 items-center justify-center rounded-2xl bg-[#1f2a7c]/[0.07] text-[#1f2a7c]">
            <Icon className="size-5" aria-hidden strokeWidth={1.85} />
          </span>
        </div>
        <div className="min-w-0 pt-1">
          <h3 className="text-balance text-[clamp(1.15rem,2.4vw,1.65rem)] font-medium leading-tight tracking-[-0.02em] text-[#1f2a7c]">
            {step.title}
          </h3>
          <p className="mt-3 text-[15px] leading-relaxed text-[#1f2a7c]/72 sm:text-base">
            {step.text}
          </p>
        </div>
      </div>
    </article>
  );
}

function MethodStepVisual({ step }: { step: MethodStep }) {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.75rem] border border-[#1f2a7c]/10 bg-[#1f2a7c]/[0.04] shadow-[0_20px_55px_rgba(23,33,59,0.08)] xl:aspect-[5/4] xl:rounded-[2rem]">
      <Image
        src={step.image}
        alt={step.title}
        fill
        className="object-cover"
        sizes="(min-width: 1024px) 42vw, 100vw"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1f2a7c]/20 via-transparent to-transparent" />
    </div>
  );
}

function MethodStepCopy({
  step,
  index,
  align = "left",
  titleId,
}: {
  step: MethodStep;
  index: number;
  align?: "left" | "right";
  titleId: string;
}) {
  const Icon = step.icon;

  return (
    <div
      className={cn(
        "flex flex-col justify-center",
        align === "right" ? "lg:items-end lg:text-right" : "lg:items-start lg:text-left",
      )}
    >
      <div className={cn("flex items-center gap-3", align === "right" && "lg:flex-row-reverse")}>
        <span className="text-[clamp(2.5rem,4vw,3.5rem)] font-semibold leading-none tracking-[-0.04em] text-[#1f2a7c]/12 tabular-nums">
          0{index + 1}
        </span>
        <span className="flex size-12 items-center justify-center rounded-2xl bg-[#1f2a7c]/[0.07] text-[#1f2a7c]">
          <Icon className="size-5" aria-hidden strokeWidth={1.85} />
        </span>
      </div>
      <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1f2a7c]/45">
        {step.tab}
      </p>
      <h3
        id={titleId}
        className="mt-2 max-w-md text-balance text-[clamp(1.35rem,2.2vw,1.85rem)] font-medium leading-tight tracking-[-0.025em] text-[#1f2a7c]"
      >
        {step.title}
      </h3>
      <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[#1f2a7c]/72 sm:text-base">
        {step.text}
      </p>
    </div>
  );
}

function MethodDesktopRow({ step, index }: { step: MethodStep; index: number }) {
  const imageFirst = index % 2 === 1;

  return (
    <article
      aria-labelledby={`method-step-title-${step.id}`}
      className="grid items-center gap-8 lg:grid-cols-2 lg:gap-10 xl:gap-14"
    >
      <div className={cn(imageFirst ? "lg:order-1" : "lg:order-2")}>
        <MethodStepVisual step={step} />
      </div>
      <div className={cn(imageFirst ? "lg:order-2" : "lg:order-1")}>
        <MethodStepCopy
          step={step}
          index={index}
          align={imageFirst ? "right" : "left"}
          titleId={`method-step-title-${step.id}`}
        />
      </div>
    </article>
  );
}

/** Section « Notre méthode » — grille mobile ; alternance visuel / texte sur desktop. */
export function MethodScrollStack() {
  return (
    <section
      data-nav-theme="light"
      aria-labelledby="home-method-title"
      className={cn(LANDING_SECTION_SHELL, LANDING_SCROLL_MARGIN, "bg-white")}
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-[1.75rem] border border-[#1f2a7c]/12 bg-white lg:rounded-[2rem]",
          LANDING_SECTION_INSET,
          LANDING_SECTION_INNER_Y,
        )}
      >
        <MethodIntroHeader />

        {/* Mobile & tablette — grille 2 colonnes (inchangée) */}
        <ol className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-2 lg:hidden">
          {METHOD_STEPS.map((step, index) => (
            <li key={step.id}>
              <MethodStepCard step={step} index={index} />
            </li>
          ))}
        </ol>

        {/* Desktop — une étape par ligne, visuel et texte face à face */}
        <ol className="mx-auto mt-14 hidden max-w-6xl flex-col gap-16 lg:flex xl:mt-16 xl:gap-20">
          {METHOD_STEPS.map((step, index) => (
            <li key={step.id}>
              <MethodDesktopRow step={step} index={index} />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
