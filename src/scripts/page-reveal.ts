/**
 * Page reveal — the moment a page's entrance animation should start.
 *
 * Every page view has exactly one reveal:
 *   - first visit in the tab: when the intro loader's bars are lifting
 *     (Motion row 03: the hero chains on at "-=0.4" before the bars finish);
 *   - repeat visit (loader skipped): as soon as fonts are ready;
 *   - after a client-side navigation: when the page-transition panel starts
 *     to leave (Motion row 15).
 *
 * API for section code (hero, case-study title, …):
 *   import { whenRevealed } from '../scripts/page-reveal';
 *   whenRevealed().then(() => heroTimeline.play());
 * or inside onPage(): `page.revealed.then(...)`.
 * DOM: <html> gets the class `is-revealed`, and `document` receives
 *   CustomEvent 'page:reveal' (detail: { source: 'loader' | 'transition' | 'instant' }).
 * The loader also fires 'loader:done' on document once it has been removed.
 *
 * CSS hook for pre-reveal states (avoids a flash before JS animates):
 *   html.js:not(.is-revealed) .my-hero-thing { opacity: 0; }
 */
export type RevealSource = 'loader' | 'transition' | 'instant';

let resolveFn: (() => void) | null = null;
let promise: Promise<void> = Promise.resolve();
let revealed = false;

export function resetReveal(): void {
  revealed = false;
  promise = new Promise<void>((r) => (resolveFn = r));
  document.documentElement.classList.remove('is-revealed');
}

export function whenRevealed(): Promise<void> {
  return promise;
}

export function isRevealed(): boolean {
  return revealed;
}

export function reveal(source: RevealSource): void {
  if (revealed) return;
  revealed = true;
  document.documentElement.classList.add('is-revealed');
  resolveFn?.();
  document.dispatchEvent(new CustomEvent('page:reveal', { detail: { source } }));
}

if (typeof document !== 'undefined') resetReveal();
