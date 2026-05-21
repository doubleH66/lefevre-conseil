import { ImageResponse } from "next/og";
import { SITE_LOGO_URL, CABINET_CONTACT } from "@/lib/content/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Lefèvre Conseil — Cabinet de gestion de patrimoine à Perpignan";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f1847 0%, #1f2a7c 60%, #2f3e9e 100%)",
          padding: "64px",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={SITE_LOGO_URL}
          alt=""
          height={72}
          style={{ objectFit: "contain", marginBottom: 40 }}
        />
        <div
          style={{
            fontSize: 56,
            fontWeight: 600,
            color: "white",
            textAlign: "center",
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            maxWidth: 900,
          }}
        >
          Lefèvre Conseil
        </div>
        <div
          style={{
            fontSize: 26,
            color: "rgba(255,255,255,0.75)",
            textAlign: "center",
            marginTop: 20,
            maxWidth: 780,
            lineHeight: 1.4,
          }}
        >
          Cabinet indépendant de gestion de patrimoine — Perpignan
        </div>
        <div
          style={{
            marginTop: 40,
            display: "flex",
            gap: 12,
            alignItems: "center",
          }}
        >
          <span
            style={{
              background: "rgba(255,255,255,0.12)",
              borderRadius: 100,
              padding: "8px 20px",
              fontSize: 18,
              color: "rgba(255,255,255,0.9)",
            }}
          >
            ★ 5/5 Google
          </span>
          <span
            style={{
              background: "rgba(255,255,255,0.12)",
              borderRadius: 100,
              padding: "8px 20px",
              fontSize: 18,
              color: "rgba(255,255,255,0.9)",
            }}
          >
            {CABINET_CONTACT.phone}
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
