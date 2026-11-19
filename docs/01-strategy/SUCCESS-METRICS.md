# Success Metrics

**Status:** Recommendation. No analytics are implemented on the website.

## Principles

1. **Measure participation, not vanity.** Registrations are an input; contributions are the output.
2. **Do not instrument the applicant.** The site ships with no analytics, no pixels and no tracking scripts. Any future measurement must be justified and disclosed.
3. **Small numbers are fine.** A cohort of 100 with 30 active members is a success if those 30 build things.

## Stage 1 — Application health

| Metric | How to obtain | Target |
| --- | --- | --- |
| Applications received | Count submissions at the endpoint | `TBD` — set after the first week |
| Completion rate of the form | Submissions ÷ form starts | `TBD` (needs instrumentation; not implemented) |
| Data quality | Share of applications with usable, specific answers | ≥ 70% (recommendation) |
| Geography spread | Count distinct countries in submissions | Observe, do not target a quota |

Form starts are **not** currently measurable, because no analytics exist. Do not report this metric until it is deliberately instrumented.

## Stage 2 — Cohort health

| Metric | Definition | Target |
| --- | --- | --- |
| Activated members | Onboarded members who post an introduction | ≥ 80% of accepted |
| Active members (monthly) | Contributed at least once in 30 days | ≥ 40% of accepted |
| Activity completion | Members who submit at least one activity per quarter | ≥ 30% |
| Feedback volume | Structured feedback responses per release | ≥ 15 per cycle |
| Retention | Members active in month 3 vs month 1 | ≥ 50% |

## Stage 3 — Value to Code Yaar

| Metric | Definition |
| --- | --- |
| Actioned feedback | Feedback items that changed a decision |
| Founding contributions | Docs, translations, examples, bug reports from members |
| Member-led activities | Activities run by members rather than the team |
| Referrals | New applicants who cite an existing member |

## Anti-metrics

Explicitly **not** success:

- total members,
- total messages,
- follower growth,
- impressions,
- number of channels,
- number of activities announced.

These may be recorded for context but never presented as the goal.

## Reporting cadence

A monthly internal note covering: applications, accepted, activated, active, what members built, feedback actioned, and what the team will change. Internal only unless the team chooses to publish a summary. Publishing policy is `TBD`.

## Honesty rules for public claims

- Never publish a metric the team cannot verify from primary data.
- Never round up a small number into an impressive one.
- Never describe future targets as achieved results.
- If a number is published, state the period it covers.

## Related documents

- [`COMMUNITY-STRATEGY.md`](COMMUNITY-STRATEGY.md)
- [`FOUNDING-COHORT-STRATEGY.md`](FOUNDING-COHORT-STRATEGY.md)
- [`../07-quality/TESTING-STRATEGY.md`](../07-quality/TESTING-STRATEGY.md)
