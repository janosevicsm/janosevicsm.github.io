/**
 * Toolbox groups (Motion row 12) — used by components/home/Toolbox.astro.
 * The four [data-tb-group] columns slide up 24 px in sequence:
 * 0.7 s power3.out, stagger 0.1, one ScrollTrigger (top 85 %), once.
 * Reduced motion: fade, 300 ms.
 */
import { gsap } from '../gsap';
import { onPage } from '../lifecycle';

onPage((page) => {
  const grid = document.querySelector<HTMLElement>('[data-tb-grid]');
  if (!grid) return;
  const groups = [...grid.querySelectorAll<HTMLElement>('[data-tb-group]')];
  if (!groups.length) return;

  gsap.fromTo(
    groups,
    { opacity: 0, y: page.reduced ? 0 : 24 },
    {
      opacity: 1,
      y: 0,
      duration: page.reduced ? 0.3 : 0.7,
      ease: page.reduced ? 'none' : 'power3.out',
      stagger: page.reduced ? 0 : 0.1,
      clearProps: 'transform',
      scrollTrigger: { trigger: grid, start: 'top 85%', once: true },
    },
  );
});
