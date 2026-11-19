# Performance Checklist

**Status:** Design decisions implemented. **No measurement has been taken.** Do not claim a Lighthouse score.

## Budget

| Metric | Budget | Notes |
| --- | --- | --- |
| First-load JS (marketing routes) | ≤ 130 KB gzipped | Next.js + React baseline |
| First-load JS (`/apply`) | ≤ 200 KB gzipped | Adds zod + form code |
| Font files | ≤ 2 families, ≤ 4 weights total | |
| Third-party requests | 0 | Hard rule |
| LCP | ≤ 2.5s on mid-range mobile | Target, unmeasured |
| CLS | ≤ 0.05 | No images above the fold; no late-injected banners |

## Implemented decisions

- [x] Static prerendering for all six routes.
- [x] No analytics, tag managers, chat widgets or embeds.
- [x] No animation library.
- [x] Fonts via `next/font` (self-hosted, `display: swap`, subset Latin) — no render-blocking third-party font CSS.
- [x] No hero image; the hero is typography and CSS. Zero image bytes above the fold.
- [x] Client JS confined to header nav, FAQ accordion and the form.
- [x] Form step components are plain presentational functions; no per-step bundles.
- [x] No scroll listeners, no intersection observers, no parallax.
- [x] `next/image` configured for AVIF/WebP for future portraits.
- [x] Fixed aspect ratios for any future imagery to prevent CLS.
- [x] `overflow-x: clip` prevents accidental horizontal scroll.
- [x] Semantic HTML reduces the need for JS-driven accessibility fixes.

## Verification steps (not yet run)

```bash
npm run build          # inspect route table and First Load JS
npx lighthouse <url> --preset=desktop
npx lighthouse <url> --form-factor=mobile --throttling-method=simulate
```

Record real numbers here before publishing any performance claim.

## Watch items

- `lucide-react` is imported per-icon; avoid barrel imports of the full set.
- zod adds ~13 KB gzipped; acceptable, and only on `/apply`.
- If a CMS or analytics is added, the budgets above must be revisited and the privacy page updated.

## Related documents

- [`../04-technical/TECHNICAL-ARCHITECTURE.md`](../04-technical/TECHNICAL-ARCHITECTURE.md)
- [`../03-design/RESPONSIVE-DESIGN.md`](../03-design/RESPONSIVE-DESIGN.md)
- [`TESTING-STRATEGY.md`](TESTING-STRATEGY.md)
