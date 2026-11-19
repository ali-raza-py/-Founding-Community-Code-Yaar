# Release Checklist

Use this before any public launch. A checked box means it was verified, not that the code exists.

## 1. Blocking decisions (founders)

- [ ] Fee policy confirmed, and FAQ wording matches it.
- [ ] Submission provider chosen, contracted if needed, and named on `/privacy`.
- [ ] Privacy contact address exists and is published.
- [ ] Retention period decided and published.
- [ ] Minors policy decided (18+ cohort, or guardian consent implemented).
- [ ] Application close date and cohort start communicated (only if real).
- [ ] Response-time expectation decided (only publish if achievable).

## 2. Content audit

- [ ] No fabricated statistics, partners, testimonials, dates.
- [ ] Every claim is correctly tensed (today / planned / ambition).
- [ ] No promise of job, internship, scholarship, certificate or career outcome.
- [ ] Home H1 and campaign label match the specification.
- [ ] All `TBD` copy has an honest accompanying sentence.
- [ ] No lorem ipsum; no leftover placeholder names.

## 3. Technical

- [ ] `npm run typecheck` passes.
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes; all six routes prerendered.
- [ ] `NEXT_PUBLIC_SITE_URL` set to the production domain and rebuilt.
- [ ] `NEXT_PUBLIC_APPLICATION_ENDPOINT` set and tested with a real submission.
- [ ] Endpoint CORS allows the production origin.
- [ ] No secret values in any `NEXT_PUBLIC_*` variable.
- [ ] No route handlers, server actions, database clients or auth added.
- [ ] No applicant data in console, URLs, or third-party requests.

## 4. Form

- [ ] All five steps reachable and validating.
- [ ] Optional fields accept empty input.
- [ ] Back navigation preserves values.
- [ ] Review summary accurate; edit links correct.
- [ ] Consent required.
- [ ] Success only after a 2xx response.
- [ ] Failure and timeout states show accurate copy and allow retry.
- [ ] Duplicate submit prevented.
- [ ] Draft saved/cleared as documented; clear button works.
- [ ] Unconfigured build shows the demo notice and cannot submit.

## 5. Accessibility and responsive

- [ ] Keyboard-only pass over every page and the whole form.
- [ ] Mobile menu keyboard operable; focus returns.
- [ ] No horizontal overflow at 320, 360, 390, 768, 1024, 1440.
- [ ] Focus visible on every control.
- [ ] Errors announced; success announced.
- [ ] Reduced-motion behaviour verified.

## 6. Deployment

- [ ] `/sitemap.xml` and `/robots.txt` correct.
- [ ] Titles/descriptions/OG verified in production source.
- [ ] 404 page renders.
- [ ] Backups/rollback path known.
- [ ] Post-deploy test application received by the team.

## 7. After launch

- [ ] Monitor the endpoint for failures.
- [ ] Review applications on the agreed cadence.
- [ ] Update the decision log with the chosen provider and policies.
- [ ] Remove this checklist's blockers from `OPEN-QUESTIONS.md` as they resolve.

## Related documents

- [`../04-technical/DEPLOYMENT-GUIDE.md`](../04-technical/DEPLOYMENT-GUIDE.md)
- [`../08-planning/RISKS-AND-ASSUMPTIONS.md`](../08-planning/RISKS-AND-ASSUMPTIONS.md)
- [`TESTING-STRATEGY.md`](TESTING-STRATEGY.md)
