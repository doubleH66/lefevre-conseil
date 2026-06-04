"use client";

import type { LucideIcon } from "lucide-react";
import { X } from "lucide-react";

export function FilterChip({
  label,
  icon: Icon,
  onRemove,
}: {
  label: string;
  icon: LucideIcon;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[11px] text-zinc-700">
      <Icon className="size-3 shrink-0 opacity-70" aria-hidden />
      <span className="truncate">{label}</span>
      <button
        type="button"
        onClick={onRemove}
        className="ml-0.5 shrink-0 rounded-full p-0.5 hover:bg-zinc-200/80"
        aria-label={`Retirer le filtre ${label}`}
      >
        <X className="size-3" aria-hidden />
      </button>
    </span>
  );
}
