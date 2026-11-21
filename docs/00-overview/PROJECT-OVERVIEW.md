# Project Overview

**Project:** Code Yaar Global Founding Community website rebuild
**Repository:** `C:\Users\HP\-Founding-Community-Code-Yaar`
**Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4
**Deployment:** Static export (`next.config.ts` `output: "export"`)

## Purpose

The founding community website is a separate, frontend-only community initiative for Code Yaar's "The First 100" — the initial global founding cohort. It is not the Code Yaar learning platform and does not connect to its internal systems.

## Required routes

| Route | Purpose |
|---|---|
| `/` | Homepage — campaign hero, mission, principles, cohort intro, journey, CTA |
| `/about` | About Code Yaar and the founding team (Ali Raza, Abdullah, Shabbar) |
| `/cohort` | The First 100 — what it is, who applies, selection, global participation |
| `/apply` | Five-step custom application form with draft persistence and submission |
| `/faq` | Frequently asked questions (accordion) |
| `/privacy` | Privacy information — data categories, handling, rights, minors |

## What was removed (failed UI)

- Dark-first theme (`canvas: #07110F`) and decorative theme toggle
- Kinetic hero (outline ghost rows, drifting marquees, mascot cursor arrows, orbiting ribbon)
- 10×10 decorative dot grid
- framer-motion presentational animations (char reveal, scramble, word-cycle, gradient sweep)
- Glassmorphism/backdrop-blur cards and giant active indicators
- `/benefits` route (duplicated homepage content)
- Mascot/bot illustrations and floating decorative elements
- Unused UI dependencies

## What was preserved

- `src/lib/constants.ts`, `validation.ts`, `application.ts`, `draft.ts`, `submission.ts`, `utils.ts`
- `src/types/application.ts`
- `src/lib/content/*` (home, about, cohort, faq, privacy — honest copy, TBD-marked where unresolved)
- `public/og-image.png`, `robots.ts`, `sitemap.ts`

## Configuration requiring founder approval

- `NEXT_PUBLIC_APPLICATION_ENDPOINT` — the submission endpoint (applications are saved to browser localStorage until configured)
- `NEXT_PUBLIC_APPLICATION_PUBLIC_KEY` — optional public key header
- `NEXT_PUBLIC_APPLICATION_TIMEOUT_MS` — request timeout
- `NEXT_PUBLIC_SITE_URL` — site URL for metadata/sitemap

No credentials, secrets, or personal data are committed to the repository.
