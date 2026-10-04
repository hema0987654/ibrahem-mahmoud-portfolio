import { profile } from "@/content/profile";

export function About() {
  const { about } = profile;

  return (
    <section id="about" aria-labelledby="about-heading" className="section rule">
      <div className="page">
        <p className="label flex items-center gap-3 text-muted">
          <span className="text-signal">05</span>
          <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
          <span>About</span>
        </p>
        <h2
          id="about-heading"
          className="mt-5 text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-[1.05] tracking-[-0.03em]"
        >
          The person behind the API.
        </h2>

        <div className="mt-12 grid gap-12 md:mt-16 md:grid-cols-12 md:gap-10">
          <div className="reveal md:col-span-7">
            <p className="text-lead">{about.paragraphs[0]}</p>

            {/* Mobile: the figure sits after the first paragraph */}
            <div className="mt-10 w-[62%] max-w-[260px] md:hidden">
              <Portrait />
            </div>

            <p className="mt-10 text-lead text-muted md:mt-6">{about.paragraphs[1]}</p>

            <dl className="mt-12 border-t border-line">
              {about.facts.map((fact) => (
                <div
                  key={`${fact.label}-${fact.value}`}
                  className="grid gap-1 border-b border-line py-4 sm:grid-cols-[8.5rem_1fr] sm:gap-6"
                >
                  <dt className="label pt-1 text-muted">{fact.label}</dt>
                  <dd>
                    <span className="block text-[1.0625rem] leading-snug">{fact.value}</span>
                    <span className="mt-1 block font-mono text-[0.8125rem] text-muted">{fact.detail}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="reveal hidden md:col-span-4 md:col-start-9 md:block">
            <div className="max-w-[320px] md:ml-auto">
              <Portrait />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Treated as a figure in a technical document, not as a profile picture. */
function Portrait() {
  const { photo } = profile.about;
  return (
    <figure>
      <div className="figure-grain overflow-hidden rounded-sheet border border-line-strong bg-paper-deep">
        <picture>
          <source type="image/avif" srcSet="/about-320.avif 320w, /about-640.avif 640w" sizes="(min-width: 48rem) 320px, 62vw" />
          {/* Pre-processed static asset: fixed crop, two widths, lazy. */}
          <img
            src="/about-640.jpg"
            alt={photo.alt}
            width={640}
            height={800}
            loading="lazy"
            decoding="async"
            className="block aspect-[4/5] w-full object-cover"
          />
        </picture>
      </div>
      <figcaption className="label mt-3 text-muted">{photo.caption}</figcaption>
    </figure>
  );
}
