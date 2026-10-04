import { stack } from "@/content/stack";

export function Stack() {
  return (
    <section id="stack" aria-labelledby="stack-heading" className="pb-[var(--section-gap)] pt-10 md:pt-0">
      <div className="page">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-5">
            <p className="label flex items-center gap-3 text-muted">
              <span className="text-signal">04</span>
              <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
              <span>Stack</span>
            </p>
            <h2
              id="stack-heading"
              className="mt-5 text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-[1.05] tracking-[-0.03em]"
            >
              What I actually use.
            </h2>
          </div>
          <p className="max-w-[52ch] text-base text-muted lg:col-span-6 lg:col-start-7 lg:pb-1">
            Three tiers, so it’s clear what is daily work and what is still being learned. Everything in the first two
            is in the code on GitHub.
          </p>
        </div>

        <div className="reveal mt-12 grid border border-line bg-paper md:mt-16 md:grid-cols-3">
          {stack.map((tier, i) => (
            <div
              key={tier.id}
              className={`p-6 md:p-8 ${i > 0 ? "border-t border-line md:border-l md:border-t-0" : ""}`}
            >
              <p className="label flex items-baseline justify-between gap-4">
                <span className={tier.id === "core" ? "text-signal" : "text-text"}>{tier.title}</span>
                <span className="text-muted">{String(tier.items.length).padStart(2, "0")}</span>
              </p>
              <p className="mt-2 text-base text-muted">{tier.note}</p>
              <ul className="mt-8 flex flex-col">
                {tier.items.map((item) => (
                  <li
                    key={item}
                    className={`border-t border-line py-2.5 text-[1.0625rem] leading-snug ${
                      tier.id === "learning" ? "text-muted" : ""
                    }`}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
