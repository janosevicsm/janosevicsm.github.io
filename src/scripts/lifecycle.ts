/**
 * Page lifecycle that survives Astro <ClientRouter /> navigations.
 *
 *   import { onPage } from '../scripts/lifecycle';
 *   onPage((page) => {
 *     gsap.from('.thing', { y: 40, scrollTrigger: '.thing' });   // auto-reverted on leave
 *     window.addEventListener('resize', fn, { signal: page.signal }); // auto-removed
 *     page.revealed.then(() => …);                              // entrance hook
 *     return () => { … };                                       // optional extra cleanup
 *   });
 *
 * - init runs once per page view: on first load (DOMContentLoaded) and after
 *   every client-side navigation ('astro:page-load').
 * - Everything GSAP creates synchronously inside init (tweens, timelines,
 *   ScrollTriggers, SplitTexts) is captured in a gsap.context and reverted on
 *   'astro:before-swap'. For work created later (after an await), wrap it in
 *   page.add(() => …) so it is captured too.
 * - Registering after the page is already initialised runs init immediately.
 * - `order` sorts inits (lower first). Core: smooth scroll -100, tone -50,
 *   data-attribute helpers -10. Section code should use the default 0.
 */
import type Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsap';
import { prefersReducedMotion, isFinePointer } from './env';
import { whenRevealed, resetReveal } from './page-reveal';

export interface PageContext {
  /** prefers-reduced-motion at page load */
  readonly reduced: boolean;
  /** mouse/trackpad that can hover */
  readonly finePointer: boolean;
  /** aborted on 'astro:before-swap' — pass to addEventListener */
  readonly signal: AbortSignal;
  /** resolves when the entrance should start (see page-reveal.ts) */
  readonly revealed: Promise<void>;
  /** run fn inside this page's gsap.context (use for async-created animations) */
  add<T>(fn: () => T): T | undefined;
  /** register extra cleanup */
  onCleanup(fn: () => void): void;
  /** the Lenis instance, or null (reduced motion / not started yet) */
  readonly lenis: Lenis | null;
}

type Init = (page: PageContext) => void | (() => void);
interface Entry {
  init: Init;
  order: number;
}

const entries: Entry[] = [];
let current: { ctx: gsap.Context; controller: AbortController; cleanups: (() => void)[]; page: PageContext } | null =
  null;
let lastBody: HTMLElement | null = null;
let lenisRef: () => Lenis | null = () => null;

/** used by smooth-scroll.ts to expose its instance on the page context */
export function provideLenis(getter: () => Lenis | null): void {
  lenisRef = getter;
}

function runEntry(entry: Entry): void {
  if (!current) return;
  const { ctx, cleanups, page } = current;
  ctx.add(() => {
    try {
      const cleanup = entry.init(page);
      if (typeof cleanup === 'function') cleanups.push(cleanup);
    } catch (err) {
      console.error('[lifecycle] init failed', err);
    }
  });
}

export function onPage(init: Init, opts: { order?: number } = {}): void {
  const entry: Entry = { init, order: opts.order ?? 0 };
  entries.push(entry);
  entries.sort((a, b) => a.order - b.order);
  if (current) runEntry(entry);
}

function start(): void {
  if (lastBody === document.body && current) return; // already initialised this document
  lastBody = document.body;
  const controller = new AbortController();
  const ctx = gsap.context(() => {});
  const cleanups: (() => void)[] = [];
  const page: PageContext = {
    reduced: prefersReducedMotion(),
    finePointer: isFinePointer(),
    signal: controller.signal,
    revealed: whenRevealed(),
    add<T>(fn: () => T): T | undefined {
      if (controller.signal.aborted) return undefined;
      let out: T | undefined;
      ctx.add(() => {
        out = fn();
      });
      return out;
    },
    onCleanup(fn) {
      cleanups.push(fn);
    },
    get lenis() {
      return lenisRef();
    },
  };
  current = { ctx, controller, cleanups, page };
  for (const entry of [...entries]) runEntry(entry);
  requestAnimationFrame(() => ScrollTrigger.refresh());
  document.dispatchEvent(new CustomEvent('page:init'));
}

function stop(): void {
  if (!current) return;
  const { ctx, controller, cleanups } = current;
  current = null;
  controller.abort();
  for (const fn of cleanups.reverse()) {
    try {
      fn();
    } catch (err) {
      console.error('[lifecycle] cleanup failed', err);
    }
  }
  ctx.revert();
  ScrollTrigger.getAll().forEach((t) => t.kill());
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else queueMicrotask(start);
  document.addEventListener('astro:page-load', start);
  document.addEventListener('astro:before-swap', () => {
    stop();
    resetReveal();
  });
}
