import type { MetadataRoute } from "next";
import { systems } from "@/content/systems";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${siteUrl}/`, changeFrequency: "monthly", priority: 1 },
    ...systems.map((system) => ({
      url: `${siteUrl}/systems/${system.slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.8,
    })),
  ];
}
