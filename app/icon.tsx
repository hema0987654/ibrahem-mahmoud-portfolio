import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** Monogram favicon in the site's paper and ink. The portrait is never used here. */
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
          background: "#101110",
          color: "#f2efe8",
          fontSize: 30,
          fontWeight: 700,
          letterSpacing: -1,
        }}
      >
        IM
      </div>
    ),
    size,
  );
}
