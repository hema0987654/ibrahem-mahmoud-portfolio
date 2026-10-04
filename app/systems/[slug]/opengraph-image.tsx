import { caseStudies } from "@/content/case-studies";
import { getSystem } from "@/content/systems";
import { profile } from "@/content/profile";
import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "Case study";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const system = getSystem(slug);
  const first = system?.endpoints.find((endpoint) => endpoint.method === "POST");
  return renderOg({
    eyebrow: `Case study ${system?.index ?? ""} — ${profile.name}`,
    title: system?.name ?? "Case study",
    footerLeft: first?.path ?? "/",
    footerRight: system?.stack.slice(0, 3).join(" · ") ?? "",
  });
}
