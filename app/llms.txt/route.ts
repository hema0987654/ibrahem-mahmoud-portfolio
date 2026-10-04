import { profile } from "@/content/profile";
import { systems } from "@/content/systems";
import { stack } from "@/content/stack";
import { siteDescription, siteUrl } from "@/lib/site";

export const dynamic = "force-static";

/** Plain-text profile for AI assistants, generated from the same content as the site. */
export function GET() {
  const lines = [
    `# ${profile.name} — ${profile.role}`,
    "",
    `> ${siteDescription}`,
    "",
    `- Location: ${profile.location}`,
    `- Status: ${profile.availability}`,
    `- Email: ${profile.email}`,
    `- GitHub: ${profile.links.github}`,
    `- LinkedIn: ${profile.links.linkedin}`,
    "",
    "## About",
    "",
    ...profile.about.paragraphs,
    "",
    "## Systems",
    "",
    ...systems.flatMap((system) => [
      `- [${system.name}](${siteUrl}/systems/${system.slug}): ${system.tagline} Stack: ${system.stack.join(", ")}. Source: ${system.repo}`,
    ]),
    "",
    "## Stack",
    "",
    ...stack.map((tier) => `- ${tier.title}: ${tier.items.join(", ")}`),
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
