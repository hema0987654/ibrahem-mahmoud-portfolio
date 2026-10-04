"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { System } from "@/content/systems";
import { MAP, layoutSystem } from "@/lib/diagram";
import { canAnimate, loadGsap } from "@/lib/motion";

type Tone = "paper" | "ink" | "signal";

type Props = {
  system: System;
  tone?: Tone;
  /** When true, requests flow along the store links as the map scrolls through the viewport. */
  flow?: boolean;
};

/**
 * Architecture map drawn from data. The SVG carries a text summary; the full
 * per-module notes are always available as text in <ModuleList>.
 */
export function ModuleMap({ system, tone = "paper", flow = false }: Props) {
  const layout = useMemo(() => layoutSystem(system), [system]);
  const [active, setActive] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!flow || !svg || !canAnimate()) return;
    let cancelled = false;
    let revert: (() => void) | undefined;

    void loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (cancelled) return;
      const edges = Array.from(svg.querySelectorAll<SVGPathElement>("[data-flow-edge]"));
      const dots = Array.from(svg.querySelectorAll<SVGCircleElement>("[data-flow-dot]"));
      const lengths = edges.map((edge) => edge.getTotalLength());

      const ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: svg,
          start: "top 88%",
          end: "bottom 12%",
          onUpdate: (self) => {
            edges.forEach((edge, i) => {
              const dot = dots[i];
              const length = lengths[i];
              if (!dot || !length) return;
              // each link carries a request in turn; two passes over the scroll range
              const phase = self.progress * 2.4 - i * 0.07;
              const local = phase - Math.floor(phase);
              const visible = phase > 0 && phase < 2.4 && local > 0.02 && local < 0.98;
              if (!visible) {
                dot.style.opacity = "0";
                return;
              }
              const point = edge.getPointAtLength(local * length);
              dot.setAttribute("cx", point.x.toFixed(1));
              dot.setAttribute("cy", point.y.toFixed(1));
              dot.style.opacity = "1";
            });
          },
          onLeave: () => dots.forEach((dot) => (dot.style.opacity = "0")),
          onLeaveBack: () => dots.forEach((dot) => (dot.style.opacity = "0")),
        });
      }, svg);
      revert = () => ctx.revert();
    });

    return () => {
      cancelled = true;
      revert?.();
    };
  }, [flow, system]);

  const activeModule = system.modules.find((m) => m.id === active);
  const related = new Set<string>();
  if (activeModule) {
    related.add(activeModule.id);
    activeModule.stores.forEach((s) => related.add(s));
    (activeModule.uses ?? []).forEach((u) => related.add(u));
  }
  const dim = (id: string) => (active && !related.has(id) ? 0.3 : 1);
  const edgeStyle = (from: string) =>
    active === from
      ? { stroke: "var(--map-accent)", strokeOpacity: 1, strokeWidth: 1.75 }
      : active
        ? { strokeOpacity: 0.1 }
        : undefined;

  return (
    <div className="module-map" data-tone={tone}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${MAP.width} ${layout.height}`}
        className="block h-auto w-full"
        role="img"
        aria-label={`Architecture map of ${system.name}. Modules: ${system.modules.map((m) => m.label).join(", ")}. Connected to: ${system.stores.map((st) => st.label).join(", ")}.`}
        focusable="false"
        onMouseLeave={() => setActive(null)}
      >
        {/* entry → modules */}
        <path d={layout.entryLine.d} className="map-line draw" pathLength={1} />
        <path d={layout.bracket.d} className="map-line draw" pathLength={1} />

        {layout.storeEdges.map((edge) => (
          <path
            key={`${edge.from}-${edge.to}`}
            d={edge.d}
            data-flow-edge=""
            className="map-line"
            style={edgeStyle(edge.from)}
          />
        ))}

        {layout.useEdges.map((edge) => (
          <path
            key={`${edge.from}-uses-${edge.to}`}
            d={edge.d}
            className="map-line"
            strokeDasharray="3 3"
            style={edgeStyle(edge.from)}
          />
        ))}

        {flow
          ? layout.storeEdges.map((edge) => (
              <circle key={`dot-${edge.from}-${edge.to}`} data-flow-dot="" className="map-dot" r={3} cx={0} cy={0} />
            ))
          : null}

        {layout.entry.map((node) => (
          <g key={node.label}>
            <rect x={node.x} y={node.y} width={MAP.entryW} height={MAP.boxH} rx={1} className="map-box" />
            <text x={node.x + 8} y={node.cy} className="map-text" dominantBaseline="central">
              {node.label}
            </text>
          </g>
        ))}

        {layout.modules.map((node) => {
          const on = active === node.id;
          return (
            <g
              key={node.id}
              onMouseEnter={() => setActive(node.id)}
              style={{ opacity: dim(node.id), cursor: "default" }}
              className="map-node"
            >
              {/* generous hit area */}
              <rect x={node.x - 6} y={node.y - 4} width={MAP.moduleW + 12} height={MAP.rowH} fill="transparent" />
              <rect
                x={node.x}
                y={node.y}
                width={MAP.moduleW}
                height={MAP.boxH}
                rx={1}
                className="map-box"
                style={on ? { stroke: "var(--map-accent)", strokeOpacity: 1, strokeWidth: 1.5 } : undefined}
              />
              <text
                x={node.x + 10}
                y={node.cy}
                className="map-text"
                dominantBaseline="central"
                style={on ? { fill: "var(--map-accent)" } : undefined}
              >
                {node.label}
              </text>
            </g>
          );
        })}

        {layout.stores.map((node) => (
          <g key={node.id} style={{ opacity: dim(node.id) }} className="map-node">
            <rect
              x={node.x}
              y={node.y}
              width={MAP.storeW}
              height={MAP.storeH}
              rx={node.kind === "database" ? 6 : 1}
              className="map-box map-box-store"
            />
            <text x={node.x + 10} y={node.cy} className="map-text" dominantBaseline="central">
              {node.label}
            </text>
          </g>
        ))}
      </svg>

      <p className="map-caption label mt-4 hidden min-h-[2.8em] md:block" aria-hidden="true">
        {activeModule ? (
          <>
            <span style={{ color: "var(--map-accent)" }}>{activeModule.label}</span>
            <span className="normal-case tracking-normal"> — {activeModule.note}</span>
          </>
        ) : (
          <span className="opacity-75">Hover a module to see what it does and what it talks to.</span>
        )}
      </p>
    </div>
  );
}
