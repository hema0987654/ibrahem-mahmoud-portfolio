import type { CSSProperties } from "react";
import { systems } from "@/content/systems";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { EndpointList } from "@/components/ui/EndpointList";
import { ModuleMap } from "@/components/diagram/ModuleMap";
import { ModuleList } from "@/components/diagram/ModuleList";

export function Systems() {
  return (
    <section id="systems" aria-labelledby="systems-heading" className="section">
      <div className="page">
        <SectionHeader
          index="02"
          label="Systems"
          headingId="systems-heading"
          title="Three systems, drawn from their code."
          intro="Each map is drawn from the repository: the modules are its folders, the lines are what each one calls."
        />

        <div className="mt-16 flex flex-col gap-8 md:mt-24 lg:gap-0">
          {systems.map((system, i) => (
            <article
              key={system.slug}
              aria-labelledby={`system-${system.slug}`}
              className="sheet"
              style={{ "--i": i } as CSSProperties}
            >
              <header className="label flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-b border-line px-5 py-3 text-muted md:px-8">
                <span>
                  <span className="text-signal">System {system.index}</span>
                  <span aria-hidden="true"> — </span>
                  <span className="text-text">{system.name}</span>
                </span>
                <time dateTime={system.dateTime}>{system.date}</time>
              </header>

              <div className="grid gap-10 px-5 py-8 md:px-8 md:py-10 lg:grid-cols-12 lg:gap-10">
                <div className="lg:col-span-5">
                  <h3
                    id={`system-${system.slug}`}
                    className="text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-[1] tracking-[-0.035em]"
                  >
                    {system.name}
                  </h3>
                  <p className="mt-4 text-lead leading-snug">{system.tagline}</p>

                  <dl className="mt-8 flex flex-col gap-5">
                    <div>
                      <dt className="label text-muted">Problem</dt>
                      <dd className="mt-1.5 text-base leading-relaxed text-muted">{system.problem}</dd>
                    </div>
                    <div>
                      <dt className="label text-muted">Solution</dt>
                      <dd className="mt-1.5 text-base leading-relaxed">{system.solution}</dd>
                    </div>
                  </dl>

                  <ul aria-label="Facts" className="mt-8 flex flex-wrap gap-x-5 gap-y-1.5 font-mono text-[0.8125rem]">
                    {system.facts.map((fact) => (
                      <li key={fact} className="whitespace-nowrap">
                        <span aria-hidden="true" className="mr-1.5 text-ok">
                          ✓
                        </span>
                        {fact}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="lg:col-span-7">
                  {/* Map from tablet up; the module notes are a disclosure on every device. */}
                  <div className="hidden md:block">
                    <ModuleMap system={system} />
                  </div>
                  <details className="module-details">
                    <summary className="label">
                      <span>
                        {system.modules.length} modules and what they talk to
                      </span>
                    </summary>
                    <div className="mt-5">
                      <ModuleList system={system} />
                    </div>
                  </details>
                </div>
              </div>

              <footer className="flex flex-col gap-6 border-t border-line px-5 py-5 md:px-8 lg:flex-row lg:items-center lg:justify-between">
                <EndpointList endpoints={system.endpoints} label={`${system.name} endpoints`} />
                <div className="flex shrink-0 flex-wrap gap-3">
                  <a href={`/systems/${system.slug}`} className="btn btn-primary">
                    Case study
                    <span aria-hidden="true">→</span>
                    <span className="sr-only">: {system.name}</span>
                  </a>
                  <a href={system.repo} className="btn btn-ghost" target="_blank" rel="noreferrer">
                    Code
                    <span aria-hidden="true">↗</span>
                    <span className="sr-only">: {system.name} on GitHub</span>
                  </a>
                  {system.live ? (
                    <a href={system.live} className="btn btn-ghost" target="_blank" rel="noreferrer">
                      Live
                      <span aria-hidden="true">↗</span>
                    </a>
                  ) : null}
                </div>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
