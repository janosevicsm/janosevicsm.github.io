# Claude Design prompt

## Before sending

The links are already in the prompt. Claude Design has a web-capture tool, but it is not certain it
opens every link, so attach backups:

1. **Your photo (required):** recent, good light, ideally on a plain background. A cut-out (no
   background) works best.
2. **Backup screenshots:** Dennis's hero, his work list and his footer, plus Brittany's Experience
   section. If its first draft clearly matches the references, you can skip them next time.
3. Optionally, the eMachy logo.

Then paste everything below the line.

---

Design a personal portfolio website for **Marko Janošević**, a full-stack software engineer and tech
lead from Novi Sad, Serbia. The site is English only and will be built as a static site
(Astro + GSAP + Lenis smooth scroll). Show it to me as an interactive prototype, desktop and mobile.

## Links: please open and study these

- Main style reference: https://dennissnellenberg.com
- Timeline reference (Experience section): https://brittanychiang.com
- My startup, the main case study: https://emachy.com
- My employer: https://wedosoftware.eu

If you can't open a link, tell me and work from the attached screenshots instead.

## Look and feel

- **Main reference: Dennis Snellenberg's portfolio** (screenshots attached). I want the same bold,
  editorial, high-impact feel: huge type, lots of space, confident layout, smooth scrolling and
  motion that makes people say "wow". It must not be a copy. Give it its own identity.
- **Timeline reference: Brittany Chiang's Experience section** (screenshot attached). Use her
  structure (date range, role and company, short summary, tech tags), but restyle it in the bold
  editorial look.
- **Colour:** an off-white or light page that alternates with deep dark sections as you scroll, plus
  **one strong accent colour**. Propose 2–3 accent options. Optionally add a very subtle grain or
  noise texture.
- **Type:** a big, characterful display font for the name and headlines, and a clean grotesk for body
  text. Use free fonts only (Google Fonts or Fontshare). Propose a pairing.
- **Avoid:** neon "hacker" terminals, generic bento-grid templates, gradient blobs, custom cursors
  without a purpose, and walls of technology logos.

## Page structure (one long home page)

1. **Loader (short, under 2 s):** greetings cycling quickly in the six eMachy languages —
   "Zdravo · Hello · Hallo · Živjo · Здраво · Bok" — then the page reveals.
2. **Hero:**
   - A big photo of me as the centrepiece.
   - My name, huge, sliding endlessly across the screen ("Marko Janošević —"). The direction follows
     the scroll direction.
   - Small labels: "Full-stack Engineer & Tech Lead" and "Based in Novi Sad, Serbia".
   - A small nav at the top: Work, Experience, About, Contact.
3. **Intro statement:** large text revealed word by word on scroll, for example: *"I build
   full-stack products end to end — from .NET APIs to Angular and React Native apps. Lately I lead a
   team that ships a live marketplace with AI agents as part of the workflow."* Next to it, a round
   magnetic "About me" button.
4. **Featured work: eMachy** (the main case study, give it a big presence):
   - eMachy is a B2B marketplace for new and used industrial machines (listings and lead
     generation). Live at emachy.com since September 2026, with real sellers. Six languages.
   - My role: co-founder and tech lead. I created every repository, made the architecture calls and
     set up the team's AI-assisted way of working (Claude Code as an "agentic software factory",
     with shared automation, code review and release workflows). This is also the topic of my
     master's thesis.
   - Stack: .NET 8 (Clean Architecture), PostgreSQL, Angular 20, Azure, OpenTofu.
   - Design a home-page block for it and a separate **case study page** (hero, problem, my role,
     architecture/stack, the agentic workflow, outcome, link to the live site).
5. **Selected work list (Dennis style):** a list of rows. Hovering a row shows a floating image that
   follows the cursor. Rows:
   - eMachy — Industrial machines marketplace — Tech lead — 2026
   - Agriculture platform — Full-stack (.NET + Angular) — WeDoSoftware
   - Real estate platform — Full-stack (.NET + Angular) — WeDoSoftware
   - HR & time tracking — Full-stack (.NET + Angular) — WeDoSoftware
   - Mobile apps — React Native — WeDoSoftware

   Client work is under NDA, so use the domain names and placeholder images, not client names.
6. **Experience timeline (Brittany structure, bold style).** On desktop, a sticky section title on
   the left; entries scroll on the right and reveal one by one.
   - **Feb 2026 – Present · Co-founder & Tech Lead · eMachy**: architecture, all repositories,
     cross-repo workflow, AI-assisted development. Tags: .NET, Angular, PostgreSQL, Azure, Claude Code.
   - **Jun 2025 – Present · Software Engineer · WeDoSoftware, Novi Sad**: full-stack applications
     for agriculture, real estate, HR tracking and more, mostly .NET + Angular, plus mobile apps in
     React Native. Tags: .NET, C#, Angular, React Native, SQL.
   - **2024 – Present · Master's studies · Faculty of Technical Sciences, Novi Sad**: Software
     Engineering and IT. Thesis: agentic software development.
   - **2020 – 2024 · Bachelor's degree · Faculty of Technical Sciences, Novi Sad**: Software
     Engineering and IT. GPA 9.20/10, "Dositej" scholarship.
   - **2016 – 2020 · Mitrovačka gimnazija, Sremska Mitrovica**: computer science programme.
7. **Skills, compact (no logo wall):** grouped text, for example Backend (.NET/C#, Java/Spring,
   Python, Go, SQL), Frontend (Angular, React, TypeScript), Mobile (React Native, Android), Tools
   (Docker, Azure, GitHub Actions, Claude Code, Figma).
8. **Footer / contact (dark, Dennis style):** a huge "Let's work together" headline with my small
   photo; big round magnetic buttons for email and LinkedIn; small links (GitHub, LinkedIn, email);
   live local time in Novi Sad; a version or build label.
   - Email: markojanosevicsm7@gmail.com
   - GitHub: github.com/janosevicsm
   - LinkedIn: linkedin.com/in/marko-janosevic

## Motion (describe it in the prototype, even if only approximately)

- Smooth, slightly weighted scrolling throughout.
- The moving name in the hero; its speed reacts to scrolling.
- Headlines split into lines or words that slide up into view.
- Background colour shifting between light and dark sections as you scroll.
- Magnetic round buttons that pull towards the cursor, with a fill animation on hover.
- Work-list hover image that follows the cursor smoothly.
- Timeline entries revealing one by one; the period dates could count or slide in.
- A smooth page transition between the home page and the eMachy case study.
- Everything must have a calm fallback when the user prefers reduced motion.

## Deliverables

1. A small design system first: colours, type scale, spacing, buttons, link and hover states.
2. The home page, desktop and mobile.
3. The eMachy case study page, desktop and mobile.
4. Notes on every animation (what moves, when, roughly how long) to hand off to Claude Code.
