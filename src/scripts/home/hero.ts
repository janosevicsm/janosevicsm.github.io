/**
 * Home hero motion (Motion rows 03, 04, 05). Markup: components/home/Hero.astro.
 *
 * 03 Entrance — on page reveal (loader bars lifting / transition panel leaving):
 *    photo scales 1.08 → 1 and fades in (1.2 s power3.out), labels rise from line
 *    masks (0.8 s, stagger 0.08), marquee slides in from the right.
 *    Reduced: everything fades together, 300 ms.
 * 04 Marquee — two copies in a track, xPercent wrapped to [-50, 0].
 *    Base 1 loop / 22 s; direction follows scroll direction (down → left);
 *    speed × (1 + |v|·0.12), max 4×, eased back with lerp 0.1. Drifts 80 px
 *    down as the hero leaves. Reduced: static, no loop, no drift.
 * 05 Photo — scrubbed parallax yPercent 0 → 12 and darken to 70 % while the
 *    hero scrolls out. Reduced: off.
 */
import { gsap, ScrollTrigger } from '../gsap';
import { onPage } from '../lifecycle';

const LOOP_SECONDS = 22;
const BASE_SPEED = 50 / LOOP_SECONDS; // xPercent per second (one copy = 50 % of the track)
const MAX_BOOST = 3; // 1 + 3 = 4×

onPage((page) => {
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  if (!hero) return;
  const photo = hero.querySelector<HTMLElement>('[data-hero-photo]');
  const img = hero.querySelector<HTMLElement>('[data-hero-img]');
  const shade = hero.querySelector<HTMLElement>('[data-hero-shade]');
  const mq = hero.querySelector<HTMLElement>('[data-hero-mq]');
  const drift = hero.querySelector<HTMLElement>('[data-hero-mq-drift]');
  const track = hero.querySelector<HTMLElement>('[data-hero-mq-track]');
  const labels = [...hero.querySelectorAll<HTMLElement>('[data-hero-lbl]')];
  const lines = labels.flatMap((l) => [...l.querySelectorAll<HTMLElement>('.ln > span')]);

  /* ---------- Reduced motion: one 300 ms fade, nothing else moves ---------- */
  if (page.reduced) {
    const els = [photo, mq, ...labels].filter((el): el is HTMLElement => !!el);
    gsap.set(els, { opacity: 0 });
    gsap.set(lines, { yPercent: 0 });
    if (track) gsap.set(track, { xPercent: -4 });
    const fade = gsap.to(els, { opacity: 1, duration: 0.3, ease: 'none', paused: true });
    page.revealed.then(() => fade.play());
    return;
  }

  /* ---------- 03 Entrance ---------- */
  const tl = gsap.timeline({ paused: true });
  if (photo) {
    tl.fromTo(photo, { opacity: 0 }, { opacity: 1, duration: 1.2, ease: 'power3.out' }, 0);
    tl.fromTo(photo, { scale: 1.08 }, { scale: 1, duration: 1.4, ease: 'power3.out', transformOrigin: '50% 100%' }, 0);
  }
  if (mq) {
    tl.fromTo(mq, { opacity: 0 }, { opacity: 1, duration: 1, ease: 'power2.out' }, 0.1);
    tl.fromTo(mq, { xPercent: 12 }, { xPercent: 0, duration: 1.4, ease: 'expo.out' }, 0.1);
  }
  if (lines.length) {
    tl.fromTo(lines, { yPercent: 110 }, { yPercent: 0, duration: 0.8, ease: 'power4.out', stagger: 0.08 }, 0.25);
  }
  page.revealed.then(() => tl.play());

  /* ---------- 05 Photo parallax + darken, 04 marquee drift ---------- */
  const scrub = { trigger: hero, start: 'top top', end: 'bottom top', scrub: true };
  if (img) gsap.fromTo(img, { yPercent: 0 }, { yPercent: 12, ease: 'none', scrollTrigger: scrub });
  if (shade) gsap.fromTo(shade, { opacity: 0 }, { opacity: 0.3, ease: 'none', scrollTrigger: { ...scrub } });
  if (drift) gsap.fromTo(drift, { y: 0 }, { y: 80, ease: 'none', scrollTrigger: { ...scrub } });

  /* ---------- 04 Endless marquee ---------- */
  if (!track) return;
  const setX = gsap.quickSetter(track, 'xPercent') as (v: number) => void;
  const wrap = gsap.utils.wrap(-50, 0);
  let x = 0;
  let dir = -1; // -1 = leftwards (scrolling down), 1 = rightwards (scrolling up)
  let boost = 1;
  let lastY = window.scrollY;
  let visible = true;

  // only run while the hero is on screen
  ScrollTrigger.create({
    trigger: hero,
    start: 'top bottom',
    end: 'bottom top',
    onToggle: (self) => {
      visible = self.isActive;
    },
  });

  const tick = (_time: number, deltaMs: number) => {
    const dt = Math.min(deltaMs, 100) / 1000;
    const y = window.scrollY;
    const delta = y - lastY;
    lastY = y;
    if (!visible || dt <= 0) return;
    // velocity in px per 60 fps frame, so the spec's 0.12 factor is frame-rate independent
    const v = delta / (dt * 60);
    if (Math.abs(v) > 0.5) dir = v > 0 ? -1 : 1;
    const target = 1 + Math.min(Math.abs(v) * 0.12, MAX_BOOST);
    boost += (target - boost) * (1 - Math.pow(0.9, dt * 60)); // lerp 0.1 per frame
    x = wrap(x + dir * BASE_SPEED * boost * dt);
    setX(x);
  };
  gsap.ticker.add(tick);
  page.onCleanup(() => gsap.ticker.remove(tick));
});
