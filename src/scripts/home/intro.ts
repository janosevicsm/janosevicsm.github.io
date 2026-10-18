/**
 * Intro statement — Motion row 06. Markup: components/home/Intro.astro.
 *
 * Words (SplitText, type "words") go from 15 % to 100 % opacity in one scrubbed
 * timeline while the paragraph scrolls from "top 80%" to "bottom 55%". When the
 * scrub reaches "AI agents" its accent highlighter sweeps in left → right
 * (0.6 s CSS transition on .hl.is-on) and retracts if you scroll back above it.
 * Reduced motion: no split, full opacity, highlight static (the CSS default).
 */
import { gsap, SplitText } from '../gsap';
import { onPage } from '../lifecycle';

const DIM = 0.15;

onPage((page) => {
  const vis = document.querySelector<HTMLElement>('[data-intro-words]');
  if (!vis || page.reduced) return;
  const hl = vis.querySelector<HTMLElement>('[data-intro-hl]');

  const split = SplitText.create(vis, { type: 'words', wordsClass: 'w', tag: 'span', aria: 'none' });
  const words = split.words as HTMLElement[];
  if (!words.length) return;

  // index (in `words`) of the last highlighted word: the sweep starts once it is lit
  const hlWords = hl ? words.filter((w) => hl.contains(w)) : [];
  const hlIndex = hlWords.length ? words.indexOf(hlWords[hlWords.length - 1]!) : -1;
  if (hl) hl.setAttribute('data-hl-anim', '');

  gsap.set(words, { opacity: DIM });
  const n = words.length;
  const sync = (progress: number) => {
    if (!hl || hlIndex < 0) return;
    // word i is fully lit at timeline time i + 1 (each tween 1 long, stagger 1)
    hl.classList.toggle('is-on', progress * n >= hlIndex + 1);
  };
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: vis,
      start: 'top 80%',
      end: 'bottom 55%',
      scrub: true,
      onUpdate: (self) => sync(self.progress),
      onRefresh: (self) => sync(self.progress),
    },
  });
  tl.to(words, { opacity: 1, duration: 1, ease: 'none', stagger: 1 }, 0);

  page.onCleanup(() => hl?.removeAttribute('data-hl-anim'));
});
