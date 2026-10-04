import { evolution } from "@/content/evolution";
import { EvolutionCounter } from "@/components/sections/EvolutionCounter";

/** Running count of the items listed as added, entry by entry. */
const totals = evolution.reduce<number[]>((acc, entry) => {
  acc.push((acc[acc.length - 1] ?? 0) + entry.added.length);
  return acc;
}, []);

export function Evolution() {
  return (
    <section id="evolution" aria-labelledby="evolution-heading" className="section">
      <div className="page grid gap-14 lg:grid-cols-12 lg:gap-10">
        {/* Heading and counter stay in view while the timeline scrolls past. */}
        <div className="lg:order-2 lg:col-span-4 lg:col-start-9">
          <div className="lg:sticky lg:top-28">
            <p className="label flex items-center gap-3 text-muted">
              <span className="text-signal">03</span>
              <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
              <span>Evolution</span>
            </p>
            <h2
              id="evolution-heading"
              className="mt-6 text-[clamp(2rem,3.6vw,3.25rem)] font-semibold leading-[1] tracking-[-0.035em]"
            >
              A changelog, not a résumé.
            </h2>
            <p className="mt-5 max-w-[34ch] text-lead text-muted">
              What each project added that the one before it didn’t have.
            </p>
            <div className="mt-12">
              <EvolutionCounter totals={totals} labels={evolution.map((entry) => entry.date)} />
            </div>
          </div>
        </div>

        <div className="relative lg:order-1 lg:col-span-8">
          {/* CSS line for small screens and no-JS; the request path replaces it on wide screens */}
          <div aria-hidden="true" className="grow-line absolute bottom-2 left-[5px] top-2 w-0.5 bg-signal" />

          <ol className="flex flex-col gap-14 md:gap-20" data-path="timeline">
            {evolution.map((entry, i) => {
              const isNow = entry.kind === "now";
              return (
                <li
                  key={`${entry.dateTime}-${entry.title}`}
                  data-evo={i}
                  data-reached={isNow ? "true" : undefined}
                  className="relative grid grid-cols-[12px_1fr] gap-x-6 md:gap-x-10"
                >
                  <span
                    aria-hidden="true"
                    data-path-node=""
                    className={`evo-node relative z-[1] mt-2 h-3 w-3 border-2 border-signal bg-paper ${
                      entry.kind === "milestone" ? "rounded-full" : ""
                    }`}
                  />

                  <div>
                    <time
                      dateTime={entry.dateTime}
                      className="block font-mono text-[clamp(1.5rem,3vw,2.5rem)] font-medium leading-none tracking-[-0.04em] text-signal"
                    >
                      {entry.date}
                    </time>
                    <h3 className="mt-4 text-2xl font-semibold leading-tight tracking-[-0.02em] md:text-[2rem]">
                      {entry.repo ? (
                        <a href={entry.repo} className="link" target="_blank" rel="noreferrer">
                          {entry.title}
                          <span aria-hidden="true" className="ml-2 font-mono text-sm text-muted">
                            ↗
                          </span>
                        </a>
                      ) : (
                        entry.title
                      )}
                    </h3>
                    <p className="mt-3 max-w-[54ch] text-muted">{entry.summary}</p>

                    {entry.added.length > 0 ? (
                      <ul
                        aria-label={`New in ${entry.title}`}
                        className="mt-5 flex flex-wrap gap-2 font-mono text-[0.8125rem]"
                      >
                        {entry.added.map((item) => (
                          <li key={item} className="whitespace-nowrap border border-line-strong px-2.5 py-1.5 leading-none">
                            <span aria-hidden="true" className="mr-1.5 text-ok">
                              +
                            </span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
