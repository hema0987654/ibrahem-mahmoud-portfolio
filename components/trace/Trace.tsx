"use client";

import { useEffect, useRef } from "react";
import { trace, traceMeta, type TraceLine } from "@/content/trace";

/** Pinned mode needs room and motion; everything else gets the vertical stepper. */
const PIN_QUERY = "(min-width: 64rem) and (min-height: 43.75rem) and (prefers-reduced-motion: no-preference)";
const HEADER_OFFSET = 56;

const toneClass: Record<NonNullable<TraceLine["tone"]>, string> = {
  ok: "text-[#6fd3a3]",
  warn: "text-[#e6b566]",
  signal: "text-signal-on-ink",
};

export function Trace() {
  const sectionRef = useRef<HTMLElement>(null);
  const inkRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const ink = inkRef.current;
    const stage = stageRef.current;
    const progress = progressRef.current;
    if (!section || !ink || !stage || !progress) return;

    const mq = window.matchMedia(PIN_QUERY);
    let cleanup: (() => void) | undefined;
    let cancelled = false;

    const setActive = (index: number) => {
      section.querySelectorAll<HTMLElement>("[data-step]").forEach((el) => {
        el.dataset.active = String(Number(el.dataset.step) === index);
      });
      section.querySelectorAll<HTMLElement>("[data-rail]").forEach((el) => {
        const i = Number(el.dataset.rail);
        el.dataset.state = i === index ? "active" : i < index ? "done" : "todo";
      });
    };

    const toStepper = () => {
      cleanup?.();
      cleanup = undefined;
      section.dataset.mode = "stepper";
      ink.style.clipPath = "";
      progress.style.transform = "";
    };

    const toPinned = async () => {
      try {
        const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
        if (cancelled || !mq.matches) return;
        gsap.registerPlugin(ScrollTrigger);
        section.dataset.mode = "pinned";
        setActive(0);

        const ctx = gsap.context(() => {
          // Paper → ink: the surface bleeds out from where the request line enters.
          const originX = () => {
            const line = document.querySelector<HTMLElement>(".signal-line");
            return line ? line.getBoundingClientRect().left + 1 : 64;
          };
          ScrollTrigger.create({
            trigger: section,
            start: "top 96%",
            end: "top 28%",
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (self.progress >= 1) {
                ink.style.clipPath = "none";
                return;
              }
              const radius = Math.hypot(window.innerWidth, window.innerHeight) * 1.1 * self.progress;
              ink.style.clipPath = `circle(${radius.toFixed(0)}px at ${originX().toFixed(0)}px 0px)`;
            },
            onLeave: () => {
              ink.style.clipPath = "none";
            },
            onLeaveBack: () => {
              ink.style.clipPath = "circle(0px at 0px 0px)";
            },
          });

          // The request moves through the system as the page scrolls.
          ScrollTrigger.create({
            trigger: stage,
            start: `top top+=${HEADER_OFFSET}`,
            end: () => `+=${Math.round(trace.length * window.innerHeight * 0.55)}`,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const index = Math.min(trace.length - 1, Math.floor(self.progress * trace.length));
              setActive(index);
              progress.style.transform = `scaleY(${self.progress.toFixed(4)})`;
            },
          });
        }, section);

        // Fonts and images can shift the page after first layout.
        const refresh = () => ScrollTrigger.refresh();
        window.addEventListener("load", refresh, { once: true });
        document.fonts?.ready.then(refresh).catch(() => undefined);

        cleanup = () => {
          window.removeEventListener("load", refresh);
          ctx.revert();
        };
      } catch {
        // If the animation code cannot load, the stepper is the full experience.
        toStepper();
      }
    };

    let observer: IntersectionObserver | undefined;
    const sync = () => {
      observer?.disconnect();
      if (!mq.matches) {
        toStepper();
        return;
      }
      section.dataset.mode = "auto";
      // Load GSAP only when the section is within reach.
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            observer?.disconnect();
            void toPinned();
          }
        },
        { rootMargin: "150% 0px" },
      );
      observer.observe(section);
    };

    sync();
    mq.addEventListener("change", sync);

    return () => {
      cancelled = true;
      mq.removeEventListener("change", sync);
      observer?.disconnect();
      cleanup?.();
    };
  }, []);

  const total = String(trace.length).padStart(2, "0");

  return (
    <section ref={sectionRef} id="trace" aria-labelledby="trace-heading" className="trace" data-mode="auto">
      <div ref={inkRef} className="trace-ink bg-ink text-paper">
        <div className="page pb-10 pt-[var(--section-gap)] lg:pb-16">
          <p className="label flex items-center gap-3 text-paper/60">
            <span className="text-signal-on-ink">01</span>
            <span aria-hidden="true" className="h-px w-8 bg-paper/35" />
            <span>The Trace</span>
          </p>
          <h2
            id="trace-heading"
            className="mt-6 max-w-[16ch] text-title font-semibold leading-[1.02] tracking-[-0.03em]"
          >
            {traceMeta.heading}
          </h2>
          <p className="mt-6 max-w-[54ch] text-lead text-paper/70">{traceMeta.intro}</p>
          <p className="label mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-paper/55">
            <a
              href={traceMeta.repo}
              target="_blank"
              rel="noreferrer"
              className="link text-paper hover:!text-signal-on-ink focus-visible:!text-signal-on-ink"
            >
              {traceMeta.repoLabel} ↗
            </a>
            <span>{traceMeta.sampleNote}</span>
          </p>
        </div>

        <div ref={stageRef} className="trace-stage">
          <div className="page trace-grid">
            {/* Rail: where the request is. Visual only; the steps carry the content. */}
            <div className="trace-rail" aria-hidden="true">
              <div className="trace-track" />
              <div ref={progressRef} className="trace-progress" />
              <ul>
                {trace.map((step, i) => (
                  <li key={step.id} data-rail={i} data-state={i === 0 ? "active" : "todo"}>
                    <span className="trace-dot" />
                    <span className="label">{step.rail}</span>
                  </li>
                ))}
              </ul>
            </div>

            <ol className="trace-steps">
              {trace.map((step, i) => (
                <li key={step.id} data-step={i} data-active={i === 0} className="trace-step">
                  <span className="trace-step-dot" aria-hidden="true" />
                  <p className="label flex flex-wrap items-center gap-x-3 gap-y-1 text-paper/55">
                    <span className="text-signal-on-ink">
                      {String(i + 1).padStart(2, "0")}
                      <span className="text-paper/40"> / {total}</span>
                    </span>
                    <span>{step.rail}</span>
                  </p>
                  <h3 className="mt-3 text-[clamp(1.625rem,3vw,2.75rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
                    {step.title}
                  </h3>
                  {step.file ? (
                    <p className="mt-3 break-all font-mono text-[0.8125rem] text-signal-on-ink">{step.file}</p>
                  ) : null}
                  <p className="mt-4 max-w-[60ch] text-base leading-relaxed text-paper/75 lg:text-[1.0625rem]">
                    {step.body}
                  </p>

                  <div className="mt-6 grid gap-4 lg:grid-cols-12 lg:gap-5">
                    <pre className="trace-code lg:col-span-7">
                      <code>{step.code}</code>
                    </pre>
                    <div className="lg:col-span-5">
                      <div className="border border-paper/20">
                        <p className="label flex items-center justify-between gap-3 border-b border-paper/20 px-3 py-2 text-paper/60">
                          <span>{step.stateTitle}</span>
                          <span className="text-paper/40">sample</span>
                        </p>
                        <dl className="px-3 py-2 font-mono text-[0.8125rem] leading-relaxed">
                          {step.state.map((line) => (
                            <div key={line.k} className="flex gap-3 py-0.5">
                              <dt className="shrink-0 text-paper/55">{line.k}</dt>
                              <dd className={`min-w-0 break-words ${line.tone ? toneClass[line.tone] : ""}`}>
                                {line.v}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                      {step.rejects ? (
                        <p className="label mt-3 text-paper/55">
                          Otherwise <span className="text-[#e6b566]">{step.rejects}</span>
                        </p>
                      ) : null}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
