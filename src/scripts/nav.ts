/**
 * Nav → menu — Motion row 14.
 *
 * - Top bar (logo + Work / Experience / About / Contact) rises from line masks
 *   on page reveal (0.8 s power3.out, stagger 0.08).
 * - After the hero ([data-nav-fold], else #hero, else the first [data-tone]
 *   section) the inline nav folds into the round "Menu" button, top right
 *   (scale 0.35 s back.out). On ≤ 760 px the button is always shown.
 * - Panel slides in from the right (0.8 s expo.inOut), links rise in sequence
 *   (stagger 0.06). Focus is trapped while open, Esc / scrim / link click close
 *   it and focus returns to the button. Scroll is locked while open.
 * - Active section gets an accent dot (links carry data-nav-key; sections are
 *   matched by id, see SECTION_KEYS).
 * Reduced motion: fades, 200 ms.
 */
import { gsap, ScrollTrigger } from './gsap';
import { onPage } from './lifecycle';
import { stopScroll, startScroll } from './smooth-scroll';

/** section id → nav key */
const SECTION_KEYS: Record<string, string> = {
  about: 'about',
  emachy: 'work',
  work: 'work',
  experience: 'experience',
  contact: 'contact',
};

let closeMenuRef: (() => void) | null = null;
document.addEventListener('astro:before-preparation', () => closeMenuRef?.());

onPage((page) => {
  const btn = document.querySelector<HTMLButtonElement>('[data-menu-button]');
  const panel = document.querySelector<HTMLElement>('[data-menu-panel]');
  const scrim = document.querySelector<HTMLElement>('[data-menu-scrim]');
  const label = btn?.querySelector<HTMLElement>('.t');
  const { signal, reduced } = page;

  // ---- entrance ----
  const rise = document.querySelectorAll<HTMLElement>('[data-topbar] [data-rise]');
  if (rise.length) {
    const intro = reduced
      ? gsap.fromTo(rise, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'none', paused: true })
      : gsap.fromTo(
          rise,
          { yPercent: 110 },
          { yPercent: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08, paused: true },
        );
    page.revealed.then(() => intro.play());
  }

  // ---- active section dot ----
  const links = [...document.querySelectorAll<HTMLAnchorElement>('[data-nav-key]')];
  const triggers: { key: string; st: ScrollTrigger }[] = [];
  const setActive = (key: string) => {
    for (const a of links) {
      const on = a.dataset.navKey === key;
      a.classList.toggle('is-active', on);
      if (on) a.setAttribute('aria-current', 'location');
      else a.removeAttribute('aria-current');
    }
  };
  const recompute = () => setActive(triggers.filter((t) => t.st.isActive).map((t) => t.key).pop() ?? '');
  for (const [id, key] of Object.entries(SECTION_KEYS)) {
    const el = document.getElementById(id);
    if (!el) continue;
    triggers.push({ key, st: ScrollTrigger.create({ trigger: el, start: 'top 60%', end: 'bottom 60%', onToggle: recompute }) });
  }

  if (!btn || !panel || !scrim) return;

  // ---- menu button visibility ----
  let folded = false;
  let open = false;
  let mobile = false;
  const showBtn = (show: boolean) => {
    if (show) {
      gsap.set(btn, { visibility: 'visible' });
      if (reduced) gsap.to(btn, { opacity: 1, scale: 1, duration: 0.2, ease: 'none', overwrite: 'auto' });
      else gsap.to(btn, { scale: 1, opacity: 1, duration: 0.35, ease: 'back.out(1.7)', overwrite: 'auto' });
    } else {
      const hide = () => gsap.set(btn, { visibility: 'hidden' });
      if (reduced) gsap.to(btn, { opacity: 0, duration: 0.2, ease: 'none', overwrite: 'auto', onComplete: hide });
      else gsap.to(btn, { scale: 0, duration: 0.25, ease: 'power2.in', overwrite: 'auto', onComplete: hide });
    }
  };
  let shown: boolean | null = null;
  const sync = () => {
    const want = mobile || folded || open;
    if (want === shown) return;
    shown = want;
    showBtn(want);
  };

  const mm = gsap.matchMedia();
  mm.add('(max-width: 760px)', () => {
    mobile = true;
    sync();
    return () => {
      mobile = false;
    };
  });
  const foldEl =
    document.querySelector<HTMLElement>('[data-nav-fold]') ??
    document.getElementById('hero') ??
    document.querySelector<HTMLElement>('main [data-tone]');
  if (foldEl) {
    ScrollTrigger.create({
      trigger: foldEl,
      start: 'bottom 25%',
      end: 'max',
      onToggle: (self) => {
        folded = self.isActive;
        sync();
      },
    });
    folded = foldEl.getBoundingClientRect().bottom < window.innerHeight * 0.25;
  } else {
    folded = true;
  }
  // initial state without animation
  shown = mobile || folded;
  gsap.set(btn, shown ? { scale: 1, opacity: 1, visibility: 'visible' } : { scale: reduced ? 1 : 0, opacity: reduced ? 0 : 1, visibility: 'hidden' });
  matchMedia('(max-width: 760px)').addEventListener('change', () => requestAnimationFrame(sync), { signal });

  // ---- panel ----
  const panelLinks = [...panel.querySelectorAll<HTMLElement>('[data-menu-rise]')];
  // x: 0 drops the CSS translateX(102%) so only xPercent is used
  gsap.set(panel, reduced ? { x: 0, xPercent: 0, opacity: 0 } : { x: 0, xPercent: 102, opacity: 1 });
  let returnFocus: HTMLElement | null = null;
  let tl: gsap.core.Timeline | null = null;

  const focusables = () =>
    [btn, ...panel.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')].filter(
      (el) => !el.hasAttribute('inert'),
    );

  const openMenu = () => {
    if (open) return;
    open = true;
    sync();
    returnFocus = btn;
    panel.inert = false;
    panel.removeAttribute('aria-hidden');
    btn.setAttribute('aria-expanded', 'true');
    btn.setAttribute('aria-label', 'Close menu');
    if (label) label.textContent = 'Close';
    stopScroll();
    tl?.kill();
    gsap.set(panel, { visibility: 'visible' });
    scrim.classList.add('is-open');
    tl = gsap.timeline();
    if (reduced) {
      tl.to(panel, { opacity: 1, duration: 0.2, ease: 'none' });
    } else {
      tl.to(panel, { xPercent: 0, duration: 0.8, ease: 'expo.inOut' });
      tl.fromTo(panelLinks, { yPercent: 110 }, { yPercent: 0, duration: 0.8, ease: 'power3.out', stagger: 0.06 }, 0.3);
    }
    const first = panel.querySelector<HTMLElement>('a[href]');
    requestAnimationFrame(() => first?.focus({ preventScroll: true }));
  };

  const closeMenu = (restoreFocus = true) => {
    if (!open) return;
    open = false;
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Open menu');
    if (label) label.textContent = 'Menu';
    scrim.classList.remove('is-open');
    startScroll();
    tl?.kill();
    tl = gsap.timeline({
      onComplete: () => {
        panel.inert = true;
        panel.setAttribute('aria-hidden', 'true');
        gsap.set(panel, { visibility: 'hidden' });
      },
    });
    if (reduced) tl.to(panel, { opacity: 0, duration: 0.2, ease: 'none' });
    else tl.to(panel, { xPercent: 102, duration: 0.7, ease: 'expo.inOut' });
    if (restoreFocus && panel.contains(document.activeElement)) (returnFocus ?? btn).focus({ preventScroll: true });
    else if (restoreFocus && document.activeElement === btn) btn.focus({ preventScroll: true });
    sync();
  };
  closeMenuRef = () => closeMenu(false);

  btn.addEventListener('click', () => (open ? closeMenu() : openMenu()), { signal });
  scrim.addEventListener('click', () => closeMenu(), { signal });
  panel.addEventListener(
    'click',
    (e) => {
      if ((e.target as Element).closest('a[href]')) closeMenu(false);
    },
    { signal },
  );
  document.addEventListener(
    'keydown',
    (e) => {
      if (!open) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        closeMenu();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = focusables();
      if (!items.length) return;
      const first = items[0]!;
      const last = items[items.length - 1]!;
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && (active === first || !items.includes(active!))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !items.includes(active!))) {
        e.preventDefault();
        first.focus();
      }
    },
    { signal },
  );

  return () => {
    if (open) startScroll();
    open = false;
    closeMenuRef = null;
    mm.revert();
  };
});
