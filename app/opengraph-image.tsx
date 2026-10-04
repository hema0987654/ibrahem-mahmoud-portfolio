import { profile } from "@/content/profile";
import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = `${profile.name} — ${profile.role}`;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({
    eyebrow: `${profile.name} — ${profile.role}`,
    title: profile.hero.headline.join(" "),
    footerLeft: profile.hero.request.path,
    footerRight: "NestJS · TypeScript · PostgreSQL",
  });
}
