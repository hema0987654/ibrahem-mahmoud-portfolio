/**
 * The Trace: one real request through StockGuard, step by step.
 * File paths and code excerpts are taken from github.com/hema0987654/stockguard
 * (excerpts are shortened with "…", never rewritten).
 * Values in `state` are sample data and are labelled as such in the UI.
 */

export type TraceLine = {
  k: string;
  v: string;
  tone?: "ok" | "warn" | "signal";
  /** In the pinned scene the value counts from one number to the other. */
  roll?: { from: number; to: number };
};

export type TraceStep = {
  id: string;
  /** Short name for the rail. */
  rail: string;
  title: string;
  /** Repository-relative file, or null for steps that are not a file. */
  file: string | null;
  body: string;
  code: string;
  /** What the request / data looks like at this point. */
  stateTitle: string;
  state: readonly TraceLine[];
  /** What the caller gets if this step refuses the request. */
  rejects?: string;
};

export const traceMeta = {
  heading: "What happens when you call POST /invoice.",
  intro:
    "One sale invoice in StockGuard, followed from the HTTP request to the database and the alert that fires later. Every file below is in the repository.",
  repo: "https://github.com/hema0987654/stockguard",
  repoLabel: "hema0987654/stockguard",
  sampleNote: "Values are sample data. Code is quoted from the repository.",
} as const;

export const trace: readonly TraceStep[] = [
  {
    id: "request",
    rail: "Request",
    title: "A storeman records a sale.",
    file: null,
    body: "The client sends a sale invoice with a bearer token. Nothing has been trusted yet.",
    code: `POST /invoice
Authorization: Bearer <token>
Content-Type: application/json`,
    stateTitle: "Request body",
    state: [
      { k: "type", v: '"sale"' },
      { k: "totalAmount", v: "120" },
      { k: "invoiceItems", v: "[{ productId: 12, quantity: 3, unitPrice: 40, … }]" },
    ],
  },
  {
    id: "auth",
    rail: "Auth middleware",
    title: "Who is calling?",
    file: "src/middleware/auth/auth.middleware.ts",
    body: "The middleware is applied to the invoice routes. It requires a Bearer header, verifies the JWT and attaches its payload to the request.",
    code: `const authHeader = req.headers['authorization'];
if (!authHeader || !authHeader.startsWith('Bearer ')) {
  return res.status(HttpStatus.UNAUTHORIZED).json({ … });
}
const token = authHeader?.split(' ')[1];
const payload = await this.jwtService.verifyAsync(token)
req['user']=payload;
next();`,
    stateTitle: "req.user",
    state: [
      { k: "sub", v: "3" },
      { k: "role", v: '"Storeman"', tone: "signal" },
    ],
    rejects: "401 Unauthorized",
  },
  {
    id: "roles",
    rail: "Roles guard",
    title: "Are they allowed to?",
    file: "src/auth/roles/roles.guard.ts",
    body: "The route declares which roles may create invoices. The guard reads that metadata and compares it with the role from the token.",
    code: `// invoice.controller.ts
@Post()
@Roles('Admin', 'Storeman')
create(…)

// roles.guard.ts
const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
  context.getHandler(),
  context.getClass(),
]);
…
return requiredRoles.includes(user.role);`,
    stateTitle: "Check",
    state: [
      { k: "required", v: "Admin | Storeman" },
      { k: "user.role", v: "Storeman", tone: "signal" },
      { k: "result", v: "allowed", tone: "signal" },
    ],
    rejects: "403 Forbidden",
  },
  {
    id: "validation",
    rail: "Validation",
    title: "Is the body valid?",
    file: "src/invoice/dto/create-invoice.dto.ts",
    body: "A ValidationPipe with whitelist strips unknown fields, then the DTO checks the type, the total and that there is at least one line.",
    code: `@IsEnum(InvoiceType, { message: 'Type must be either purchase or sale' })
readonly type: InvoiceType;

@IsPositive({ message: 'Total amount must be greater than zero' })
readonly totalAmount: number;

@ValidateNested({ each: true })
@Type(() => CreateInvoiceItemDto)
@ArrayMinSize(1, { message: 'Invoice must contain at least one item' })
readonly invoiceItems: CreateInvoiceItemDto[];`,
    stateTitle: "Checks",
    state: [
      { k: "type", v: "purchase | sale", tone: "signal" },
      { k: "totalAmount", v: "> 0", tone: "signal" },
      { k: "invoiceItems", v: "≥ 1, each validated", tone: "signal" },
    ],
    rejects: "400 Bad Request",
  },
  {
    id: "service",
    rail: "InvoiceService",
    title: "Move the stock.",
    file: "src/invoice/invoice.service.ts",
    body: "All products on the invoice are loaded in one query. A sale checks that enough is in stock and lowers the quantity; a purchase raises it.",
    code: `const foundProducts = await this.productRepository.findBy({
  id: In(uniqueProductIds),
});
…
} else if (createInvoiceDto.type === 'sale') {
  if (product.quantity < item.quantity) {
    throw new Error(\`Insufficient quantity for product ID \${product.id}\`);
  }
  product.quantity -= item.quantity;
}`,
    stateTitle: "products · id 12",
    state: [
      { k: "quantity", v: "7 → 4", tone: "signal", roll: { from: 7, to: 4 } },
      { k: "min_quantity", v: "5" },
    ],
  },
  {
    id: "database",
    rail: "PostgreSQL",
    title: "Write it down.",
    file: "src/invoice/invoice.service.ts",
    body: "The changed products are saved, then the invoice row is created. Tables come from TypeORM entities: products, invoices, invoice_items.",
    code: `await this.productRepository.save(foundProducts);

const invoice = this.invoiceRepository.create({
  type: createInvoiceDto.type,
  totalAmount: createInvoiceDto.totalAmount,
  …
});

const savedInvoice = await this.invoiceRepository.save(invoice);`,
    stateTitle: "Writes",
    state: [
      { k: "products", v: "1 row updated", tone: "signal" },
      { k: "invoices", v: "1 row inserted", tone: "signal" },
    ],
  },
  {
    id: "response",
    rail: "Response",
    title: "Answer the caller.",
    file: "src/invoice/invoice.service.ts",
    body: "The service returns the saved invoice. Nest answers a POST with 201 by default.",
    code: `return {
  message: 'Invoice created successfully',
  invoice: savedInvoice,
};`,
    stateTitle: "Response",
    state: [
      { k: "status", v: "201 Created", tone: "ok" },
      { k: "message", v: '"Invoice created successfully"' },
    ],
  },
  {
    id: "alert",
    rail: "Scheduled alert",
    title: "Later, without a request.",
    file: "src/alerts/alerts.service.ts",
    body: "Every 12 hours a job scans products. Anything at or below its minimum gets an alert row and an email, unless an unread alert of that type already exists.",
    code: `@Cron(CronExpression.EVERY_12_HOURS)
async checkLowStock() {
  const products = await this.productRepository.find();

  for (const product of products) {
    if (product.quantity <= product.minQuantity) {
      …
      await this.alertRepository.save(alert);
      …
      await this.mailerService.sendMail({ … });`,
    stateTitle: "products · id 12",
    state: [
      { k: "4 <= 5", v: "true", tone: "warn" },
      { k: "alerts", v: "low_stock, 1 row inserted", tone: "warn" },
      { k: "email", v: "sent", tone: "warn" },
    ],
  },
];
