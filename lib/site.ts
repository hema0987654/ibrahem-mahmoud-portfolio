import { profile } from "@/content/profile";

/** Public URL of the site. Set NEXT_PUBLIC_SITE_URL once the Vercel URL exists. */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export const siteTitle = `${profile.name} — ${profile.role}`;

export const siteDescription =
  "Backend developer working with NestJS, TypeScript and PostgreSQL. Inventory, commerce and learning systems, with the code to back them up.";

export const navItems = [
  { href: "/#trace", label: "Trace" },
  { href: "/#systems", label: "Systems" },
  { href: "/#evolution", label: "Evolution" },
  { href: "/#stack", label: "Stack" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
] as const;
