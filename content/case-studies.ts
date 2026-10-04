/**
 * Case studies. Everything is taken from the public repositories:
 * code excerpts are quoted (shortened with "…"), behaviour is described as the
 * code implements it, and "What I'd improve" lists gaps visible in that code.
 * No metrics, users or outcomes are claimed beyond what the repository shows.
 */

export type Annotation = { label: string; note: string };

export type CaseStudy = {
  slug: string;
  /** Short line under the title. */
  lede: string;
  spec: readonly { k: string; v: string }[];
  problem: readonly string[];
  architectureIntro: string;
  decision: {
    title: string;
    context: string;
    decision: string;
    consequence: string;
  };
  implementation: {
    title: string;
    file: string;
    intro: string;
    code: string;
    annotations: readonly Annotation[];
  };
  challenges: readonly { problem: string; handling: string; file: string }[];
  outcome: readonly string[];
  improve: readonly { title: string; detail: string }[];
};

export const caseStudies: readonly CaseStudy[] = [
  {
    slug: "stockguard",
    lede: "An inventory and invoicing API where the invoice is the only thing that moves stock.",
    spec: [
      { k: "Type", v: "Backend API · personal project" },
      { k: "Built", v: "August 2025" },
      { k: "Framework", v: "NestJS 11, TypeScript" },
      { k: "Data", v: "PostgreSQL, TypeORM" },
      { k: "Also", v: "@nestjs/schedule, Nodemailer, PDFKit, Swagger" },
    ],
    problem: [
      "A small business tracks three things that depend on each other: what it holds in stock, what it bought from suppliers and what it sold. Kept apart, they drift. A sale is written down but the quantity is not lowered, or a product quietly reaches zero and nobody notices until a customer asks for it.",
      "StockGuard treats the invoice as the event. A purchase raises stock, a sale lowers it, and everything else, reports and alerts, is derived from that.",
    ],
    architectureIntro:
      "Seven feature modules around one PostgreSQL database. Product, supplier and invoice routes sit behind a JWT middleware and a roles guard; a scheduler drives the alerts module.",
    decision: {
      title: "Stock changes only inside invoice creation",
      context:
        "A product’s quantity changes for two business reasons: stock was bought or stock was sold. Both already produce an invoice.",
      decision:
        "InvoiceService.create loads every product on the invoice in one query, validates a sale against the quantity on hand, adjusts quantities, and saves the products together with the invoice.",
      consequence:
        "Quantities cannot be lowered below zero by a sale, and profit can be computed from invoice lines instead of being stored. The cost is that the invoice path has to be correct and atomic, which is the first thing I would tighten today.",
    },
    implementation: {
      title: "Profit is a query, not a column",
      file: "src/reports/reports.service.ts",
      intro:
        "Reports never store totals. Profit for a day, month or year is summed from invoice lines joined to the product’s buy price, filtered to sale invoices.",
      code: `const qb = this.invoiceItemRepository
  .createQueryBuilder('item')
  .leftJoin('item.product', 'product')
  .leftJoin('item.invoice', 'invoice')
  .select(
    'SUM((item.unitPrice - product.buyPrice) * item.quantity)',
    'profit',
  )
  .where('invoice.type = :typeSale', { typeSale: 'sale' });

if (type === 'day') {
  qb.andWhere('DATE(item.created_at) = :date', { date });
} else if (type === 'month') {
  …`,
      annotations: [
        { label: "Margin per line", note: "Unit price minus the product’s buy price, times quantity, summed in SQL." },
        { label: "Parameters", note: "Values are bound as parameters, not concatenated into the query." },
        { label: "Period", note: "The same query serves day, month and year by adding a date condition." },
      ],
    },
    challenges: [
      {
        problem: "Selling more than is in stock.",
        handling: "A sale compares each line with the quantity on hand and refuses the invoice before anything is saved.",
        file: "src/invoice/invoice.service.ts",
      },
      {
        problem: "Many products on one invoice.",
        handling: "Product ids are de-duplicated and loaded with a single In() query instead of one query per line.",
        file: "src/invoice/invoice.service.ts",
      },
      {
        problem: "The same alert firing every 12 hours.",
        handling: "Before creating an alert, the job looks for an unread alert of the same type for that product and skips it if one exists.",
        file: "src/alerts/alerts.service.ts",
      },
      {
        problem: "Different people, different permissions.",
        handling: "Each route declares its roles with a decorator, and one guard enforces them from the role in the JWT.",
        file: "src/auth/roles/roles.guard.ts",
      },
    ],
    outcome: [
      "Seven feature modules: auth, products, supplier, invoice, invoice-item, reports, alerts.",
      "Four roles (Admin, Seller, Storeman, Accountant) enforced per route.",
      "Five report endpoints, including a PDF export built with PDFKit.",
      "A scheduled low-stock and out-of-stock check that writes alerts and sends email.",
      "Swagger documentation generated from the controllers and DTOs.",
    ],
    improve: [
      {
        title: "Make invoice creation one transaction",
        detail: "Products are saved before the invoice. If the second save fails, stock has already moved. Both belong in a single database transaction.",
      },
      {
        title: "Save invoice lines with the invoice",
        detail: "Lines are stored through the invoice-item routes today. Cascading them from the invoice would make one request enough and keep reports in step.",
      },
      {
        title: "Return the right status codes",
        detail: "Missing products and insufficient stock throw a plain Error, which reaches the client as a 500. They should be 404 and 400 responses.",
      },
      {
        title: "Put reports and alerts behind the same guard",
        detail: "The auth middleware is applied to products, suppliers and invoices. Reports and alerts should use it too.",
      },
      {
        title: "Move configuration out of the code",
        detail: "The alert recipient, the open CORS origin and schema synchronisation should come from environment settings, with migrations instead of synchronize.",
      },
      {
        title: "Tests",
        detail: "The invoice path is the heart of the system and deserves tests around stock changes before anything else.",
      },
    ],
  },
  {
    slug: "talent-showcase",
    lede: "A marketplace API for creative work: publishing, ordering and telling both sides what happened.",
    spec: [
      { k: "Type", v: "Backend API" },
      { k: "Built", v: "November 2025" },
      { k: "Framework", v: "NestJS 11, TypeScript" },
      { k: "Data", v: "PostgreSQL (TypeORM), MongoDB (Mongoose), Redis" },
      { k: "Also", v: "Cloudinary, Passport JWT, Nodemailer" },
    ],
    problem: [
      "Three kinds of people use a marketplace for creative work. Artists publish works with media, categories and tags. Buyers order them. Admins keep the catalogue in order. An order matters to two people at once, and both need to be told when it is placed, changes status or is removed.",
      "The data is not all the same shape either: accounts, works and orders are relational, notifications are a stream of small messages, and login attempts only need to live for a few minutes.",
    ],
    architectureIntro:
      "Thirteen Nest modules. Relational data goes through TypeORM to PostgreSQL, notifications through Mongoose to MongoDB, login-attempt counters to Redis and files to Cloudinary.",
    decision: {
      title: "Notifications live in MongoDB, everything else in PostgreSQL",
      context:
        "A notification is a user id, a message and a read flag. It has no joins, is written often and is read as a list per user. Users, works and orders, on the other hand, reference each other.",
      decision:
        "The notifications module is the only one that uses Mongoose. Orders and works call NotificationsService and never touch the document store directly.",
      consequence:
        "The relational schema stays small and the notification store can grow on its own. The price is that an order and its notifications are written to two databases, so they cannot share a transaction.",
    },
    implementation: {
      title: "Registration is held until the email is proven",
      file: "src/otp/otp.service.ts",
      intro:
        "Registering does not create an account. It stores a pending record with a hashed six-digit code that expires in five minutes, and emails the code. The real user is created only when the code is verified.",
      code: `const otp = Math.floor(100000 + Math.random() * 900000).toString();

const otpHash = await bcrypt.hash(otp, 10);

user.otp = otpHash;
user.otp_expires_at = addMinutes(new Date(), 5);

await this.OtpRepository.save(user);

await this.emailService.sendOtp(info.email, otp);

return { message: 'OTP sent successfully' };`,
      annotations: [
        { label: "Hashed at rest", note: "Only the bcrypt hash of the code is stored; the plain code exists in the email." },
        { label: "Short-lived", note: "The code is valid for five minutes, checked again at verification." },
        { label: "Two steps", note: "POST /auth/register sends the code, POST /auth/verify creates the account." },
      ],
    },
    challenges: [
      {
        problem: "An order concerns two people.",
        handling: "Creating, updating and removing an order each write a notification for the buyer and one for the artist.",
        file: "src/orders/orders.service.ts",
      },
      {
        problem: "Repeated wrong passwords.",
        handling: "Failed logins increment a Redis counter that expires after 15 minutes; at five the login is refused.",
        file: "src/users/users.service.ts",
      },
      {
        problem: "Who may do what.",
        handling: "A JWT guard authenticates, and a roles guard separates admin, artist and buyer on the routes that need it.",
        file: "src/auth/guards",
      },
      {
        problem: "Files do not belong on the API server.",
        handling: "Uploads are sent to Cloudinary and the returned URL is what the API stores.",
        file: "src/upload/upload.service.ts",
      },
    ],
    outcome: [
      "Thirteen Nest modules, including auth, users, works, media, orders, comments and notifications.",
      "Two databases in one application, each used for the data that suits it.",
      "Email verification with a one-time code before an account exists.",
      "Notifications for buyer and artist on every order event.",
    ],
    improve: [
      {
        title: "Keep the original error status",
        detail: "Services wrap every failure in a 500. A missing work should stay a 404 and a bad request a 400.",
      },
      {
        title: "Configure Redis from the environment",
        detail: "The Redis host and port are fixed to a local instance in the module. They should come from configuration like the databases do.",
      },
      {
        title: "Make order and notifications resilient",
        detail: "If a notification fails after the order is saved, the request fails although the order exists. Notifications should be sent after commit, or through a queue.",
      },
      {
        title: "Limit one-time code attempts properly",
        detail: "Verification should count its own attempts and stop after a few wrong codes.",
      },
      {
        title: "Type the payment data",
        detail: "payment_info is free-form JSON today. It should be a defined structure, and the payment itself a real provider integration.",
      },
      {
        title: "Tests",
        detail: "The order flow and the verification flow are the first candidates.",
      },
    ],
  },
  {
    slug: "shopsphere",
    lede: "An e-commerce API written directly on SQL, with checkout and payment as transactions.",
    spec: [
      { k: "Type", v: "Backend API" },
      { k: "Built", v: "February 2026" },
      { k: "Framework", v: "Express 5, TypeScript" },
      { k: "Data", v: "PostgreSQL through pg, no ORM" },
      { k: "Also", v: "JWT, Multer, Nodemailer, Swagger" },
    ],
    problem: [
      "Checkout is the moment a store can go wrong. A cart has to become an order, stock has to drop by exactly what was bought, a payment record has to exist, and the cart has to be emptied. If any one of those happens without the others, the store’s numbers are wrong.",
      "ShopSphere is built without an ORM, so every one of those steps is a SQL statement written by hand, and keeping them together is the job of the service layer.",
    ],
    architectureIntro:
      "Eight route groups in a layered structure: route, controller, service and a query file per feature. One PostgreSQL pool, a JWT middleware, an admin check, and an audit log on every admin request.",
    decision: {
      title: "Checkout is one SQL transaction",
      context:
        "Creating an order touches five things: the order, its payment record, the order lines, product stock and the cart. A failure halfway would leave them disagreeing.",
      decision:
        "OrderService.createOrder takes a client from the pool, opens a transaction, performs every write through that client and commits once. Any error rolls everything back and the client is always released.",
      consequence:
        "An order either exists completely or not at all. Payment follows the same pattern and additionally locks the payment row, so an order cannot be paid twice at the same time.",
    },
    implementation: {
      title: "BEGIN, five writes, COMMIT",
      file: "src/order/order.service.ts",
      intro:
        "The query functions accept the transaction client as their first argument, which is how separate query files take part in one transaction.",
      code: `const client = await db.connect();

try {
    await client.query("BEGIN");
    …
    const order = await OrderQueries.createOrder(client, user_id, totalAmount);
    await PaymentQueries.createPayment(client, {
        order_id: order.id,
        status: PaymentStatus.pending,
        method: null,
        amount: totalAmount
    });
    for (const item of cartItems) {
        …
        await productdb.updateStock(client, item.product_id, newStock);
        await OrderQueries.createOrderItem(client, order.id, item.product_id, item.quantity, product.price);
    }

    await cartDb.clearCartByUserId(client, user_id);

    await client.query("COMMIT");
    return order;

} catch (err) {
    await client.query("ROLLBACK");
    throw err;
} finally {
    client.release();
}`,
      annotations: [
        { label: "One client", note: "Every write goes through the same pooled client, so they share the transaction." },
        { label: "Pending payment", note: "The payment row is created with the order and paid later through POST /payments/:orderId." },
        { label: "Always released", note: "The finally block returns the client to the pool whether the order succeeded or not." },
      ],
    },
    challenges: [
      {
        problem: "Paying the same order twice.",
        handling: "The payment row is read with SELECT … FOR UPDATE inside the transaction, and only pending orders can be paid.",
        file: "src/payments/payment.service.ts",
      },
      {
        problem: "Swapping the payment provider later.",
        handling: "Charging goes through an IPaymentGateway interface. The current implementation is a simulated gateway.",
        file: "src/utils/payment.gateway.ts",
      },
      {
        problem: "Knowing what admins did.",
        handling: "A middleware on the admin router records user, method, path, status and duration for every request.",
        file: "src/utils/middleware/audit.middleware.ts",
      },
      {
        problem: "Fake sign-ups.",
        handling: "Registration creates a pending user with a one-time code valid for ten minutes; the account is created on verification.",
        file: "src/auth/user.service.ts",
      },
    ],
    outcome: [
      "Eight route groups: users, products, categories, cart, orders, payments, reviews and admin.",
      "Checkout and payment implemented as SQL transactions with rollback.",
      "An admin area with stock, price and bulk product updates, plus dashboard queries for best sellers and stale products.",
      "Swagger documentation served at /api-docs.",
    ],
    improve: [
      {
        title: "Lock stock during checkout",
        detail: "Checkout reads products outside the transaction client. Reading them with the existing FOR UPDATE query would stop two orders from taking the last item.",
      },
      {
        title: "Integrate a real payment provider",
        detail: "The gateway is simulated. The interface is in place; a real provider with webhooks is the next step.",
      },
      {
        title: "Add the Dockerfile the README describes",
        detail: "The README documents a Docker build, but the file is not in the repository.",
      },
      {
        title: "Store the audit log in the database",
        detail: "The audit trail is appended to a file. A table would make it queryable and survive redeploys.",
      },
      {
        title: "Schema migrations and tests",
        detail: "The schema should be versioned in the repository, and checkout covered by tests.",
      },
    ],
  },
];

export const getCaseStudy = (slug: string) => caseStudies.find((study) => study.slug === slug);
