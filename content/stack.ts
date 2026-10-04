/**
 * Three honest tiers. "Core" appears in most repositories; "Used in projects"
 * appears in at least one shipped project; "Learning" is not claimed as a skill.
 */
export type StackTier = {
  id: string;
  title: string;
  note: string;
  items: readonly string[];
};

export const stack: readonly StackTier[] = [
  {
    id: "core",
    title: "Core",
    note: "What I reach for by default.",
    items: [
      "Node.js",
      "NestJS",
      "TypeScript",
      "PostgreSQL",
      "TypeORM",
      "Express",
      "REST APIs",
      "JWT auth & role guards",
      "Swagger / OpenAPI",
    ],
  },
  {
    id: "used",
    title: "Used in projects",
    note: "Shipped in at least one system.",
    items: [
      "MongoDB / Mongoose",
      "Redis",
      "Raw SQL (pg)",
      "Docker",
      "Cloudinary",
      "Scheduled jobs",
      "Nodemailer",
      "PDFKit",
      "Vercel",
    ],
  },
  {
    id: "learning",
    title: "Learning now",
    note: "Not claimed yet.",
    items: ["System design", "Microservices", "CI/CD"],
  },
];
