/**
 * [data-tone] — light/dark page shift (Motion row 08).
 *
 *   <section data-tone="light">…</section>
 *   <section data-tone="dark" data-tone-fixed>…</section>
 *
 * data-tone="light|dark"  the section's ground. Without JS each section paints
 *                         its own tone. With JS (<html class="tone-live">) the
 *                         whole page shares one tone: when a top-level
 *                         [data-tone] section crosses mid-screen, --bg / --fg on
 *                         <html> cross-fade to it (0.6 s power2.inOut).
 * data-tone-fixed         the section always keeps its own colours (hero, footer)
 *                         but still sets the page tone while it is mid-screen.
 *
 * Inside a section use var(--bg), var(--fg) and the derived var(--mu) (muted),
 * var(--mu2), var(--line), var(--line2) — never hard-coded ink/paper.
 * Reduced motion: instant swap.
 * Emits CustomEvent 'tone:change' on document (detail: { tone }).
 */
import { gsap, ScrollTrigger } from '../gsap';
import { onPage } from '../lifecycle';

type Tone = 'light' | 'dark';

onPage(
  (page) => {
    const html = document.documentElement;
    const sections = [...document.querySelectorAll<HTMLElement>('[data-tone]')].filter(
      (s) => !s.parentElement?.closest('[data-tone]'),
    );
    if (!sections.length) return;

    const css = getComputedStyle(html);
    const ink = css.getPropertyValue('--ink').trim() || '#0e0f11';
    const paper = css.getPropertyValue('--paper').trim() || '#efece5';
    const colours: Record<Tone, { bg: string; fg: string }> = {
      dark: { bg: ink, fg: paper },
      light: { bg: paper, fg: ink },
    };

    let current: Tone | null = null;
    const apply = (tone: Tone, instant = false) => {
      if (tone === current) return;
      current = tone;
      html.dataset.pageTone = tone;
      const c = colours[tone];
      if (instant || page.reduced) gsap.set(html, { '--bg': c.bg, '--fg': c.fg });
      else gsap.to(html, { '--bg': c.bg, '--fg': c.fg, duration: 0.6, ease: 'power2.inOut', overwrite: true });
      document.dispatchEvent(new CustomEvent('tone:change', { detail: { tone } }));
    };
    const toneOf = (s: HTMLElement): Tone => (s.dataset.tone === 'light' ? 'light' : 'dark');

    // initial tone: the section under mid-screen (or the first one)
    const mid = window.innerHeight / 2;
    const start =
      sections.find((s) => {
        const r = s.getBoundingClientRect();
        return r.top <= mid && r.bottom > mid;
      }) ?? sections[0]!;
    apply(toneOf(start), true);
    html.classList.add('tone-live');

    for (const s of sections) {
      ScrollTrigger.create({
        trigger: s,
        start: 'top 50%',
        end: 'bottom 50%',
        onToggle: (self) => {
          if (self.isActive) apply(toneOf(s));
        },
      });
    }

    return () => {
      html.classList.remove('tone-live');
      delete html.dataset.pageTone;
    };
  },
  { order: -50 },
);
