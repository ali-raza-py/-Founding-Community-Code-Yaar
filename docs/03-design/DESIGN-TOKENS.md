# Design Tokens

**Status:** Implemented in `src/app/globals.css` under `@theme`. Values here must stay in sync with that file.

Tailwind CSS v4 is used, so tokens are declared as CSS custom properties in an `@theme` block and consumed as utility classes (`bg-surface`, `text-ink`, `border-line`, …). Theme-dependent tokens switch by `[data-theme="dark"]` (default) and `[data-theme="light"]`.

## Colour — brand scale

Real emerald and teal ramps. No lime values remain.

| Token | Value | Use |
| --- | --- | --- |
| `--color-emerald-50` | `#f0fdf4` | Tints |
| `--color-emerald-100` | `#d1fae5` | Success/tinted surfaces |
| `--color-emerald-200` | `#a7f3d0` | Tints |
| `--color-emerald-300` | `#6ee7b7` | Tints |
| `--color-emerald-400` | `#34d399` | Tints |
| `--color-emerald-500` | `#10b981` | Primary accent, focus ring, gradient start |
| `--color-emerald-600` | `#059669` | Primary button fill |
| `--color-emerald-700` | `#047857` | Hover states |
| `--color-emerald-800` | `#065f46` | Deep surfaces |
| `--color-emerald-900` | `#064e3b` | Deep surfaces |
| `--color-emerald-950` | `#022c22` | Deepest surfaces |
| `--color-teal-50` | `#f0fdfa` | Tints |
| `--color-teal-100` | `#ccfbf1` | Tints |
| `--color-teal-200` | `#99f6e4` | Tints |
| `--color-teal-300` | `#5eead4` | Tints |
| `--color-teal-400` | `#2dd4bf` | Tints |
| `--color-teal-500` | `#14b8a6` | Secondary accent, gradient end |
| `--color-teal-600` | `#0d9488` | — |
| `--color-teal-700` | `#0f766e` | — |
| `--color-teal-800` | `#115e59` | — |
| `--color-teal-900` | `#134e4a` | — |
| `--color-hero-ink` | `#3dae76` | Flat green of the giant wordmark |

## Colour — semantic tokens

| Token | Dark | Light | Contrast note |
| --- | --- | --- | --- |
| `--color-canvas` | `#07110F` | `#F8FAFC` | Page background |
| `--color-surface` | `#0C1A17` | `#FFFFFF` | Panels, inputs |
| `--color-surface-raised` | `#112420` | `#F1F5F4` | Raised panels |
| `--color-line` | `rgba(255,255,255,0.09)` | `rgba(100,116,139,0.12)` | Hairline borders (decorative) |
| `--color-line-strong` | `rgba(255,255,255,0.18)` | `rgba(100,116,139,0.24)` | Input borders (~3:1 against canvas/surface) |
| `--color-ink` | `#ECFDF5` | `#0B1B17` | Primary text: 18.9:1 dark / 15.1:1 light |
| `--color-ink-muted` | `rgba(236,253,245,0.72)` | `#3F514B` | Secondary text: 9.9:1 dark / 6.5:1 light |
| `--color-ink-subtle` | `rgba(236,253,245,0.52)` | `#5B6B65` | Meta text only. 5.9:1 dark (≥18px); 3.7:1 light — not for small body text |
| `--color-ghost-stroke` | `rgba(30,58,49,0.55)` | `rgba(183,211,198,0.70)` | Outline text layers (decorative) |
| `--color-danger` | `#EF4444` | `#B91C1C` | Errors: 5.1:1 dark / 5.8:1 light |
| `--color-danger-soft` | `rgba(239,68,68,0.12)` | `#FEF2F2` | Error surfaces |
| `--color-success` | `#10B981` | `#059669` | Success text: 8.2:1 dark / 3.6:1 light — use with `success-soft` surface at small sizes |
| `--color-success-soft` | `rgba(16,185,129,0.12)` | `#ECFDF5` | Success surfaces |
| `--color-warning` | `#F59E0B` | `#B45309` | Warning text: 8.9:1 dark / 4.8:1 light |
| `--color-warning-soft` | `rgba(245,158,11,0.12)` | `#FEFCE8` | Warning surfaces |

## Focus

`--color-focus-ring` is `#10B981` in both themes: a 2px ring with a 2px offset.

## Signature gradient

`emerald-500 → teal-500`. Allowed only on: the "100" numeral accent, primary CTA hover sheen, diagram connector lines, and progress lines.

## Contrast of brand colours on canvas

| Colour | On dark canvas | On light canvas |
| --- | --- | --- |
| hero-ink `#3DAE76` | 6.8:1 | 2.1:1 (dark hero only) |
| emerald-500 `#10B981` | 8.2:1 | 3.6:1 |
| emerald-600 `#059669` | 5.1:1 | 3.6:1 |

Primary buttons use `emerald-600` fill with canvas text (5.3:1 dark / 19:1 light) rather than white text, to stay above 4.5:1. Links use underlines in addition to colour.

Only these tokens may be used in components. Raw hex values in JSX are a review failure (exceptions: SVG mascot fills, `themeColor`).

## Typography

| Role | Font | Weights |
| --- | --- | --- |
| Display, headings, UI | Manrope | 500, 600, 700, 800 |
| Body / long text | Inter | 400, 500, 600 |
| Technical labels, counters, step numbers | JetBrains Mono | 400, 500 |

Load with `next/font/google`, `display: "swap"`, Latin subset, exposed as CSS variables (`--font-sans` = Inter, `--font-display` = Manrope, `--font-mono` = JetBrains Mono).

| Style | Fluid size | Weight / tracking / line height |
| --- | --- | --- |
| hero-wordmark | `clamp(2.5rem, 9vw, 7rem)` | 800, -0.045em, 0.82 |
| display (page heroes) | `clamp(2.25rem, 5.2vw, 3rem)` | 800, -0.035em, 1.08 |
| h2 | `clamp(1.875rem, 3.4vw, 2.75rem)` | 700, -0.025em, 1.1 |
| h3 | `clamp(1.5rem, 2.2vw, 1.875rem)` | 700, -0.02em, 1.25 |
| h4 | `clamp(1.125rem, 1.6vw, 1.375rem)` | 600, 1.35 |
| lead | `clamp(1.125rem, 1.6vw, 1.25rem)` | 500, 1.75 |
| body | 1rem | 400, 1.65 |
| small | 0.875rem | 500, 1.55 |
| label (mono) | 0.75rem | 500, 0.14em, uppercase |

Max prose width 65ch. Spacing on a 4px base. Section padding block 72 / 96 / 128px.

## Radii

| Token | Value | Use |
| --- | --- | --- |
| `--radius-md` | 6px | Inputs, buttons |
| Card radius | 12px | Cards |
| Panel radius | 20px | Panels |
| Full | 999px | Pills |

## Breakpoints and spacing

Tailwind defaults: `sm 640`, `md 768`, `lg 1024`. Section block padding 72px mobile → 96px tablet → 128px desktop.

## Related documents

- [`DESIGN-DIRECTION.md`](DESIGN-DIRECTION.md)
- [`COMPONENT-GUIDELINES.md`](COMPONENT-GUIDELINES.md)
- [`../04-technical/FRONTEND-STANDARDS.md`](../04-technical/FRONTEND-STANDARDS.md)
