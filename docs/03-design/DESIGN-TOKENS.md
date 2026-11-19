# Design Tokens

**Status:** Implemented in `src/app/globals.css` under `@theme`. Values here must stay in sync with that file.

Tailwind CSS v4 is used, so tokens are declared as CSS custom properties in an `@theme` block and consumed as utility classes (`bg-surface`, `text-ink`, `border-line`, …).

## Colour

| Token | Value | Use | Contrast note |
| --- | --- | --- | --- |
| `--color-canvas` | `#F6F4EE` | Page background (warm off-white) | — |
| `--color-surface` | `#FBFAF6` | Raised panels, inputs | — |
| `--color-surface-muted` | `#EFEDE4` | Subtle fills, table stripes | — |
| `--color-forest-950` | `#0B1F17` | Deep forest base, footer | White on it: 16.4:1 |
| `--color-forest-900` | `#10291F` | Dark section background | — |
| `--color-forest-700` | `#1B4A36` | Secondary headings on light | 8.6:1 on canvas |
| `--color-emerald-600` | `#0E7A4F` | Accent, links, primary button | 5.1:1 on canvas |
| `--color-emerald-500` | `#149A63` | Hover/active accent | used on dark surfaces |
| `--color-emerald-100` | `#DCEFE4` | Tinted chips, selected states | — |
| `--color-ink` | `#121712` | Primary text | 15.8:1 on canvas |
| `--color-ink-muted` | `#4C554E` | Secondary text | 7.4:1 on canvas |
| `--color-ink-subtle` | `#6C766E` | Meta text, placeholders (non-essential) | 4.6:1 on canvas |
| `--color-line` | `#D9D8CE` | Hairline borders | decorative |
| `--color-line-strong` | `#C2C3B6` | Input borders | 3:1 against canvas |
| `--color-danger` | `#A32B21` | Errors | 6.4:1 on canvas |
| `--color-danger-surface` | `#FBEDEA` | Error background | — |
| `--color-success` | `#0E6B45` | Success text | 5.8:1 on canvas |
| `--color-success-surface` | `#E4F2E9` | Success background | — |

Only these tokens may be used in components. Raw hex values in JSX are a review failure (exceptions: SVG icon fills, `themeColor`).

## Typography

| Token | Value |
| --- | --- |
| `--font-sans` | `var(--font-inter-tight)`, system fallback stack |
| `--font-serif` | `var(--font-newsreader)`, Georgia fallback |

| Role | Size (mobile → desktop) | Weight | Tracking | Line height |
| --- | --- | --- | --- | --- |
| Page display (H1) | 2.5rem → 4.25rem | 500 | -0.03em | 1.02 |
| Hero kinetic display | 3rem → 10rem | 800 | -0.045em | 0.88 |
| H2 (section) | 1.875rem → 2.75rem | 500 | -0.02em | 1.08 |
| H3 (card) | 1.125rem → 1.25rem | 600 | -0.01em | 1.3 |
| Lead | 1.0625rem → 1.1875rem | 400 | 0 | 1.6 |
| Body | 1rem | 400 | 0 | 1.65 |
| Small | 0.875rem | 400 | 0 | 1.55 |
| Label / eyebrow | 0.75rem | 500 | 0.12em uppercase | 1.4 |
| Button | 0.9375rem | 500 | 0 | 1 |

Implemented as utilities: `.type-display`, `.type-h2`, `.type-h3`, `.type-lead`, `.type-label`, plus Tailwind text sizes for body/small.

## Spacing

Base unit `4px`. Scale used: `2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128`.

| Context | Mobile | Tablet | Desktop |
| --- | --- | --- | --- |
| Section padding block | 64px | 88px | 120px |
| Section heading → content | 32px | 40px | 48px |
| Card padding | 20px | 24px | 32px |
| Form field vertical gap | 20px | 24px | 24px |

## Radii

| Token | Value | Use |
| --- | --- | --- |
| `--radius-sm` | 4px | Chips, small controls |
| `--radius-md` | 6px | Inputs, buttons |
| `--radius-lg` | 10px | Panels (used sparingly) |
| `--radius-full` | 999px | Step dots, pills |

Cards are rectangular with hairlines; large radii are not used for containers.

## Shadow

| Token | Value | Use |
| --- | --- | --- |
| `--shadow-xs` | `0 1px 2px rgb(11 31 23 / 0.05)` | Inputs on focus-free state |
| `--shadow-sm` | `0 2px 8px rgb(11 31 23 / 0.06)` | Sticky header on scroll, dropdown |

No other shadows.

## Container and breakpoints

| Token | Value |
| --- | --- |
| `--container-content` | 1200px |
| `--container-prose` | 68ch |
| Breakpoints (Tailwind defaults) | `sm 640`, `md 768`, `lg 1024`, `xl 1280` |

## Interaction states

| State | Treatment |
| --- | --- |
| Hover (link) | Colour → `emerald-500`, underline offset increases |
| Hover (button) | Background darkens one step; no scale |
| Active | `translateY(1px)` |
| Focus-visible | `2px` solid `emerald-600`, `2px` offset, `border-radius` inherited |
| Disabled | `opacity 0.55`, `cursor: not-allowed`, no hover change |
| Selected (radio/checkbox) | `emerald-100` fill + `emerald-600` border |

## Related documents

- [`DESIGN-DIRECTION.md`](DESIGN-DIRECTION.md)
- [`COMPONENT-GUIDELINES.md`](COMPONENT-GUIDELINES.md)
- [`../04-technical/FRONTEND-STANDARDS.md`](../04-technical/FRONTEND-STANDARDS.md)
