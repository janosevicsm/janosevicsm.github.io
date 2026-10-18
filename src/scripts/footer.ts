/**
 * Footer — Motion row 13 + live clock.
 * - Footer content rises out from underneath while the footer scrolls in
 *   (scrub, inner yPercent −20 → 0; the footer clips it). Small photo scales
 *   0.8 → 1. Headline lines rise via [data-split-lines].
 * - Clock: Novi Sad local time (Intl, Europe/Belgrade), ticks every second.
 * Reduced motion: no parallax / scale; clock still ticks.
 */
import { gsap } from './gsap';
import { onPage } from './lifecycle';

const fmt = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/Belgrade',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
  timeZoneName: 'short',
});

onPage((page) => {
  const footer = document.querySelector<HTMLElement>('[data-footer]');
  if (!footer) return;

  const clock = footer.querySelector<HTMLTimeElement>('[data-clock]');
  if (clock) {
    const tick = () => {
      const now = new Date();
      clock.textContent = fmt.format(now);
      clock.dateTime = now.toISOString();
    };
    tick();
    const id = window.setInterval(tick, 1000);
    page.onCleanup(() => window.clearInterval(id));
  }

  if (page.reduced) return;
  const inner = footer.querySelector<HTMLElement>('[data-footer-inner]');
  const photo = footer.querySelector<HTMLElement>('[data-footer-photo]');
  if (inner) {
    gsap.fromTo(
      inner,
      { yPercent: -20 },
      { yPercent: 0, ease: 'none', scrollTrigger: { trigger: footer, start: 'top bottom', end: 'bottom bottom', scrub: true } },
    );
  }
  if (photo) {
    gsap.fromTo(
      photo,
      { scale: 0.8 },
      { scale: 1, ease: 'none', scrollTrigger: { trigger: footer, start: 'top bottom', end: 'top 25%', scrub: true } },
    );
  }
});
