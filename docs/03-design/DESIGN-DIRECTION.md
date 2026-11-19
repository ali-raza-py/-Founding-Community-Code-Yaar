# Design Direction

**Status:** Implemented. Subject to brand-asset replacement.

## Intent

A serious early-stage international technology organization. Editorial rather than promotional: the site should read like a considered publication, not a SaaS landing page.

Three adjectives: **composed, warm, precise.**

## Visual concept — "the founding ledger"

The design borrows from print: a paper-toned canvas, a hairline rule system, generous margins, and a numbered index. The cohort's 100 places are treated as an editorial fact, not a marketing device.

Applied concretely:

- **Hairlines** (`1px`, low-contrast green-tinted) separate sections instead of cards and shadows.
- **Section eyebrows**: small uppercase label with a rule, numbered (`01 — MISSION`) where a sequence exists.
- **Numbered lists**: principles and journey steps use large muted numerals.
- **One accent**: emerald used for emphasis, links, and focus only.
- **Kinetic hero**: a dark, typography-led first screen — a massive solid headline over an outlined duplicate, a few floating brand-derived marks, and cohort metadata along the bottom. Every other section stays neutral, textual and light.

## Anti-patterns avoided

No gradient meshes, no glassmorphism, no floating card stacks, no 3D blobs, no generic globe, no stock photography of laptops, no purple, no loud glow. The homepage hero's low-contrast code-character texture is the one deliberate exception, and it stays behind the headline.

## Colour rationale

Deep forest green carries seriousness and distinguishes the site from the default blue/gray startup palette. Off-white (rather than pure white) reduces glare and supports the editorial feel. Emerald is used sparingly so it retains emphasis.

All pairings were chosen to clear WCAG AA for body text. Contrast values are recorded in [`DESIGN-TOKENS.md`](DESIGN-TOKENS.md).

## Typography rationale

Two faces:

- **Display/UI:** a humanist-geometric sans with tight tracking for large headings and neutral rhythm for body text.
- **Editorial accent:** a serif reserved for a single pull-quote style moment and the cohort numeral, adding publication character without noise.

If the brand later specifies a typeface, swap the font variables in `src/app/layout.tsx`; the type scale and tokens remain valid.

## Layout system

- Max content width `1200px`, prose width `68ch`.
- Page gutters: `20px` → `32px` → `48px`.
- Section rhythm: `64px` mobile → `96px` tablet → `128px` desktop.
- 12-column grid on desktop used only where a two-column composition genuinely helps; otherwise stacked.

## Motion

- Transitions `150–200ms`, ease-out.
- Only opacity, transform and colour animate.
- The homepage hero owns the only scroll-linked motion on the site: as it leaves the viewport the content lifts, the outlined headline layer grows more visible, and the marks drift at different rates. It writes one CSS custom property per frame — no React state, transforms and opacity only.
- The hero also keeps a slow ambient background drift, confined to the first screen.
- No scroll-triggered animation, no pointer parallax, no counters.
- All motion disabled under `prefers-reduced-motion: reduce`.

## Imagery and iconography

- **Icons:** Lucide, `1.5px` stroke, `20px` default, used functionally (arrows, chevrons, check, alert). Not decorative per-heading.
- **Imagery:** none by default. The hero is typographic; the only raster asset is the brand mark, used as a floating symbol at low opacity. Founder portraits are initials until real photographs are supplied.
- **Social preview:** typographic card, no stock imagery.

## Dark mode

**Not implemented.** The brief makes it optional and conditions it on consistent support across all pages and form states. Given the tight launch scope, one well-executed light theme is better than a second theme with weak form states. If added later, it must repaint every token, not invert.

## Quality bar for new sections

- Does it survive without icons? If not, the hierarchy is weak.
- Is there exactly one focal point?
- Would it look at home beside a printed report?
- Does it work at 360px with no horizontal scroll?

## Related documents

- [`DESIGN-TOKENS.md`](DESIGN-TOKENS.md)
- [`COMPONENT-GUIDELINES.md`](COMPONENT-GUIDELINES.md)
- [`RESPONSIVE-DESIGN.md`](RESPONSIVE-DESIGN.md)
