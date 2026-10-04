import type { CSSProperties } from "react";
import { profile } from "@/content/profile";
import { MagneticLink } from "@/components/ui/MagneticLink";

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

/** The gates POST /invoice passes in StockGuard, in order. Detailed in The Trace. */
const route = ["auth", "roles", "dto", "service", "db", "201"] as const;

export function Hero() {
  const { hero } = profile;
  const requestText = `${hero.request.method} ${hero.request.path}`;

  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="flex flex-col lg:min-h-[calc(100svh-3.5rem)]"
    >
      <div className="page flex flex-1 flex-col pb-0 pt-8 md:pt-12">
        <div className="fade flex flex-wrap items-center justify-between gap-x-8 gap-y-2" style={delay(0)}>
          <p className="label flex flex-wrap items-center gap-x-3 gap-y-1 text-muted">
            <span className="text-text">{profile.name}</span>
            <span aria-hidden="true">—</span>
            <span>{profile.role}</span>
            <span aria-hidden="true">—</span>
            <span>{profile.location}</span>
          </p>
          <p className="label flex items-center gap-2.5 text-muted">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-ok" />
            {profile.availability}
          </p>
        </div>

        {/* The request is the picture. Decorative here: The Trace tells it in text. */}
        <div aria-hidden="true" className="cq mt-10 md:mt-14">
          <p className="hero-request">
            <span className="typed" style={{ "--chars": requestText.length } as CSSProperties}>
              <span className="text-signal">{hero.request.method}</span> {hero.request.path}
            </span>
            <span className="caret" />
          </p>

          <div className="hero-route mt-8 md:mt-12">
            <span className="hero-route-fill" />
            <span className="hero-route-pulse" />
            {route.map((station, i) => (
              <span
                key={station}
                className={`hero-station ${i === 0 ? "is-first" : ""}`}
                style={{ "--i": i } as CSSProperties}
              >
                <i />
                <span className={`label ${i === route.length - 1 ? "text-ok" : "text-muted"}`}>{station}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="mt-14 grid gap-8 pb-12 md:mt-20 lg:mt-16 lg:flex-1 lg:grid-cols-12 lg:content-end lg:gap-10 lg:pb-10">
          <h1
            id="hero-heading"
            className="text-[clamp(2.25rem,5.4vw,5rem)] font-semibold leading-[0.96] tracking-[-0.04em] lg:col-span-7"
          >
            {hero.headline.map((line, i) => (
              <span key={line} className="wipe block" style={delay(120 + i * 140)}>
                {line}{" "}
              </span>
            ))}
          </h1>

          <div className="rise lg:col-span-5 lg:pb-2" style={delay(520)}>
            <p className="max-w-[44ch] text-lead text-muted">{hero.subheadline}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <MagneticLink href="#trace" className="btn btn-primary">
                {hero.primaryCta}
                <span aria-hidden="true">↓</span>
              </MagneticLink>
              <a href={profile.links.github} className="btn btn-ghost" target="_blank" rel="noreferrer">
                GitHub
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* the line leaves the hero and becomes the request path */}
      <div className="page" aria-hidden="true">
        <div className="signal-line ml-[5px] h-14 md:h-20" data-path="start" />
      </div>
    </section>
  );
}
