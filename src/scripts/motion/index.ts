/**
 * Motion data-attribute API — import once (BaseLayout does). Sections need no
 * JS of their own for these common cases:
 *
 *   [data-tone="light|dark"] (+ data-tone-fixed)   page light/dark shift      → tone.ts
 *   [data-split-lines]                              headline line-mask reveal  → split-lines.ts
 *   [data-reveal] / ="fade" / ="children"           fade-up on enter           → fade-up.ts
 *   [data-magnetic] (+ class="mag")                 magnetic round button      → magnetic.ts
 *
 * Shared options for split-lines and reveal: data-motion-on="scroll|reveal",
 * data-motion-delay, data-motion-stagger, data-motion-start (options.ts).
 *
 * For custom effects use onPage() from ../lifecycle and gsap from ../gsap;
 * hook entrances on page.revealed / whenRevealed() from ../page-reveal.
 */
import './tone';
import './split-lines';
import './fade-up';
import './magnetic';
