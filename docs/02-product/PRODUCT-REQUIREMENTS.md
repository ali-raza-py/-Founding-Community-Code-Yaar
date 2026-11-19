# Product Requirements

**Status:** Implemented. Acceptance criteria marked ✅ are verified; others are noted.

## 1. Product scope

A frontend-only Next.js website with six routes, a five-step application form, and no server of its own.

### In scope

- Marketing and information pages.
- A custom, multi-step application experience.
- One external submission endpoint (configurable, optional in development).
- SEO fundamentals, accessibility, responsive layouts.

### Out of scope (explicitly)

- Backends, API routes, server actions, databases, auth.
- Admin dashboard or application review UI.
- Email sending, notifications, calendars.
- Payments, certificates, analytics, chat.
- Integration with the Code Yaar platform.

## 2. Routes

| Route | Purpose | Rendering |
| --- | --- | --- |
| `/` | Explain the community and route to apply | Static |
| `/about` | Code Yaar, philosophy, founding team | Static |
| `/cohort` | Details of The First 100, eligibility, process | Static |
| `/apply` | Five-step application | Static shell + client form |
| `/faq` | Twelve questions with honest answers | Static + client accordion |
| `/privacy` | What is collected and why | Static |
| `not-found` | Unknown routes | Static |

## 3. Functional requirements

### RF-1 Navigation

- Persistent header on all routes with wordmark, four links (About, The Cohort, FAQ, Apply) and a primary CTA.
- Active-route indication.
- Mobile: accessible disclosure menu, closes on navigation and `Escape`, traps nothing but restores focus to the trigger.
- Skip link to main content.

**Acceptance:** all links reach the correct route; menu fully keyboard operable; no layout shift.

### RF-2 Landing page

Required sections, in order: hero (campaign label, heading, supporting text, two CTAs), mission, five principles, First 100 introduction with an explicit early-stage statement, member benefits with qualifiers, 8-step journey timeline, final CTA.

**Acceptance:** every CTA points to `/apply` or `/cohort`; no fabricated statistics; no testimonial imagery.

### RF-3 About page

Code Yaar description, rationale, Think/Build/Evolve, community vision, three founder profiles with roles only (no invented biographies), initials-based monograms in place of missing photographs, and a statement that portraits are added only when real images are supplied.

### RF-4 Cohort page

Definition, who should apply, expectations, four-stage selection process with a no-guarantee statement, global participation and time-zone commitments.

### RF-5 FAQ

Twelve specified questions, accessible accordion (`button` + `aria-expanded` + `aria-controls`), each answer reflecting a decided policy or explicitly saying details are not confirmed.

### RF-6 Application form

Five steps, validation per [`APPLICATION-FORM-SPECIFICATION.md`](APPLICATION-FORM-SPECIFICATION.md), review step, consent, submission states, duplicate prevention, draft persistence notice.

### RF-7 Privacy page

Data categories, purposes, access, retention, rights, contact placeholders marked `TBD`. Must not claim certification or compliance.

## 4. Non-functional requirements

| ID | Requirement |
| --- | --- |
| NF-1 | No backend code, no route handlers, no server actions. |
| NF-2 | No secrets in client bundles. Only `NEXT_PUBLIC_*` variables are read. |
| NF-3 | No third-party scripts. |
| NF-4 | Static generation for informational pages. |
| NF-5 | Keyboard-only usable; visible focus; WCAG AA contrast for text. |
| NF-6 | No horizontal overflow from 320px up. |
| NF-7 | `prefers-reduced-motion` respected. |
| NF-8 | Unique title/description per route; Open Graph defaults; sitemap and robots. |
| NF-9 | Builds with `npm run build`; type-checks with `npm run typecheck`. |
| NF-10 | Applicant data never logged to the console and never placed in URLs. |

## 5. Content requirements

- No invented dates, partners, statistics, testimonials, benefits or team credentials.
- Clear separation of *today*, *planned for the cohort*, and *long-term ambition*.
- No guarantee of jobs, internships, scholarships or certificates.
- `TBD` used publicly only where a short, honest statement is better than a fabricated answer.

## 6. Error and empty states

| Condition | Required behaviour |
| --- | --- |
| Endpoint not configured | Step 5 shows a notice that live submission is not configured; submit is disabled; no success is claimed; answers are kept as a draft. |
| Request fails (network/5xx) | Honest error, retry button, answers preserved. |
| Request times out | Timeout message with retry; note that the application may still have arrived. |
| Duplicate submit attempt | Button disabled while in flight; idempotency key reused on retry; form locked after success. |
| Invalid field | Inline message, `aria-invalid`, focus moves to first invalid field of the step. |

## 7. Acceptance status

| Criterion | Status |
| --- | --- |
| Six routes reachable and styled | ✅ all six return `200` from the production build; `/404` renders for unknown paths |
| Navigation, footer links, CTAs correct | ✅ inspected in source and rendered HTML |
| Form validation and step navigation | ✅ implemented; schema-level checks pass typecheck, interactive pass **not** automated |
| Review/edit/consent | ✅ implemented; consent blocks submission |
| Submission states incl. unconfigured endpoint | ✅ implemented; unconfigured build shows the notice and disables submit |
| No fabricated claims or statistics | ✅ content written against the constraint list; no numbers, partners or dates invented |
| Build + typecheck + lint | ✅ `npm run build`, `npm run typecheck`, `npm run lint` all exit 0 |
| Automated tests / Lighthouse measurement | ❌ not run — no test harness or measurement in this environment |

## Related documents

- [`WEBSITE-STRUCTURE.md`](WEBSITE-STRUCTURE.md)
- [`USER-JOURNEYS.md`](USER-JOURNEYS.md)
- [`APPLICATION-FORM-SPECIFICATION.md`](APPLICATION-FORM-SPECIFICATION.md)
- [`../04-technical/TECHNICAL-ARCHITECTURE.md`](../04-technical/TECHNICAL-ARCHITECTURE.md)
