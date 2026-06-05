"use client";

import * as React from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  CARTO_GL_STYLE_URL,
  CONTACT_MAP_ZOOM,
  contactMapPinSvg,
  getContactMapCenter,
} from "@/lib/contact/map-config";
import { CABINET_CONTACT, formatAddressLine } from "@/lib/content/site";
import { cn } from "@/lib/utils";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function createPopupHtml() {
  const { name, phone, phoneTel, email, openingHours } = CABINET_CONTACT;
  const mapsQuery = encodeURIComponent(`${CABINET_CONTACT.address.street} ${CABINET_CONTACT.address.postalCode} ${CABINET_CONTACT.address.city}`);
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

    const { lat, lng } = getContactMapCenter();

    const map = new maplibregl.Map({
      container: el,
      style: CARTO_GL_STYLE_URL,
      center: [lng, lat],
      zoom: CONTACT_MAP_ZOOM,
      scrollZoom: false,
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

    const pin = document.createElement("button");
    pin.type = "button";
    pin.className = "contact-map-pin";
    pin.innerHTML = contactMapPinSvg();
    pin.setAttribute("aria-label", "Afficher les coordonnées du cabinet");

    const popup = new maplibregl.Popup({
      offset: 44,
      closeButton: true,
      maxWidth: "280px",
      className: "contact-map-popup-shell",
    }).setHTML(createPopupHtml());

    const marker = new maplibregl.Marker({ element: pin, anchor: "bottom" })
      .setLngLat([lng, lat])
      .setPopup(popup)
      .addTo(map);

    const ro = new ResizeObserver(() => map.resize());
    ro.observe(el);

    return () => {
      ro.disconnect();
      marker.remove();
      map.remove();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("contact-carto-map absolute inset-0 z-0 h-full w-full bg-white", className)}
      aria-label="Carte CARTO : localisation du cabinet Lefèvre Conseil"
    />
  );
}

export default ContactMap;
