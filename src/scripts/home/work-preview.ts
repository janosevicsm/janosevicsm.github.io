/**
 * Work list floating preview (Motion row 10) — used by components/home/WorkList.astro.
 *
 * Fine pointer, ≥ 761 px only (touch / coarse pointers get inline thumbnails in CSS):
 *   - the 400×300 card follows the pointer over the list (quickTo, 0.6 s power3.out),
 *     the round label trails slightly faster (0.35 s);
 *   - the card's vertical strip slides to the hovered row (yPercent = -100 × index,
 *     0.5 s power3.inOut); card and label scale in/out (0.4 s);
 *   - scrolling under a still pointer re-picks the row (elementFromPoint).
 * Row dimming is pure CSS (:has(:hover)).
 * Reduced motion: the card is fixed on the right; panels crossfade (CSS, 300 ms).
 */
import { gsap } from '../gsap';
import { onPage } from '../lifecycle';
import { isMobile } from '../env';

onPage((page) => {
  const list = document.querySelector<HTMLElement>('[data-work-list]');
  const card = document.querySelector<HTMLElement>('[data-work-preview]');
  const cursor = document.querySelector<HTMLElement>('[data-work-cursor]');
  if (!list || !card || !cursor || !page.finePointer) return;

  const rows = [...list.querySelectorAll<HTMLElement>('[data-work-row]')];
  const inner = card.querySelector<HTMLElement>('.wpv__in');
  const strip = card.querySelector<HTMLElement>('.wpv__strip');
  const panels = [...card.querySelectorAll<HTMLElement>('.wpv__panel')];
  const cursorIn = cursor.querySelector<HTMLElement>('.wpvl__in');
  if (!inner || !strip || !cursorIn) return;

  let active = -1;
  let placed = false;
  let lastX = 0;
  let lastY = 0;

  const rowAt = (x: number, y: number): number => {
    const el = document.elementFromPoint(x, y)?.closest<HTMLElement>('[data-work-row]');
    return el && list.contains(el) ? Number(el.dataset.workRow) : -1;
  };

  /* ---------- reduced motion: fixed card, crossfade ---------- */
  if (page.reduced) {
    card.classList.add('is-reduced');
    const set = (i: number): void => {
      if (i === active) return;
      active = i;
      card.classList.toggle('is-on', i >= 0);
      panels.forEach((p, n) => p.classList.toggle('is-active', n === i));
    };
    list.addEventListener(
      'pointermove',
      (e) => {
        if (e.pointerType !== 'touch' && !isMobile()) set(rowAt(e.clientX, e.clientY));
      },
      { signal: page.signal },
    );
    list.addEventListener('pointerleave', () => set(-1), { signal: page.signal });
    page.onCleanup(() => card.classList.remove('is-reduced', 'is-on'));
    return;
  }

  /* ---------- full motion ---------- */
  gsap.set([card, cursor], { visibility: 'visible' });
  gsap.set([inner, cursorIn], { scale: 0 });
  const cardX = gsap.quickTo(card, 'x', { duration: 0.6, ease: 'power3.out' });
  const cardY = gsap.quickTo(card, 'y', { duration: 0.6, ease: 'power3.out' });
  const curX = gsap.quickTo(cursor, 'x', { duration: 0.35, ease: 'power3.out' });
  const curY = gsap.quickTo(cursor, 'y', { duration: 0.35, ease: 'power3.out' });

  const show = (on: boolean): void => {
    gsap.to([inner, cursorIn], {
      scale: on ? 1 : 0,
      duration: 0.4,
      ease: on ? 'expo.out' : 'power3.out',
      overwrite: true,
    });
  };

  const setActive = (i: number): void => {
    if (i === active) return;
    const was = active;
    active = i;
    if (i < 0) {
      show(false);
      return;
    }
    cursorIn.textContent = rows[i]?.dataset.workLabel ?? 'View';
    if (was < 0) {
      // entering: jump the strip (no slide from the previous row) and scale in
      gsap.set(strip, { yPercent: -100 * i });
      show(true);
    } else {
      gsap.to(strip, { yPercent: -100 * i, duration: 0.5, ease: 'power3.inOut', overwrite: true });
    }
  };

  const follow = (x: number, y: number): void => {
    if (!placed) {
      gsap.set([card, cursor], { x, y });
      placed = true;
    }
    cardX(x);
    cardY(y);
    curX(x);
    curY(y);
  };

  list.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType === 'touch' || isMobile()) return;
      lastX = e.clientX;
      lastY = e.clientY;
      if (active < 0) placed = false; // re-enter: appear under the pointer, not glide in
      follow(lastX, lastY);
      setActive(rowAt(lastX, lastY));
    },
    { signal: page.signal },
  );
  list.addEventListener('pointerleave', () => setActive(-1), { signal: page.signal });

  // rows move under a still pointer while scrolling
  window.addEventListener(
    'scroll',
    () => {
      if (active >= 0) setActive(rowAt(lastX, lastY));
    },
    { passive: true, signal: page.signal },
  );
  // leaving through a link (case study) or tab switch: hide immediately
  window.addEventListener('blur', () => setActive(-1), { signal: page.signal });
  list.addEventListener('click', () => setActive(-1), { signal: page.signal });

});
