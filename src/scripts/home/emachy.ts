/**
 * Featured eMachy plate. Markup: components/home/FeaturedEmachy.astro.
 *
 * - Unmask: clip-path inset(10% 6%) → inset(0), 1.3 s mj.inOut, once at top 88 %
 *   (the design's `.plate` reveal). The pre-state is set in CSS (html.js).
 * - Inner parallax: the mock content drifts −40 px → +40 px (≈ ±14 px on mobile)
 *   while the plate crosses the viewport (scrubbed), so it lags the page slightly.
 * Reduced motion: no clip, no parallax — a 300 ms fade only.
 */
import { gsap, EASE_IN_OUT } from '../gsap';
import { onPage } from '../lifecycle';
import { isMobile } from '../env';

onPage((page) => {
  const plate = document.querySelector<HTMLElement>('[data-emachy-plate]');
  if (!plate) return;
  const inner = plate.querySelector<HTMLElement>('[data-emachy-plate-in]');

  if (page.reduced) {
    gsap.fromTo(
      plate,
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: 'none', scrollTrigger: { trigger: plate, start: 'top 88%', once: true } },
    );
    return;
  }

  gsap.fromTo(
    plate,
    { clipPath: 'inset(10% 6% 10% 6%)' },
    {
      clipPath: 'inset(0% 0% 0% 0%)',
      duration: 1.3,
      ease: EASE_IN_OUT,
      scrollTrigger: { trigger: plate, start: 'top 88%', once: true },
    },
  );

  if (inner) {
    const amp = () => (isMobile() ? 14 : 40);
    gsap.fromTo(
      inner,
      { y: () => -amp() },
      {
        y: () => amp(),
        ease: 'none',
        scrollTrigger: { trigger: plate, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
      },
    );
  }
});
