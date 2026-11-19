# Open Questions

**Status:** Live list. Each item needs a founder answer. Items marked **blocker** must be resolved before taking real applications.

## Launch blockers

| # | Question | Why it blocks | Owner | Status |
| --- | --- | --- | --- | --- |
| Q1 | Which submission provider/endpoint will receive applications? | The form cannot submit; privacy page cannot be accurate | CTO + CEO | Open |
| Q2 | What is the privacy contact address? | Applicants need a route for deletion/correction requests; page currently says `TBD` | CEO | Open |
| Q3 | What is the retention period for applications? | Required by the privacy page | CEO | Open |
| Q4 | What is the minimum age, and is there a guardian-consent process? | Accepting minors without it is a safeguarding risk | CEO | Open |
| Q5 | Is the founding cohort free? | FAQ states "no fee is being charged" — needs confirmation | CEO | Open |
| Q6 | What is the production domain? | Canonical URLs, sitemap, OG | CTO | Open |

## Important, not blocking a static preview

| # | Question | Impact | Owner |
| --- | --- | --- | --- |
| Q7 | When do applications open and close? | Site deliberately shows no dates | CEO |
| Q8 | What response time can the team meet? | Nothing is promised now | CEO |
| Q9 | Is there a waitlist, and how is it described? | Affects review process and copy | CEO |
| Q10 | Certificate policy | FAQ says none currently | CEO |
| Q11 | Founding-member recognition format (badge/listing/none) | Benefits copy says "subject to participation" | CEO + CGO |
| Q12 | Which community channel(s)? | Onboarding docs are `TBD` | CGO |
| Q13 | Who reviews applications, and with what tool? | No review UI exists | CGO |
| Q14 | Will the cohort be 18+ at launch? | Simplifies Q4 | CEO |
| Q15 | Official logo and brand assets? | Interim wordmark in use | Brand |
| Q16 | Legal review for applicant jurisdictions? | Compliance cannot be claimed without it | CEO |

## Engineering follow-ups

| # | Question | Note |
| --- | --- | --- |
| E1 | Add automated tests? | Recommended before launch; none exist |
| E2 | Endpoint dedupe on `submissionId`? | Provider-dependent |
| E3 | Should draft persistence remain enabled? | Privacy trade-off; currently on with notice |
| E4 | Is a custom OG image needed? | A generated 1200×630 image ships via `src/app/opengraph-image.tsx`. Replace it with a designed asset when brand artwork exists. |

## How to close a question

1. Record the answer in [`DECISION-LOG.md`](DECISION-LOG.md).
2. Update the affected public page in the same change.
3. Remove or mark the item here.

Do not close an item by editing only this document.

## Related documents

- [`DECISION-LOG.md`](DECISION-LOG.md)
- [`RISKS-AND-ASSUMPTIONS.md`](RISKS-AND-ASSUMPTIONS.md)
- [`../06-privacy-and-safety/PRIVACY-REQUIREMENTS.md`](../06-privacy-and-safety/PRIVACY-REQUIREMENTS.md)
