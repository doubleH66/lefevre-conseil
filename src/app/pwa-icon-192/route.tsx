import { ImageResponse } from "next/og";
import { SITE_LOGO_URL } from "@/lib/content/site";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 192,
          height: 192,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1f2a7c",
          borderRadius: 40,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={SITE_LOGO_URL} alt="" height={88} style={{ objectFit: "contain" }} />
      </div>
    ),
    { width: 192, height: 192 },
  );
}
