import type { CSSProperties } from "react";
import { profile } from "@/content/profile";
import { MagneticLink } from "@/components/ui/MagneticLink";

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export function Hero() {
  const { hero } = profile;
  const requestText = `${hero.request.method} ${hero.request.path}`;

  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="relative flex min-h-[calc(100svh-3.5rem)] flex-col"
    >
      <div className="page flex flex-1 flex-col justify-center pb-10 pt-14 md:pt-20">
        <p className="label fade flex flex-wrap items-center gap-x-3 gap-y-1 text-muted" style={delay(100)}>
          <span className="text-text">{profile.name}</span>
          <span aria-hidden="true">—</span>
          <span>{profile.role}</span>
          <span aria-hidden="true">—</span>
          <span>{profile.location}</span>
        </p>

        <h1
          id="hero-heading"
          className="mt-8 text-display font-semibold leading-[0.94] tracking-[-0.045em]"
        >
          {hero.headline.map((line, i) => (
            <span key={line} className="rise block" style={delay(400 + i * 140)}>
              {line}
            </span>
          ))}
        </h1>

        <p className="rise mt-8 max-w-[46ch] text-lead text-muted" style={delay(1400)}>
          {hero.subheadline}
        </p>

        <div className="rise mt-10 flex flex-col gap-4 sm:flex-row sm:items-center" style={delay(1650)}>
          <MagneticLink href="#trace" className="btn btn-primary">
            {hero.primaryCta}
            <span aria-hidden="true">↓</span>
          </MagneticLink>
          <a href={profile.links.github} className="btn btn-ghost" target="_blank" rel="noreferrer">
            GitHub
            <span aria-hidden="true">↗</span>
          </a>
          <p className="label flex items-center gap-2.5 text-muted sm:ml-3">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-ok" />
            {profile.availability}
          </p>
        </div>
      </div>

      {/* The request that the rest of the page follows. Decorative: the same
          information is given in text by The Trace section. */}
      <div className="page" aria-hidden="true">
        <div className="flex flex-col items-start">
          <p className="font-mono text-[0.8125rem] leading-none text-text sm:text-sm">
            <span className="typed" style={{ "--chars": requestText.length } as CSSProperties}>
              <span className="text-signal">{hero.request.method}</span> {hero.request.path}
            </span>
            <span className="caret" />
          </p>
          <div className="signal-line ml-[0.3ch] mt-3 h-20 md:h-28" />
        </div>
      </div>
    </section>
  );
}
