/**
 * Single place where GSAP plugins are registered. Import gsap and plugins from
 * here (not from 'gsap' directly) so registration always happens once.
 *
 * Named eases (Motion.dc.html):
 *   'mj.inOut'  cubic-bezier(.65,0,.35,1)  fills, wipes
 *   'mj.bars'   cubic-bezier(.76,0,.24,1)  loader bars, menu panel
 *   entrances use 'expo.out' / 'power4.out'; magnetic release 'elastic.out(1, .4)'.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);

export const EASE_IN_OUT = 'mj.inOut';
export const EASE_BARS = 'mj.bars';
if (!CustomEase.get(EASE_IN_OUT)) CustomEase.create(EASE_IN_OUT, '.65,0,.35,1');
if (!CustomEase.get(EASE_BARS)) CustomEase.create(EASE_BARS, '.76,0,.24,1');

gsap.defaults({ overwrite: 'auto' });
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger, SplitText, CustomEase };
