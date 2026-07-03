"use client";

import { cn } from "@/lib/utils";
import type { ChartPoint } from "@/lib/portal/dashboard-analytics";

export function AdminDashboardKpiGrid({
  items,
}: {
  items: { label: string; value: number | string }[];
}) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {items.map((item) => (
        <article
          key={item.label}
          className="rounded-xl border border-neutral-200 bg-white p-4"
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-neutral-500">
            {item.label}
          </p>
          <p className="mt-1.5 text-2xl font-semibold tabular-nums text-neutral-900">{item.value}</p>
        </article>
      ))}
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
        "flex h-full flex-col rounded-xl border border-neutral-200 bg-white p-4",
        className,
      )}
    >
      <header className="mb-4">
        <h3 className="text-sm font-semibold text-neutral-900">{title}</h3>
        {subtitle ? <p className="mt-0.5 text-xs text-neutral-500">{subtitle}</p> : null}
      </header>
      <div className="flex min-h-[150px] flex-1 items-end gap-2 sm:gap-3">
        {data.map((point) => {
          const h = Math.round((point.value / max) * 100);
          return (
            <div key={point.label} className="flex min-w-0 flex-1 flex-col items-center gap-2">
              <span className="text-[10px] font-semibold tabular-nums text-neutral-600">{point.value}</span>
              <div className="flex w-full flex-1 items-end justify-center">
                <div
                  className="w-full max-w-[2.75rem] rounded-t-md bg-[#1f2a7c]"
                  style={{
                    height: `${Math.max(h, point.value > 0 ? 8 : 3)}%`,
                    minHeight: point.value > 0 ? "0.75rem" : "0.2rem",
                    opacity: point.value > 0 ? 1 : 0.25,
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
