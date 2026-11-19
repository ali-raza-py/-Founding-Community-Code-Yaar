# Testing Strategy

**Status:** Checks performed for this delivery are listed at the bottom. No automated test suite exists yet; verification is build, static type-checking, lint and an HTTP smoke check of the production build.

## What is being tested

A static marketing site plus one stateful client form. The risk profile is:

| Area | Risk | Test level |
| --- | --- | --- |
| Copy claims | High (credibility, legal) | Manual content audit |
| Form validation | High (blocks or corrupts applications) | Unit tests (recommended) + manual |
| Submission states | High (false success is unacceptable) | Unit tests on adapter + manual |
| Accessibility | Medium | Manual keyboard + axe (recommended) |
| Responsive layout | Medium | Manual at the 6-width matrix |
| Build integrity | Medium | `typecheck` + `build` + `lint` |
| SEO metadata | Low | Manual source inspection |

## Recommended next step: minimal test harness

Vitest + React Testing Library, covering only:

1. `validateStep` — each step, required and optional fields, boundary lengths.
2. `submitApplication` — not-configured, 2xx, 4xx, 5xx, abort/timeout, network rejection (mock `fetch`).
3. `ApplicationForm` — cannot advance with errors, back preserves values, review shows values, submit disabled unconfigured, duplicate click sends one request.

Not recommended at this stage: end-to-end browser suites (slow to maintain for a six-page static site) and visual regression (no stable design baseline yet).

## Manual test script (current)

### Navigation
- [ ] Header links reach `/about`, `/cohort`, `/faq`, `/apply`.
- [ ] Active route is indicated.
- [ ] Mobile menu: opens, links work, `Escape` closes, focus returns.
- [ ] Skip link focuses main content.

### Content
- [ ] No fabricated statistics, partners, dates or testimonials.
- [ ] All `TBD` occurrences are intentional and paired with honest copy.
- [ ] Home H1 and campaign label match the specification.

### Form
- [ ] Step 1 blocks on empty fields; error messages specific.
- [ ] Email rejects `a@b` and accepts `name@example.com`.
- [ ] Optional fields can be empty.
- [ ] Back preserves entered values.
- [ ] Review shows every answer; Edit returns to the right step.
- [ ] Consent unchecked → submit blocked with a clear message.
- [ ] Unconfigured endpoint → demo notice, submit disabled.
- [ ] Simulated failure → error + retry, values intact.
- [ ] Success only after 2xx; draft cleared; reload in same session shows success state.

### Build
- [ ] `npm run typecheck`
- [ ] `npm run lint`
- [ ] `npm run build`

## Checks performed for this delivery

| Check | Result |
| --- | --- |
| `npm run typecheck` | ✅ exit 0, no errors |
| `npm run lint` | ✅ exit 0 using ESLint 9 flat config (`eslint-config-next` 16 `core-web-vitals` + `typescript`) |
| `npm run build` | ✅ exit 0; `/`, `/about`, `/cohort`, `/apply`, `/faq`, `/privacy`, `/sitemap.xml`, `/robots.txt` and the 404 page all prerendered static |
| HTTP smoke check of the production server | ✅ `/`, `/about`, `/cohort`, `/apply`, `/faq`, `/privacy` return 200 with unique titles; unknown path returns 404; `/sitemap.xml` and `/robots.txt` return 200; step-1 fields (`fullName`, `email`, `country`, `city`, `ageRange`) present in `/apply` HTML; `og:image` resolves to a 1200×630 PNG (54 KB) |
| Manual test script (above) | **Not executed interactively** — no browser session was driven; client-only states (draft restore, step validation, submission) are implemented but not clicked through |
| Lighthouse / performance measurement | **Not run** — no browser measurement performed |
| Cross-browser testing | **Not run** — single environment |
| Automated tests | **None exist** |

Note: the smoke check ran without `NEXT_PUBLIC_SITE_URL` set, so the sitemap and metadata used the documented `http://localhost:3000` fallback. Set the production origin and rebuild before launch.

Do not record a check as passed unless it was executed. Update this table when checks run.

## Related documents

- [`ACCESSIBILITY-CHECKLIST.md`](ACCESSIBILITY-CHECKLIST.md)
- [`PERFORMANCE-CHECKLIST.md`](PERFORMANCE-CHECKLIST.md)
- [`RELEASE-CHECKLIST.md`](RELEASE-CHECKLIST.md)
