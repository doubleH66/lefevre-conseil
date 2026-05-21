import { ImageResponse } from "next/og";
import { SITE_LOGO_URL } from "@/lib/content/site";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1f2a7c",
          borderRadius: 8,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={SITE_LOGO_URL} alt="" height={14} style={{ objectFit: "contain" }} />
      </div>
    ),
    { ...size },
  );
}
