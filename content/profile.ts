/**
 * Single source of truth for identity, contact and hero copy.
 * Every claim here is backed by the CV or by public code on GitHub.
 */
export const profile = {
  name: "Ibrahem Mahmoud",
  initials: "IM",
  role: "Backend Developer",
  location: "Qena, Egypt",
  email: "ibrihem22815809@gmail.com",
  availability: "Open to backend roles · Remote",
  links: {
    github: "https://github.com/hema0987654",
    linkedin: "https://www.linkedin.com/in/ibrihem-mahmoud-28a21b284/",
  },
  hero: {
    headline: ["I build the part", "you don’t see."],
    subheadline:
      "Backend developer working with NestJS, TypeScript and PostgreSQL. I build the systems behind inventory, commerce and learning products.",
    /** A real route from StockGuard: src/invoice/invoice.controller.ts */
    request: { method: "POST", path: "/invoice" },
    primaryCta: "Follow a request",
  },
  about: {
    // Every sentence below maps to the CV or to a public repository.
    paragraphs: [
      "I’m a backend developer from Qena, Egypt, specializing in Node.js, Express, NestJS and PostgreSQL. I took my first Node.js training in 2024 and have been building projects since: a product management app, a course platform API, an inventory and invoicing system, a marketplace API and an e-commerce API.",
      "I graduated from South Valley University in May 2026. I’m looking for a full-time backend role in a professional environment where I can deepen my backend expertise, strengthen security and learn DevOps, with a focus on problem-solving and teamwork.",
    ],
    facts: [
      {
        label: "Education",
        value: "B.Ed. in Technology and Information",
        detail: "South Valley University, Qena · 2022 – 2026",
      },
      {
        label: "Training",
        value: "Node.js, Nest.js, PostgreSQL and Security",
        detail: "Muhammad Naga (Codeawy) · 2025",
      },
      {
        label: "Training",
        value: "Creative Node.js Intensive",
        detail: "20-day program · 2024",
      },
      {
        label: "Languages",
        value: "Arabic, English",
        detail: "Native · Intermediate",
      },
    ],
    photo: {
      caption: "FIG. 01 — Ibrahem Mahmoud · Qena, Egypt",
      alt: "Portrait of Ibrahem Mahmoud in a black suit, standing in front of a brick wall.",
    },
  },
  contact: {
    heading: "Have a backend role? Let’s talk.",
    note: "Email is the fastest way to reach me.",
  },
} as const;

export type Profile = typeof profile;
