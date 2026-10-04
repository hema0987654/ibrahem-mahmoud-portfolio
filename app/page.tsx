import { Hero } from "@/components/sections/Hero";
import { Trace } from "@/components/trace/Trace";
import { Systems } from "@/components/sections/Systems";
import { Evolution } from "@/components/sections/Evolution";
import { Stack } from "@/components/sections/Stack";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { profile } from "@/content/profile";
import { systems } from "@/content/systems";
import { siteUrl } from "@/lib/site";
import { RequestPath } from "@/components/ui/RequestPath";

const pageJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: siteUrl,
    name: `${profile.name} — ${profile.role}`,
    mainEntity: { "@type": "Person", name: profile.name, jobTitle: profile.role, url: siteUrl },
  },
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Systems",
    itemListElement: systems.map((system, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: system.name,
      url: `${siteUrl}/systems/${system.slug}`,
    })),
  },
];

export default function HomePage() {
  return (
    <div className="home">
      <RequestPath />
      <Hero />
      <Trace />
      <Systems />
      <Evolution />
      <Stack />
      <About />
      <Contact />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }} />
    </div>
  );
}
