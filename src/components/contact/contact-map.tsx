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

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

const BRAND = "#1f2a7c";

const TILE_URL = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>';

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
    className: "contact-map-pin-icon",
    iconSize: [36, 44],
    iconAnchor: [18, 44],
    popupAnchor: [0, -44],
  });
}

function createPopupHtml() {
  const { name, phone, phoneTel, email, address, openingHours } = CABINET_CONTACT;
  const mapsQuery = encodeURIComponent(`${address.street} ${address.postalCode} ${address.city}`);
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${mapsQuery}`;

  return `
    <div class="contact-map-popup">
      <p class="contact-map-popup__name">${escapeHtml(name)}</p>
      <p class="contact-map-popup__address">${escapeHtml(formatAddressLine())}</p>
      <p class="contact-map-popup__hours">${escapeHtml(openingHours.label)}</p>
      <div class="contact-map-popup__links">
        <a href="tel:${phoneTel}">${escapeHtml(phone)}</a>
        <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>
      </div>
      <a class="contact-map-popup__cta" href="${directionsUrl}" target="_blank" rel="noopener noreferrer">Itinéraire Google Maps</a>
    </div>
  `.trim();
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

    const map = L.map(el, {
      scrollWheelZoom: false,
      zoomControl: true,
      attributionControl: true,
    }).setView([lat, lng], 17);

    L.tileLayer(TILE_URL, {
      maxZoom: 19,
      attribution: TILE_ATTRIBUTION,
    }).addTo(map);

    L.marker([lat, lng], { icon: createCustomIcon(), interactive: true })
      .addTo(map)
      .bindPopup(createPopupHtml(), {
        maxWidth: 280,
        minWidth: 220,
        className: "contact-map-popup-shell",
        closeButton: true,
        autoPan: true,
        autoPanPadding: [24, 24],
      });

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
      className={cn("contact-leaflet-map absolute inset-0 z-0 h-full w-full bg-white", className)}
      aria-label="Carte : localisation du cabinet Lefèvre Conseil"
    />
  );
}

export default ContactMap;
