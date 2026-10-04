import type { Metadata } from "next";

export const metadata: Metadata = { title: "404 Not Found", robots: { index: false } };

export default function NotFound() {
  return (
    <section aria-labelledby="nf-heading" className="page flex min-h-[calc(100svh-3.5rem)] flex-col justify-center py-20">
      <p className="inline-flex w-fit items-center gap-2.5 border border-warn/50 px-3 py-1.5 font-mono text-[0.8125rem] text-warn">
        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-warn" />
        404 Not Found
      </p>
      <h1 id="nf-heading" className="mt-8 text-display font-semibold leading-[0.94] tracking-[-0.045em]">
        No route here.
      </h1>
      <p className="mt-8 max-w-[44ch] text-lead text-muted">
        That path doesn’t match anything on this site. The systems and the request trace are on the home page.
      </p>
      <div className="mt-10">
        <a href="/" className="btn btn-primary">
          <span aria-hidden="true">←</span>
          Back to start
        </a>
      </div>
    </section>
  );
}
