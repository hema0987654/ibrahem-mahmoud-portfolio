import { profile } from "@/content/profile";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { MagneticLink } from "@/components/ui/MagneticLink";

export function Contact() {
  const year = new Date().getFullYear();

  return (
    <section id="contact" aria-labelledby="contact-heading" className="rule pt-[var(--section-gap)]">
      <div className="page">
        {/* the request completes here */}
        <div aria-hidden="true" className="reveal flex flex-col items-start">
          <div className="ml-[5px] h-16 w-0.5 bg-signal md:h-24" />
          <p className="mt-3 inline-flex items-center gap-2.5 border border-ok/40 px-3 py-1.5 font-mono text-[0.8125rem] text-ok">
            <span className="h-1.5 w-1.5 rounded-full bg-ok" />
            201 Created
          </p>
        </div>

        <div className="reveal mt-12">
          <p className="label flex items-center gap-3 text-muted">
            <span className="text-signal">06</span>
            <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
            <span>Contact</span>
          </p>
          <h2
            id="contact-heading"
            className="mt-6 max-w-[14ch] text-title font-semibold leading-[1.02] tracking-[-0.03em]"
          >
            {profile.contact.heading}
          </h2>
        </div>

        <div className="reveal mt-12 md:mt-16">
          <a
            href={`mailto:${profile.email}`}
            className="link block w-fit max-w-full break-all text-[clamp(1.25rem,4.4vw,3.25rem)] font-medium leading-tight tracking-[-0.03em]"
          >
            {profile.email}
          </a>
          <p className="mt-4 text-muted">{profile.contact.note}</p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <MagneticLink href={`mailto:${profile.email}`} className="btn btn-primary">
              Write to me
              <span aria-hidden="true">→</span>
            </MagneticLink>
            <CopyEmail email={profile.email} />
          </div>
        </div>

        <footer className="mt-24 flex flex-col gap-6 border-t border-line py-8 sm:flex-row sm:items-center sm:justify-between md:mt-32">
          <ul className="flex gap-7">
            <li>
              <a href={profile.links.github} className="label link py-2" target="_blank" rel="noreferrer">
                GitHub ↗
              </a>
            </li>
            <li>
              <a href={profile.links.linkedin} className="label link py-2" target="_blank" rel="noreferrer">
                LinkedIn ↗
              </a>
            </li>
          </ul>
          <p className="label text-muted">
            © {year} {profile.name} · {profile.location}
          </p>
        </footer>
      </div>
    </section>
  );
}
