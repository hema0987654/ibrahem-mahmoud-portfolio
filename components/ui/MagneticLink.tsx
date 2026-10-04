"use client";

import { useRef, type ComponentPropsWithoutRef, type PointerEvent } from "react";

type Props = ComponentPropsWithoutRef<"a"> & { strength?: number };

/**
 * Subtle magnetic pull for the two primary calls to action.
 * Mouse only, off for touch and for reduced motion. No animation library.
 */
export function MagneticLink({ strength = 0.22, children, style, ...rest }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);

  const enabled = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const onPointerMove = (event: PointerEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el || event.pointerType !== "mouse" || !enabled()) return;
    const rect = el.getBoundingClientRect();
    const x = (event.clientX - (rect.left + rect.width / 2)) * strength;
    const y = (event.clientY - (rect.top + rect.height / 2)) * strength;
    el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
  };

  const reset = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <a
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      onBlur={reset}
      style={{
        ...style,
        transition:
          "transform 300ms cubic-bezier(0.22, 1, 0.36, 1), background-color 150ms linear, color 150ms linear, border-color 150ms linear",
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
