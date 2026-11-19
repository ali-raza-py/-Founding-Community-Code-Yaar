# Website Structure

**Status:** Implemented.

## Information architecture

```text
/                       Landing — what this is, why join, how to apply
├── /about              Who Code Yaar is, philosophy, team
├── /cohort             The First 100 in detail, eligibility, process
├── /apply              Five-step application
├── /faq                Twelve questions
└── /privacy            Data collection and applicant rights
```

No nested routes. No blog, no dashboard, no member area. Every page has a single job.

## Global shell

Every page renders `SiteHeader`, `<main id="main">`, `SiteFooter`.

| Element | Contents |
| --- | --- |
| Header left | Wordmark linking to `/` |
| Header center (desktop) | About · The Cohort · FAQ |
| Header right | "Apply" primary button |
| Header mobile | Disclosure menu with the same links + CTA |
| Footer | Column 1: wordmark, tagline, one-line description. Column 2: Explore (Home, About, The Cohort, FAQ). Column 3: Program (Apply, Privacy). Bottom: campaign line, `TBD` contact note. |

The footer does **not** include social links, addresses or emails, because none have been confirmed.

## Section map per page

### `/`

1. `HeroSection` — kinetic campaign headline over an outlined duplicate, floating brand marks, supporting paragraph, primary + secondary CTA, and a compact cohort metadata strip.
2. `MissionSection` — "More than a learning platform. A community of builders." plus the six-part practice loop.
3. `PrinciplesSection` — five principles with explanations.
4. `CohortSection` — what The First 100 is, early-stage disclosure, link to `/cohort`.
5. `BenefitsSection` — six qualified benefits + "what we do not promise" note.
6. `JourneySection` — eight-step visual timeline.
7. `FinalCtaSection` — "Be part of the beginning."

### `/about`

- Page hero (title, lead).
- What Code Yaar is.
- Why we are building it.
- Philosophy: three cards (Think / Build / Evolve).
- Community vision.
- Founding team: three profiles.
- CTA to cohort.

### `/cohort`

- Page hero.
- What the founding cohort is.
- Who should apply (list + "not required" note).
- What we expect from members.
- Selection process: four numbered stages + no-guarantee notice.
- Global participation and time zones.
- CTA to apply.

### `/apply`

- Page hero: what the form is, what to expect, privacy short note.
- `ApplicationForm`: progress, five steps, review, consent, submission status.
- Sidebar/notes: what happens after applying; "no guarantee" caveat; draft notice; clear-progress control.

### `/faq`

- Page hero.
- Twelve accordion items.
- "Still have a question?" with `TBD` contact note.

### `/privacy`

- Page hero + "not legal advice / pending review" notice.
- Data collected table, purposes, sharing, retention, rights, minors, contact (`TBD`).

## CTA hierarchy

| CTA | Location | Destination |
| --- | --- | --- |
| Apply for the Founding Cohort | Hero, final CTA, header | `/apply` |
| Explore the Cohort | Hero | `/cohort` |
| Read the application process | Cohort page | `/cohort#process` |
| Apply to The First 100 | Final sections | `/apply` |

Only two intents exist: **learn more** (`/cohort`, `/about`, `/faq`) and **apply**. No newsletter, no waitlist form, no "book a call".

## SEO surface

- `metadata` per route with title, description, canonical path, Open Graph.
- `sitemap.ts` listing six routes.
- `robots.ts` allowing all, disallowing nothing (no private areas exist).
- One `h1` per page; `h2` per section; no skipped levels.

## Related documents

- [`USER-JOURNEYS.md`](USER-JOURNEYS.md)
- [`CONTENT-STRATEGY.md`](CONTENT-STRATEGY.md)
- [`../03-design/COMPONENT-GUIDELINES.md`](../03-design/COMPONENT-GUIDELINES.md)
