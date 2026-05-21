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

type ContactMapProps = {
  className?: string;
};

export function ContactMap({ className }: ContactMapProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const lat = parseEnvCoord(
      process.env.NEXT_PUBLIC_CONTACT_MAP_LAT,
      CABINET_CONTACT.geo.lat,
    );
    const lng = parseEnvCoord(
      process.env.NEXT_PUBLIC_CONTACT_MAP_LNG,
      CABINET_CONTACT.geo.lng,
    );

    delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
      iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    });

    const map = L.map(el, { scrollWheelZoom: false }).setView([lat, lng], 16);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    L.marker([lat, lng])
      .addTo(map)
      .bindPopup(
        `<strong>${CABINET_CONTACT.name}</strong><br />${formatAddressLine()}<br /><a href="tel:${CABINET_CONTACT.phoneTel}">${CABINET_CONTACT.phone}</a>`,
      )
      .openPopup();

    const ro = new ResizeObserver(() => {
      map.invalidateSize();
    });
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
      aria-label="Carte : localisation du cabinet"
    />
  );
}

export default ContactMap;
