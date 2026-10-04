import type { System } from "@/content/systems";

type Props = {
  system: System;
  /** When true the list is only exposed to assistive tech (the map is shown instead). */
  visuallyHidden?: boolean;
  tone?: "paper" | "ink";
};

/** Text equivalent of the module map: every module, what it does, what it reaches. */
export function ModuleList({ system, visuallyHidden = false, tone = "paper" }: Props) {
  const storeLabel = (id: string) => system.stores.find((s) => s.id === id)?.label ?? id;
  const moduleLabel = (id: string) => system.modules.find((m) => m.id === id)?.label ?? id;
  const line = tone === "ink" ? "border-paper/15" : "border-line";
  const muted = tone === "ink" ? "text-paper/65" : "text-muted";
  const accent = tone === "ink" ? "text-signal-on-ink" : "text-signal";

  return (
    <div className={visuallyHidden ? "sr-only" : undefined}>
      <p className={`label ${muted}`}>Request path: {system.entry.join(" → ")} → module</p>
      <dl className={`mt-4 border-t ${line}`}>
        {system.modules.map((module) => {
          const reaches = [...module.stores.map(storeLabel), ...(module.uses ?? []).map(moduleLabel)];
          return (
            <div key={module.id} className={`border-b ${line} py-3`}>
              <dt className={`font-mono text-[0.8125rem] ${accent}`}>{module.label}</dt>
              <dd className="mt-1 text-base leading-snug">
                {module.note}
                {reaches.length > 0 ? (
                  <span className={`mt-1 block font-mono text-xs ${muted}`}>→ {reaches.join(", ")}</span>
                ) : null}
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}
