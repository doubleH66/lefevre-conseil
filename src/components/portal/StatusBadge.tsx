import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: string }) {
  const classes =
    status === "Terminé" || status === "Validé" || status === "Traitée" || status === "Actif"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : status === "En cours" || status === "Envoyé" || status === "En validation"
        ? "bg-blue-50 text-blue-700 border-blue-200"
        : status === "Urgent" || status === "Refusé" || status === "À relancer" || status === "À corriger"
          ? "bg-rose-50 text-rose-700 border-rose-200"
          : "bg-amber-50 text-amber-700 border-amber-200";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-wide",
        classes
      )}
    >
      {status}
    </span>
  );
}

