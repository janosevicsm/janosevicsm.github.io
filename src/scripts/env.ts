/**
 * Environment helpers shared by every motion module.
 *
 * - prefersReducedMotion(): true when the visitor asked for reduced motion.
 *   Every effect must have the fallback listed in design/project/Motion.dc.html
 *   (usually opacity-only, ≤ 300 ms, no scroll-jacking).
 * - isFinePointer(): a mouse/trackpad that can hover — gate pointer-follow effects on it.
 * - isMobile(): the ≤ 760 px layout (matches the CSS breakpoint).
 */
const query = (q: string): boolean =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia(q).matches;

export const prefersReducedMotion = (): boolean => query('(prefers-reduced-motion: reduce)');
export const isFinePointer = (): boolean => query('(hover: hover) and (pointer: fine)');
export const isMobile = (): boolean => query('(max-width: 760px)');

/** Session key: the intro loader has already played in this tab. */
export const LOADER_SEEN_KEY = 'mj:loader-seen';
