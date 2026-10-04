"use client";

import { useEffect, useState } from "react";

type Props = {
  /** Running total of items added, per timeline entry. Computed from the content. */
  totals: readonly number[];
  labels: readonly string[];
};

/**
 * Follows the timeline as it scrolls: marks entries as reached and shows how
 * many things had been added by that point. Uses IntersectionObserver only.
 */
export function EvolutionCounter({ totals, labels }: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const entries = Array.from(document.querySelectorAll<HTMLElement>("[data-evo]"));
    if (entries.length === 0 || !("IntersectionObserver" in window)) return;

    const apply = (current: number) => {
      setIndex(current);
      entries.forEach((el, i) => {
        el.dataset.reached = String(i <= current);
        el.dataset.current = String(i === current);
      });
    };

    // An entry becomes current once its top passes just below the middle of the screen.
    const measure = () => {
      const line = window.innerHeight * 0.58;
      let current = 0;
      entries.forEach((el, i) => {
        if (el.getBoundingClientRect().top < line) current = i;
      });
      apply(current);
    };

    const observer = new IntersectionObserver(measure, {
      rootMargin: "0px 0px -42% 0px",
      threshold: [0, 1],
    });
    entries.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const total = totals[index] ?? 0;
  const label = labels[index] ?? "";

  return (
    <div aria-hidden="true" className="hidden lg:block">
      <p className="label text-muted">Added so far</p>
      <p className="evo-count mt-3 text-signal">{String(total).padStart(2, "0")}</p>
      <p className="label mt-4 text-muted">
        by <span className="text-text">{label}</span>
      </p>
    </div>
  );
}
