"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const PORTAL_MOTION = {
  panel: { duration: 0.2, ease: [0.22, 1, 0.36, 1] as const },
  drawer: { type: "spring" as const, damping: 34, stiffness: 380, mass: 0.82 },
  backdrop: { duration: 0.18 },
};

export const PORTAL_ICON_BUTTON =
  "grid size-10 shrink-0 place-items-center rounded-xl border border-neutral-200/90 bg-white text-neutral-600 transition-all duration-200 hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-900 active:scale-[0.98]";

export const PORTAL_ICON_BUTTON_ACTIVE =
  "border-[#1f2a7c]/20 bg-[#1f2a7c]/[0.06] text-[#1f2a7c] shadow-[inset_0_0_0_1px_rgba(31,42,124,0.06)]";

export function useDismissiblePanel(open: boolean, onClose: () => void) {
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) onClose();
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  return rootRef;
}

export function PortalDropdownPanel({
  open,
  children,
  className,
  placement = "bottom-end",
}: {
  open: boolean;
  children: React.ReactNode;
  className?: string;
  placement?: "bottom-end" | "top-stretch" | "right-center";
}) {
  const placementClass =
    placement === "top-stretch"
      ? "inset-x-3 bottom-[calc(100%+0.5rem)]"
      : placement === "right-center"
        ? "bottom-0 left-[calc(100%+0.5rem)]"
        : "right-0 top-[calc(100%+0.5rem)]";

  const motionOffset = placement === "top-stretch" ? -6 : 6;

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0, y: motionOffset, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: motionOffset, scale: 0.98 }}
          transition={PORTAL_MOTION.panel}
          className={cn(
            "absolute z-50 overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-xl",
            placementClass,
            className,
          )}
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function PortalMenuSection({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="py-1">
      {title ? (
        <p className="px-4 pb-1 pt-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-400">
          {title}
        </p>
      ) : null}
      <div className="px-1.5">{children}</div>
    </div>
  );
}

export function PortalMenuSeparator() {
  return <div className="mx-3 my-1 h-px bg-neutral-100" role="separator" />;
}

export function PortalMenuItem({
  icon,
  label,
  tone = "default",
  onClick,
  type = "button",
}: {
  icon: React.ReactNode;
  label: string;
  tone?: "default" | "danger";
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      role="menuitem"
      onClick={onClick}
      className={cn(
        "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium transition-colors",
        tone === "danger"
          ? "text-neutral-700 hover:bg-rose-50 hover:text-rose-700"
          : "text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900",
      )}
    >
      <span
        className={cn(
          "grid size-8 shrink-0 place-items-center rounded-lg transition-colors",
          tone === "danger"
            ? "bg-neutral-100 text-neutral-600 group-hover:bg-rose-100 group-hover:text-rose-600"
            : "bg-neutral-100 text-neutral-600",
        )}
      >
        {icon}
      </span>
      {label}
    </button>
  );
}

export function PortalMenuLink({
  href,
  icon,
  label,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <a
      href={href}
      role="menuitem"
      onClick={onClick}
      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
    >
      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-neutral-100 text-neutral-600">{icon}</span>
      {label}
    </a>
  );
}
