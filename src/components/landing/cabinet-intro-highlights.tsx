"use client";

import { HighlightReveal } from "@/components/ui/highlight-reveal";

/** Accent typographique sans pastille — même couleur pleine que le corps. */
function Strong({ children }: { children: React.ReactNode }) {
  return <span className="font-semibold text-[#1f2a7c]">{children}</span>;
}

function Mark({
  children,
  delay,
  tone = "body",
}: {
  children: React.ReactNode;
  delay?: "none" | "hero";
  tone?: "title" | "body";
}) {
  return (
    <HighlightReveal
      variant="dark"
      delay={delay}
      className={tone === "title" ? "highlight-reveal--slim-title" : "highlight-reveal--slim"}
    >
      {children}
    </HighlightReveal>
  );
}

export function CabinetIntroTitleHighlights() {
  return (
    <>
      Conseil en gestion de patrimoine à <Mark tone="title">Perpignan</Mark>, <Strong>clair et personnalisé</Strong>.
    </>
  );
}

export function CabinetIntroParagraph1() {
  return (
    <p>
      Basé à Perpignan, <Strong>Lefèvre Conseil</Strong> accompagne particuliers, dirigeants et professions libérales
      dans l’organisation, la protection et la <Mark delay="hero">transmission de leur patrimoine</Mark>.
    </p>
  );
}

export function CabinetIntroParagraph2() {
  return (
    <p>
      Le cabinet intervient sur les grands sujets patrimoniaux : épargne, placements, assurance-vie, PER, retraite,
      prévoyance, assurance emprunteur et <Mark>fiscalité patrimoniale</Mark>.
    </p>
  );
}

export function CabinetIntroParagraph3() {
  return (
    <p>
      L’objectif est simple : construire une <Strong>stratégie claire, cohérente et adaptée</Strong> à votre situation,
      avec un accompagnement au cabinet, par téléphone ou en visioconférence.
    </p>
  );
}

export function CabinetIntroExtraParagraphs() {
  return (
    <>
      <CabinetIntroParagraph2 />
      <CabinetIntroParagraph3 />
    </>
  );
}
