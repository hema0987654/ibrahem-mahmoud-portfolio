import { stack } from "@/content/stack";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function Stack() {
  return (
    <section id="stack" aria-labelledby="stack-heading" className="section rule">
      <div className="page">
        <SectionHeader
          index="04"
          label="Stack"
          headingId="stack-heading"
          title="What I actually use."
          intro="Three tiers, so it’s clear what is daily work and what is still being learned. Everything in the first two is in the code on GitHub."
        />

        <div className="reveal mt-16 grid border border-line bg-paper md:mt-24 md:grid-cols-3">
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
