import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { caseStudies, getCaseStudy } from "@/content/case-studies";
import { getSystem, systems } from "@/content/systems";
import { profile } from "@/content/profile";
import { siteUrl } from "@/lib/site";
import { ModuleMap } from "@/components/diagram/ModuleMap";
import { ModuleList } from "@/components/diagram/ModuleList";
import { EndpointList } from "@/components/ui/EndpointList";
import { SiteFooter } from "@/components/ui/SiteFooter";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const system = getSystem(slug);
  const study = getCaseStudy(slug);
  if (!system || !study) return {};
  const title = `${system.name} — case study`;
  return {
    title,
    description: study.lede,
    alternates: { canonical: `/systems/${slug}` },
    openGraph: {
      type: "article",
      url: `/systems/${slug}`,
      title: `${title} — ${profile.name}`,
      description: study.lede,
    },
    twitter: { card: "summary_large_image", title: `${title} — ${profile.name}`, description: study.lede },
  };
}

function SectionLabel({ index, children }: { index: string; children: React.ReactNode }) {
  return (
    <p className="label flex items-center gap-3 text-muted">
      <span className="text-signal">{index}</span>
      <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
      <span>{children}</span>
    </p>
  );
}

export default async function CaseStudyPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const system = getSystem(slug);
  const study = getCaseStudy(slug);
  if (!system || !study) notFound();

  const position = systems.findIndex((s) => s.slug === slug);
  const next = systems[(position + 1) % systems.length] ?? system;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareSourceCode",
      name: system.name,
      description: study.lede,
      codeRepository: system.repo,
      programmingLanguage: "TypeScript",
      runtimePlatform: "Node.js",
      author: { "@type": "Person", name: profile.name, url: siteUrl },
      url: `${siteUrl}/systems/${slug}`,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "Systems", item: `${siteUrl}/#systems` },
        { "@type": "ListItem", position: 3, name: system.name, item: `${siteUrl}/systems/${slug}` },
      ],
    },
  ];

  return (
    <article aria-labelledby="case-heading">
      {/* Route feedback: the page answers like an API would. Decorative. */}
      <div className="route-chip" aria-hidden="true">
        <span className="text-signal">GET</span> /systems/{slug}
        <span className="ml-3 text-ok">200 OK</span>
      </div>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <header className="page pb-16 pt-12 md:pb-24 md:pt-20">
        <nav aria-label="Breadcrumb">
          <a href="/#systems" className="label link py-2 text-muted">
            ← All systems
          </a>
        </nav>

        <p className="label rise mt-10 flex items-center gap-3 text-muted">
          <span className="text-signal">Case study {system.index}</span>
          <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
          <time dateTime={system.dateTime}>{system.date}</time>
        </p>
        <h1
          id="case-heading"
          className="rise mt-6 text-display font-semibold leading-[0.94] tracking-[-0.045em]"
          style={{ "--d": "120ms" } as React.CSSProperties}
        >
          {system.name}
        </h1>
        <p className="rise mt-8 max-w-[38ch] text-[clamp(1.25rem,2.4vw,2rem)] leading-snug tracking-[-0.01em]" style={{ "--d": "260ms" } as React.CSSProperties}>
          {study.lede}
        </p>

        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-10">
          <dl className="border-t border-line lg:col-span-7">
            {study.spec.map((row) => (
              <div key={row.k} className="grid gap-1 border-b border-line py-3 sm:grid-cols-[8.5rem_1fr] sm:gap-6">
                <dt className="label pt-0.5 text-muted">{row.k}</dt>
                <dd className="font-mono text-[0.8125rem] leading-relaxed">{row.v}</dd>
              </div>
            ))}
          </dl>
          <div className="flex flex-col items-start gap-4 lg:col-span-4 lg:col-start-9">
            <a href={system.repo} className="btn btn-primary" target="_blank" rel="noreferrer">
              Read the code
              <span aria-hidden="true">↗</span>
            </a>
            {system.live ? (
              <a href={system.live} className="btn btn-ghost" target="_blank" rel="noreferrer">
                Live API
                <span aria-hidden="true">↗</span>
              </a>
            ) : null}
            <p className="label text-muted">{system.repo.replace("https://", "")}</p>
          </div>
        </div>
      </header>

      {/* ── 01 Problem ───────────────────────────────────────── */}
      <section aria-labelledby="problem-heading" className="section rule">
        <div className="page grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-3">
            <SectionLabel index="01">Problem</SectionLabel>
            <h2 id="problem-heading" className="sr-only">
              Problem
            </h2>
          </div>
          <div className="reveal lg:col-span-9">
            <p className="max-w-[30ch] text-[clamp(1.5rem,3.2vw,2.75rem)] font-medium leading-[1.12] tracking-[-0.025em] sm:max-w-[34ch]">
              {system.problem}
            </p>
            <div className="mt-10 flex max-w-[62ch] flex-col gap-5 text-lead text-muted">
              {study.problem.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 02 Architecture (Ink) ────────────────────────────── */}
      <section aria-labelledby="architecture-heading" className="trace-ink bg-ink text-paper">
        <div className="page section">
          <p className="label flex items-center gap-3 text-paper/60">
            <span className="text-signal-on-ink">02</span>
            <span aria-hidden="true" className="h-px w-8 bg-paper/35" />
            <span>Architecture</span>
          </p>
          <h2
            id="architecture-heading"
            className="mt-6 max-w-[18ch] text-title font-semibold leading-[1.02] tracking-[-0.03em]"
          >
            Inside {system.name}.
          </h2>
          <p className="mt-6 max-w-[58ch] text-lead text-paper/70">{study.architectureIntro}</p>

          <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="hidden md:block lg:col-span-7">
              <ModuleMap system={system} tone="ink" />
            </div>
            <div className="lg:col-span-5">
              <ModuleList system={system} tone="ink" />
            </div>
          </div>

          <div className="mt-12 border-t border-paper/15 pt-6">
            <p className="label mb-4 text-paper/60">Selected routes</p>
            <EndpointList endpoints={system.endpoints} tone="ink" label={`${system.name} endpoints`} />
          </div>
        </div>
      </section>

      {/* ── 03 Key decision ──────────────────────────────────── */}
      <section aria-labelledby="decision-heading" className="section">
        <div className="page grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-3">
            <SectionLabel index="03">Key decision</SectionLabel>
          </div>
          <div className="reveal lg:col-span-9">
            <div className="sheet">
              <p className="label flex items-center justify-between gap-4 border-b border-line px-5 py-3 text-muted md:px-8">
                <span>Decision record</span>
                <span>{system.name}</span>
              </p>
              <div className="px-5 py-8 md:px-8 md:py-10">
                <h2
                  id="decision-heading"
                  className="max-w-[22ch] text-[clamp(1.75rem,3.4vw,3rem)] font-semibold leading-[1.05] tracking-[-0.03em]"
                >
                  {study.decision.title}
                </h2>
                <dl className="mt-10 border-t border-line">
                  {(
                    [
                      ["Context", study.decision.context],
                      ["Decision", study.decision.decision],
                      ["Consequence", study.decision.consequence],
                    ] as const
                  ).map(([label, text]) => (
                    <div key={label} className="grid gap-2 border-b border-line py-5 md:grid-cols-[9rem_1fr] md:gap-8">
                      <dt className={`label pt-1 ${label === "Decision" ? "text-signal" : "text-muted"}`}>{label}</dt>
                      <dd className="max-w-[62ch] text-[1.0625rem] leading-relaxed">{text}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 04 Implementation ────────────────────────────────── */}
      <section aria-labelledby="implementation-heading" className="section rule">
        <div className="page grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-3">
            <SectionLabel index="04">Implementation</SectionLabel>
          </div>
          <div className="reveal lg:col-span-9">
            <h2
              id="implementation-heading"
              className="max-w-[22ch] text-[clamp(1.75rem,3.4vw,3rem)] font-semibold leading-[1.05] tracking-[-0.03em]"
            >
              {study.implementation.title}
            </h2>
            <p className="mt-6 max-w-[62ch] text-lead text-muted">{study.implementation.intro}</p>

            <div className="mt-10 grid gap-6 xl:grid-cols-[minmax(0,1fr)_16rem] xl:gap-8">
              <figure className="min-w-0">
                <figcaption className="label flex items-center justify-between gap-4 border border-b-0 border-line-strong px-4 py-2.5 text-muted">
                  <span className="break-all normal-case tracking-normal text-signal">{study.implementation.file}</span>
                  <span className="shrink-0">Excerpt</span>
                </figcaption>
                <pre className="code-paper">
                  <code>{study.implementation.code}</code>
                </pre>
              </figure>
              <ol className="flex flex-col gap-5 xl:pt-10" aria-label="Notes on the code">
                {study.implementation.annotations.map((annotation, i) => (
                  <li key={annotation.label} className="border-l-2 border-signal pl-4">
                    <p className="label text-text">
                      <span className="text-signal">{String.fromCharCode(97 + i)}</span> · {annotation.label}
                    </p>
                    <p className="mt-1.5 text-base leading-snug text-muted">{annotation.note}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* ── 05 Challenges ────────────────────────────────────── */}
      <section aria-labelledby="challenges-heading" className="section rule">
        <div className="page grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-3">
            <SectionLabel index="05">Challenges</SectionLabel>
            <h2 id="challenges-heading" className="sr-only">
              Challenges
            </h2>
          </div>
          <ol className="reveal border-t border-line lg:col-span-9">
            {study.challenges.map((challenge, i) => (
              <li key={challenge.problem} className="grid gap-3 border-b border-line py-6 md:grid-cols-[2.5rem_1fr_1.2fr] md:gap-8">
                <span className="label pt-1.5 text-signal" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-xl font-semibold leading-snug tracking-[-0.015em] md:text-2xl">
                  {challenge.problem}
                </h3>
                <div>
                  <p className="text-[1.0625rem] leading-relaxed text-muted">{challenge.handling}</p>
                  <p className="mt-2 break-all font-mono text-xs text-muted">{challenge.file}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── 06 Outcome ───────────────────────────────────────── */}
      <section aria-labelledby="outcome-heading" className="section rule">
        <div className="page grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-3">
            <SectionLabel index="06">Outcome</SectionLabel>
          </div>
          <div className="reveal lg:col-span-9">
            <h2
              id="outcome-heading"
              className="max-w-[20ch] text-[clamp(1.75rem,3.4vw,3rem)] font-semibold leading-[1.05] tracking-[-0.03em]"
            >
              What is in the repository.
            </h2>
            <ul className="mt-10 border-t border-line">
              {study.outcome.map((item) => (
                <li key={item} className="flex gap-4 border-b border-line py-4 text-[1.0625rem] leading-relaxed">
                  <span aria-hidden="true" className="pt-0.5 font-mono text-sm text-ok">
                    ✓
                  </span>
                  <span className="max-w-[64ch]">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── 07 What I'd improve ──────────────────────────────── */}
      <section aria-labelledby="improve-heading" className="section rule">
        <div className="page grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-3">
            <SectionLabel index="07">Next</SectionLabel>
          </div>
          <div className="reveal lg:col-span-9">
            <h2
              id="improve-heading"
              className="max-w-[20ch] text-[clamp(1.75rem,3.4vw,3rem)] font-semibold leading-[1.05] tracking-[-0.03em]"
            >
              What I’d improve today.
            </h2>
            <p className="mt-6 max-w-[58ch] text-lead text-muted">
              Reading this code again, these are the changes I would make first.
            </p>
            <ol className="mt-10 grid gap-x-10 border-t border-line md:grid-cols-2">
              {study.improve.map((item, i) => (
                <li key={item.title} className="border-b border-line py-6">
                  <p className="label text-warn">
                    <span aria-hidden="true">— </span>
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold leading-snug tracking-[-0.015em]">{item.title}</h3>
                  <p className="mt-2 max-w-[48ch] text-base leading-relaxed text-muted">{item.detail}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ── Next system ──────────────────────────────────────── */}
      <nav aria-label="Next case study" className="rule">
        <div className="page">
          <a href={`/systems/${next.slug}`} className="next-link group block py-14 md:py-20">
            <span className="label text-muted">Next system · {next.index}</span>
            <span className="mt-4 flex items-baseline justify-between gap-6">
              <span className="text-[clamp(2.25rem,8vw,6.5rem)] font-semibold leading-[0.95] tracking-[-0.045em] transition-colors duration-150 group-hover:text-signal group-focus-visible:text-signal">
                {next.name}
              </span>
              <span
                aria-hidden="true"
                className="font-mono text-2xl text-signal transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-2 md:text-4xl"
              >
                →
              </span>
            </span>
            <span className="mt-4 block max-w-[48ch] text-lead text-muted">{next.tagline}</span>
          </a>
        </div>
      </nav>
      <div className="page">
        <SiteFooter />
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </article>
  );
}
