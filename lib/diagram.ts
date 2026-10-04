import type { System } from "@/content/systems";

/**
 * Pure layout for the module map: entry on the left, modules in one column,
 * stores on the right. Module-to-module calls are arcs on the left of the
 * column, module-to-store links are curves on the right.
 */
export const MAP = {
  width: 640,
  padTop: 14,
  rowH: 30,
  boxH: 22,
  entryX: 0,
  entryW: 112,
  bracketX: 142,
  moduleX: 176,
  moduleW: 168,
  storeX: 468,
  storeW: 172,
  storeH: 30,
} as const;

export type MapLayout = {
  height: number;
  modules: { id: string; label: string; x: number; y: number; cy: number }[];
  stores: { id: string; label: string; kind: string; x: number; y: number; cy: number }[];
  entry: { label: string; x: number; y: number; cy: number }[];
  storeEdges: { from: string; to: string; d: string }[];
  useEdges: { from: string; to: string; d: string }[];
  bracket: { d: string };
  entryLine: { d: string };
};

export function layoutSystem(system: System): MapLayout {
  const n = system.modules.length;
  const height = MAP.padTop * 2 + n * MAP.rowH;

  const modules = system.modules.map((m, i) => {
    const y = MAP.padTop + i * MAP.rowH + (MAP.rowH - MAP.boxH) / 2;
    return { id: m.id, label: m.label, x: MAP.moduleX, y, cy: y + MAP.boxH / 2 };
  });
  const moduleById = new Map(modules.map((m) => [m.id, m]));

  const sCount = system.stores.length;
  const sGap = height / sCount;
  const stores = system.stores.map((s, i) => {
    const cy = sGap * i + sGap / 2;
    return { id: s.id, label: s.label, kind: s.kind, x: MAP.storeX, y: cy - MAP.storeH / 2, cy };
  });
  const storeById = new Map(stores.map((s) => [s.id, s]));

  const eCount = system.entry.length;
  const eBlock = eCount * MAP.rowH;
  const eTop = height / 2 - eBlock / 2;
  const entry = system.entry.map((label, i) => {
    const y = eTop + i * MAP.rowH + (MAP.rowH - MAP.boxH) / 2;
    return { label, x: MAP.entryX, y, cy: y + MAP.boxH / 2 };
  });

  const right = MAP.moduleX + MAP.moduleW;
  const mid = (right + MAP.storeX) / 2;
  const storeEdges = system.modules.flatMap((m) =>
    m.stores.flatMap((storeId) => {
      const a = moduleById.get(m.id);
      const b = storeById.get(storeId);
      if (!a || !b) return [];
      return [{ from: m.id, to: storeId, d: `M${right},${a.cy} C${mid},${a.cy} ${mid},${b.cy} ${MAP.storeX},${b.cy}` }];
    }),
  );

  const useEdges = system.modules.flatMap((m) =>
    (m.uses ?? []).flatMap((targetId) => {
      const a = moduleById.get(m.id);
      const b = moduleById.get(targetId);
      if (!a || !b) return [];
      const span = Math.abs(a.cy - b.cy) / MAP.rowH;
      const cx = Math.max(MAP.bracketX + 4, MAP.moduleX - 10 - span * 5);
      return [{ from: m.id, to: targetId, d: `M${MAP.moduleX},${a.cy} C${cx},${a.cy} ${cx},${b.cy} ${MAP.moduleX},${b.cy}` }];
    }),
  );

  const first = modules[0];
  const last = modules[modules.length - 1];
  const top = first ? first.cy : 0;
  const bottom = last ? last.cy : height;
  const bracket = {
    d: `M${MAP.bracketX + 8},${top} H${MAP.bracketX} V${bottom} H${MAP.bracketX + 8}`,
  };
  const entryLine = { d: `M${MAP.entryX + MAP.entryW},${height / 2} H${MAP.bracketX}` };

  return { height, modules, stores, entry, storeEdges, useEdges, bracket, entryLine };
}
