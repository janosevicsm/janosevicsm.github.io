/**
 * Case study /work/emachy — Motion row 16 ("Case-study details").
 *
 * - [data-cs-plate]  hero plate unmasks from inset 18 % to full while it scrolls
 *                    from 90 % to 15 % of the viewport (scrub); the mock inside
 *                    settles from scale 1.06 to 1 with it (2D transform, ends
 *                    at exactly 1 so the screenshot is crisp at rest).
 * - [data-cs-arch]   architecture layers ([data-cs-layer]) stack in from the
 *                    left: 0.6 s expo.out, stagger 0.1, once at top 80 %.
 * - [data-cs-flow]   workflow progress line ([data-cs-fill]) fills on scroll
 *                    (scaleY scrub, top 60 % → bottom 60 %); each step
 *                    ([data-cs-step]) gets .is-lit once the line reaches it.
 *
 * Pre-JS states live in the components' CSS (inside a no-preference media
 * query), so reduced motion simply shows everything: no unmask, layers
 * visible, line full, every step lit.
 */
import { gsap } from './gsap';
import { onPage } from './lifecycle';

onPage((page) => {
  const plate = document.querySelector<HTMLElement>('[data-cs-plate]');
  const arch = document.querySelector<HTMLElement>('[data-cs-arch]');
  const flow = document.querySelector<HTMLElement>('[data-cs-flow]');
  if (!plate && !arch && !flow) return; // not the case-study page
  if (page.reduced) return;

  // --- hero plate unmask ---
  if (plate) {
    const scroll = { trigger: plate, start: 'top 90%', end: 'top 15%', scrub: true };
    gsap.fromTo(
      plate,
      { clipPath: 'inset(18% 18% 18% 18%)' },
      { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: scroll },
    );
    const mock = plate.querySelector<HTMLElement>('[data-cs-mock]');
    if (mock) gsap.fromTo(mock, { scale: 1.06 }, { scale: 1, ease: 'none', force3D: false, scrollTrigger: { ...scroll } });
  }

  // --- architecture layers ---
  if (arch) {
    const layers = arch.querySelectorAll<HTMLElement>('[data-cs-layer]');
    gsap.fromTo(
      layers,
      { opacity: 0, x: -40 },
      {
        opacity: 1,
        x: 0,
        duration: 0.6,
        ease: 'expo.out',
        stagger: 0.1,
        clearProps: 'transform',
        scrollTrigger: { trigger: arch, start: 'top 80%', once: true },
      },
    );
  }

  // --- workflow progress ---
  if (flow) {
    const fill = flow.querySelector<HTMLElement>('[data-cs-fill]');
    const steps = [...flow.querySelectorAll<HTMLElement>('[data-cs-step]')];
    const light = (progress: number) =>
      steps.forEach((s, i) => s.classList.toggle('is-lit', progress >= (i + 0.2) / steps.length));
    if (fill) {
      gsap.fromTo(
        fill,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: flow,
            start: 'top 60%',
            end: 'bottom 60%',
            scrub: true,
            onUpdate: (self) => light(self.progress),
            onRefresh: (self) => light(self.progress),
          },
        },
      );
    }
  }
});
