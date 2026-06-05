"use client";

import * as Color from "color-bits";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export const getRGBA = (
  cssColor: React.CSSProperties["color"],
  fallback = "rgba(180, 180, 180)",
): string => {
  if (typeof window === "undefined") return fallback;
  if (!cssColor) return fallback;

  try {
    if (typeof cssColor === "string" && cssColor.startsWith("var(")) {
      const element = document.createElement("div");
      element.style.color = cssColor;
      document.body.appendChild(element);
      const computedColor = window.getComputedStyle(element).color;
      document.body.removeChild(element);
      return Color.formatRGBA(Color.parse(computedColor));
    }

    return Color.formatRGBA(Color.parse(cssColor));
  } catch {
    return fallback;
  }
};

export const colorWithOpacity = (color: string, opacity: number): string => {
  if (!color.startsWith("rgb")) return color;
  return Color.formatRGBA(Color.alpha(Color.parse(color), opacity));
};

export type FlickeringFooterLink = {
  id: number;
  title: string;
  url: string;
  external?: boolean;
};

export type FlickeringFooterColumn = {
  title: string;
  links: FlickeringFooterLink[];
  /** Contenu sous les liens de la colonne (ex. réseaux sociaux). */
  extra?: React.ReactNode;
};

type FlickeringGridProps = React.HTMLAttributes<HTMLDivElement> & {
  squareSize?: number;
  gridGap?: number;
  flickerChance?: number;
  color?: string;
  width?: number;
  height?: number;
  maxOpacity?: number;
  text?: string;
  fontSize?: number;
  fontWeight?: number | string;
};

export const FlickeringGrid: React.FC<FlickeringGridProps> = ({
  squareSize = 3,
  gridGap = 3,
  flickerChance = 0.2,
  color = "#B4B4B4",
  width,
  height,
  className,
  maxOpacity = 0.15,
  text = "",
  fontSize = 140,
  fontWeight = 600,
  ...props
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  const memoizedColor = useMemo(() => getRGBA(color), [color]);

  const drawGrid = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      canvasWidth: number,
      canvasHeight: number,
      cols: number,
      rows: number,
      squares: Float32Array,
      dpr: number,
    ) => {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      const maskCanvas = document.createElement("canvas");
      maskCanvas.width = canvasWidth;
      maskCanvas.height = canvasHeight;
      const maskCtx = maskCanvas.getContext("2d", { willReadFrequently: true });
      if (!maskCtx) return;

      if (text) {
        maskCtx.save();
        maskCtx.scale(dpr, dpr);
        maskCtx.fillStyle = "white";
        maskCtx.font = `${fontWeight} ${fontSize}px var(--font-inter), Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
        maskCtx.textAlign = "center";
        maskCtx.textBaseline = "middle";
        maskCtx.fillText(text, canvasWidth / (2 * dpr), canvasHeight / (2 * dpr));
        maskCtx.restore();
      }

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * (squareSize + gridGap) * dpr;
          const y = j * (squareSize + gridGap) * dpr;
          const squareWidth = squareSize * dpr;
          const squareHeight = squareSize * dpr;

          const maskData = maskCtx.getImageData(x, y, squareWidth, squareHeight).data;
          const hasText = maskData.some((value, index) => index % 4 === 0 && value > 0);

          const opacity = squares[i * rows + j];
          const finalOpacity = hasText ? Math.min(1, opacity * 3 + 0.4) : opacity;

          ctx.fillStyle = colorWithOpacity(memoizedColor, finalOpacity);
          ctx.fillRect(x, y, squareWidth, squareHeight);
        }
      }
    },
    [memoizedColor, squareSize, gridGap, text, fontSize, fontWeight],
  );

  const setupCanvas = useCallback(
    (canvas: HTMLCanvasElement, canvasWidth: number, canvasHeight: number) => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvasWidth * dpr;
      canvas.height = canvasHeight * dpr;
      canvas.style.width = `${canvasWidth}px`;
      canvas.style.height = `${canvasHeight}px`;
      const cols = Math.ceil(canvasWidth / (squareSize + gridGap));
      const rows = Math.ceil(canvasHeight / (squareSize + gridGap));

      const squares = new Float32Array(cols * rows);
      for (let i = 0; i < squares.length; i++) {
        squares[i] = Math.random() * maxOpacity;
      }

      return { cols, rows, squares, dpr };
    },
    [squareSize, gridGap, maxOpacity],
  );

  const updateSquares = useCallback(
    (squares: Float32Array, deltaTime: number) => {
      for (let i = 0; i < squares.length; i++) {
        if (Math.random() < flickerChance * deltaTime) {
          squares[i] = Math.random() * maxOpacity;
        }
      }
    },
    [flickerChance, maxOpacity],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let gridParams: ReturnType<typeof setupCanvas>;

    const updateCanvasSize = () => {
      const newWidth = width || container.clientWidth;
      const newHeight = height || container.clientHeight;
      setCanvasSize({ width: newWidth, height: newHeight });
      gridParams = setupCanvas(canvas, newWidth, newHeight);
    };

    updateCanvasSize();

    let lastTime = 0;
    const animate = (time: number) => {
      if (!isInView) return;

      const deltaTime = (time - lastTime) / 1000;
      lastTime = time;

      updateSquares(gridParams.squares, deltaTime);
      drawGrid(
        ctx,
        canvas.width,
        canvas.height,
        gridParams.cols,
        gridParams.rows,
        gridParams.squares,
        gridParams.dpr,
      );
      animationFrameId = requestAnimationFrame(animate);
    };

    const resizeObserver = new ResizeObserver(() => {
      updateCanvasSize();
    });

    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0 },
    );

    intersectionObserver.observe(canvas);

    if (isInView) {
      animationFrameId = requestAnimationFrame(animate);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, [setupCanvas, updateSquares, drawGrid, width, height, isInView]);

  return (
    <div ref={containerRef} className={cn("h-full w-full", className)} {...props}>
      <canvas
        ref={canvasRef}
        className="pointer-events-none"
        style={{
          width: canvasSize.width,
          height: canvasSize.height,
        }}
      />
    </div>
  );
};

export type FlickeringFooterProps = {
  brandName: string;
  logoSrc: string;
  description: string;
  columns: FlickeringFooterColumn[];
  copyright: string;
  /** Contenu sous la description (newsletter, réseaux…). */
  brandExtra?: React.ReactNode;
  /** Liens légaux au-dessus du copyright. */
  legalLinks?: readonly { title: string; href: string }[];
  /** Lien Aurenis sous le copyright. */
  creditHref?: string;
  creditLogoSrc?: string;
  creditAlt?: string;
};

export function FlickeringFooter({
  brandName,
  logoSrc,
  description,
  columns,
  copyright,
  brandExtra,
  legalLinks,
  creditHref = "https://heyaurenis.com",
  creditLogoSrc,
  creditAlt = "Aurenis",
}: FlickeringFooterProps) {
  return (
    <footer id="footer" className="relative w-full overflow-hidden border-t border-neutral-200/80 bg-white pb-0 text-[#1f2a7c]">
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        <FlickeringGrid
          className="h-full w-full"
          squareSize={1}
          gridGap={4}
          color="#1f2a7c"
          maxOpacity={0.18}
          flickerChance={0.09}
        />
      </div>

      <div className="relative z-10 flex flex-col gap-10 p-8 sm:p-10 md:flex-row md:items-start md:justify-between lg:gap-14 lg:p-14 xl:gap-16 xl:p-16">
        <div className="mx-0 flex max-w-sm flex-col items-start justify-start gap-y-5 lg:max-w-md lg:gap-y-6">
          <Link href="/" className="flex items-center gap-2" aria-label={brandName}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoSrc} alt="" className="h-9 w-auto max-w-[min(100%,220px)] object-contain sm:h-10" />
          </Link>
          <p className="text-sm leading-[1.7] font-medium tracking-tight text-[#1f2a7c]/70 sm:text-[15px]">
            {description}
          </p>
          {brandExtra}
        </div>

        <div className="md:w-3/5 md:pt-0 lg:w-[62%] xl:w-[60%]">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-12 lg:gap-y-10 xl:gap-x-14">
            {columns.map((column) => (
              <ul key={column.title} className="flex flex-col gap-y-2.5">
                <li className="mb-2.5 text-sm font-semibold text-[#1f2a7c] lg:mb-3 lg:text-[15px]">{column.title}</li>
                {column.links.map((link) => (
                  <li
                    key={link.id}
                    className="group inline-flex cursor-pointer items-center justify-start gap-1 text-[15px]/snug text-[#1f2a7c]/70"
                  >
                    <Link
                      href={link.url}
                      className="transition-colors hover:text-[#1f2a7c]"
                      {...(link.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      {link.title}
                    </Link>
                    <span className="flex size-4 translate-x-0 items-center justify-center rounded border border-[#1f2a7c]/15 opacity-0 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:opacity-100">
                      <ChevronRight className="size-3" aria-hidden />
                    </span>
                  </li>
                ))}
                {column.extra ? <li className="pt-4 lg:pt-5">{column.extra}</li> : null}
              </ul>
            ))}
          </div>
        </div>
      </div>

      {legalLinks?.length ? (
        <ul className="relative z-10 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[#1f2a7c]/10 px-8 pb-4 pt-6 sm:px-10 lg:px-14 lg:pb-5 lg:pt-8 xl:px-16">
          {legalLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-xs text-[#1f2a7c]/48 transition-colors hover:text-[#1f2a7c]/75 sm:text-sm"
              >
                {link.title}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="relative z-10 flex flex-col items-start justify-between gap-4 px-8 pb-8 sm:flex-row sm:items-center sm:px-10 sm:pb-10 lg:px-14 lg:pb-14 lg:pt-1 xl:px-16 xl:pb-16">
        <p className="text-sm text-[#1f2a7c]/50">{copyright}</p>
        {creditLogoSrc ? (
          <a
            href={creditHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0"
            aria-label={creditAlt}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={creditLogoSrc} alt={creditAlt} className="h-6 w-auto brightness-0 sm:h-7" />
          </a>
        ) : null}
      </div>
    </footer>
  );
}
