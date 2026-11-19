# Development Roadmap

**Status:** Phase 0 is complete. Phases 1–4 are proposals.

## Phase 0 — Foundation (complete)

- [x] Repository discovery (empty repo, greenfield).
- [x] Documentation set.
- [x] Design tokens and shared layout.
- [x] Landing, About, Cohort, FAQ, Privacy pages.
- [x] Five-step application form with submission adapter.
- [x] SEO metadata, sitemap, robots.
- [x] Build, typecheck and lint verification.

## Phase 1 — Launch readiness (blocked on decisions)

| Task | Owner | Blocked by |
| --- | --- | --- |
| Choose submission provider | CTO + CEO | Cost/privacy review |
| Configure and test a live endpoint | CTO | Provider choice |
| Name processor + retention on `/privacy` | CEO | Provider choice |
| Publish a privacy contact | CEO | `TBD` |
| Decide minors policy | CEO | Safeguarding advice |
| Confirm fee policy | CEO | — |
| Replace interim wordmark with official logo | Design | Brand assets |
| Add real OG image | Design | Brand assets |
| Set production domain and rebuild | CTO | Domain |

## Phase 2 — Quality uplift (recommended before launch)

- Add Vitest + RTL for validation and adapter (see [`../07-quality/TESTING-STRATEGY.md`](../07-quality/TESTING-STRATEGY.md)).
- Run Lighthouse on the production URL; record numbers.
- Screen-reader pass on `/apply`.
- Real-device check at 320–390px.

## Phase 3 — Content and campaign support (after launch, if needed)

- Founder photographs (real, supplied) replacing initials.
- A published "what happened in the cohort" note — only once there is something true to report.
- Optional `/cohort` FAQ additions based on real applicant questions.

## Phase 4 — Longer term (do not build yet)

- Member area or application status page — requires auth and a backend, which are explicitly out of scope.
- Non-technical content editing (headless CMS).
- Localisation.

Any Phase 4 item reopens the architectural constraints in [`../04-technical/TECHNICAL-ARCHITECTURE.md`](../04-technical/TECHNICAL-ARCHITECTURE.md) and will need a new decision-log entry.

## Sequencing rule

Nothing in Phase 1 may be skipped in order to launch faster, except items the founders explicitly accept as deferred in the decision log. Launching with an unnamed data processor or an unconfirmed minors policy is not a schedule decision, it is a risk decision.

## Related documents

- [`OPEN-QUESTIONS.md`](OPEN-QUESTIONS.md)
- [`RISKS-AND-ASSUMPTIONS.md`](RISKS-AND-ASSUMPTIONS.md)
- [`../07-quality/RELEASE-CHECKLIST.md`](../07-quality/RELEASE-CHECKLIST.md)
