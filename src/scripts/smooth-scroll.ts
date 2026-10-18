/**
 * Smooth scroll — Motion row 01.
 * Lenis (lerp 0.09, programmatic scrolls 1.2 s) driven from gsap.ticker, with
 * ScrollTrigger updated on every Lenis scroll and lagSmoothing(0).
 * Touch stays native (syncTouch off). Not started when prefers-reduced-motion:
 * native scroll is used and in-page anchors jump.
 *
 * In-page anchors: clicks on links to an id on the current page (`#work`,
 * or `/#work` while on `/`) are smooth-scrolled here and the target gets focus
 * (for keyboard and screen-reader users). Add `data-no-smooth` to opt out.
 *
 * API:
 *   getLenis()                 -> Lenis | null
 *   scrollToTarget(el | '#id') -> smooth (or instant when reduced) scroll + focus
 *   stopScroll() / startScroll() — lock/unlock (menu, loader)
 */
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsap';
import { onPage, provideLenis } from './lifecycle';
import { prefersReducedMotion } from './env';

let lenis: Lenis | null = null;
let tickerFn: ((time: number) => void) | null = null;
let locks = 0;

export const getLenis = (): Lenis | null => lenis;
provideLenis(getLenis);

export function stopScroll(): void {
  locks++;
  lenis?.stop();
  document.documentElement.classList.add('scroll-locked');
}

export function startScroll(): void {
  locks = Math.max(0, locks - 1);
  if (locks > 0) return;
  lenis?.start();
  document.documentElement.classList.remove('scroll-locked');
}

function resolveTarget(target: Element | string): HTMLElement | null {
  if (typeof target !== 'string') return target as HTMLElement;
  const id = decodeURIComponent(target.replace(/^.*#/, ''));
  if (!id || id === 'top') return document.body;
  return document.getElementById(id);
}

export function scrollToTarget(target: Element | string, opts: { focus?: boolean } = {}): void {
  const el = resolveTarget(target);
  if (!el) return;
  const top = el === document.body;
  const done = () => {
    if (opts.focus === false || top) return;
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
  };
  const go = () => {
    if (lenis && !prefersReducedMotion()) {
      lenis.scrollTo(top ? 0 : el, { duration: 1.2, onComplete: done });
    } else {
      if (top) window.scrollTo(0, 0);
      else el.scrollIntoView({ block: 'start' });
      done();
    }
  };
  // a scroll lock (e.g. the menu closing on this same click) is released
  // synchronously by its handler; scroll on the next frame in that case
  if (locks > 0) requestAnimationFrame(go);
  else go();
}

function onAnchorClick(ev: MouseEvent): void {
  if (ev.defaultPrevented || ev.button !== 0 || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return;
  const link = (ev.target as Element | null)?.closest?.('a[href*="#"]') as HTMLAnchorElement | null;
  if (!link || link.hasAttribute('data-no-smooth') || (link.target && link.target !== '_self')) return;
  const url = new URL(link.href, location.href);
  if (url.origin !== location.origin || url.pathname !== location.pathname || url.search !== location.search) return;
  const target = resolveTarget(url.hash);
  if (!target) return;
  ev.preventDefault(); // also stops the ClientRouter from handling it
  history.replaceState(history.state, '', url.hash === '#top' ? url.pathname : url.hash);
  scrollToTarget(target);
}

if (typeof window !== 'undefined') {
  // capture phase on window: runs before the ClientRouter's document listener
  window.addEventListener('click', onAnchorClick, { capture: true });
}

onPage(
  (page) => {
    if (page.reduced) return;
    lenis = new Lenis({
      lerp: 0.09,
      duration: 1.2,
      smoothWheel: true,
      syncTouch: false,
      autoRaf: false,
      stopInertiaOnNavigate: true,
    });
    lenis.on('scroll', ScrollTrigger.update);
    tickerFn = (time: number) => lenis?.raf(time * 1000);
    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0);
    if (locks > 0) lenis.stop();
    return () => {
      if (tickerFn) gsap.ticker.remove(tickerFn);
      tickerFn = null;
      lenis?.destroy();
      lenis = null;
    };
  },
  { order: -100 },
);
