# Component Guidelines

**Status:** Implemented (components listed exist in `src/components`).

## Principles

1. **Server by default.** A component becomes a client component only when it needs state, effects, refs or event handlers.
2. **Composition over configuration.** Sections compose primitives; they do not take a dozen boolean props.
3. **One job each.** If a component renders two unrelated things, split it.
4. **Tokens only.** No raw colours or arbitrary spacing values in JSX.
5. **Accessibility is part of the component.** A primitive without keyboard and ARIA behaviour is unfinished.

## UI primitives (`src/components/ui`)

| Component | API | Behaviour notes |
| --- | --- | --- |
| `Button` | `variant: primary \| secondary \| ghost`, `size: sm \| md \| lg`, `asChild`-free by design; renders `<button>` or accepts `href` to render `Link` | `focus-visible` ring, `disabled` styling, no icon-only usage without `aria-label` |
| `ButtonLink` | same visual API + `href` | Uses `next/link` |
| `Container` | `width: content \| prose` | Applies max width + gutters |
| `Section` | `id`, `tone: canvas \| surface \| forest`, `eyebrow`, `title`, `intro` | Owns vertical rhythm; children rendered in content column |
| `SectionHeading` | `number`, `eyebrow`, `title`, `intro`, `align` | Renders `h2` by default (level configurable) |
| `Field` | `label`, `hint`, `error`, `required`, `htmlFor` | Wires `aria-describedby` / `aria-invalid` |
| `Input`, `Textarea`, `Select` | native props + `invalid` | Shared visual treatment, 44px min height |
| `Checkbox` | native checked input + label slot | Large hit area, no custom-only control |
| `RadioGroup` | options[], value, onChange | `fieldset`/`legend`, native radios styled with peers |
| `Accordion` | items[{ id, question, answer }] | Client: `button` + `aria-expanded`/`aria-controls`, one or many open |
| `Badge` | `tone: neutral \| accent` | Text-only, no icon |

## Layout components (`src/components/layout`)

| Component | Notes |
| --- | --- |
| `SiteHeader` | Sticky, hairline bottom border, backdrop-blur only when scrolled — implemented as plain translucent surface, no scroll listener |
| `DesktopNav` | Active link via `usePathname` (client), `aria-current="page"` |
| `MobileNavigation` | Client disclosure: `aria-expanded`, `Escape` closes, focus returns to trigger, body scroll lock while open |
| `SiteFooter` | Three columns, campaign line, no unconfirmed contact info |
| `Wordmark` | Interim typographic mark; replace with official logo |

## Section components (`src/components/sections`)

| Component | Used on | Contains |
| --- | --- | --- |
| `HeroSection` | Home | Campaign label, kinetic H1 with outlined layer, floating brand marks, lead, CTAs, metadata strip |
| `HeroStage` | Home (inside hero) | Client scroll driver; writes one `--hero-p` progress value, no state |
| `MissionSection` | Home | Belief statement + six-part practice loop |
| `PrinciplesSection` | Home | Five numbered principles |
| `CohortSection` | Home | Early-stage disclosure + link |
| `BenefitsSection` | Home | Qualified benefits + limit note |
| `JourneySection` | Home | Eight-step timeline |
| `FinalCtaSection` | Home, About, Cohort | Heading, text, CTA |
| `PageHero` | About, Cohort, FAQ, Privacy, Apply | Eyebrow, H1, lead, optional aside |

## Form components (`src/components/apply`)

| Component | Responsibility |
| --- | --- |
| `ApplicationForm` | State machine: current step, values, errors, submission status, draft sync |
| `FormProgress` | Step list + progress bar + "Step n of 5" |
| `StepPersonal`, `StepEducation`, `StepProgramming`, `StepMotivation` | Presentational per step; receive values, errors and a change handler |
| `ReviewStep` | Summary, edit links, consent, unconfigured notice |
| `SubmissionSuccess` / `SubmissionError` | Success and failure presentation; the unconfigured state is guarded in the review step |
| `StepNavigation` | Back/Continue/Submit controls and disabled logic |

## Conventions

- Named exports for components, default exports only for pages/layouts (Next.js requirement).
- Props interfaces exported when reused across files.
- Client components start with `"use client"` and are kept leaf-ward.
- Content (copy strings, option lists) imported from `src/lib/content` and `src/lib/constants`, not hardcoded in markup where reused.

## Related documents

- [`DESIGN-TOKENS.md`](DESIGN-TOKENS.md)
- [`../04-technical/FRONTEND-STANDARDS.md`](../04-technical/FRONTEND-STANDARDS.md)
- [`../07-quality/ACCESSIBILITY-CHECKLIST.md`](../07-quality/ACCESSIBILITY-CHECKLIST.md)
