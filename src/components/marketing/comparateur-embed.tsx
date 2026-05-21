"use client";

import * as React from "react";
import {
  ASSUR_DISTRIBUTION_ORIGIN,
  type AssurEmbedVariant,
  assurEmbedConfig,
} from "@/lib/content/comparateur";

declare global {
  interface Window {
    triggerResize?: () => void;
  }
}

function parseHeight(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return Math.round(value);
  }
  if (typeof value === "string") {
    const parsed = Number.parseInt(value, 10);
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
  }
  return null;
}

function heightFromMessagePayload(data: unknown): number | null {
  const direct = parseHeight(data);
  if (direct) return direct;

  if (!data || typeof data !== "object") return null;

  const record = data as Record<string, unknown>;
  for (const key of ["height", "iframeHeight", "resizeHeight", "h", "frameHeight"]) {
    const nested = parseHeight(record[key]);
    if (nested) return nested;
  }

  if ("data" in record) {
    return heightFromMessagePayload(record.data);
  }

  return null;
}

type AssurDistributionEmbedProps = {
  variant?: AssurEmbedVariant;
  className?: string;
};

export function AssurDistributionEmbed({ variant = "comparateur", className }: AssurDistributionEmbedProps) {
  const config = assurEmbedConfig(variant);
  const src = `${ASSUR_DISTRIBUTION_ORIGIN}${config.path}`;
  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  const [heightPx, setHeightPx] = React.useState<number>(config.defaultHeightPx);

  const triggerResize = React.useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    try {
      const doc = iframe.contentDocument ?? iframe.contentWindow?.document;
      const bodyHeight = doc?.body?.scrollHeight ?? 0;
      const docHeight = doc?.documentElement?.scrollHeight ?? 0;
      const measured = Math.max(bodyHeight, docHeight);
      if (measured > 0) setHeightPx(measured);
    } catch {
      // Cross-origin : hauteur via postMessage.
    }
  }, []);

  React.useEffect(() => {
    setHeightPx(config.defaultHeightPx);
  }, [config.defaultHeightPx, variant]);

  React.useEffect(() => {
    window.triggerResize = triggerResize;

    function onMessage(event: MessageEvent) {
      if (event.origin !== ASSUR_DISTRIBUTION_ORIGIN) return;
      const nextHeight = heightFromMessagePayload(event.data);
      if (nextHeight) setHeightPx(nextHeight);
    }

    window.addEventListener("message", onMessage);
    return () => {
      delete window.triggerResize;
      window.removeEventListener("message", onMessage);
    };
  }, [triggerResize]);

  return (
    <iframe
      ref={iframeRef}
      id={config.iframeId}
      title={config.title}
      src={src}
      scrolling="no"
      onLoad={triggerResize}
      className={className ?? "block w-full min-w-full border-0"}
      style={{
        width: "1px",
        minWidth: "100%",
        height: `${heightPx}px`,
        overflow: "hidden",
      }}
    />
  );
}

/** Comparateur assurance emprunteur / multi-produits. */
export function ComparateurEmbed() {
  return <AssurDistributionEmbed variant="comparateur" />;
}

/** Parcours mutuelle santé (« Obtenir ma mutuelle »). */
export function MutuelleEmbed() {
  return <AssurDistributionEmbed variant="mutuelle" />;
}
