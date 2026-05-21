import { ImageResponse } from "next/og";
import { SITE_LOGO_URL } from "@/lib/content/site";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={SITE_LOGO_URL} alt="" height={72} style={{ objectFit: "contain" }} />
      </div>
    ),
    { ...size },
  );
}
