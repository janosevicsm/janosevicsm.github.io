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
| 1 | Astro scaffold, design tokens, layout, motion core, loader, menu, footer, page transition | subagent | ✅ done (not yet checked in a browser) |
| 2a | Home: hero, intro, eMachy feature | subagent | ⏳ |
| 2b | Home: selected work, experience timeline, toolbox | subagent | ⏳ |
| 2c | eMachy case study page | subagent | ⏳ |
| 3 | Browser check (desktop + mobile, reduced motion), fixes | orchestrator | ⏳ |
| 4 | GitHub Pages deploy | with you | ⏳ |

## Open items for you

- The case study's **Outcome** section has two `[Metric]` placeholders. Give two real numbers
  (for example listings, sellers or countries), or we drop them.
- The work-list images are placeholders. Add real screenshots later if NDAs allow.

## Log

- 2026-10-18: Repo created and design handoff saved under `design/`.
- 2026-10-18: Phase 1 foundation built: Astro 7, GSAP, Lenis, tokens, loader, nav/menu, footer, page transition, motion data attributes. Build and type check pass.
