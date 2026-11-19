# Content Strategy

**Status:** Implemented rules. Copy in `src/lib/content/` follows them.

## The tense rule

Every claim in public copy belongs to exactly one of three tiers, and the wording must make the tier obvious.

| Tier | Meaning | Allowed verbs |
| --- | --- | --- |
| **Today** | Exists now | is, we are building, applications are open |
| **Founding cohort (planned)** | Intended for this cohort, not yet running | we plan to, as they become available, will be invited |
| **Ambition** | Long-term direction | we want to, our aim is, in the long term |

**Breaking the rule is a content bug**, not a style preference. Example: "Members join weekly challenges" (Tier 1 wording for a Tier 2 item) is a bug.

## Message hierarchy

1. **What this is:** the first 100 members of a global learning community around Code Yaar.
2. **Why it exists:** practical learning needs other people, not just content.
3. **Who it is for:** beginners and self-taught learners, not experts only.
4. **What it costs:** nothing claimed beyond participation (fees: see FAQ).
5. **What happens next:** apply → confirm → review → decide → onboard.

## Page-level content rules

### Home

- Hero presents the campaign name as the display headline: **The First 100**, with `Global Founding Cohort 2026–27` as the label above it.
- Supporting text exactly as specified in the brief.
- The early-stage sentence appears in the cohort block, not hidden in the footer.

### About

- Team section lists roles and responsibility areas only. **No invented biographies, employers, degrees or achievements.**
- If portraits are unavailable, initials are used. No stock or AI-generated faces.

### Cohort

- The phrase "Submitting an application does not guarantee acceptance." must appear near the process.
- Time-zone commitment is stated as a design intent ("Activities are designed so that…"), not as a live schedule.

### FAQ

- Each answer must be traceable to a decision, a stated limit, or an explicit "not decided yet".
- No answer may hint at a benefit that the cohort page does not also state.

### Privacy

- Plain language, specific categories, no legalese that asserts compliance.

## Terminology

| Term | Definition | Do not use |
| --- | --- | --- |
| founding member | Accepted participant in the first cohort | ambassador, intern, scholar |
| cohort | The First 100 group | batch, intake |
| activity | A planned practical exercise | assignment, task (implies obligation) |
| application | The submitted form | registration, enrollment |
| community | The people and their shared practice | platform, network |

## Microcopy standards

- Buttons: imperative verb + object ("Apply", "Review application", "Submit application"). Never "Click here", never "Learn more" as a button.
- Field help: one sentence, explains *why* if non-obvious ("Used only to contact you about your application.").
- Errors: what went wrong + how to fix. No blame.
- Success: what happened, what happens next, no invented timing.

## Forbidden content

- Fake statistics, member counts, country counts.
- Invented partnerships, press mentions, awards.
- Testimonials from people who do not exist.
- Countdown timers or scarcity pressure.
- "Revolutionary", "world-class", "number one", "unlimited", "guaranteed".
- Stock photos of people pretending to be members.

## Placeholders

`TBD` is acceptable in operational docs and, sparingly, in public copy where the alternative is a false claim (for example the privacy contact). In public copy, `TBD` must always be accompanied by an honest sentence — never a bare placeholder or lorem ipsum.

## Maintenance

Copy lives in typed content modules (`src/lib/content/*.ts`) rather than being scattered through JSX, so the same statements can be audited in one place.

## Related documents

- [`FAQ-AND-MESSAGING.md`](FAQ-AND-MESSAGING.md)
- [`../01-strategy/GLOBAL-POSITIONING.md`](../01-strategy/GLOBAL-POSITIONING.md)
- [`../00-overview/BRAND-AND-POSITIONING.md`](../00-overview/BRAND-AND-POSITIONING.md)
