/**
 * Engineering changelog. Each entry lists only what was new at that point,
 * verified against the repositories and the CV. No titles, no invented metrics.
 */
export type EvolutionEntry = {
  date: string;
  /** ISO-ish value for <time dateTime> */
  dateTime: string;
  title: string;
  summary: string;
  added: readonly string[];
  repo?: string;
  kind: "training" | "project" | "milestone" | "now";
};

const gh = (name: string) => `https://github.com/hema0987654/${name}`;

export const evolution: readonly EvolutionEntry[] = [
  {
    date: "2024",
    dateTime: "2024",
    title: "First Node.js training",
    summary: "A 20-day intensive program. The starting point.",
    added: ["Node.js", "JavaScript"],
    kind: "training",
  },
  {
    date: "Jun 2025",
    dateTime: "2025-06",
    title: "nodejs-mvc-products",
    summary:
      "First project with a deliberate structure: MVC with separate services and server-rendered views.",
    added: ["Express", "MVC", "Pug"],
    repo: gh("nodejs-mvc-products"),
    kind: "project",
  },
  {
    date: "Jul 2025",
    dateTime: "2025-07",
    title: "Edu-Hub",
    summary:
      "Course and video platform API. First typed codebase, first relational database, first role-based auth.",
    added: ["TypeScript", "PostgreSQL", "JWT auth", "File uploads"],
    repo: gh("Edu-Hub"),
    kind: "project",
  },
  {
    date: "Aug 2025",
    dateTime: "2025-08",
    title: "StockGuard",
    summary:
      "Inventory and invoicing system: stock that moves with invoices, profit reports, low-stock alerts.",
    added: ["NestJS", "TypeORM", "Scheduled jobs", "PDF reports", "Swagger"],
    repo: gh("stockguard"),
    kind: "project",
  },
  {
    date: "Nov 2025",
    dateTime: "2025-11",
    title: "talent-showcase",
    summary:
      "Marketplace for creative work with orders and notifications. Thirteen modules across two databases.",
    added: ["MongoDB", "Redis", "Cloudinary", "Passport"],
    repo: gh("talent-showcase"),
    kind: "project",
  },
  {
    date: "Feb 2026",
    dateTime: "2026-02",
    title: "ShopSphere",
    summary:
      "E-commerce API written without an ORM: carts, orders, payments and reviews on hand-written SQL.",
    added: ["Raw SQL (pg)", "Docker"],
    repo: gh("shopsphere"),
    kind: "project",
  },
  {
    date: "May 2026",
    dateTime: "2026-05",
    title: "Graduated",
    summary: "B.Ed. in Technology and Information, South Valley University, Qena.",
    added: [],
    kind: "milestone",
  },
  {
    date: "Now",
    dateTime: "2026",
    title: "Now",
    summary:
      "Building and refining production-oriented backend systems with NestJS, TypeScript and PostgreSQL.",
    added: [],
    kind: "now",
  },
];
