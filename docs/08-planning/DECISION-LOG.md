# Decision Log

Format: Decision · Date · Context · Options considered · Chosen approach · Reason · Consequences · Status

Dates are only recorded where the decision was actually taken during this build. Nothing here is attributed to the founders unless stated.

---

## D-001 — Frontend-only, no backend of any kind

**Date:** 2026-11-19 (implementation decision)
**Context:** The brief requires an application form but forbids custom backends, API routes, server actions, databases and auth.
**Options:** (a) Next.js route handler + DB, (b) serverless function in this repo, (c) static site + external endpoint adapter.
**Chosen:** (c).
**Reason:** Matches the constraint exactly and keeps the site deployable anywhere.
**Consequences:** The browser must POST directly to an external endpoint; no secret can be held; dedupe depends on the provider; a provider must be chosen before launch.
**Status:** Implemented.

## D-002 — Next.js App Router with static rendering

**Date:** 2026-11-19
**Context:** Public informational site with three interactive islands.
**Options:** (a) static HTML/CSS/JS, (b) Next.js App Router, (c) Astro.
**Chosen:** (b) on Next.js 16.4.6.
**Reason:** Required stack by the brief; App Router gives per-route metadata, sitemap/robots routes and static prerendering without extra tooling.
**Consequences:** React runtime cost on static pages; mitigated by keeping client components to nav, accordion and form.
**Status:** Implemented.

## D-003 — Tailwind CSS v4 with `@theme` tokens; no shadcn CLI

**Date:** 2026-11-19
**Context:** Need a design-token system and accessible primitives.
**Options:** (a) shadcn/ui via CLI (Radix + cva), (b) hand-built primitives with Tailwind tokens, (c) CSS Modules.
**Chosen:** (b), with cva available for variants.
**Reason:** The site needs a button, inputs, a radio group, a checkbox and one accordion. Radix would add weight for behaviour we implement in ~40 lines; a bespoke editorial visual system would fight shadcn defaults anyway.
**Consequences:** Accordion and radio styling are ours to maintain; must be keyboard/ARIA correct.
**Status:** Implemented.

## D-004 — Single light theme; no dark mode

**Date:** 2026-11-19
**Context:** Dark mode is optional in the brief and conditional on consistency across pages and form states.
**Options:** (a) implement both, (b) light only.
**Chosen:** (b).
**Reason:** A second theme would need a full token repaint and testing of every form state; scope is better spent on the application experience.
**Consequences:** Adding dark mode later means auditing all tokens and both surface tones.
**Status:** Implemented.

## D-005 — Submittable JSON envelope with an idempotency key

**Date:** 2026-11-19
**Context:** No backend means no server-side duplicate protection.
**Options:** (a) bare payload, (b) payload + client-generated `submissionId`, (c) local "already submitted" flag only.
**Chosen:** (b) plus (c) within a session.
**Reason:** Gives the eventual provider something stable to dedupe on across retries.
**Consequences:** Dedupe is only as good as the provider; documentation states this limitation.
**Status:** Implemented.

## D-006 — Draft persistence in `localStorage`, opt-out visible

**Date:** 2026-11-19
**Context:** A five-step application with long free-text answers is painful to lose.
**Options:** (a) no persistence, (b) `sessionStorage`, (c) `localStorage` with notice + clear control.
**Chosen:** (c), excluding consent and submission id.
**Reason:** Survives accidental tab closure; the notice satisfies transparency; consent is never stored.
**Consequences:** Shared-device exposure; documented as an accepted, disclosed trade-off.
**Status:** Implemented.

## D-007 — Typographic interim wordmark instead of an invented logo

**Date:** 2026-11-19
**Context:** No Code Yaar logo asset was available.
**Options:** (a) design a new logo, (b) use a plain text wordmark, (c) placeholder box.
**Chosen:** (b) with a small abstract mark derived from the wordmark.
**Reason:** The brief forbids inventing a new brand identity; a restrained wordmark is a stand-in, not a redesign.
**Consequences:** Must be replaced when official assets arrive. Tracked in open questions Q15.
**Status:** Implemented as interim.

## D-008 — No invented operational answer in the FAQ

**Date:** 2026-11-19
**Context:** Several FAQ questions (certificate, timeline, contact) have no decided answer.
**Options:** (a) invent plausible answers, (b) omit the questions, (c) answer honestly with "not currently" / "not yet confirmed".
**Chosen:** (c).
**Reason:** The brief requires the twelve questions and forbids fabrication.
**Consequences:** Some answers are negative or provisional; they must be updated when policies are decided.
**Status:** Implemented.

---

## Pending (not yet decided)

| Item | Status |
| --- | --- |
| Submission provider | `TBD` |
| Privacy contact | `TBD` |
| Retention period | `TBD` |
| Minors/guardian consent | `TBD` |
| Fee policy formal confirmation | `TBD` |
| Production domain | `TBD` |
| Cohort dates | `TBD` |

## Related documents

- [`OPEN-QUESTIONS.md`](OPEN-QUESTIONS.md)
- [`RISKS-AND-ASSUMPTIONS.md`](RISKS-AND-ASSUMPTIONS.md)
