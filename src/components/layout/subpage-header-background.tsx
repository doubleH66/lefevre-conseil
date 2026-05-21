import Image from "next/image";

const INNER_PAGE_HEADER_IMAGE =
  "https://cdn.helloklik.com/uploads/1778742468697-Capture_d_e_cran_2026-05-14_a__09.06.37.png";

/** Visuel d’en-tête des pages intérieures (bandeau photo arrondi). */
export function SubpageHeaderBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden rounded-3xl lg:rounded-[3rem]">
      <Image
        src={INNER_PAGE_HEADER_IMAGE}
        alt=""
        fill
        className="object-cover object-center"
        sizes="(min-width: 1024px) 90vw, 100vw"
        priority
      />
      <div className="absolute inset-0 bg-black/35" aria-hidden />
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/30"
        aria-hidden
      />
    </div>
  );
}
