"use client";

import { cn } from "@/lib/utils";
import { zLayerClass } from "@/lib/z-layers";

export function ToastStack({
  toasts,
  onDismiss,
}: {
  toasts: { id: string; type: "success" | "info" | "warning"; message: string }[];
  onDismiss: (id: string) => void;
}) {
  return (
    <div className={cn("pointer-events-none fixed bottom-6 right-6 flex w-[min(24rem,90vw)] flex-col gap-2", zLayerClass.toast)}>
      {toasts.map((toast) => (
        <button
          key={toast.id}
          type="button"
          onClick={() => onDismiss(toast.id)}
          className={cn(
            "pointer-events-auto rounded-xl border px-4 py-3 text-left text-sm shadow-lg",
            toast.type === "success" && "border-emerald-200 bg-emerald-50 text-emerald-800",
            toast.type === "warning" && "border-rose-200 bg-rose-50 text-rose-800",
            toast.type === "info" && "border-blue-200 bg-blue-50 text-blue-800"
          )}
        >
          {toast.message}
        </button>
      ))}
    </div>
  );
}

