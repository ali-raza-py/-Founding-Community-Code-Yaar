# Reference Design Audit

**Project:** Code Yaar Global Founding Community — frontend rebuild
**Status:** Complete (Phase 1–3 input)
**Repositories inspected:** founding community (this repo, `main`) and official Code Yaar frontend (`https://github.com/ali-raza-py/Code-Yaar`, `frontend/` directory)

---

## 1. Existing founding website — problems identified

| Area | Problem |
|---|---|
| Theme | Dark-first (`canvas: #07110F`, `data-theme` dark/light switcher). Contradicts the light-primary design direction. |
| Hero | Kinetic "The First 100" wordmark with outline ghost rows, drifting marquees, 5 mascot cursor-arrow characters with gaze tracking, and an orbiting ribbon ring. Decorative bots/mascots and ambient motion — banned by the rebuild standard. |
| Dot grid | 10×10 decorative dot grid component — banned decorative element. |
| Typography | Manrope (display), Inter (body), JetBrains Mono — not the specified Montserrat heading system; heavy animation classes (`char-reveal`, `scramble`, `word-cycle`, ghost drift). |
| Header | Glassmorphism/backdrop-blur on scroll, giant animated active indicator, decorative theme toggle. |
| Animation | framer-motion shared-layout nav indicator, scroll reveals, hero lift, button sheen sweeps — excessive for a community site; slows page load. |
| Palette | Custom teal/emerald mix (`#3DAE76` hero-ink, teal accents) not aligned with the specified emerald identity (`#087A52` family). |
| Routes | `/benefits` page exists but is not a required route; duplicates homepage benefit content. |
| Dependencies | framer-motion used for presentational animation only — unnecessary dependency per the rebuild standard. |
| Brand assets | Existing logos (`public/code-yaar-logo.png`, `code-yaar-logo-light.png`) are local copies; official brand assets (`logo-light.png`, `logo-dark.png`, `logo-mark.png`, team portraits) were not used. |

## 2. Official Code Yaar design characteristics (source of truth)

Inspected at `github.com/ali-raza-py/Code-Yaar` → `frontend/` (Next.js 16.3.5, React 19, Tailwind CSS v4, `src/app/globals.css`).

**Theme tokens (`frontend/src/app/globals.css`, light theme `:root`):**
- Background: `oklch(0.992 0.002 160)` — near-white warm neutral, effectively `#F7F8F5`–`#F8FAF8` range.
- Foreground: `oklch(0.22 0.01 250)` — dark neutral text.
- Primary (emerald): `oklch(0.59 0.145 163)`.
- Border/input: `oklch(0.90 0.006 250 / 0.85)` — subtle muted border.
- CTA emerald: `oklch(0.59 0.145 163)`; hover `oklch(0.53 0.14 163)`; CTA foreground white.
- Surfaces: card `oklch(1 0 0)` (white); secondary/muted `oklch(0.965–0.968 ...)`; green-deep `oklch(0.42 0.10 163)`; green-pale `oklch(0.965 0.025 163)`.
- Radius: `--radius: 0.5rem`; card radius `0.75rem`; pill `9999px`.
- Section padding token: `--space-section: 6rem`.
- Shadows: subtle layered shadows only (`shadow-1`…`shadow-3`); hairline borders do most elevation.
- UI patterns observed: `dc-btn-primary` (solid emerald, white text), `dc-btn-outline` (bordered), `dc-input`, `dc-card` (hairline border, white card, hover lift), hairline cards over shadows.
- Typography: Fraunces (display serif, headings), Figtree (sans body/UI), JetBrains Mono (technical labels).
- Navigation (`public-header.tsx`): sticky `h-16` header, `max-w-6xl` container, logo mark + "Code Yaar" wordmark, desktop links, mobile menu, primary CTA button; white/near-white surface, bottom border, dark text.
- Footer: link columns (Platform, Credentials, Company), logo + short description, social row, copyright + "Think. Build. Evolve." tagline.
- Team assets: `public/team/ali-raza.png`, `abdullah.png`, `shabbar-raza.png` — actual founder photographs.

**Cross-check against the prompt palette:** the prompt's `#F7F8F5` background, white cards, `#19231D` primary text, `#46534A` secondary text, `#087A52` primary emerald, `#176B47` hover, `#D9E7DC` light green surface, `#E8ECE8` muted border are consistent with the official light theme (near-white neutral canvas, emerald brand, dark readable text). Where the prompt gives explicit hex values, those are used; they align with the official emerald family.

## 3. Existing assets worth reusing

- `src/lib/constants.ts` — campaign metadata, nav links, form version, step labels, age/education/experience/time/language options, country list, privacy consent text. **Keep.**
- `src/lib/validation.ts` — Zod schemas for all five application steps. **Keep.**
- `src/lib/application.ts` — `EMPTY_APPLICATION` and `REVIEW_GROUPS` for the review step. **Keep.**
- `src/lib/draft.ts` — localStorage draft persistence, session-submission guard. **Keep.**
- `src/lib/submission.ts` — configurable endpoint submission adapter with localStorage fallback, timeout, dedup `submissionId`, no logging of applicant data. **Keep.** Endpoint driven by `NEXT_PUBLIC_APPLICATION_ENDPOINT`.
- `src/lib/utils.ts` — `cn` helper. **Keep.**
- `src/types/application.ts` — `ApplicationData`, `ApplicationEnvelope`, `SubmissionResult`, `SubmissionStatus`. **Keep.**
- `src/lib/content/*` — all copy (home, about, cohort, faq, privacy). **Keep** — honest, TBD-marked copy that matches the rebuild constraints (no job/internship/certificate promises).
- `public/og-image.png` — keep.
- `src/app/robots.ts`, `src/app/sitemap.ts` — keep.
- Official brand assets downloaded to `public/brand/` and `public/team/`: `logo-light.png`, `logo-dark.png`, `logo-mark.png`, `ali-raza.png`, `abdullah.png`, `shabbar-raza.png`.

## 4. Exact color values adopted

| Purpose | Value (used) | Official cross-reference |
|---|---|---|
| Main background | `#F7F8F5` | `oklch(0.992 0.002 160)` |
| Card background | `#FFFFFF` | `oklch(1 0 0)` |
| Primary text | `#19231D` | `oklch(0.22 0.01 250)` |
| Secondary text | `#46534A` | `oklch(0.50 0.015 250)` muted |
| Primary emerald | `#087A52` | `oklch(0.59 0.145 163)` primary / `oklch(0.42 0.10 163)` green-deep |
| Dark forest | `#123D2B` | deep emerald surface |
| Emerald hover | `#176B47` | `oklch(0.53 0.14 163)` cta-hover |
| Light green surface | `#D9E7DC` | `oklch(0.965 0.025 163)` green-pale |
| Muted border | `#E8ECE8` | `oklch(0.90 0.006 250 / 0.85)` |
| Supporting green | `#26966A` | secondary emerald emphasis |

No purple, pink, neon blue, or rainbow accents. No gradients as layout devices.

## 5. Typography findings

- Prompt spec: **Montserrat** for main/section/brand/campaign headings; clean modern sans-serif for body/navigation/forms/FAQ; restrained monospace for technical labels.
- Official spec: Fraunces (display serif), Figtree (sans body), JetBrains Mono (code).
- Adopted: Montserrat (headings), Figtree (body/UI), JetBrains Mono (technical labels/mono). All loaded via `next/font/google` with `display: "swap"`, Latin subset only, required weights only (400/500/600/700/800 for Montserrat; 400/500/600 for Figtree; 400/500 for JetBrains Mono).

## 6. Layout and spacing findings

- Container: `max-w-6xl` (~1152px equivalent), px-4/sm:px-6/lg:px-8 padding.
- Section padding: 6rem block (desktop), scaled for mobile.
- Header height: `h-16`, sticky, bottom border, dark text on white surface.
- Cards: hairline `1px` border, white surface, 12px radius, subtle hover lift — no heavy shadows.
- Buttons: solid emerald primary with white text; outlined secondary; 8–12px radius, not pills unless badge-like.
- Type scale: clamped fluid headings; max prose width ~65ch; line-height ~1.6.

## 7. Components to recreate (new implementation)

- `SiteHeader` — sticky navbar, Code Yaar logo wordmark, links (About, The Cohort, FAQ), Apply CTA, emerald active indicator, mobile menu, no theme toggle.
- `SiteFooter` — link columns, logo, socials, copyright, tagline.
- `Wordmark` / logo component with light/dark variants.
- Typography components: headings, lead, body, label, small.
- Section container (`Section`) with consistent padding and max-width.
- `Button` (primary/outline), `Field` (label + input/select/textarea + error), `Badge`.
- Homepage: Hero, Mission, Principles, Founding cohort intro, Community journey (timeline), Final CTA.
- Pages: About, Cohort, Apply (5-step form), FAQ, Privacy.
- Application form: 5 steps, Zod validation, draft persistence, submission status, review/edit controls, duplicate prevention.

## 8. Components that can be reused conceptually

- Application form step structure (personal, education, programming, motivation, review) — kept, restyled.
- Review groups and submission adapter — kept unchanged.
- Footer link-column concept — kept, scoped to the six community routes.

## 9. Differences between official platform and founding community

- Official is a full learning platform (Django backend, courses, challenges, certificates, auth, dashboard, IDE). The founding community is frontend-only: six static/marketing pages plus a client-side application form with a configurable submission endpoint.
- No backend integration, no auth, no API routes, no server actions, no database.
- The founding site has its own identity ("The First 100 · Global Founding Cohort 2026–27") while inheriting Code Yaar's visual language.

## 10. Proposed rebuilding approach

1. Record audit (this file) + backup branch `backup/pre-rebuild-20261120` (commit `2061c49`).
2. Remove failed UI: dark-first theme, mascots, dot grid, kinetic hero/motion library, theme toggle, glassmorphism, `/benefits` route, framer-motion dependency.
3. Rewrite `globals.css` with `@theme` tokens from the audit palette; light theme primary; no theme toggle.
4. Load Montserrat/Figtree/JetBrains Mono via `next/font/google` in `layout.tsx`.
5. Rebuild shared components (header, footer, ui primitives, section container, typography).
6. Rebuild six pages (`/`, `/about`, `/cohort`, `/apply`, `/faq`, `/privacy`) using existing copy and lib logic.
7. Rebuild the 5-step application form with the preserved submission adapter (honest "not configured" state when no endpoint is set).
8. Add docs per `docs/` structure; run lint/typecheck/build; browser-test light theme across viewports.
