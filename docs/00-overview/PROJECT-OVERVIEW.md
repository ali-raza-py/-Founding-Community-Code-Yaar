# Project Overview

**Status:** Implemented (site + docs in this repository)

## What this repository is

A standalone marketing and application website for the **Code Yaar Global Founding Community**, a community initiative built around the launch campaign **The First 100** and the **Global Founding Cohort 2026–27**.

It introduces the community, explains the cohort, answers questions, publishes privacy information, and accepts applications through a custom multi-step form.

## What this repository is not

- It is **not** the Code Yaar learning platform.
- It is **not** a second Code Yaar product.
- It has **no backend**, database, authentication or API routes.
- It does **not** read from or write to the main Code Yaar systems.

The separation is deliberate: the community site can ship, change and be deployed independently of the platform, and it cannot become an accidental source of truth for learner data.

## Scope at a glance

| Area | Summary |
| --- | --- |
| Public pages | `/`, `/about`, `/cohort`, `/apply`, `/faq`, `/privacy` |
| Application | Five-step native form, client-validated, submitted to one external endpoint |
| Rendering | Static for all informational pages; client components only for nav, FAQ accordion and the form |
| Stack | Next.js (App Router), TypeScript, Tailwind CSS v4, Lucide icons |
| Persistence | None on the server. Optional in-browser draft only, user-clearable |
| Analytics | None |
| Authentication | None |

## Identity

| Item | Value |
| --- | --- |
| Organization | Code Yaar |
| Initiative | Code Yaar Global Founding Community |
| Campaign | The First 100 |
| Program | Global Founding Cohort 2026–27 |
| Tagline | Think. Build. Evolve. |
| Core message | One community. Different countries. One shared ambition. |

## Relationship to the Code Yaar platform

Code Yaar is a practical programming education platform in development. Its direction is a fuller learning loop: understand concepts, practise problem-solving, apply knowledge in projects, develop real skills, learn collaboratively, get guidance, and demonstrate progress through work.

The founding community supports that loop from the community side. It brings motivated learners together early, so that the culture of practical learning exists before the platform is complete.

The community site therefore describes the platform **only as a direction**, never as a finished product, and never with feature-level promises.

## Repository contents

```text
docs/                 Product, design, technical and operational documentation
public/               Static assets (favicon, social preview)
src/app/              Routes (App Router)
src/components/       Layout, sections, forms, UI primitives
src/lib/              Constants, validation, submission adapter, content data
src/types/            Shared TypeScript types
```

## Ownership

Founding team roles are listed in [`05-operations/TEAM-RESPONSIBILITIES.md`](../05-operations/TEAM-RESPONSIBILITIES.md). No additional responsibilities are assigned in this repository without founder confirmation.

## Related documents

- [PRODUCT-VISION.md](PRODUCT-VISION.md)
- [BRAND-AND-POSITIONING.md](BRAND-AND-POSITIONING.md)
- [../02-product/PRODUCT-REQUIREMENTS.md](../02-product/PRODUCT-REQUIREMENTS.md)
- [../04-technical/TECHNICAL-ARCHITECTURE.md](../04-technical/TECHNICAL-ARCHITECTURE.md)
