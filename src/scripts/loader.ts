/**
 * Intro loader — Motion row 02. Runs once per tab session (sessionStorage);
 * repeat visits and client-side navigations skip it (an inline head script
 * adds html.loader-skip before first paint, so it never flashes).
 *
 * Timeline: the greetings (LOADER_GREETINGS in data/site.ts: "Hello · Zdravo ·
 * Hola · Bonjour · Ciao · Hallo · Olá · 你好") swap in place, each rising 12 px
 * from a mask (first 280 ms, the rest share ≈ 700 ms), the accent dot pulses,
 * counter 01→08. Exit: one vertical bar per greeting lifts away left→right
 * (0.7 s cubic(.76,0,.24,1), stagger 0.04). Total ≈ 2 s.
 *
 * Hook: the page reveal fires 0.4 s before the bars finish ("-=0.4"), see
 * page-reveal.ts. 'loader:done' is dispatched on document when the loader is gone.
 * Reduced motion: "Hello" fades in and out (300 ms each), then the screen fades.
 */
import { gsap, EASE_BARS } from './gsap';
import { prefersReducedMotion, LOADER_SEEN_KEY } from './env';
import { reveal } from './page-reveal';
import { stopScroll, startScroll } from './smooth-scroll';
import { LOADER_GREETINGS as GREETINGS } from '../data/site';

/** time on the first greeting, and the time all the others share */
const FIRST = 0.28;
const REST = 0.7;

function markSeen(): void {
  try {
    sessionStorage.setItem(LOADER_SEEN_KEY, '1');
  } catch {
    /* storage unavailable: the loader simply plays again next time */
  }
}

function finish(loader: HTMLElement | null): void {
  markSeen();
  loader?.remove();
  document.documentElement.classList.remove('is-loading');
  document.documentElement.classList.add('loader-skip');
  document.dispatchEvent(new CustomEvent('loader:done'));
}

/** Reveal as soon as fonts are ready (max 600 ms) — used when there is no loader. */
export function revealInstant(): void {
  const timeout = new Promise((r) => setTimeout(r, 600));
  Promise.race([document.fonts.ready, timeout]).then(() => reveal('instant'));
}

export function runLoader(): void {
  const html = document.documentElement;
  const loader = document.querySelector<HTMLElement>('[data-loader]');
  if (!loader || html.classList.contains('loader-skip')) {
    loader?.remove();
    html.classList.remove('is-loading');
    revealInstant();
    return;
  }

  const word = loader.querySelector<HTMLElement>('[data-loader-word]');
  const count = loader.querySelector<HTMLElement>('[data-loader-count]');
  const bars = loader.querySelectorAll<HTMLElement>('[data-loader-bar]');
  const centre = loader.querySelector<HTMLElement>('[data-loader-centre]');
  html.classList.add('is-loading');
  stopScroll();

  const done = () => {
    finish(loader);
    startScroll();
  };

  if (prefersReducedMotion() || !word || !bars.length) {
    const tl = gsap.timeline({ onComplete: done });
    if (word) {
      word.textContent = GREETINGS[0]!;
      tl.fromTo(word, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'none' });
      tl.to(word, { opacity: 0, duration: 0.3, ease: 'none' }, '+=0.2');
    }
    tl.add(() => reveal('loader'));
    tl.to(loader, { opacity: 0, duration: 0.3, ease: 'none' });
    return;
  }

  const tl = gsap.timeline({ onComplete: done });
  const setGreeting = (i: number) => {
    word.textContent = GREETINGS[i]!;
    if (count) count.textContent = String(i + 1).padStart(2, '0');
  };
  const step = REST / Math.max(1, GREETINGS.length - 1);
  let t = 0;
  GREETINGS.forEach((_, i) => {
    const slot = i === 0 ? FIRST : step;
    tl.call(() => setGreeting(i), undefined, t);
    tl.fromTo(word, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: slot * 0.86, ease: 'power2.out' }, t);
    t += slot;
  });
  const exitAt = t + 0.02;
  if (centre) tl.to(centre, { opacity: 0, duration: 0.25, ease: 'none' }, exitAt);
  tl.to(bars, { yPercent: -101, duration: 0.7, ease: EASE_BARS, stagger: 0.04 }, exitAt);
  const barsEnd = exitAt + 0.7 + 0.04 * (bars.length - 1);
  tl.call(() => reveal('loader'), undefined, barsEnd - 0.4);
  tl.set(loader, { pointerEvents: 'none' }, exitAt + 0.3);
}
