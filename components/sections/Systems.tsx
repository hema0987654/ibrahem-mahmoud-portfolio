import type { CSSProperties } from "react";
import { systems, type System } from "@/content/systems";
import { EndpointList } from "@/components/ui/EndpointList";
import { ModuleMap } from "@/components/diagram/ModuleMap";
import { ModuleList } from "@/components/diagram/ModuleList";

type Tone = "paper" | "ink" | "signal";

/** Paper, Ink, Paper. Signal stays an accent here; the full Signal surface is kept for the finale. */
const tones: readonly Tone[] = ["paper", "ink", "paper"];

/** Sizes the name so it spans the plate whatever its length. */
const fit = (name: string) => Math.min(18.5, 96 / (name.length * 0.535));

export function Systems() {
  return (
    <section id="systems" aria-labelledby="systems-heading">
      <div className="page pb-14 pt-[var(--section-gap)] md:pb-20">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-10">
          <p className="label flex items-center gap-3 text-muted lg:col-span-3 lg:pb-3">
            <span className="text-signal">02</span>
            <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
            <span>Systems</span>
          </p>
          <div className="lg:col-span-9">
            <h2
              id="systems-heading"
              className="reveal-wipe text-[clamp(2.25rem,6vw,5.5rem)] font-semibold leading-[0.96] tracking-[-0.04em]"
            >
              Three systems, drawn from their code.
            </h2>
            <p className="mt-6 max-w-[56ch] text-lead text-muted">
              Each map is drawn from the repository: the modules are its folders, the lines are what each one calls.
            </p>
          </div>
        </div>
      </div>

      {systems.map((system, i) => (
        <Plate key={system.slug} system={system} tone={tones[i % tones.length] ?? "paper"} accent={i === 2} />
      ))}
    </section>
  );
}

function Plate({ system, tone, accent = false }: { system: System; tone: Tone; accent?: boolean }) {
  const surface = tone === "ink" ? "surface-ink" : tone === "signal" ? "surface-signal" : "";

  return (
    <article aria-labelledby={`system-${system.slug}`} className={`plate ${surface}`} data-tone={tone} data-accent={accent || undefined}>
      {tone !== "paper" ? <span className="margin-line" aria-hidden="true" /> : null}

      <div className="page flex min-h-[100svh] flex-col py-14 md:py-20">
        <header className="label plate-rule flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-b pb-4">
          <span>
            <span className="plate-accent">System {system.index}</span>
            <span aria-hidden="true" className="plate-muted">
              {" "}
              /{" "}
            </span>
            <span className="plate-muted">0{systems.length}</span>
          </span>
          <time dateTime={system.dateTime} className="plate-muted">
            {system.date}
          </time>
        </header>

        <div className="cq mt-8 md:mt-10">
          <h3
            id={`system-${system.slug}`}
            className="plate-name drift"
            style={{ "--fit": fit(system.name).toFixed(2) } as CSSProperties}
          >
            {system.name}
          </h3>
        </div>

        <div className="mt-10 grid flex-1 gap-10 md:mt-14 lg:grid-cols-12 lg:gap-12">
          <div className="hidden md:block lg:col-span-8">
            <ModuleMap system={system} tone={tone} flow />
          </div>

          <div className="flex flex-col lg:col-span-4">
            <p className="text-[clamp(1.375rem,2.2vw,1.875rem)] font-medium leading-[1.15] tracking-[-0.02em]">
              {system.tagline}
            </p>
            <p className="plate-muted mt-5 text-base leading-relaxed">{system.solution}</p>

            <ul aria-label="Facts" className="mt-7 flex flex-col gap-1.5 font-mono text-[0.8125rem]">
              {system.facts.map((fact) => (
                <li key={fact}>
                  <span aria-hidden="true" className="mr-2" style={{ color: "var(--p-ok)" }}>
                    ✓
                  </span>
                  {fact}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3 lg:mt-auto lg:pt-8">
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
          </div>
        </div>

        <div className="plate-rule mt-10 border-t pt-5">
          <EndpointList endpoints={system.endpoints} tone={tone} label={`${system.name} endpoints`} />
        </div>

        <details className="module-details mt-5">
          <summary className="label">
            <span>{system.modules.length} modules and what they talk to</span>
          </summary>
          <div className="pb-2 pt-4 lg:columns-2 lg:gap-12">
            <ModuleList system={system} tone={tone} />
          </div>
        </details>
      </div>
    </article>
  );
}
