/**
 * [data-reveal] — simple fade-up on enter (the design's `.rv`).
 *
 *   <div data-reveal>…</div>                    fade + rise 56 px, 0.9 s expo.out
 *   <div data-reveal="fade">…</div>             opacity only
 *   <ul data-reveal="children">…</ul>           each direct child in sequence
 *   <div data-reveal data-reveal-y="24">…</div> custom rise distance (px)
 *
 * Plays once when the element's top reaches 88 % of the viewport.
 * Options (see options.ts): data-motion-on, data-motion-delay,
 * data-motion-stagger (children mode, default 0.1), data-motion-start.
 * Reduced motion: opacity only, 300 ms.
 * Elements are opacity:0 while html.js is set, so no flash before init.
 */
import { gsap } from '../gsap';
import { onPage, type PageContext } from '../lifecycle';
import { readOptions, num } from './options';

function setup(el: HTMLElement, page: PageContext): void {
  const mode = el.dataset.reveal || 'up';
  const o = readOptions(el, { stagger: 0.1, start: 'top 88%' });
  const targets: Element[] = mode === 'children' ? [...el.children] : [el];
  if (!targets.length) return;
  const y = page.reduced || mode === 'fade' ? 0 : num(el.dataset.revealY, 56);

  const tween = gsap.fromTo(
    targets,
    { opacity: 0, y },
    {
      opacity: 1,
      y: 0,
      duration: page.reduced ? 0.3 : 0.9,
      ease: page.reduced ? 'none' : 'expo.out',
      delay: o.delay,
      stagger: mode === 'children' ? (page.reduced ? 0 : o.stagger) : 0,
      paused: o.on === 'reveal',
      clearProps: 'transform',
      scrollTrigger: o.on === 'scroll' ? { trigger: el, start: o.start, once: true } : undefined,
    },
  );
  if (o.on === 'reveal') page.revealed.then(() => tween.play());
}

onPage(
  (page) => {
    document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => setup(el, page));
  },
  { order: -10 },
);
