# Code Yaar — The First 100

Frontend for the **Code Yaar Global Founding Community · The First 100**, a global founding cohort of learners and aspiring developers. Built with Next.js App Router, TypeScript and Tailwind CSS. No backend, no database, no authentication.

## Requirements

- Node.js 20.9+ (developed on Node 24)
- npm 10+

## Getting started

```bash
npm install
cp .env.example .env.local   # optional; submission stays disabled when empty
npm run dev
```

Open http://localhost:3000.

## Environment

All variables are build-time public values (see `.env.example`). Nothing secret belongs in this project.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin for metadata, `sitemap.xml` and `robots.txt`. |
| `NEXT_PUBLIC_APPLICATION_ENDPOINT` | HTTPS endpoint receiving the application envelope. Empty = submission disabled. |
| `NEXT_PUBLIC_APPLICATION_PUBLIC_KEY` | Optional public identifier sent as `X-Application-Key`. |
| `NEXT_PUBLIC_APPLICATION_TIMEOUT_MS` | Optional request timeout, clamped to 5000–60000, default 20000. |

When `NEXT_PUBLIC_APPLICATION_ENDPOINT` is empty the form still works and drafts are saved, but submitting shows a clear "not configured" message. It never reports success it did not receive.

## Routes

| Route | Description |
| --- | --- |
| `/` | Mission, principles, cohort introduction, benefits, journey, CTA |
| `/about` | What Code Yaar is, why it exists, philosophy, team |
| `/cohort` | Cohort definition, eligibility, commitment, process, global participation |
| `/apply` | Five-step application form |
| `/faq` | Twelve answered questions, including what is not confirmed |
| `/privacy` | What the application collects and how it is handled |
| `/sitemap.xml`, `/robots.txt` | Generated statically |

## Project structure

```
src/
  app/                 routes, layout, metadata, sitemap, robots
  components/
    apply/             form state machine, steps, review, status
    layout/            header, footer, navigation
    sections/          page sections shared across routes
    ui/                design-system primitives
  lib/
    content/           page copy kept out of components
    application.ts     empty values + review groups
    constants.ts       campaign metadata and option lists
    draft.ts           localStorage draft with validation
    submission.ts      single POST, timeout, typed result
    validation.ts      zod schemas per step
  types/               shared application types
docs/                  product, design, technical and operational documentation
```

Docs start at [`docs/README.md`](docs/README.md). Decisions and their reasoning are in [`docs/08-planning/DECISION-LOG.md`](docs/08-planning/DECISION-LOG.md).

## Submission contract

One `POST` with a JSON envelope:

```json
{
  "submissionId": "uuid, reused across retries",
  "formVersion": "1.0.0",
  "submittedAt": "ISO 8601 timestamp",
  "application": { "...": "all form fields" }
}
```

The browser sends `Content-Type: application/json` and optionally `X-Application-Key`. Any 2xx is treated as success and an optional `reference`, `id` or `submissionId` in the JSON body is shown to the applicant. Non-2xx, timeouts and network failures produce a typed error state with a retry action. The applicant's data is never logged. The provider itself is still **TBD** — see `docs/04-technical/FORM-SUBMISSION-ARCHITECTURE.md`.

## Scripts

```bash
npm run dev        # development server
npm run build      # production build
npm run start      # serve the production build
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
```

## Accessibility and motion

Semantic landmarks, a skip link, labelled fields with inline errors, visible focus styles, keyboard-operable accordion and navigation, and `prefers-reduced-motion` support. Light theme only.

## Status

The site and form are implemented. The submission provider, review timeline, final team biographies, logo and founding-member recognition format are **not confirmed** and are marked as such in the copy and docs. Do not treat any page as a source of statistics, partnerships, dates, or certification claims — none are invented.
