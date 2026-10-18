# Portfolio design references

Shortlist collected 2026-10-18 (every URL checked live).

## Chosen direction

- **Main reference: [Dennis Snellenberg](https://dennissnellenberg.com)**: bold editorial look, big
  type, smooth scroll, a big photo in the hero, magnetic buttons, a big wow effect.
- **Timeline: [Brittany Chiang](https://brittanychiang.com)**: experience as a dated list with
  tech tags, restyled to fit the bold look.
- **Rejected:** the minimal sites (Emil, Paco, Lee and the like) and the terminal-style ones.
- **Decisions:** a big photo in the hero; light page with dark sections and one accent colour;
  English only; no AI chat feature.

The prompt for Claude Design is in [claude-design-prompt.md](claude-design-prompt.md).

## Shortlist

| ✓ | Site | Style | Worth borrowing | Build effort |
|---|---|---|---|---|
| [ ] | [Brittany Chiang](https://brittanychiang.com) | Dark, two columns, timeline-led | Fixed left column (name, role, nav) while the right side scrolls; experience as a dated list with tech tags; soft glow that follows the cursor; active section lit in the nav | Low–medium |
| [ ] | [Emil Kowalski](https://emilkowal.ski) | Minimal "design engineer" | One narrow column, very quiet type, tiny polished hover/press details | Low |
| [ ] | [Paco Coursey](https://paco.me) | Minimal, typographic | Calm monochrome text sections, a "Now" section; made by the author of the ⌘K menu library | Low |
| [ ] | [Rauno Freiberg](https://rauno.me) | Minimal, experimental interactions | Block-style nav, click-to-copy email, archive of old site versions | Medium |
| [ ] | [Lee Robinson](https://leerob.com) | Ultra-minimal text | Short/long bio switch; restraint that reads as senior | Low |
| [ ] | [Jakub Krehel](https://jakub.kr) | Minimal design engineer | Strong text hierarchy; projects include agent skills (fits the AI angle) | Low |
| [ ] | [ibelick](https://ibelick.com) | Minimal, "engineer for AI startups" | How to present an AI-product-engineer identity | Low |
| [ ] | [Samuel Kraft](https://samuelkraft.com) | Minimal list with thumbnails | Each project row has an image | Low–medium |
| [ ] | [Jhey Tompkins](https://jhey.dev) | Minimal home, heavy CSS craft | Live status strip (location, time), numbered "Latest" list, build hash in footer | Medium |
| [ ] | [Josh W. Comeau](https://www.joshwcomeau.com) | Playful, warm | Springy micro-interactions, animated theme switch, optional sounds | Medium–high |
| [ ] | [Dennis Snellenberg](https://dennissnellenberg.com) | Bold editorial, big type, smooth scroll | "Hello" loader in many languages, huge name hero, magnetic buttons, images following cursor over the work list, live local time | High |
| [ ] | [Ravi Klaassens](https://raviklaassens.com) | Bold editorial studio | Statement headline, case-study carousel, live clock, availability note | High |
| [ ] | [Olivier Larose](https://olivierlarose.com) | Editorial index table | Projects as a table (project / category / client / year), small "edition" labels | Medium |
| [ ] | [Huy Phan](https://huyml.co) | Cinematic editorial (Awwwards SOTD, Oct 2026) | Display + grotesk font pair, numbered project slides, project index | High |
| [ ] | [kuber.studio](https://kuber.studio) | Dark terminal + AI assistant | Interactive terminal, chat assistant, sections named like commands; static fallback without JS | Medium |
| [ ] | [Nelson Lai](https://nelsonlai.dev) | Bento / card dashboard | Modular cards: stack, stats, live widgets | Medium |

Extra timeline examples: [Dillion Verma](https://dillion.io) (experience as cards with logo, role,
dates), [Anthony Fu](https://antfu.me).

3D / WebGL (inspiration only, one at most): [Bruno Simon](https://bruno-simon.com),
[Arthur Engel](https://aengel.io) (note his "Lite version" link).

## Trends worth using (2025–2026)

- Smooth scroll with **Lenis**, scroll-triggered reveals with **GSAP ScrollTrigger** (GSAP is fully free since 3.13, all plugins included).
- Native **CSS scroll-driven animations** and the **View Transitions API** — now usable in Chrome/Edge/Safari; keep content visible where unsupported.
- Fonts: **Geist + Geist Mono**, **Inter + Instrument Serif** (serif for display headings); rising: Funnel Display, Fraunces.
- Subtle **grain/noise texture** over flat colour.
- **⌘K command menu** as a power-user shortcut next to normal nav.
- Small "alive" details: local time in Novi Sad, current status ("building eMachy"), build hash.
- **Bento grids** — 6–9 tiles max.

## Overdone — avoid

Neon-green "hacker" typewriter terminals, generic shadcn/Aceternity bento templates, custom cursors
and gradient blobs with no reason, long skill-logo walls, long full-screen loaders.
