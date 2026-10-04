"use client";

import { useEffect, useRef } from "react";
import { trace, traceMeta, type TraceLine } from "@/content/trace";
import { clamp01, loadGsap, smooth } from "@/lib/motion";

/** The pinned scene needs room and motion; everything else gets the vertical stepper. */
const PIN_QUERY = "(min-width: 64rem) and (min-height: 43.75rem) and (prefers-reduced-motion: no-preference)";
const HEADER_OFFSET = 56;
/** Scroll distance per station, in viewport heights. */
const STEP_LENGTH = 0.8;

const RESPONSE_INDEX = trace.findIndex((step) => step.id === "response");
const JOB_INDEX = trace.findIndex((step) => step.id === "alert");

const toneClass: Record<NonNullable<TraceLine["tone"]>, string> = {
  ok: "text-ok-on-ink",
  warn: "text-warn-on-ink",
  signal: "text-signal-on-ink",
};

const pad = (value: number) => String(value).padStart(2, "0");

export function Trace() {
  const sectionRef = useRef<HTMLElement>(null);
  const inkRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const ink = inkRef.current;
    const stage = stageRef.current;
    if (!section || !ink || !stage) return;

    const mq = window.matchMedia(PIN_QUERY);
    let cleanup: (() => void) | undefined;
    let cancelled = false;

    const q = <T extends Element>(selector: string) => section.querySelector<T & HTMLElement>(selector);
    const all = (selector: string) => Array.from(section.querySelectorAll<HTMLElement>(selector));

    const resetScene = () => {
      ink.style.clipPath = "";
      all(".code-line, .state-row").forEach((el) => {
        delete el.dataset.on;
        delete el.dataset.cur;
      });
      all("[data-roll]").forEach((el) => {
        el.textContent = el.dataset.final ?? el.textContent;
      });
    };

    const toStepper = () => {
      cleanup?.();
      cleanup = undefined;
      section.dataset.mode = "stepper";
      resetScene();
    };

    const toPinned = async () => {
      try {
        const { gsap, ScrollTrigger } = await loadGsap();
        if (cancelled || !mq.matches) return;
        section.dataset.mode = "pinned";

        const steps = all("[data-step]");
        const stations = all("[data-station]");
        const packet = q<HTMLElement>(".trace-packet");
        const fill = q<HTMLElement>(".trace-track-fill");
        const numeral = q<HTMLElement>(".trace-numeral");
        const numeralText = q<HTMLElement>(".trace-numeral-text");
        const parts = steps.map((step) => ({
          lines: Array.from(step.querySelectorAll<HTMLElement>(".code-line")),
          rows: Array.from(step.querySelectorAll<HTMLElement>(".state-row")),
          roll: step.querySelector<HTMLElement>("[data-roll]"),
        }));
        const n = steps.length;
        const last = { index: -1, lines: -1, rows: -1, roll: "", station: -2, kind: "" };

        const render = (progress: number) => {
          const f = progress * n;
          const index = Math.min(n - 1, Math.floor(f));
          const t = Math.min(1, f - index);

          // the request travels to the next gate during the first part of each step
          const travel = index === 0 ? 1 : smooth(t / 0.28);
          const position = index === 0 ? 0 : (index - 1 + travel) / (n - 1);
          if (packet) packet.style.left = `${(position * 100).toFixed(3)}%`;
          if (fill) fill.style.transform = `scaleX(${position.toFixed(4)})`;

          const arrived = travel >= 1 ? index : index - 1;
          if (arrived !== last.station) {
            last.station = arrived;
            stations.forEach((el, i) => {
              el.dataset.state = i === arrived ? "active" : i < arrived ? "done" : "todo";
            });
          }

          const kind = index === RESPONSE_INDEX ? "response" : index === JOB_INDEX ? "job" : "request";
          if (packet && kind !== last.kind) {
            last.kind = kind;
            packet.dataset.kind = kind;
            packet.textContent =
              kind === "response" ? "201 Created" : kind === "job" ? "cron · every 12h" : "POST /invoice";
          }

          if (index !== last.index) {
            last.index = index;
            last.lines = -1;
            last.rows = -1;
            steps.forEach((el, i) => {
              el.dataset.active = String(i === index);
              el.dataset.passed = String(i < index);
            });
            if (numeralText) numeralText.textContent = index === RESPONSE_INDEX ? "201" : pad(index + 1);
          }
          if (numeral) numeral.dataset.climax = String(index === RESPONSE_INDEX && t > 0.3);

          const part = parts[index];
          if (!part) return;

          // code is read line by line, then the state settles row by row
          const lineCount = Math.round(clamp01((t - 0.24) / 0.42) * part.lines.length);
          if (lineCount !== last.lines) {
            last.lines = lineCount;
            part.lines.forEach((el, i) => {
              el.dataset.on = String(i < lineCount);
              el.dataset.cur = String(i === lineCount - 1 && lineCount < part.lines.length);
            });
          }
          const rowCount = Math.ceil(clamp01((t - 0.5) / 0.34) * part.rows.length);
          if (rowCount !== last.rows) {
            last.rows = rowCount;
            part.rows.forEach((el, i) => {
              el.dataset.on = String(i < rowCount);
            });
          }
          if (part.roll) {
            const from = Number(part.roll.dataset.from);
            const to = Number(part.roll.dataset.to);
            const value = Math.round(from + (to - from) * clamp01((t - 0.5) / 0.3));
            const text = `${from} → ${value}`;
            if (text !== last.roll) {
              last.roll = text;
              part.roll.textContent = text;
            }
          }
        };

        render(0);

        const originX = () => {
          const line = document.querySelector<HTMLElement>('[data-path="start"]');
          return line ? line.getBoundingClientRect().left + 1 : 64;
        };
        const reach = () => Math.hypot(window.innerWidth, window.innerHeight) * 1.1;

        const ctx = gsap.context(() => {
          // Paper → Ink: the surface bleeds out from where the request line enters.
          ScrollTrigger.create({
            trigger: section,
            start: "top 96%",
            end: "top 26%",
            onUpdate: (self) => {
              ink.style.clipPath =
                self.progress >= 1
                  ? "none"
                  : `circle(${(reach() * self.progress).toFixed(0)}px at ${originX().toFixed(0)}px 0px)`;
            },
            onLeave: () => {
              ink.style.clipPath = "none";
            },
            onLeaveBack: () => {
              ink.style.clipPath = "circle(0px at 0px 0px)";
            },
          });

          // The scene: the request moves through the system as the page scrolls.
          ScrollTrigger.create({
            trigger: stage,
            start: `top top+=${HEADER_OFFSET}`,
            end: () => `+=${Math.round(n * window.innerHeight * STEP_LENGTH)}`,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => render(self.progress),
          });

          // Ink → Paper: once the response is out, the surface drains back to the line.
          ScrollTrigger.create({
            trigger: section,
            start: "bottom 92%",
            end: "bottom 30%",
            onUpdate: (self) => {
              ink.style.clipPath =
                self.progress <= 0
                  ? "none"
                  : `circle(${(reach() * (1 - self.progress)).toFixed(0)}px at ${originX().toFixed(0)}px 100%)`;
            },
            onLeaveBack: () => {
              ink.style.clipPath = "none";
            },
          });
        }, section);

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

  const total = pad(trace.length);

  return (
    <section ref={sectionRef} id="trace" aria-labelledby="trace-heading" className="trace" data-mode="auto">
      <div ref={inkRef} className="trace-ink surface-ink">
        <span className="margin-line" aria-hidden="true" />
        <div className="page pb-10 pt-[var(--section-gap)] lg:pb-14">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
            <div className="lg:col-span-8">
              <p className="label flex items-center gap-3 text-paper/60">
                <span className="text-signal-on-ink">01</span>
                <span aria-hidden="true" className="h-px w-8 bg-paper/35" />
                <span>The Trace</span>
              </p>
              <h2
                id="trace-heading"
                className="reveal-wipe mt-6 max-w-[14ch] text-[clamp(2.5rem,7vw,6.5rem)] font-semibold leading-[0.95] tracking-[-0.04em]"
              >
                {traceMeta.heading}
              </h2>
            </div>
            <div className="lg:col-span-4 lg:pb-3">
              <p className="max-w-[44ch] text-lead text-paper/70">{traceMeta.intro}</p>
              <p className="label mt-5 flex flex-col gap-2 text-paper/55">
                <a href={traceMeta.repo} target="_blank" rel="noreferrer" className="link w-fit text-paper">
                  {traceMeta.repoLabel} ↗
                </a>
                <span>{traceMeta.sampleNote}</span>
              </p>
            </div>
          </div>
        </div>

        <div ref={stageRef} className="trace-stage">
          {/* Very large step numeral; becomes the status code at the high point. Visual only. */}
          <div className="trace-numeral" aria-hidden="true" data-climax="false">
            <small>Created</small>
            <span className="trace-numeral-text">01</span>
          </div>

          <div className="page trace-grid">
            {/* The track: where the request is. Visual only; the steps carry the content. */}
            <div className="trace-track" aria-hidden="true">
              <div className="trace-track-line" />
              <div className="trace-track-fill" />
              <div className="trace-packet" data-kind="request">
                POST /invoice
              </div>
              {trace.map((step, i) => (
                <div
                  key={step.id}
                  className="trace-station"
                  data-station={i}
                  data-state={i === 0 ? "active" : "todo"}
                  style={{ left: `${(i / (trace.length - 1)) * 100}%` }}
                >
                  <i />
                  <span className="label">{step.rail}</span>
                  {step.rejects ? <span className="trace-reject">↳ {step.rejects.split(" ")[0]}</span> : null}
                </div>
              ))}
            </div>

            <ol className="trace-steps">
              {trace.map((step, i) => (
                <li key={step.id} data-step={i} data-id={step.id} data-active={i === 0} className="trace-step">
                  <span className="trace-step-dot" aria-hidden="true" />
                  <div className="grid gap-6 lg:grid-cols-12 lg:items-center lg:gap-10">
                    <div className="lg:col-span-7">
                      <p className="label flex flex-wrap items-center gap-x-3 gap-y-1 text-paper/55">
                        <span className="text-signal-on-ink">
                          {pad(i + 1)}
                          <span className="text-paper/55"> / {total}</span>
                        </span>
                        <span>{step.rail}</span>
                      </p>
                      <h3 className="mt-3 text-[clamp(1.75rem,3.6vw,3.5rem)] font-semibold leading-[1.02] tracking-[-0.035em]">
                        {step.title}
                      </h3>
                      {step.file ? (
                        <p className="mt-3 break-all font-mono text-[0.8125rem] text-signal-on-ink">{step.file}</p>
                      ) : null}
                      <p className="mt-4 max-w-[58ch] text-base leading-relaxed text-paper/75 lg:text-[1.0625rem]">
                        {step.body}
                      </p>
                      <pre className="trace-code mt-6">
                        <code>
                          {step.code.split("\n").map((line, lineIndex) => (
                            <span key={lineIndex} className="code-line">
                              {line.length > 0 ? line : " "}
                              {"\n"}
                            </span>
                          ))}
                        </code>
                      </pre>
                    </div>

                    <div className="trace-side lg:col-span-5">
                      <div className="border border-paper/20 bg-ink">
                        <p className="label flex items-center justify-between gap-3 border-b border-paper/20 px-3 py-2 text-paper/60">
                          <span>{step.stateTitle}</span>
                          <span className="text-paper/55">sample</span>
                        </p>
                        <dl className="px-3 py-2.5 font-mono text-[0.8125rem] leading-relaxed lg:text-[0.9375rem]">
                          {step.state.map((line) => (
                            <div key={line.k} className="state-row flex gap-3 py-0.5">
                              <dt className="shrink-0 text-paper/75">{line.k}</dt>
                              <dd className={`min-w-0 break-words ${line.tone ? toneClass[line.tone] : ""}`}>
                                {line.roll ? (
                                  <span
                                    data-roll=""
                                    data-from={line.roll.from}
                                    data-to={line.roll.to}
                                    data-final={line.v}
                                  >
                                    {line.v}
                                  </span>
                                ) : (
                                  line.v
                                )}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                      {step.rejects ? (
                        <p className="label mt-3 text-paper/55">
                          Otherwise <span className="text-warn-on-ink">{step.rejects}</span>
                        </p>
                      ) : null}
                    </div>
                  </div>

                  {step.id === "response" ? (
                    <p className="trace-result" aria-hidden="true">
                      201
                      <small>Created</small>
                    </p>
                  ) : null}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
