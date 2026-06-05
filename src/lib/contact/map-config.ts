import { CABINET_CONTACT } from "@/lib/content/site";

export const CONTACT_MAP_BRAND = "#1f2a7c";

/** Style vectoriel CARTO Positron (équivalent light). */
export const CARTO_GL_STYLE_URL = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

function parseEnvCoord(value: string | undefined, fallback: number) {
  const n = value ? Number.parseFloat(value) : Number.NaN;
  return Number.isFinite(n) ? n : fallback;
}

export function getContactMapCenter(): { lat: number; lng: number } {
  return {
    lat: parseEnvCoord(process.env.NEXT_PUBLIC_CONTACT_MAP_LAT, CABINET_CONTACT.geo.lat),
    lng: parseEnvCoord(process.env.NEXT_PUBLIC_CONTACT_MAP_LNG, CABINET_CONTACT.geo.lng),
  };
}

export const CONTACT_MAP_ZOOM = 17;

export function contactMapPinSvg(fill = CONTACT_MAP_BRAND) {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="44" viewBox="0 0 36 44">
      <defs>
        <filter id="shadow" x="-30%" y="-10%" width="160%" height="150%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-color="rgba(0,0,0,0.28)" />
        </filter>
      </defs>
      <g filter="url(#shadow)">
        <path
          d="M18 2C10.268 2 4 8.268 4 16c0 9.375 12.265 23.64 13.28 24.8a.97.97 0 0 0 1.44 0C19.735 39.64 32 25.375 32 16 32 8.268 25.732 2 18 2z"
          fill="${fill}"
        />
        <circle cx="18" cy="16" r="6" fill="white" opacity="0.92" />
      </g>
    </svg>`.trim();
}
