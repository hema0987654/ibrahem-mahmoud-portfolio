import { profile } from "@/content/profile";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { MagneticLink } from "@/components/ui/MagneticLink";
import { SiteFooter } from "@/components/ui/SiteFooter";

/** The request completes: an Ink surface, the status code in Signal, and the address. */
export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-heading" className="surface-ink" data-path="end">
      <span className="margin-line" aria-hidden="true" />

      <div className="page flex min-h-[100svh] flex-col pt-14 md:pt-20">
        <div className="label flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-b border-paper/35 pb-4">
          <p className="flex items-center gap-3">
            <span>06</span>
            <span aria-hidden="true" className="h-px w-8 bg-paper/50" />
            <span>Response</span>
          </p>
          <p aria-hidden="true" className="text-paper/85">
            Request complete
          </p>
        </div>

        {/* the status code is the picture; the heading says the same in words */}
        <div aria-hidden="true" className="cq mt-10 md:mt-14">
          <div className="flex flex-wrap items-end gap-x-[4cqw] gap-y-3">
            <p className="finale-code reveal-wipe text-signal-on-ink">201</p>
            <p className="pb-[0.2em] font-mono text-[clamp(1.25rem,5.2cqw,5rem)] font-medium uppercase leading-none tracking-[-0.02em]">
              Created
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-8 md:mt-16 lg:grid-cols-12 lg:gap-10">
          <h2
            id="contact-heading"
            className="text-[clamp(1.75rem,3.4vw,3rem)] font-semibold leading-[1.02] tracking-[-0.03em] lg:col-span-5"
          >
            {profile.contact.heading}
          </h2>
          <p className="max-w-[40ch] text-lead text-paper/85 lg:col-span-5 lg:col-start-8 lg:pt-2">
            {profile.contact.note}
          </p>
        </div>

        <div className="cq mt-10 md:mt-14">
          <a href={`mailto:${profile.email}`} className="finale-email link block w-fit max-w-full">
            {profile.email}
          </a>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <MagneticLink href={`mailto:${profile.email}`} className="btn btn-primary">
              Write to me
              <span aria-hidden="true">→</span>
            </MagneticLink>
            <CopyEmail email={profile.email} />
          </div>
        </div>

        <div className="mt-auto pt-20 md:pt-28">
          <SiteFooter inverted />
        </div>
      </div>
    </section>
  );
}
