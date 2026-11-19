# Accessibility Checklist

**Status:** Implemented in code; verified by inspection, not by an automated audit.

## Target

WCAG 2.2 Level AA for the public site and the application form.

## Structure

- [x] One `<h1>` per page; headings descend without skipping levels.
- [x] Landmarks: `header`, `nav` (labelled), `main#main`, `footer`.
- [x] Skip-to-content link as the first focusable element.
- [x] `lang="en"` on `<html>`.
- [x] Lists used for lists; tables only for tabular data.

## Keyboard

- [x] Every interactive element reachable in DOM order.
- [x] Visible `:focus-visible` ring on all controls (2px emerald, 2px offset).
- [x] Mobile menu button has `aria-expanded` and `aria-controls`; `Escape` closes; focus returns to trigger.
- [x] FAQ items are `<button>` elements inside headings.
- [x] Form advancement does not rely on mouse; step changes move focus to the step heading.
- [x] No keyboard traps; no positive `tabindex`.

## Forms

- [x] Every input has a `<label for>`.
- [x] Required fields marked visually and with `aria-required`.
- [x] Hints linked via `aria-describedby`.
- [x] Errors linked via `aria-describedby`, `aria-invalid="true"`, with text and an icon (not colour alone).
- [x] Error summary announced with `role="alert"` once per submit attempt.
- [x] Success and submitting states announced via `aria-live="polite"`.
- [x] Radio groups use `fieldset`/`legend`.
- [x] Autocomplete attributes set where meaningful (`name`, `email`, `address-level2`, `country-name`).

## Colour and contrast

- [x] Body text `#121712` on `#F6F4EE` ≈ 15.8:1.
- [x] Muted text `#4C554E` on canvas ≈ 7.4:1.
- [x] Accent link `#0E7A4F` on canvas ≈ 5.1:1.
- [x] White on forest `#0B1F17` ≈ 16.4:1.
- [x] Error `#A32B21` on `#FBEDEA` ≈ 6.4:1.
- [ ] Verified with a contrast tool — ratios are computed, not tool-verified.

## Motion

- [x] `prefers-reduced-motion: reduce` removes transitions and transforms globally.
- [x] No autoplaying media, no carousels, no parallax.

## Content

- [x] Link text is meaningful in isolation (no "click here").
- [x] Icons that convey meaning have accessible names; decorative icons are `aria-hidden`.
- [x] Acronyms expanded on first use where needed.
- [x] No text embedded in images.

## Known gaps

- [ ] Screen-reader testing (NVDA/VoiceOver) not performed.
- [ ] Automated audit (axe/Lighthouse accessibility) not run.
- [ ] Zoom at 200% not visually verified; reflow tested only by code inspection.

## Related documents

- [`../03-design/DESIGN-TOKENS.md`](../03-design/DESIGN-TOKENS.md)
- [`../04-technical/FRONTEND-STANDARDS.md`](../04-technical/FRONTEND-STANDARDS.md)
- [`TESTING-STRATEGY.md`](TESTING-STRATEGY.md)
