# Design Direction

**Status:** Implemented. Dark-first design system with a kinetic typography-led hero; light theme as a fully designed secondary theme.

## Intent

A serious early-stage international developer community. Composed, warm, precise. The site reads like a platform, not a publication: tight typography, hairline surfaces, emerald used sparingly, and purposeful motion.

Three adjectives: **composed, warm, precise.**

## Visual concept

- **Near-black canvas** (`#07110F`) as the default theme; light theme (`#F8FAFC`) is designed independently, not inverted.
- **Kinetic wordmark hero:** an enormous flat-green ("The First 100", `hero-ink = #3DAE76`, weight 800, tracking -0.045em, line-height 0.82) over the dark canvas, with outline-only ghost rows of the same word cropped by the top and bottom viewport edges and drifting at different rates. A solid wordmark sits in front. Five cursor-arrow mascots with gaze-tracking eyes overlap the letter edges; one carries a thin orbiting ribbon ring. A bright sub-headline sits under the wordmark.
- **Hairlines** (`1px`, low contrast) separate sections instead of cards and shadows.
- **Section eyebrows**: small uppercase label with a rule, numbered where a sequence exists.
- **Numbered lists**: principles and journey steps use large muted numerals.
- **One accent:** emerald used for emphasis, links, focus, and the signature gradient (`emerald-500 → teal-500`). The gradient is restricted to the "100" numeral accent, primary CTA hover sheen, diagram connectors and progress lines.
- **Signature visuals:** the kinetic wordmark, the 10×10 dot-grid (never used to show filled application slots), and the interactive learning-loop diagram.

## Anti-patterns avoided

No gradient meshes, no glassmorphism, no floating card stacks as the default layout, no 3D blobs, no generic globe, no stock photography, no purple, no loud glows, no emoji as icons, no lorem ipsum, no off-token colours, no static brochure layouts, and no infinite background drift. The only ambient loops are the hero ghost-row drift and mascot idle, both paused off-screen and under `prefers-reduced-motion`.

## Colour rationale

Emerald is a real scale (#10B981 at 500, #059669 at 600, #064E3B at 900); teal (#14B8A6 at 500) is the secondary accent. Lime/forest placeholder values were removed. Semantic tokens (`canvas`, `surface`, `ink`, `line`, …) are declared in a Tailwind v4 `@theme` block in `src/app/globals.css` and switched by `[data-theme="dark"]` / `[data-theme="light"]`.

## Typography rationale

Three faces, loaded via `next/font/google` (Latin, `display: "swap"`):

- **Manrope** — display, headings and UI (500/600/700/800).
- **Inter** — body text (400/500/600).
- **JetBrains Mono** — technical labels, counters, step numbers (400/500).

Fluid sizes via `clamp()`. Max prose width 65ch. Spacing on a 4px base; section padding 128/96/72px. Radii 8 (inputs), 12 (cards), 20 (panels), 999 (pills).

## Layout system

- Max content width 1200px; prose width 65ch.
- Section padding block: 72px mobile → 96px tablet → 128px desktop.
- One idea per viewport; sticky headings on desktop sections.

## Motion

- Transforms, opacity and SVG stroke offsets only; no layout-property animation except accordion height (safe framer-motion method).
- Reveals: fade + 16px translate, `whileInView`, once, margin -80px, stagger 60–80ms.
- Scroll-linked motion: hero lift and ghost parallax, loop-diagram arc draw, timeline progress, outline-to-fill headings.
- Ambient loops: ghost-row drift and mascot idle (paused off-screen, paused when the tab is hidden).
- Reduced motion: reveals instant, marquees paused, mascots static, scramble/word-cycle show final text.

## Dark mode

Implemented as the default theme, persisted in `localStorage` under `codeyaar-theme`, with an inline `<head>` script that sets `data-theme` before first paint to avoid a flash or hydration mismatch. Both themes are fully designed: ghost stroke, mascot shadows, diagram lines, form fields, focus rings and error states have light-theme values.

## Mascots

Cursor-arrow characters ported from OpenMausBot (Apache-2.0; see `NOTICE` and `THIRD_PARTY.md`). Permitted only in the hero (at most five) and optionally once on the form success state. Decorative (`aria-hidden`), eyes follow the pointer, not scattered on other sections.

## Related documents

- [`DESIGN-TOKENS.md`](DESIGN-TOKENS.md)
- [`COMPONENT-GUIDELINES.md`](COMPONENT-GUIDELINES.md)
- [`RESPONSIVE-DESIGN.md`](RESPONSIVE-DESIGN.md)
