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
| `Section` | `id`, `tone: canvas \| surface \| raised \| muted`, `bordered` | Owns vertical rhythm and hairline section separators; children rendered in `Container` |
| `SectionHeading` | `number`, `eyebrow`, `title`, `intro` | Renders an `h2` at the `type-h2` scale; used on page sections |
| `Field` | `label`, `hint`, `error`, `required`, `optional` | Wires `aria-describedby` / `aria-invalid`; native inputs and selects |
| `Input`, `Textarea`, `Select` | native props + `invalid` | Shared visual treatment, 44px min height |
| `Checkbox` / `RadioGroup` | native controls + label slot | Large hit area; `fieldset`/`legend` for radio groups |
| `Accordion` | `items[{ id, question, answer }]` | Client: `button` + `aria-expanded`/`aria-controls`, spring-driven height |
| `Badge` | `tone: neutral \| accent` | Text-only, no icon |

## Motion text library (`src/components/motion/text`)

| Component | Behaviour | Where used |
| --- | --- | --- |
| `SplitReveal` | Masked per-line slide-up with stagger, `whileInView` once | Section headings, hero sub-headline |
| `CharReveal` | Per-character masked slide-up on mount | Hero wordmark |
| `GhostMarquee` | Outline-stroke repeated text row with direction, speed, edge mask, pause-off-screen | Hero rows, final CTA, footer ghost wordmark |
| `OutlineToFill` | Stroke-only heading filling with ink on scroll (`useElementScroll` / `useTransform`) | Mission statement, final CTA |
| `Scramble` | Mono label resolving from random glyphs on first view | Eyebrows only |
| `WordCycle` | Vertical swap through loop words, 2.4s per word, pause on hover/focus | Loop diagram centre |
| `GradientSweep` | Single diagonal light sweep over a heading | "100" accents |

All respect `prefers-reduced-motion`; split spans are `aria-hidden` and the full string remains available to assistive technology.

## Layout components (`src/components/layout`)

| Component | Notes |
| --- | --- |
| `SiteHeader` | Sticky, translucent over the hero, `canvas` with `backdrop-blur` after 16px scroll; active-route indicator with shared layout animation; mobile sheet with focus trap, Esc close, scroll lock |
| `SiteFooter` | Four link columns on desktop, ghost wordmark cropped at the bottom edge, theme toggle, no unconfirmed contact info or social links |
| `Wordmark` | Theme-adaptive logomark + name |

## Section components (`src/components/sections`)

| Component | Used on | Contains |
| --- | --- | --- |
| `FoundingHero` | Home | Kinetic wordmark hero, ghost rows, five cursor mascots, dossier row, CTAs |
| `HeroStage` | Home (inside hero) | Client scroll driver writing `--hero-p`; no React state |
| `MissionSection` | Home | Belief statement, outline-to-fill line |
| `LoopSection` | Home | Interactive six-node learning-loop diagram, scroll-drawn arcs, vertical mobile stepper |
| `PrinciplesSection` | Home | Five numbered principles with cursor highlight |
| `BenefitsSection` | Home, /benefits | Bento grid, qualified benefits + caveat |
| `FinalCtaSection` | Home, About, Cohort | Ghost wordmark callback, 100 dot-grid, mascot, CTA |
| `PageHero` | About, Cohort, FAQ, Privacy, Apply | Eyebrow, SplitReveal H1, lead, optional aside |

## Form components (`src/components/apply`)

| Component | Responsibility |
| --- | --- |
| `ApplicationForm` | State machine: current step, values, errors, submission status, draft sync |
| `FormProgress` | Connected step line with mono numbers, real step labels and check marks |
| `StepPersonal`, `StepEducation`, `StepProgramming`, `StepMotivation` | Presentational per step; receive values, errors and a change handler |
| `ReviewStep` | Summary, edit links, consent, unconfigured notice |
| `SubmissionSuccess` / `SubmissionError` | Success and failure presentation; the unconfigured state is guarded in the review step |
| `StepNavigation` | Back/Continue/Submit controls and disabled logic |

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
