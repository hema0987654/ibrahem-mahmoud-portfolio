/**
 * Featured systems. Everything here was read from the public repositories:
 * module names are folder names, endpoints are routes declared in the code,
 * and edges are constructor injections or direct queries.
 * `live` stays null until a deployment has been verified as working.
 */

export type StoreKind = "database" | "cache" | "service";

export type SystemStore = {
  id: string;
  label: string;
  kind: StoreKind;
};

export type SystemModule = {
  id: string;
  label: string;
  /** One line: what the module is responsible for. */
  note: string;
  /** Store ids this module talks to. */
  stores: readonly string[];
  /** Other module ids this module calls. */
  uses?: readonly string[];
};

export type Endpoint = {
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  path: string;
};

export type System = {
  slug: string;
  index: string;
  name: string;
  date: string;
  dateTime: string;
  tagline: string;
  problem: string;
  solution: string;
  /** What a request passes through before it reaches a module. */
  entry: readonly string[];
  modules: readonly SystemModule[];
  stores: readonly SystemStore[];
  endpoints: readonly Endpoint[];
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
    dateTime: "2025-08",
    tagline: "Inventory and invoicing where stock moves with the invoice.",
    problem:
      "When stock, suppliers and invoices are tracked separately, quantities drift from what was actually bought and sold, and a shortage is noticed only when a product runs out.",
    solution:
      "Creating a purchase or sale invoice adjusts product quantities in the same call. Reports are computed from invoice lines, and a job that runs every 12 hours raises an alert and sends an email when a product reaches its minimum quantity.",
    entry: ["Client", "JWT middleware", "Roles guard"],
    modules: [
      {
        id: "auth",
        label: "auth",
        note: "Register and login. Issues a JWT carrying the user id and role (Admin, Seller, Storeman, Accountant).",
        stores: ["pg"],
      },
      {
        id: "products",
        label: "products",
        note: "Products with SKU, buy and sell price, quantity and a minimum quantity.",
        stores: ["pg"],
      },
      {
        id: "supplier",
        label: "supplier",
        note: "Suppliers and the products they provide.",
        stores: ["pg"],
      },
      {
        id: "invoice",
        label: "invoice",
        note: "Purchase and sale invoices. Creating one raises or lowers product quantities.",
        stores: ["pg"],
        uses: ["products"],
      },
      {
        id: "invoice-item",
        label: "invoice-item",
        note: "Invoice lines: product, quantity and unit price.",
        stores: ["pg"],
      },
      {
        id: "reports",
        label: "reports",
        note: "Profit, quantities sold, best sellers and most active suppliers, plus a PDF export.",
        stores: ["pg"],
        uses: ["invoice-item"],
      },
      {
        id: "alerts",
        label: "alerts",
        note: "Runs every 12 hours. Low or out-of-stock products get an alert row and an email.",
        stores: ["pg", "smtp"],
        uses: ["products"],
      },
    ],
    stores: [
      { id: "pg", label: "PostgreSQL", kind: "database" },
      { id: "smtp", label: "SMTP email", kind: "service" },
    ],
    endpoints: [
      { method: "POST", path: "/auth/login" },
      { method: "POST", path: "/invoice" },
      { method: "GET", path: "/products" },
      { method: "GET", path: "/reports/profit" },
      { method: "GET", path: "/reports/export-full-pdf" },
      { method: "PATCH", path: "/alerts/:id/read" },
    ],
    stack: ["NestJS 11", "TypeScript", "PostgreSQL", "TypeORM", "@nestjs/schedule", "PDFKit", "Swagger"],
    facts: ["7 feature modules", "4 roles", "5 report endpoints", "12-hour stock check"],
    repo: "https://github.com/hema0987654/stockguard",
    // Checked 2026-10-04: the deployment did not respond correctly, so it is not shown.
    live: null,
  },
  {
    slug: "talent-showcase",
    index: "02",
    name: "Talent Showcase",
    date: "Nov 2025",
    dateTime: "2025-11",
    tagline: "A marketplace backend spread across the right stores.",
    problem:
      "Artists publish work, buyers order it, and both sides need to hear about it when an order is placed or changes status.",
    solution:
      "A modular NestJS API. Users, works, orders and comments live in PostgreSQL, notifications in MongoDB, login attempts in Redis and uploaded files on Cloudinary. Registration is confirmed with a one-time code sent by email.",
    entry: ["Client", "JWT guard", "Roles guard"],
    modules: [
      {
        id: "auth",
        label: "auth",
        note: "Register, verify and login. Signs the JWT.",
        stores: [],
        uses: ["users"],
      },
      {
        id: "users",
        label: "users",
        note: "Accounts with three roles (admin, artist, buyer). Counts failed logins in Redis and locks after five.",
        stores: ["pg", "redis"],
      },
      {
        id: "otp",
        label: "otp",
        note: "Six-digit code, stored hashed, valid for five minutes, sent by email before the account is created.",
        stores: ["pg"],
        uses: ["email"],
      },
      {
        id: "email",
        label: "email",
        note: "Sends the one-time code.",
        stores: ["smtp"],
      },
      {
        id: "works",
        label: "works",
        note: "Published works with categories and tags.",
        stores: ["pg"],
        uses: ["notifications"],
      },
      {
        id: "media",
        label: "media",
        note: "Files attached to a work.",
        stores: ["pg"],
      },
      {
        id: "upload",
        label: "upload",
        note: "Uploads files to Cloudinary.",
        stores: ["cloudinary"],
      },
      {
        id: "orders",
        label: "orders",
        note: "A buyer orders a work. Buyer and artist are both notified on purchase and on every status change.",
        stores: ["pg"],
        uses: ["works", "notifications"],
      },
      {
        id: "comments",
        label: "comments",
        note: "Comments on a work.",
        stores: ["pg"],
      },
      {
        id: "categories",
        label: "categories",
        note: "Categories a work belongs to.",
        stores: ["pg"],
      },
      {
        id: "tags",
        label: "tags",
        note: "Tags attached to works.",
        stores: ["pg"],
      },
      {
        id: "notifications",
        label: "notifications",
        note: "Per-user messages with a read flag, stored as documents.",
        stores: ["mongo"],
      },
    ],
    stores: [
      { id: "pg", label: "PostgreSQL", kind: "database" },
      { id: "mongo", label: "MongoDB", kind: "database" },
      { id: "redis", label: "Redis", kind: "cache" },
      { id: "cloudinary", label: "Cloudinary", kind: "service" },
      { id: "smtp", label: "SMTP email", kind: "service" },
    ],
    endpoints: [
      { method: "POST", path: "/auth/register" },
      { method: "POST", path: "/auth/verify" },
      { method: "POST", path: "/works" },
      { method: "POST", path: "/media/work/:id/upload" },
      { method: "POST", path: "/orders" },
      { method: "PATCH", path: "/notifications/:id/read" },
    ],
    stack: ["NestJS 11", "TypeScript", "PostgreSQL", "TypeORM", "MongoDB", "Redis", "Cloudinary", "Passport JWT"],
    facts: ["13 Nest modules", "2 databases", "3 roles", "Email one-time codes"],
    repo: "https://github.com/hema0987654/talent-showcase",
    live: null,
  },
  {
    slug: "shopsphere",
    index: "03",
    name: "ShopSphere",
    date: "Feb 2026",
    dateTime: "2026-02",
    tagline: "An e-commerce API on hand-written SQL.",
    problem:
      "A store has to turn a cart into an order without overselling, take payment for it once, and give an admin a way to manage products and see what is selling.",
    solution:
      "A layered Express and TypeScript API that talks to PostgreSQL through the pg driver, with no ORM. Checkout and payment each run inside a SQL transaction, and every admin request is written to an audit log.",
    entry: ["Client", "JWT middleware", "Admin check"],
    modules: [
      {
        id: "auth",
        label: "auth",
        note: "Register with an emailed one-time code, login, and password reset.",
        stores: ["pg", "smtp"],
      },
      {
        id: "products",
        label: "products",
        note: "Public product listing and detail.",
        stores: ["pg"],
      },
      {
        id: "categories",
        label: "categories",
        note: "Public category listing.",
        stores: ["pg"],
      },
      {
        id: "cart",
        label: "cartItems",
        note: "A user’s cart: add, list, change quantity, remove.",
        stores: ["pg"],
      },
      {
        id: "order",
        label: "order",
        note: "Checkout. One transaction creates the order, a pending payment and the order lines, lowers stock and clears the cart.",
        stores: ["pg"],
        uses: ["cart", "products", "payments"],
      },
      {
        id: "payments",
        label: "payments",
        note: "Pays a pending order once. Locks the payment row, charges through a gateway interface, then marks the order paid.",
        stores: ["pg", "gateway"],
      },
      {
        id: "reviews",
        label: "reviews",
        note: "Product reviews with average and rating statistics.",
        stores: ["pg"],
      },
      {
        id: "admin",
        label: "admin",
        note: "Users, products, stock, prices, categories and dashboard queries. Every request is audit-logged.",
        stores: ["pg"],
      },
    ],
    stores: [
      { id: "pg", label: "PostgreSQL", kind: "database" },
      { id: "smtp", label: "SMTP email", kind: "service" },
      { id: "gateway", label: "Gateway (simulated)", kind: "service" },
    ],
    endpoints: [
      { method: "POST", path: "/users/verify-otp" },
      { method: "POST", path: "/cart" },
      { method: "POST", path: "/orders" },
      { method: "POST", path: "/payments/:orderId" },
      { method: "GET", path: "/reviews/product/:productId/stats" },
      { method: "GET", path: "/admin/dashboard/best-sellers" },
    ],
    stack: ["Express 5", "TypeScript", "PostgreSQL", "pg (no ORM)", "JWT", "Swagger"],
    facts: ["8 route groups", "No ORM", "Transactional checkout", "Admin audit log"],
    repo: "https://github.com/hema0987654/shopsphere",
    live: null,
  },
];

export const getSystem = (slug: string) => systems.find((system) => system.slug === slug);
