# User Journeys

**Status:** Implemented journeys for the website; downstream operational steps are `TBD`.

## Personas

| Persona | Context | Primary need |
| --- | --- | --- |
| **Ayesha, 19, Lahore** | Second-year CS student, knows Python basics, has never finished a project. | A reason and a group to build something small. |
| **Diego, 27, Bogotá** | Self-taught, works full time, learns at night. | Asynchronous participation that fits his hours. |
| **Mira, 16, Nairobi** | Learning from free resources, no GitHub. | A welcoming entry point that does not demand a portfolio. |
| **Sam, 31, Berlin** | Career switcher, has a portfolio, wants peers. | Honest feedback and a credible community. |

## Journey 1 — First-time visitor → applicant

```text
Arrive at /  →  read hero  →  scan mission + principles  →  cohort block
      →  /cohort  →  eligibility + process  →  /apply
      →  step 1 … step 5  →  review  →  consent  →  submit
      →  success screen (+ what happens next)
```

**Design decisions that support this:**

- The hero answers *what / who / why* above the fold, with the campaign label making the stage explicit.
- The early-stage disclosure appears before benefits, so expectations are set before desire.
- `/cohort` carries the process and the no-guarantee statement; `/apply` repeats the caveat next to the submit button.
- The form is in the same visual system as the site — no jarring third-party embed.

**Failure branches:**

| Branch | Behaviour |
| --- | --- |
| Endpoint unconfigured (dev/demo) | Step 5 shows "live submission is not configured"; submit disabled; draft preserved. |
| Network error | Error alert, Retry button, all answers intact. |
| Timeout | Timeout alert, Retry reuses the same submission id, note that it may have arrived. |
| Validation error | Focus moves to the first invalid field; step indicator shows errors. |
| Leaves mid-form | Draft saved locally (after step 1 is valid) and restored with a visible notice. |

## Journey 2 — Sceptical visitor

```text
/faq  →  "Is this free?" / "Do I need experience?" / "Will I get a job?"
      →  honest answers, no hedging  →  /about  →  trust  →  /apply
```

The FAQ is written for the sceptic, not the enthusiast. Answers about certificates and jobs are unambiguously negative or `TBD`.

## Journey 3 — Referred applicant

Lands directly on `/apply` from a shared link. The page must be self-sufficient: a short explanation of the programme, the time it takes, privacy summary, and a link to `/cohort` for detail. It must not assume the visitor has seen the homepage.

## Journey 4 — Mobile visitor on a slow connection

360px viewport, 3G. Requirements: no hero images blocking render, system/one web font with `display: swap`, no client JS on static pages beyond nav, form fields full-width with 44px targets, step transitions without animation when reduced motion is set.

## Journey 5 — Applicant returning after submitting

Reaches `/apply` again. If a submission succeeded in this browser session, the form shows the success state rather than a blank form (stored in `sessionStorage`, cleared when the tab closes). A fresh application from a new tab is possible. Server-side dedupe is not implemented; the endpoint adapter sends an idempotency key.

## Emotional arc

| Stage | We want the visitor to feel |
| --- | --- |
| Hero | "This is serious, and it is early." |
| Mission | "This matches how I actually want to learn." |
| Principles | "These people have standards." |
| Cohort | "I qualify." |
| Apply | "This respects my time and my data." |
| Success | "Something real happened." |

## Related documents

- [`WEBSITE-STRUCTURE.md`](WEBSITE-STRUCTURE.md)
- [`APPLICATION-FORM-SPECIFICATION.md`](APPLICATION-FORM-SPECIFICATION.md)
- [`../04-technical/FORM-SUBMISSION-ARCHITECTURE.md`](../04-technical/FORM-SUBMISSION-ARCHITECTURE.md)
