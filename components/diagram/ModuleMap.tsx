"use client";

import { useMemo, useState } from "react";
import type { System } from "@/content/systems";
import { MAP, layoutSystem } from "@/lib/diagram";

type Props = {
  system: System;
  /** "paper" on the home page, "ink" inside case-study architecture. */
  tone?: "paper" | "ink";
};

/**
 * Architecture map drawn from data. The SVG carries a text summary; the full
 * per-module notes are always available as text in <ModuleList>.
 */
export function ModuleMap({ system, tone = "paper" }: Props) {
  const layout = useMemo(() => layoutSystem(system), [system]);
  const [active, setActive] = useState<string | null>(null);

  const activeModule = system.modules.find((m) => m.id === active);
  const related = new Set<string>();
  if (activeModule) {
    related.add(activeModule.id);
    activeModule.stores.forEach((s) => related.add(s));
    (activeModule.uses ?? []).forEach((u) => related.add(u));
  }
  const dim = (id: string) => (active && !related.has(id) ? 0.28 : 1);
  const edgeOn = (from: string) => active === from;

  const signal = tone === "ink" ? "var(--color-signal-on-ink)" : "var(--color-signal)";

  return (
    <div className="module-map" data-tone={tone}>
      <svg
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
            pathLength={1}
            className="map-line draw"
            style={
              edgeOn(edge.from)
                ? { stroke: signal, strokeOpacity: 1, strokeWidth: 1.5 }
                : active
                  ? { strokeOpacity: 0.1 }
                  : undefined
            }
          />
        ))}

        {layout.useEdges.map((edge) => (
          <path
            key={`${edge.from}-uses-${edge.to}`}
            d={edge.d}
            className="map-line"
            strokeDasharray="3 3"
            style={
              edgeOn(edge.from)
                ? { stroke: signal, strokeOpacity: 1, strokeWidth: 1.5 }
                : active
                  ? { strokeOpacity: 0.1 }
                  : undefined
            }
          />
        ))}

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
                style={on ? { stroke: signal, strokeOpacity: 1 } : undefined}
              />
              <text
                x={node.x + 10}
                y={node.cy}
                className="map-text"
                dominantBaseline="central"
                style={on ? { fill: signal } : undefined}
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
            <span style={{ color: signal }}>{activeModule.label}</span>
            <span className="normal-case tracking-normal"> — {activeModule.note}</span>
          </>
        ) : (
          <span className="opacity-70">Hover a module to see what it does and what it talks to.</span>
        )}
      </p>
    </div>
  );
}
