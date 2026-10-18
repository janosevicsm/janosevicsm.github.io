# Build progress

Building the Claude Design handoff ([design/project/](../design/project/)) as an Astro static site
for GitHub Pages at **janosevicsm.github.io**. The repo is
[janosevicsm/janosevicsm.github.io](https://github.com/janosevicsm/janosevicsm.github.io); the
default branch is `dev` and `main` is for releases.

## Decisions

| Topic | Decision |
|---|---|
| Stack | Astro (static output), GSAP 3.13+ (ScrollTrigger, SplitText), Lenis smooth scroll |
| Fonts | Unbounded (display) and Onest (body), self-hosted through Fontsource |
| Colours | Ink `#0E0F11`, paper `#EFECE5`, accent cobalt `#2F3CFF` (`#8F97FF` on dark) |
| Language | English only |
| Hosting | GitHub Pages user site, deployed by GitHub Actions (set up after the build) |

## Phases

| # | Phase | Owner | Status |
|---|---|---|---|
| 0 | Repo, `main` → `dev`, GitHub remote | orchestrator | ✅ done |
| 1 | Astro scaffold, design tokens, layout, motion core, loader, menu, footer, page transition | subagent | ✅ done |
| 2a | Home: hero, intro, eMachy feature | subagent | ✅ done |
| 2b | Home: selected work, experience timeline, toolbox | subagent | ✅ done |
| 2c | eMachy case study page | subagent | ✅ done |
| 3 | Browser check (desktop + mobile, reduced motion), fixes | orchestrator | ✅ done |
| 4 | GitHub Pages deploy (Actions, on merge to `main`) | with you | ✅ workflow ready, first release PR open |

## Open items for you

- The case study's **Outcome** section shows two numbers (launch date, 6 languages); the design
  had room for two more. emachy.com currently shows 1,468 listings, 7 verified sellers, 6 countries
  and 90 categories. Say which, if any, to add (they will go stale unless updated).
- The work-list images are placeholders. Add real screenshots later if NDAs allow.

## Log

- 2026-10-18: Repo created and design handoff saved under `design/`.
- 2026-10-18: Phase 1 foundation built: Astro 7, GSAP, Lenis, tokens, loader, nav/menu, footer, page transition, motion data attributes. Build and type check pass.
- 2026-10-18: Phase 2 built by three parallel subagents: hero, intro, featured eMachy, work list, experience, toolbox, case study.
- 2026-10-18: Browser review at 1440 and 390 px. Fixed: hero labels stuck hidden, line-mask clipping, narrow work-list layout, designer notes in the mockups. The mockups now use real emachy.com screenshots. Menu, page transition (home ↔ case study), back-link to #work and reduced motion checked.
- 2026-10-18: Review rounds: sharper screenshots, logos, reworked work list, world-language loader, links to eMachy / WeDoSoftware / schools, Instagram, no version label.
- 2026-10-18: GitHub Pages switched to GitHub Actions. `.github/workflows/deploy.yml` builds every PR into `main` and deploys when `main` changes. Release = PR from `dev` to `main`.
