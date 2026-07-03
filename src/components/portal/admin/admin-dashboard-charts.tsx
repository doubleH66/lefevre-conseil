"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChartPoint } from "@/lib/portal/dashboard-analytics";

const CHART_COLORS = ["#1f2a7c", "#3d4db7", "#5c6fd4", "#8b9ae8", "#b8c4f5", "#d4dcf9"];

export function AdminDashboardKpiGrid({
  items,
}: {
  items: { label: string; value: number | string; hint?: string; icon: LucideIcon; accent?: string }[];
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <article
            key={item.label}
            className="relative overflow-hidden rounded-2xl border border-neutral-200/90 bg-white p-4 shadow-[0_8px_30px_rgba(31,42,124,0.06)]"
          >
            <div
              className="pointer-events-none absolute -right-4 -top-4 size-20 rounded-full opacity-[0.07]"
              style={{ backgroundColor: item.accent ?? "#1f2a7c" }}
              aria-hidden
            />
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
                  {item.label}
                </p>
                <p className="mt-2 text-2xl font-semibold tabular-nums tracking-tight text-neutral-900">
                  {item.value}
                </p>
                {item.hint ? <p className="mt-1 text-[11px] text-neutral-500">{item.hint}</p> : null}
              </div>
              <span
                className="flex size-9 shrink-0 items-center justify-center rounded-xl text-white"
                style={{ backgroundColor: item.accent ?? "#1f2a7c" }}
              >
                <Icon className="size-4" aria-hidden strokeWidth={1.75} />
              </span>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export function AdminBarChart({
  title,
  subtitle,
  data,
  className,
}: {
  title: string;
  subtitle?: string;
  data: ChartPoint[];
  className?: string;
}) {
  const max = Math.max(1, ...data.map((d) => d.value));

  return (
    <section
      className={cn(
        "flex h-full flex-col rounded-2xl border border-neutral-200/90 bg-white p-4 shadow-[0_8px_30px_rgba(31,42,124,0.05)]",
        className,
      )}
    >
      <header className="mb-4">
        <h3 className="text-sm font-semibold text-neutral-900">{title}</h3>
        {subtitle ? <p className="mt-0.5 text-xs text-neutral-500">{subtitle}</p> : null}
      </header>
      <div className="flex min-h-[140px] flex-1 items-end gap-2 sm:gap-3">
        {data.map((point, i) => {
          const h = Math.round((point.value / max) * 100);
          return (
            <div key={point.label} className="flex min-w-0 flex-1 flex-col items-center gap-2">
              <span className="text-[10px] font-semibold tabular-nums text-neutral-600">{point.value}</span>
              <div className="flex w-full flex-1 items-end justify-center">
                <div
                  className="w-full max-w-[2.5rem] rounded-t-lg transition-all duration-500"
                  style={{
                    height: `${Math.max(h, point.value > 0 ? 8 : 4)}%`,
                    backgroundColor: CHART_COLORS[i % CHART_COLORS.length],
                    minHeight: point.value > 0 ? "0.75rem" : "0.25rem",
                  }}
                  title={`${point.label} : ${point.value}`}
                />
              </div>
              <span className="w-full truncate text-center text-[10px] font-medium text-neutral-500">
                {point.label}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function AdminDonutChart({
  title,
  subtitle,
  data,
  className,
}: {
  title: string;
  subtitle?: string;
  data: ChartPoint[];
  className?: string;
}) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  const segments = data.map((point, i) => {
    const fraction = point.value / total;
    const dash = fraction * circumference;
    const segment = {
      ...point,
      color: CHART_COLORS[i % CHART_COLORS.length],
      dash,
      offset: -offset,
    };
    offset += dash;
    return segment;
  });

  return (
    <section
      className={cn(
        "flex h-full flex-col rounded-2xl border border-neutral-200/90 bg-white p-4 shadow-[0_8px_30px_rgba(31,42,124,0.05)]",
        className,
      )}
    >
      <header className="mb-3">
        <h3 className="text-sm font-semibold text-neutral-900">{title}</h3>
        {subtitle ? <p className="mt-0.5 text-xs text-neutral-500">{subtitle}</p> : null}
      </header>
      <div className="flex flex-1 flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-center sm:gap-6">
        <div className="relative size-28 shrink-0">
          <svg viewBox="0 0 100 100" className="size-full -rotate-90" aria-hidden>
            <circle cx="50" cy="50" r={radius} fill="none" stroke="#eef0f7" strokeWidth="14" />
            {segments.map((seg) =>
              seg.value > 0 ? (
                <circle
                  key={seg.label}
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth="14"
                  strokeDasharray={`${seg.dash} ${circumference - seg.dash}`}
                  strokeDashoffset={seg.offset}
                  strokeLinecap="round"
                />
              ) : null,
            )}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-semibold tabular-nums text-neutral-900">{total}</span>
            <span className="text-[9px] uppercase tracking-wide text-neutral-500">total</span>
          </div>
        </div>
        <ul className="w-full min-w-0 space-y-2 sm:max-w-[11rem]">
          {segments.map((seg) => (
            <li key={seg.label} className="flex items-center justify-between gap-2 text-xs">
              <span className="flex min-w-0 items-center gap-2">
                <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: seg.color }} />
                <span className="truncate text-neutral-600">{seg.label}</span>
              </span>
              <span className="shrink-0 font-semibold tabular-nums text-neutral-900">{seg.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
