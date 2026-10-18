/**
 * Shared data-attribute options for [data-split-lines] and [data-reveal]:
 *   data-motion-on="scroll|reveal"  scroll (default): play when the element enters
 *                                    the viewport (once). reveal: play when the page
 *                                    reveals (loader / page transition) — use in heroes.
 *   data-motion-delay="0.2"         seconds (default 0)
 *   data-motion-stagger="0.08"      seconds between lines / children
 *   data-motion-start="top 85%"     ScrollTrigger start (scroll mode)
 */
export interface MotionOptions {
  on: 'scroll' | 'reveal';
  delay: number;
  stagger: number;
  start: string;
}

const num = (v: string | undefined, fallback: number): number => {
  const n = v === undefined || v === '' ? NaN : Number(v);
  return Number.isFinite(n) ? n : fallback;
};

export function readOptions(el: HTMLElement, defaults: { stagger: number; start: string }): MotionOptions {
  return {
    on: el.dataset.motionOn === 'reveal' ? 'reveal' : 'scroll',
    delay: num(el.dataset.motionDelay, 0),
    stagger: num(el.dataset.motionStagger, defaults.stagger),
    start: el.dataset.motionStart || defaults.start,
  };
}

export { num };
