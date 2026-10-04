import { evolution } from "@/content/evolution";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function Evolution() {
  return (
    <section id="evolution" aria-labelledby="evolution-heading" className="section rule">
      <div className="page">
        <SectionHeader
          index="03"
          label="Evolution"
          headingId="evolution-heading"
          title="A changelog, not a résumé."
          intro="What each project added that the one before it didn’t have."
        />

        <div className="relative mt-16 md:mt-24">
          {/* the request line continues through the timeline */}
          <div
            aria-hidden="true"
            className="grow-line absolute bottom-2 left-[4.5px] top-2 w-0.5 bg-signal md:left-[calc(11.5rem+4.5px)]"
          />

          <ol className="flex flex-col gap-12 md:gap-16">
            {evolution.map((entry) => {
              const isNow = entry.kind === "now";
              return (
                <li
                  key={`${entry.dateTime}-${entry.title}`}
                  className="reveal relative grid grid-cols-[11px_1fr] gap-x-5 md:grid-cols-[9rem_11px_1fr] md:gap-x-10"
                >
                  <time
                    dateTime={entry.dateTime}
                    className="label col-start-2 mb-2 text-muted md:col-start-1 md:mb-0 md:pt-1.5 md:text-right"
                  >
                    {entry.date}
                  </time>

                  <span
                    aria-hidden="true"
                    className={`col-start-1 row-start-1 mt-1 h-[11px] w-[11px] border border-signal md:col-start-2 md:mt-2 ${
                      isNow ? "bg-signal" : "bg-paper"
                    } ${entry.kind === "milestone" ? "rounded-full" : ""}`}
                  />

                  <div className="col-start-2 md:col-start-3">
                    <h3 className="text-2xl font-semibold leading-tight tracking-[-0.02em] md:text-[1.75rem]">
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
                    <p className="mt-3 max-w-[58ch] text-muted">{entry.summary}</p>

                    {entry.added.length > 0 ? (
                      <ul
                        aria-label={`New in ${entry.title}`}
                        className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 font-mono text-[0.8125rem]"
                      >
                        {entry.added.map((item) => (
                          <li key={item} className="whitespace-nowrap">
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
