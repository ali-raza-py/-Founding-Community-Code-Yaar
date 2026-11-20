# Responsive Design

**Status:** Implemented. Verified by CSS inspection and build; not measured in a browser at every width in this environment.

## Test matrix

| Width | Device class | Must hold |
| --- | --- | --- |
| 320px | Small phone | No horizontal scroll; hero wordmark stacks as two lines; form inputs full width |
| 360px | Common Android | Same; nav button reachable |
| 390px | iPhone | Same; tap targets ≥44px |
| 768px | Tablet | Two-column sections; desktop navigation |
| 1024px | Laptop | Desktop nav; hero headline caps at 7rem |
| 1440px | Desktop | Content maxes at 1200px, generous margins |
| 1920px | Wide desktop | Hero wordmark stays on one line (~82% of container) |

## Breakpoint strategy

Mobile-first. Tailwind defaults `sm 640`, `md 768`, `lg 1024`.

| Element | Behaviour |
| --- | --- |
| Header nav | Links hidden `< lg`; disclosure sheet shown full height; "Apply" stays visible at all sizes; Esc closes, focus returns to trigger, body scroll locked |
| Hero | `min-height: calc(100svh - 64px)`; headline scales `clamp(2.5rem, 9vw, 7rem)`; stacks as two lines below `lg`; ghost rows cropped by the top and bottom viewport edges; mascots reduced to three, smaller, no gaze tracking on mobile |
| Section rhythm | 72 → 96 → 128px block padding (mobile, tablet, desktop) |
| Mission / Loop / Principles | Sticky heading column `lg`; stacked below |
| Loop diagram | SVG circle + node buttons desktop; vertical stepper with tap-to-expand mobile. The circle is never shrunk. |
| Benefits | 1 → 4 columns (`lg`, 12-column bento) |
| Form | Single column always; sticky bottom action bar on mobile respecting safe areas; raised panel max 640px desktop |
| Footer | Stacked → 4 columns (`lg`) |

## Typography scaling

Display and H2 use `clamp()` so they scale continuously rather than jumping at breakpoints. No heading exceeds `clamp(2.25rem, 5.2vw, 3rem)` except the hero wordmark, which is clamped to `7rem` max so a long headline never wraps above `lg`.

## Long and odd content

- Country and language names are allowed to wrap; no fixed-width selects.
- Timezone free text is `inputmode="text"` with a `maxlength` and a wrapping value display in review.
- Character counters are avoided; counts are enforced by validation messages only.
- The review summary uses `overflow-wrap: anywhere` for pasted URLs.

## Images

Only favicon/OG assets exist; no founder portraits. Portraits, if supplied later, use `next/image` with `sizes="(min-width: 768px) 30vw, 90vw"`, fixed 4:5 aspect ratio to prevent layout shift. Until supplied, initials render as text and no image request is made.

## Touch and keyboard

- Minimum interactive height 44px; icon buttons 44×44.
- Sticky header must not cover focused fields: form steps include `scroll-margin-top` equal to header height.
- Mobile sheet is a full-height panel above the content, focus-trapped while open.

## Overflow protection

Global rules: `body { overflow-x: clip }`, hero `overflow: clip`, `img, svg { max-width: 100% }`, no element with a fixed pixel width wider than `100%`. Ghost rows are clipped by the hero, never cause horizontal scroll. Any new section must be checked at 320px and in landscape phone.

## Related documents

- [`DESIGN-DIRECTION.md`](DESIGN-DIRECTION.md)
- [`../07-quality/PERFORMANCE-CHECKLIST.md`](../07-quality/PERFORMANCE-CHECKLIST.md)
