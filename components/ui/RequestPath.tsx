"use client";

import { useEffect, useRef } from "react";
import { MOTION_QUERY, loadGsap } from "@/lib/motion";

/**
 * One line through the page: it leaves the hero, runs down the margin, becomes
 * the Evolution timeline and ends where the Contact surface begins. Drawn with
 * scroll on wide screens only. Dark surfaces sit above it and carry their own
 * margin line, so the route reads as continuous.
 */
export function RequestPath() {
  const svgRef = useRef<SVGSVGElement>(null);
  const baseRef = useRef<SVGPathElement>(null);
  const liveRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const base = baseRef.current;
    const live = liveRef.current;
    const host = svg?.parentElement;
    if (!svg || !base || !live || !host) return;

    const mq = window.matchMedia(MOTION_QUERY);
    let cancelled = false;
    let teardown: (() => void) | undefined;

    const start = async () => {
      const { ScrollTrigger } = await loadGsap();
      if (cancelled || !mq.matches) return;

      let total = 0;
      /** [y, length] samples: how much of the path lies above a given y. */
      let samples: [number, number][] = [];

      const build = () => {
        const hostRect = host.getBoundingClientRect();
        const rel = (el: Element) => {
          const r = el.getBoundingClientRect();
          return { left: r.left - hostRect.left, top: r.top - hostRect.top, bottom: r.bottom - hostRect.top, width: r.width };
        };
        const startEl = host.querySelector('[data-path="start"]');
        const nodes = Array.from(host.querySelectorAll("[data-path-node]"));
        const endEl = host.querySelector('[data-path="end"]');
        const page = host.querySelector(".page");
        const firstNode = nodes[0];
        const lastNode = nodes[nodes.length - 1];
        if (!startEl || !firstNode || !lastNode || !endEl || !page) return false;

        const gutter = parseFloat(getComputedStyle(page).paddingLeft) || 64;
        const marginX = rel(page).left + gutter / 2 + 1;
        const s = rel(startEl);
        const a = rel(firstNode);
        const b = rel(lastNode);
        const e = rel(endEl);
        const startX = s.left + s.width / 2;
        const timelineX = a.left + a.width / 2;
        const r = 14;

        // orthogonal route with rounded corners
        const d = [
          `M${startX},${s.bottom}`,
          `V${s.bottom + 40 - r}`,
          `Q${startX},${s.bottom + 40} ${startX - r},${s.bottom + 40}`,
          `H${marginX + r}`,
          `Q${marginX},${s.bottom + 40} ${marginX},${s.bottom + 40 + r}`,
          `V${a.top - 72 - r}`,
          `Q${marginX},${a.top - 72} ${marginX + r},${a.top - 72}`,
          `H${timelineX - r}`,
          `Q${timelineX},${a.top - 72} ${timelineX},${a.top - 72 + r}`,
          `V${b.bottom + 72 - r}`,
          `Q${timelineX},${b.bottom + 72} ${timelineX - r},${b.bottom + 72}`,
          `H${marginX + r}`,
          `Q${marginX},${b.bottom + 72} ${marginX},${b.bottom + 72 + r}`,
          `V${e.top}`,
        ].join(" ");

        svg.setAttribute("viewBox", `0 0 ${hostRect.width} ${hostRect.height}`);
        base.setAttribute("d", d);
        live.setAttribute("d", d);
        total = live.getTotalLength();
        live.style.strokeDasharray = `${total}`;

        samples = [];
        const count = 240;
        let maxY = -Infinity;
        for (let i = 0; i <= count; i++) {
          const length = (total * i) / count;
          maxY = Math.max(maxY, live.getPointAtLength(length).y);
          samples.push([maxY, length]);
        }
        return true;
      };

      const lengthAt = (y: number) => {
        if (samples.length === 0) return 0;
        let lo = 0;
        let hi = samples.length - 1;
        if (y <= (samples[0]?.[0] ?? 0)) return 0;
        if (y >= (samples[hi]?.[0] ?? 0)) return total;
        while (hi - lo > 1) {
          const mid = (lo + hi) >> 1;
          if ((samples[mid]?.[0] ?? 0) <= y) lo = mid;
          else hi = mid;
        }
        return samples[hi]?.[1] ?? total;
      };

      const draw = () => {
        const y = window.scrollY + window.innerHeight * 0.62 - (host.getBoundingClientRect().top + window.scrollY);
        live.style.strokeDashoffset = `${Math.max(0, total - lengthAt(y))}`;
      };

      if (!build()) return;
      svg.style.display = "block";
      document.documentElement.classList.add("has-path");
      draw();

      const trigger = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: draw,
        onRefresh: () => {
          build();
          draw();
        },
      });

      teardown = () => {
        trigger.kill();
        svg.style.display = "none";
        document.documentElement.classList.remove("has-path");
      };
    };

    const sync = () => {
      teardown?.();
      teardown = undefined;
      if (mq.matches) void start();
    };
    sync();
    mq.addEventListener("change", sync);

    return () => {
      cancelled = true;
      mq.removeEventListener("change", sync);
      teardown?.();
    };
  }, []);

  return (
    <svg ref={svgRef} className="request-path" aria-hidden="true" focusable="false" style={{ display: "none" }}>
      <path ref={baseRef} className="path-base" />
      <path ref={liveRef} className="path-live" />
    </svg>
  );
}
