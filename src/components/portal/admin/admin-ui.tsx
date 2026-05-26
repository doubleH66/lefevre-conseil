"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export const adminFieldClass =
  "h-9 w-full rounded-lg border border-neutral-200 bg-white px-2.5 text-sm outline-none focus:border-[#1f2a7c]/40 focus:ring-2 focus:ring-[#1f2a7c]/12";

export const adminSelectClass =
  "h-9 rounded-lg border border-neutral-200 bg-white px-2.5 text-sm outline-none focus:border-[#1f2a7c]/40";

export function AdminPageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 pb-3">
      <div className="min-w-0">
        <h1 className="text-lg font-semibold tracking-tight text-neutral-900">{title}</h1>
        {description ? <p className="mt-0.5 text-xs text-neutral-500">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}

export function AdminStatStrip({ items }: { items: { label: string; value: number | string }[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <div
          key={item.label}
          className="inline-flex items-center gap-2 rounded-lg border border-neutral-200/90 bg-neutral-50/80 px-2.5 py-1.5"
        >
          <span className="text-[10px] font-semibold uppercase tracking-wide text-neutral-500">{item.label}</span>
          <span className="text-sm font-semibold tabular-nums text-neutral-900">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

export function AdminPanel({ title, children, className }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <section className={cn("overflow-hidden rounded-xl border border-neutral-200 bg-white", className)}>
      {title ? (
        <div className="border-b border-neutral-100 bg-neutral-50/60 px-3 py-2">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-600">{title}</h2>
        </div>
      ) : null}
      <div className="p-0">{children}</div>
    </section>
  );
}

type AdminBtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
};

export function AdminBtn({ variant = "secondary", size = "sm", className, ...props }: AdminBtnProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-lg font-semibold transition-colors disabled:opacity-50",
        size === "sm" ? "px-2.5 py-1.5 text-xs" : "px-3.5 py-2 text-sm",
        variant === "primary" && "bg-[#1f2a7c] text-white hover:bg-[#182266]",
        variant === "secondary" && "border border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50",
        variant === "ghost" && "text-[#1f2a7c] hover:bg-[#1f2a7c]/5",
        className,
      )}
      {...props}
    />
  );
}

export function AdminToolbar({ children }: { children: ReactNode }) {
  return <div className="mb-3 flex flex-wrap items-center gap-2">{children}</div>;
}

export function AdminSearchInput({
  value,
  onChange,
  placeholder = "Rechercher…",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cn(adminFieldClass, "min-w-[12rem] flex-1 sm:max-w-xs")}
    />
  );
}

export type AdminColumn<T> = {
  key: string;
  header: string;
  className?: string;
  cell: (row: T) => ReactNode;
};

export function AdminDataTable<T>({
  columns,
  data,
  getRowKey,
  onRowClick,
  emptyMessage = "Aucun élément.",
}: {
  columns: AdminColumn<T>[];
  data: T[];
  getRowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
}) {
  if (data.length === 0) {
    return <p className="px-3 py-8 text-center text-sm text-neutral-500">{emptyMessage}</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-left">
        <thead>
          <tr className="border-b border-neutral-200 bg-neutral-50/80">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-neutral-500",
                  col.className,
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={getRowKey(row)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={cn(
                "border-b border-neutral-100 text-sm last:border-b-0",
                onRowClick && "cursor-pointer hover:bg-[#1f2a7c]/[0.04]",
              )}
            >
              {columns.map((col) => (
                <td key={col.key} className={cn("px-3 py-2 text-neutral-700", col.className)}>
                  {col.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function AdminModal({
  open,
  onClose,
  title,
  subtitle,
  children,
  size = "md",
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  footer?: ReactNode;
}) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const maxW = size === "lg" ? "max-w-2xl" : size === "sm" ? "max-w-md" : "max-w-lg";

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-4">
      <button type="button" className="absolute inset-0 bg-black/45" onClick={onClose} aria-label="Fermer" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-modal-title"
        className={cn(
          "relative z-10 flex max-h-[min(92dvh,720px)] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl",
          maxW,
        )}
      >
        <header className="flex shrink-0 items-start justify-between gap-3 border-b border-neutral-100 px-4 py-3">
          <div className="min-w-0 pr-2">
            <h2 id="admin-modal-title" className="text-base font-semibold text-neutral-900">
              {title}
            </h2>
            {subtitle ? <p className="mt-0.5 text-xs text-neutral-500">{subtitle}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-8 shrink-0 place-items-center rounded-lg text-neutral-500 hover:bg-neutral-100"
            aria-label="Fermer"
          >
            <X className="size-4" aria-hidden />
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">{children}</div>
        {footer ? <footer className="shrink-0 border-t border-neutral-100 px-4 py-3">{footer}</footer> : null}
      </div>
    </div>
  );
}

export function AdminDetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[7.5rem_1fr] gap-2 border-b border-neutral-50 py-2 text-sm last:border-0">
      <span className="text-xs font-medium text-neutral-500">{label}</span>
      <div className="min-w-0 text-neutral-800">{children}</div>
    </div>
  );
}
