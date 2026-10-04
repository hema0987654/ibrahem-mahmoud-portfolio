import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const PAPER = "#f2efe8";
const TEXT = "#141412";
const MUTED = "#5f5e58";
const SIGNAL = "#1f3bff";

type Props = {
  eyebrow: string;
  title: string;
  footerLeft: string;
  footerRight: string;
};

/** Social card in the site's paper identity. Text only: the portrait is never used here. */
export async function renderOg({ eyebrow, title, footerLeft, footerRight }: Props) {
  const fonts = join(process.cwd(), "app", "fonts");
  const [display, mono] = await Promise.all([
    readFile(join(fonts, "Bricolage-600.woff")),
    readFile(join(fonts, "JetBrainsMono-400.woff")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: PAPER,
          backgroundImage: "radial-gradient(rgba(20,20,18,0.16) 1.5px, transparent 1.5px)",
          backgroundSize: "32px 32px",
          color: TEXT,
          padding: "64px 72px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", fontFamily: "Mono", fontSize: 22, letterSpacing: 2, color: MUTED }}>
          <div style={{ display: "flex", width: 4, height: 28, background: SIGNAL, marginRight: 20 }} />
          {eyebrow.toUpperCase()}
        </div>

        <div
          style={{
            display: "flex",
            fontFamily: "Display",
            fontSize: title.length > 22 ? 104 : 132,
            lineHeight: 0.96,
            letterSpacing: -5,
            maxWidth: 1000,
          }}
        >
          {title}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "2px solid rgba(20,20,18,0.25)",
            paddingTop: 26,
            fontFamily: "Mono",
            fontSize: 24,
          }}
        >
          <div style={{ display: "flex" }}>
            <span style={{ color: SIGNAL, marginRight: 14 }}>POST</span>
            {footerLeft}
          </div>
          <div style={{ display: "flex", color: MUTED }}>{footerRight}</div>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Display", data: display, weight: 600, style: "normal" },
        { name: "Mono", data: mono, weight: 400, style: "normal" },
      ],
    },
  );
}
