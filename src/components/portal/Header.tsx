"use client";

/** Bouton menu mobile uniquement (pas de titre / sous-titre redondants). */
export function Header({ onOpenMobileMenu }: { onOpenMobileMenu: () => void }) {
  return (
    <div className="mb-3 flex justify-end lg:hidden">
      <button
        type="button"
        onClick={onOpenMobileMenu}
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 bg-white shadow-sm"
        aria-label="Ouvrir le menu"
      >
        ☰
      </button>
    </div>
  );
}
