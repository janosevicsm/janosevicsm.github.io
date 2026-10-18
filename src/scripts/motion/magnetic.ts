/**
 * [data-magnetic] — magnetic round buttons with a rising fill (Motion row 09).
 *
 *   <a class="mag" href="…" data-magnetic style="--mag-fill: var(--fg)">
 *     <span class="fill" aria-hidden="true"></span><span class="t">Email me</span>
 *   </a>
 *   (or use src/components/ui/MagneticButton.astro, which renders this markup)
 *
 * Within a 40 px halo around the button it pulls 35 % toward the pointer and its
 * label (.t) a further 15 % (≈ 50 % in total): gsap.quickTo 0.5 s power3.
 * Leaving the halo releases with elastic.out(1, .4) over 0.9 s.
 * The fill (.fill — inserted if missing) rises from the bottom on hover/focus
 * and exits upward on leave (0.6 s cubic-bezier(.65,0,.35,1)); `.is-hover` is
 * toggled on the button so CSS can recolour the label (--mag-fill-fg).
 *
 * Options:
 *   data-magnetic="0.35"        pull strength (fraction of pointer offset)
 *   data-magnetic-label="0.15"  extra label pull
 *   data-magnetic-halo="40"     halo in px
 * Pointer-fine only for the pull. Reduced motion: no pull, the fill is a
 * 150 ms colour change (CSS in global.css).
 */
import { gsap, EASE_IN_OUT } from '../gsap';
import { onPage } from '../lifecycle';
import { num } from './options';

interface Mag {
  el: HTMLElement;
  label: HTMLElement | null;
  fill: HTMLElement;
  strength: number;
  labelStrength: number;
  halo: number;
  active: boolean;
  to: { x: gsap.QuickToFunc; y: gsap.QuickToFunc; lx?: gsap.QuickToFunc; ly?: gsap.QuickToFunc } | null;
}

function ensureFill(el: HTMLElement): HTMLElement {
  let fill = el.querySelector<HTMLElement>(':scope > .fill');
  if (!fill) {
    fill = document.createElement('span');
    fill.className = 'fill';
    fill.setAttribute('aria-hidden', 'true');
    el.prepend(fill);
  }
  return fill;
}

onPage(
  (page) => {
    const els = [...document.querySelectorAll<HTMLElement>('[data-magnetic]')];
    if (!els.length) return;
    const mags: Mag[] = els.map((el) => ({
      el,
      label: el.querySelector<HTMLElement>(':scope > .t'),
      fill: ensureFill(el),
      strength: num(el.dataset.magnetic, 0.35),
      labelStrength: num(el.dataset.magneticLabel, 0.15),
      halo: num(el.dataset.magneticHalo, 40),
      active: false,
      to: null,
    }));
    if (page.reduced) return; // CSS handles the reduced hover
    // y: 0 replaces the CSS translateY(100%) resting state with yPercent
    gsap.set(mags.map((m) => m.fill), { y: 0, yPercent: 100 });

    const { signal } = page;

    // --- fill: hover (fine pointer) and keyboard focus ---
    const enter = (m: Mag) => {
      m.el.classList.add('is-hover');
      gsap.fromTo(m.fill, { yPercent: 100 }, { yPercent: 0, duration: 0.6, ease: EASE_IN_OUT, overwrite: true });
    };
    const leave = (m: Mag) => {
      if (!m.el.classList.contains('is-hover')) return;
      m.el.classList.remove('is-hover');
      gsap.to(m.fill, { yPercent: -100, duration: 0.6, ease: EASE_IN_OUT, overwrite: true });
    };
    for (const m of mags) {
      m.el.addEventListener('focus', () => m.el.matches(':focus-visible') && enter(m), { signal });
      m.el.addEventListener('blur', () => leave(m), { signal });
      if (page.finePointer) {
        m.el.addEventListener('pointerenter', () => enter(m), { signal });
        m.el.addEventListener('pointerleave', () => leave(m), { signal });
      }
    }

    if (!page.finePointer) return;

    // --- pull: one pointer listener for all buttons ---
    let px = -1e5;
    let py = -1e5;
    const release = (m: Mag) => {
      m.active = false;
      m.to = null;
      gsap.to(m.el, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.4)', overwrite: 'auto' });
      if (m.label) gsap.to(m.label, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.4)', overwrite: 'auto' });
    };
    const update = () => {
      for (const m of mags) {
        const r = m.el.getBoundingClientRect();
        // the element is translated by the pull; measure from its resting centre
        const tx = Number(gsap.getProperty(m.el, 'x')) || 0;
        const ty = Number(gsap.getProperty(m.el, 'y')) || 0;
        const cx = r.left + r.width / 2 - tx;
        const cy = r.top + r.height / 2 - ty;
        const dx = px - cx;
        const dy = py - cy;
        const inside = Math.hypot(dx, dy) < Math.max(r.width, r.height) / 2 + m.halo;
        if (inside) {
          if (!m.to) {
            const opts = { duration: 0.5, ease: 'power3' };
            m.to = {
              x: gsap.quickTo(m.el, 'x', opts),
              y: gsap.quickTo(m.el, 'y', opts),
              lx: m.label ? gsap.quickTo(m.label, 'x', opts) : undefined,
              ly: m.label ? gsap.quickTo(m.label, 'y', opts) : undefined,
            };
          }
          m.active = true;
          m.to.x(dx * m.strength);
          m.to.y(dy * m.strength);
          m.to.lx?.(dx * m.labelStrength);
          m.to.ly?.(dy * m.labelStrength);
        } else if (m.active) {
          release(m);
        }
      }
    };
    let queued = false;
    const schedule = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        update();
      });
    };
    window.addEventListener(
      'pointermove',
      (e) => {
        if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
        px = e.clientX;
        py = e.clientY;
        schedule();
      },
      { signal, passive: true },
    );
    window.addEventListener('scroll', schedule, { signal, passive: true });
    document.documentElement.addEventListener(
      'pointerleave',
      () => {
        px = py = -1e5;
        mags.forEach((m) => m.active && release(m));
      },
      { signal },
    );
  },
  { order: -10 },
);
