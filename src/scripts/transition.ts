/**
 * Page transition — Motion row 15 (Astro <ClientRouter />).
 *
 * Going to another page an ink panel rises from the bottom carrying the
 * destination's word ("eMachy", "Home"); the route changes underneath; then the
 * panel keeps going up while the new page reveals (page.revealed resolves as
 * the panel starts to leave, so e.g. the case-study title lines rise with it).
 * Back navigation reverses the direction.
 * Timing: in 0.7 s expo.inOut · out 0.8 s expo.inOut. Reduced motion: 200 ms crossfade.
 *
 * The word comes from the clicked link's data-transition-word, else from the
 * destination path (see WORDS), else from the last path segment.
 */
import { gsap } from './gsap';
import { prefersReducedMotion } from './env';
import { reveal, isRevealed } from './page-reveal';
import { stopScroll, startScroll } from './smooth-scroll';
import { revealInstant } from './loader';

const WORDS: Record<string, string> = {
  '/': 'Home',
  '/work/emachy': 'eMachy',
};

let covering: { back: boolean } | null = null;
let swapped = false;

const panel = () => document.querySelector<HTMLElement>('[data-page-transition]');

function wordFor(to: URL, source: Element | undefined): string {
  const fromLink = source instanceof HTMLElement ? source.dataset.transitionWord : undefined;
  if (fromLink) return fromLink;
  const path = to.pathname.replace(/\/+$/, '') || '/';
  if (WORDS[path]) return WORDS[path]!;
  const last = path.split('/').filter(Boolean).pop() ?? '';
  return last ? last.charAt(0).toUpperCase() + last.slice(1).replace(/-/g, ' ') : 'Home';
}

function coverIn(word: string, back: boolean): Promise<void> {
  const el = panel();
  if (!el) return Promise.resolve();
  const w = el.querySelector<HTMLElement>('[data-page-transition-word]');
  const inner = el.querySelector<HTMLElement>('[data-page-transition-inner]');
  if (w) w.textContent = word;
  covering = { back };
  stopScroll();
  return new Promise((resolve) => {
    gsap.killTweensOf([el, inner]);
    if (prefersReducedMotion()) {
      gsap.set(el, { visibility: 'visible', y: 0, yPercent: 0 });
      gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'none', onComplete: () => resolve() });
      return;
    }
    gsap.set(el, { visibility: 'visible', opacity: 1, y: 0 });
    gsap.fromTo(el, { yPercent: back ? -101 : 101 }, { yPercent: 0, duration: 0.7, ease: 'expo.inOut', onComplete: () => resolve() });
    if (inner) gsap.fromTo(inner, { yPercent: back ? -60 : 60 }, { yPercent: 0, duration: 0.7, ease: 'expo.inOut' });
  });
}

function coverOut(): void {
  const el = panel();
  const state = covering;
  covering = null;
  if (!el || !state) return;
  const inner = el.querySelector<HTMLElement>('[data-page-transition-inner]');
  const end = () => {
    gsap.set(el, { visibility: 'hidden' });
    startScroll();
  };
  reveal('transition');
  if (prefersReducedMotion()) {
    gsap.to(el, { opacity: 0, duration: 0.2, ease: 'none', onComplete: end });
    return;
  }
  gsap.to(el, { yPercent: state.back ? 101 : -101, duration: 0.8, ease: 'expo.inOut', onComplete: end });
  if (inner) gsap.to(inner, { yPercent: state.back ? 60 : -60, duration: 0.8, ease: 'expo.inOut' });
}

document.addEventListener('astro:before-preparation', (e) => {
  const same = e.from.pathname.replace(/\/+$/, '') === e.to.pathname.replace(/\/+$/, '') && e.from.search === e.to.search;
  if (same) return;
  const original = e.loader;
  const cover = coverIn(wordFor(e.to, e.sourceElement), e.direction === 'back');
  e.loader = async () => {
    await Promise.all([original(), cover]);
  };
});

// keep the JS-state classes that swapRootAttributes() removes from <html>
document.addEventListener('astro:after-swap', () => {
  swapped = true;
  document.documentElement.classList.add('js', 'loader-skip');
});

// lifecycle.ts has already re-initialised the page when this runs
// (the initial load's page-load is ignored: the loader owns that reveal)
document.addEventListener('astro:page-load', () => {
  if (!swapped) return;
  swapped = false;
  if (covering) coverOut();
  else if (!isRevealed()) revealInstant();
});
