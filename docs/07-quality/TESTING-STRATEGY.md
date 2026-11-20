# Testing Strategy

## Browser testing performed

All six routes fetched and verified returning HTTP 200:
- `/`, `/about`, `/cohort`, `/apply`, `/faq`, `/privacy`

Verified on rendered HTML:
- Campaign label, headline, CTAs present on homepage
- Founder names and actual team portraits on `/about`
- Full five-step form with labels, required attributes, emerald focus rings on `/apply`
- Accordion questions on `/faq`
- Data categories and sections on `/privacy`

## Absence checks (banned elements)

Confirmed absent from rendered pages:
- Mascot/bot components, dot grid, kinetic hero
- framer-motion, `data-theme` toggle, glassmorphism cards
- Purple/pink/neon blue/rainbow accents

## Theme

Light theme primary; verified `#F7F8F5` canvas, `#087A52` emerald, `#176B47` hover. Dark mode not shipped (no theme toggle).

## Viewports

Responsive via Tailwind classes; layout tested structurally at 360–1440px ranges (mobile menu slide sheet, stacked → side-by-side sections, grid column counts).

## Accessibility

- Skip-to-content link
- Visible focus rings (`focus-visible:ring-2 focus-visible:ring-[#087a52]`)
- Semantic HTML (header, nav, main, section, form, label, button, h1–h3)
- Accessible labels on form fields; required attributes
- Reduced-motion preference respected (transitions/animations disabled)

## Build

- `npx tsc --noEmit` — clean
- `npx eslint src` — clean (0 errors)
- `npx next build` — all 12 routes static prerendered successfully
