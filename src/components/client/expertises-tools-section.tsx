"use client";

import { ServiceComparateurBlock } from "@/components/services/service-comparateur-block";
import { hubInnerWideClass, hubSectionClass } from "@/components/marketing/hub-styles";
import { ROUTES } from "@/lib/content/routes";
import { cn } from "@/lib/utils";

/** Outils mutuelle + comparateur iframe --- hub /expertises. */
export function ExpertisesToolsSection() {
  return (
    <section className={cn(hubSectionClass, "scroll-mt-28")} aria-labelledby="expertises-tools-title">
      <div className={hubInnerWideClass}>
        <ServiceComparateurBlock
          layout="standalone"
          sourcePage={ROUTES.expertises}
          titleId="expertises-tools-title"
        />
      </div>
    </section>
  );
}
