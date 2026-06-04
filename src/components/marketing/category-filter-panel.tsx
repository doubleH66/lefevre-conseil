"use client";

import { cn } from "@/lib/utils";

export type CategoryFilterOption<T extends string> = {
  value: T;
  label: string;
};

type CategoryFilterPanelProps<T extends string> = {
  options: readonly CategoryFilterOption<T>[];
  value: T;
  onChange: (value: T) => void;
  onReset: () => void;
  onApply: () => void;
  label?: string;
};

export function CategoryFilterPanel<T extends string>({
  options,
  value,
  onChange,
  onReset,
  onApply,
  label = "Catégorie",
}: CategoryFilterPanelProps<T>) {
  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-[#1f2a7c]/80">{label}</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={cn(
                "min-h-[2.75rem] rounded-xl border px-3 py-2.5 text-left text-sm font-medium leading-snug transition-colors duration-150",
                selected
                  ? "border-[#1f2a7c] bg-[#1f2a7c]/[0.06] text-[#1f2a7c]"
                  : "border-neutral-200 bg-[#fafbfd] text-[#1f2a7c]/70 hover:border-neutral-300 hover:bg-white",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      <div className="flex gap-2 border-t border-neutral-200 pt-4">
        <button
          type="button"
          onClick={onReset}
          className="flex-1 rounded-xl border border-neutral-200 py-2.5 text-sm font-medium text-[#1f2a7c]/75 transition hover:bg-neutral-50"
        >
          Réinitialiser
        </button>
        <button
          type="button"
          onClick={onApply}
          className="flex-1 rounded-xl bg-[#1f2a7c] py-2.5 text-sm font-semibold text-white transition hover:bg-[#182266]"
        >
          Voir les résultats
        </button>
      </div>
    </div>
  );
}
