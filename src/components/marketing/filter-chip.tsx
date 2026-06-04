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
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#1f2a7c]/15 bg-[#1f2a7c]/[0.05] py-1 pl-2.5 pr-1.5 text-xs font-medium text-[#1f2a7c]">
      <Icon className="size-3.5 opacity-60" aria-hidden />
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="grid size-5 place-items-center rounded-full text-[#1f2a7c]/55 transition hover:bg-[#1f2a7c]/10 hover:text-[#1f2a7c]"
        aria-label={`Retirer le filtre ${label}`}
      >
        <X className="size-3" aria-hidden />
      </button>
    </span>
  );
}
