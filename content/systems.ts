/**
 * Featured systems. Rendered from Phase 3 onward (Systems section, case studies).
 * Facts are limited to what the public repositories show.
 * `live` stays null until a deployment has been verified as working.
 */
export type System = {
  slug: string;
  index: string;
  name: string;
  date: string;
  tagline: string;
  problem: string;
  solution: string;
  modules: readonly string[];
  stack: readonly string[];
  facts: readonly string[];
  repo: string;
  live: string | null;
};

export const systems: readonly System[] = [
  {
    slug: "stockguard",
    index: "01",
    name: "StockGuard",
    date: "Aug 2025",
    tagline: "Inventory and invoicing that keeps itself honest.",
    problem:
      "Tracking stock, suppliers and invoices by hand means quantities drift and shortages are noticed too late.",
    solution:
      "Purchase and sale invoices move stock directly, reports are computed from invoice lines, and a scheduled job emails an alert when a product runs low.",
    modules: ["auth", "products", "supplier", "invoice", "invoice-item", "reports", "alerts"],
    stack: ["NestJS", "TypeScript", "PostgreSQL", "TypeORM", "@nestjs/schedule", "PDFKit", "Swagger"],
    facts: ["7 feature modules", "Role-based access", "PDF reports", "Scheduled low-stock alerts"],
    repo: "https://github.com/hema0987654/stockguard",
    // Checked 2026-10-04: deployment did not respond correctly, so it is not shown.
    live: null,
  },
  {
    slug: "talent-showcase",
    index: "02",
    name: "Talent Showcase",
    date: "Nov 2025",
    tagline: "A marketplace backend across two databases.",
    problem:
      "Artists need to publish work, buyers need to order it, and both sides need to know when an order changes.",
    solution:
      "A modular NestJS API with relational data in PostgreSQL, document data in MongoDB, Redis, OTP verification and media stored on Cloudinary.",
    modules: [
      "auth",
      "users",
      "works",
      "orders",
      "media",
      "upload",
      "comments",
      "categories",
      "tags",
      "notifications",
      "otp",
      "email",
      "redis",
    ],
    stack: ["NestJS", "TypeScript", "PostgreSQL", "MongoDB", "Redis", "Cloudinary", "Passport JWT"],
    facts: ["13 modules", "2 databases", "Order notifications for both parties"],
    repo: "https://github.com/hema0987654/talent-showcase",
    live: null,
  },
  {
    slug: "shopsphere",
    index: "03",
    name: "ShopSphere",
    date: "Feb 2026",
    tagline: "An e-commerce API on hand-written SQL.",
    problem:
      "A store needs products, carts, orders, payments and reviews, with an admin side to manage them.",
    solution:
      "A layered Express and TypeScript API that talks to PostgreSQL through the pg driver, documented with Swagger and packaged with Docker.",
    modules: ["users", "admin", "products", "categories", "cart", "orders", "payments", "reviews"],
    stack: ["Express 5", "TypeScript", "PostgreSQL (pg)", "JWT", "Swagger", "Docker"],
    facts: ["No ORM", "Dockerfile included", "Swagger documentation"],
    repo: "https://github.com/hema0987654/shopsphere",
    live: null,
  },
];
