/**
 * Experience timeline entries (Motion row 11) — used by components/home/Experience.astro.
 *
 * ScrollTrigger.batch at top 80 %, once: entries rise (0.8 s power3.out,
 * stagger 0.12), the hairline above each draws left→right (1 s), and every
 * [data-xp-year] counts up from year − 6 to the real year (0.8 s, whole numbers).
 * The counting text is aria-hidden; the sr-only copy next to it stays static.
 * Reduced motion: fade only (300 ms), dates static, rules drawn.
 */
import { gsap, ScrollTrigger, EASE_IN_OUT } from '../gsap';
import { onPage } from '../lifecycle';

const STAGGER = 0.12;

onPage((page) => {
  const items = [...document.querySelectorAll<HTMLElement>('[data-xp-item]')];
  if (!items.length) return;

  if (page.reduced) {
    gsap.set(items, { opacity: 0 });
    ScrollTrigger.batch(items, {
      start: 'top 80%',
      once: true,
      onEnter: (batch) => {
        page.add(() => gsap.to(batch, { opacity: 1, duration: 0.3, ease: 'none', stagger: 0 }));
      },
    });
    return;
  }

  gsap.set(items, { opacity: 0, y: 48 });
  items.forEach((item) => {
    const rule = item.querySelector('[data-xp-rule]');
    if (rule) gsap.set(rule, { scaleX: 0 });
    item.querySelectorAll<HTMLElement>('[data-xp-year]').forEach((el) => {
      el.textContent = String(Number(el.dataset.xpYear) - 6);
    });
  });

  ScrollTrigger.batch(items, {
    start: 'top 80%',
    once: true,
    onEnter: (batch) => {
      page.add(() => {
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: STAGGER,
          clearProps: 'transform',
        });
        batch.forEach((item, k) => {
          const delay = k * STAGGER;
          const rule = item.querySelector('[data-xp-rule]');
          if (rule) gsap.to(rule, { scaleX: 1, duration: 1, ease: EASE_IN_OUT, delay });
          item.querySelectorAll<HTMLElement>('[data-xp-year]').forEach((el) => {
            const year = Number(el.dataset.xpYear);
            const counter = { v: year - 6 };
            gsap.to(counter, {
              v: year,
              duration: 0.8,
              ease: 'power2.out',
              delay: delay + 0.1,
              onUpdate: () => {
                el.textContent = String(Math.round(counter.v));
              },
            });
          });
        });
      });
    },
  });

  // restore the real years if the page is left mid-count
  page.onCleanup(() => {
    items.forEach((item) =>
      item.querySelectorAll<HTMLElement>('[data-xp-year]').forEach((el) => {
        el.textContent = el.dataset.xpYear ?? el.textContent;
      }),
    );
  });
});
