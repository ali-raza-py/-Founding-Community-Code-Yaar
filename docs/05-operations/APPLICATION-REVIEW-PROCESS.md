# Application Review Process

**Status:** Recommendation. **Not yet operational.** No review tooling exists in this repository.

## Principle

Every application is read by a human. No automated scoring, filtering or rejection. The form does not compute a score, and none should be added without an explicit founder decision.

## Workflow (proposed)

```text
1. Export/collect submissions from the chosen endpoint
2. Assign batches to reviewers (two reviewers per batch is recommended)
3. Independent read → rubric note (no numeric ranking required)
4. Reconciliation conversation for disagreements
5. Decision: accept / waitlist / decline
6. Record decision + reason in the review log
7. Notification (template TBD)
```

All tooling, SLAs and storage locations are `TBD` until the submission provider is chosen.

## Rubric

Five dimensions, rated qualitatively rather than with a weighted score:

| Dimension | Look for | Red flags |
| --- | --- | --- |
| **Motivation** | Specific reason tied to their situation; mentions practice/building | Copy-pasted generic text; only mentions "career growth" |
| **Learning intent** | Names a concrete skill or gap | "I want to learn everything" with no specifics |
| **Practical orientation** | Talks about making things, challenges, projects | Only consumption ("want to complete courses") |
| **Collaboration** | Mentions peers, feedback, helping, sharing | Purely individual goals with no community interest |
| **Realistic availability** | Honest, modest number with a plan | Claims 20+ hours alongside full-time study with no explanation |

### Signal weighting

1. Contribution answer (heaviest)
2. Motivation + learning intent
3. Collaboration
4. Availability plausibility

Technical experience, GitHub/LinkedIn presence, institution and country carry **no weight**.

## Diversity of stage

Actively include beginners. A cohort of only intermediate developers fails the audience definition. Recommended guardrail: at least one third of accepted members self-identify as beginners.

## Handling minors

Applications with age range `Under 16` or `16–17` must not be accepted until the guardian-consent and safeguarding process exists. Mark them as "hold — safeguarding policy pending" rather than declining. See [`../06-privacy-and-safety/APPLICANT-SAFETY.md`](../06-privacy-and-safety/APPLICANT-SAFETY.md).

## Review log fields

`applicationId`, `reviewer`, `date`, `decision`, `dimension notes`, `safeguarding flag`, `consent status`. Store without unnecessary personal data; do not duplicate the full application into the log.

## Conflict of interest

A reviewer who knows an applicant personally should not be the sole decision-maker on that application. Disclose and reassign.

## Capacity model

Rough planning figure: 4–6 minutes per application for a first read. 300 applications ≈ 20–30 reviewer-hours. Do not open applications without this capacity committed and a stated close date.

## Inactivity and waitlist

If a waitlist exists, applicants must be told. Do not tell someone they are "on a waitlist" without a reactivation trigger. Waitlist policy is `TBD`.

## Related documents

- [`../01-strategy/TARGET-AUDIENCE.md`](../01-strategy/TARGET-AUDIENCE.md)
- [`../01-strategy/FOUNDING-COHORT-STRATEGY.md`](../01-strategy/FOUNDING-COHORT-STRATEGY.md)
- [`MEMBER-ONBOARDING.md`](MEMBER-ONBOARDING.md)
- [`../08-planning/OPEN-QUESTIONS.md`](../08-planning/OPEN-QUESTIONS.md)
