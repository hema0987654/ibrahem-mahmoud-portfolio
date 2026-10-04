/**
 * Scroll-linked motion is a wide-screen enhancement. GSAP is never requested
 * on small screens or when the visitor prefers reduced motion; every scene has
 * a complete static or CSS-only form underneath.
 */
export const MOTION_QUERY = "(min-width: 64rem) and (prefers-reduced-motion: no-preference)";

export const canAnimate = () => typeof window !== "undefined" && window.matchMedia(MOTION_QUERY).matches;

type Gsap = typeof import("gsap").gsap;
type ScrollTriggerStatic = typeof import("gsap/ScrollTrigger").ScrollTrigger;

let loader: Promise<{ gsap: Gsap; ScrollTrigger: ScrollTriggerStatic }> | undefined;

/** One shared, lazy copy of GSAP + ScrollTrigger for every scene. */
export function loadGsap() {
  loader ??= Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([g, st]) => {
    g.gsap.registerPlugin(st.ScrollTrigger);
    return { gsap: g.gsap, ScrollTrigger: st.ScrollTrigger };
  });
  return loader;
}

export const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
export const smooth = (value: number) => {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
};
