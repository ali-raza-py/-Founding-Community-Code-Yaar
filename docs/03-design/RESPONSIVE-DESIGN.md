# Responsive Design

**Status:** Implemented. Verified by CSS inspection and build; not measured in a browser at every width in this environment.

## Test matrix

| Width | Device class | Must hold |
| --- | --- | --- |
| 320px | Small phone | No horizontal scroll; headings wrap; form inputs full width |
| 360px | Common Android | Same; nav button reachable |
| 390px | iPhone | Same; tap targets ≥44px |
| 768px | Tablet | Two-column sections may begin; nav still mobile until 1024 |
| 1024px | Laptop | Desktop nav; hero headline caps at 10rem |
| 1440px | Desktop | Content maxes at 1200px, generous margins |

## Breakpoint strategy

Mobile-first. Tailwind defaults `sm 640`, `md 768`, `lg 1024`.

| Element | Behaviour |
| --- | --- |
| Header nav | Links hidden `< lg`; disclosure menu shown; "Apply" stays visible at all sizes |
| Hero | Single centered stack; headline scales 3rem → 10rem; floating marks hidden below `sm`; metadata strip 2 → 4 columns |
| Section rhythm | 64 → 88 → 120px block padding (`md`, `lg`) |
| Principles | 1 column → 2 (`md`) → 5 (`xl`, as a ledger row) |
| Benefits | 1 → 2 (`md`) → 3 (`lg`) |
| Journey | Vertical timeline → 2-column (`md`) → 4-column (`lg`), 8 steps |
| Team | 1 → 3 (`md`) |
| Form | Single column always; review summary two-column label/value from `sm` |
| Footer | Stacked → 3 columns (`md`) |

## Typography scaling

Display and H2 use `clamp()` so they scale continuously rather than jumping at breakpoints. No heading exceeds 4.25rem, which keeps a long H1 to three lines at 1440px and prevents mobile overflow at 320px.

## Long and odd content

- Country and language names are allowed to wrap; no fixed-width selects.
- Timezone free text is `inputmode="text"` with a `maxlength` and a wrapping value display in review.
- Character counters are avoided; counts are enforced by validation messages only.
- The review summary uses `overflow-wrap: anywhere` for pasted URLs.

## Images

Only two image types exist: favicon/OG assets and, later, founder portraits. Portraits use `next/image` with `sizes="(min-width: 768px) 30vw, 90vw"`, fixed 4:5 aspect ratio to prevent layout shift. Until supplied, initials render as text and no image request is made.

## Touch and keyboard

- Minimum interactive height 44px; icon buttons 44×44.
- Sticky header must not cover focused fields: form steps include `scroll-margin-top` equal to header height.
- The mobile menu is a full-width panel below the header, not a full-screen overlay, so context is retained.

## Overflow protection

Global rules: `body { overflow-x: clip }`, `img, svg { max-width: 100% }`, and no element with a fixed pixel width wider than `100%`. Any new section must be checked at 320px.

## Related documents

- [`DESIGN-DIRECTION.md`](DESIGN-DIRECTION.md)
- [`../07-quality/PERFORMANCE-CHECKLIST.md`](../07-quality/PERFORMANCE-CHECKLIST.md)
