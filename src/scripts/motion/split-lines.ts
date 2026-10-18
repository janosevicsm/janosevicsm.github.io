/**
 * [data-split-lines] — headline line-mask reveal (Motion row 07).
 *
 *   <h2 data-split-lines>Selected work</h2>
 *   <h1 data-split-lines data-motion-on="reveal" data-motion-delay="0.1">eMachy</h1>
 *
 * The text is split into lines (GSAP SplitText, mask: "lines", re-split on
 * resize/font load) and each line slides up from its own mask:
 * 0.9 s power4.out, stagger 0.08, once, when the element's top reaches 85 %.
 * Options (see options.ts): data-motion-on, data-motion-delay,
 * data-motion-stagger, data-motion-start.
 * Explicit line breaks: use <br> — SplitText respects them.
 * Reduced motion: opacity 0 → 1, 300 ms.
 * The element is visibility:hidden (html.js) until it is split, so no flash.
 */
import { gsap, SplitText } from '../gsap';
import { onPage, type PageContext } from '../lifecycle';
import { readOptions } from './options';

function setup(el: HTMLElement, page: PageContext): void {
  const o = readOptions(el, { stagger: 0.08, start: 'top 85%' });

  if (page.reduced) {
    gsap.set(el, { visibility: 'visible', opacity: 0 });
    const tween = gsap.to(el, {
      opacity: 1,
      duration: 0.3,
      ease: 'none',
      delay: o.delay,
      paused: o.on === 'reveal',
      scrollTrigger: o.on === 'scroll' ? { trigger: el, start: o.start, once: true } : undefined,
    });
    if (o.on === 'reveal') page.revealed.then(() => tween.play());
    return;
  }

  SplitText.create(el, {
    type: 'lines',
    mask: 'lines',
    linesClass: 'split-line',
    autoSplit: true,
    aria: 'auto',
    onSplit(self) {
      gsap.set(el, { visibility: 'visible' });
      const tween = gsap.from(self.lines, {
        yPercent: 110,
        duration: 0.9,
        ease: 'power4.out',
        stagger: o.stagger,
        delay: o.delay,
        paused: o.on === 'reveal',
        scrollTrigger: o.on === 'scroll' ? { trigger: el, start: o.start, once: true } : undefined,
      });
      if (o.on === 'reveal') page.revealed.then(() => tween.play());
      return tween;
    },
  });
}

onPage(
  (page) => {
    const els = [...document.querySelectorAll<HTMLElement>('[data-split-lines]')];
    if (!els.length) return;
    // split with the real fonts, otherwise line breaks would be wrong
    document.fonts.ready.then(() => page.add(() => els.forEach((el) => setup(el, page))));
  },
  { order: -10 },
);
