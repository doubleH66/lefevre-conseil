import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export const filterLabelClass = "mb-2 block text-xs font-medium text-white/55";

export const filterSelectClass = cn(
  "h-11 w-full appearance-none rounded-xl border border-white/10 bg-white/[0.06] px-3 pr-9 text-sm text-white",
  "outline-none transition focus:border-white/25 focus:ring-2 focus:ring-white/10",
  "bg-[length:16px] bg-[right_0.75rem_center] bg-no-repeat",
  '[background-image:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'rgba(255,255,255,0.55)\' stroke-width=\'2\'%3E%3Cpath d=\'m6 9 6 6 6-6\'/%3E%3C/svg%3E")]',
);

export const filterOptionClass = "bg-[#121216] text-white";

export function FilterPanelField({
  label,
  icon: Icon,
  htmlFor,
  children,
}: {
  label: string;
  icon?: LucideIcon;
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className={cn(filterLabelClass, "inline-flex items-center gap-1.5")}>
        {Icon ? <Icon className="size-3.5 text-white/55" aria-hidden /> : null}
        {label}
      </label>
      {children}
    </div>
  );
}

export function FilterPanelActions({
  onReset,
  onApply,
  applyLabel = "Voir les résultats",
}: {
  onReset: () => void;
  onApply: () => void;
  applyLabel?: string;
}) {
  return (
    <div className="flex gap-2 border-t border-white/10 pt-4">
      <button
        type="button"
        onClick={onReset}
        className="flex-1 rounded-xl border border-white/15 py-2.5 text-sm font-medium text-white transition hover:border-white/25 hover:bg-white/[0.06]"
      >
        Réinitialiser
      </button>
      <button
        type="button"
        onClick={onApply}
        className="flex-1 rounded-xl border border-white/20 bg-white/10 py-2.5 text-sm font-semibold text-white transition hover:bg-white/15"
      >
        {applyLabel}
      </button>
    </div>
  );
}
