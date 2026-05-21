"use client";

import * as React from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { CABINET_CONTACT, formatAddressLine } from "@/lib/content/site";
import { cn } from "@/lib/utils";

function parseEnvCoord(value: string | undefined, fallback: number) {
  const n = value ? Number.parseFloat(value) : Number.NaN;
  return Number.isFinite(n) ? n : fallback;
}

const BRAND = "#1f2a7c";

function createCustomIcon() {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="44" viewBox="0 0 36 44">
      <defs>
        <filter id="shadow" x="-30%" y="-10%" width="160%" height="150%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-color="rgba(0,0,0,0.28)" />
        </filter>
      </defs>
      <g filter="url(#shadow)">
        <path
          d="M18 2C10.268 2 4 8.268 4 16c0 9.375 12.265 23.64 13.28 24.8a.97.97 0 0 0 1.44 0C19.735 39.64 32 25.375 32 16 32 8.268 25.732 2 18 2z"
          fill="${BRAND}"
        />
        <circle cx="18" cy="16" r="6" fill="white" opacity="0.92" />
      </g>
    </svg>`.trim();

  return L.divIcon({
    html: svg,
    className: "",
    iconSize: [36, 44],
    iconAnchor: [18, 44],
    popupAnchor: [0, -46],
  });
}

type ContactMapProps = {
  className?: string;
};

export function ContactMap({ className }: ContactMapProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const lat = parseEnvCoord(process.env.NEXT_PUBLIC_CONTACT_MAP_LAT, CABINET_CONTACT.geo.lat);
    const lng = parseEnvCoord(process.env.NEXT_PUBLIC_CONTACT_MAP_LNG, CABINET_CONTACT.geo.lng);

    const map = L.map(el, { scrollWheelZoom: false }).setView([lat, lng], 16);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    L.marker([lat, lng], { icon: createCustomIcon() })
      .addTo(map)
      .bindPopup(
        `<strong style="color:${BRAND}">${CABINET_CONTACT.name}</strong><br />${formatAddressLine()}<br /><a href="tel:${CABINET_CONTACT.phoneTel}" style="color:${BRAND}">${CABINET_CONTACT.phone}</a>`,
        { maxWidth: 220 },
      )
      .openPopup();

    const ro = new ResizeObserver(() => map.invalidateSize());
    ro.observe(el);

    return () => {
      ro.disconnect();
      map.remove();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("absolute inset-0 z-0 h-full w-full", className)}
      aria-label="Carte : localisation du cabinet Lefèvre Conseil"
    />
  );
}

export default ContactMap;
