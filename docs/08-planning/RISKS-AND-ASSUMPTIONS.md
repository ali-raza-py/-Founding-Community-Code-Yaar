# Risks and Assumptions

**Status:** Live register.

## Unconfirmed operational decisions

| Item | Current state | Risk if unresolved |
| --- | --- | --- |
| Submission provider | `TBD` | No applications can be received; privacy page inaccurate |
| Privacy contact | `TBD` | Applicants cannot exercise rights |
| Retention policy | `TBD` | Unbounded storage of minors' data |
| Fee policy | Assumed free, unconfirmed | Public FAQ could contradict a later decision |
| Minors policy | `TBD` | Safeguarding and legal exposure |
| Response time | Not published | Silent promise; applicants assume days |
| Review tooling | `TBD` | Applications trapped in an inbox; no audit trail |
| Community channels | `TBD` | Onboarding cannot be delivered |

## Form submission dependencies

| Dependency | Failure mode | Mitigation in place |
| --- | --- | --- |
| External endpoint availability | Submissions fail | Honest error + retry + draft retained |
| CORS configuration | Every request fails silently in the console | Documented pre-launch test |
| Provider data handling | Privacy page becomes false | Provider must be named before launch |
| Idempotency support | Duplicate records after timeout retry | Same key reused; manual dedupe otherwise |
| Free-tier limits | Submissions rejected at volume | Check limits before campaign push |

## Privacy and applicant-safety considerations

| Risk | Severity | Mitigation |
| --- | --- | --- |
| Minor submits without guardian involvement | High | Hold under-18 applications until policy exists |
| Applicant overshares sensitive detail | Medium | Prompt guidance; no request for documents |
| Draft visible on shared device | Low–medium | Notice + clear button; no consent stored |
| Third-party processor not disclosed | High (legal) | Launch blocker |
| Phishing impersonating Code Yaar | Medium | Publish official contact once confirmed |
| Re-identification from small cohort + country data | Low | No public applicant data |

## Team capacity constraints

- One small founding team, also building the platform.
- Manual review of every application does not scale past a few hundred without dedicated hours.
- Activities require seeding and moderation; an unmoderated channel decays in weeks.
- Documentation must be maintained or it becomes misleading.

## Delivery risks

| Risk | Likelihood | Impact | Response |
| --- | --- | --- | --- |
| Provider choice delayed | Medium | Launch slips | Decide early; static preview still useful |
| Copy drifts from policy | Medium | Credibility/legal | Content audit each release |
| Brand assets arrive late | High | Interim mark visible | Clearly labelled interim; quick swap |
| Scope creep toward full-stack | Medium | Violates constraints, delays | Decision log gates; no API routes |
| Overpromising in marketing push | Medium | Trust damage | Fixed copy rules; review before posting |

## Assumptions (unverified)

1. The founding cohort is free — inferred from the brief's silence plus the initiative framing. **Must be confirmed.**
2. Applicants can be reached by email.
3. The team can review applications manually.
4. English is acceptable as the working language.
5. The site can launch before the platform is complete — the brief treats the community as independent.
6. No legal entity is required for the privacy page — likely false; legal review needed.
7. A public JSON endpoint without a secret is acceptable security-wise for an application form — true only if the endpoint is designed for public ingestion and rate-limited by the provider.

## Unsupported promises that must not appear

- Guaranteed job, internship, scholarship or career outcome.
- Certificates or professional certifications.
- A specific number of mentorship hours.
- Partner organizations or universities.
- Member counts or country counts.
- Scheduled activities or events with dates.
- "Lifetime" access or "free forever".
- Compliance certifications (GDPR, SOC 2, ISO).

## Related documents

- [`OPEN-QUESTIONS.md`](OPEN-QUESTIONS.md)
- [`DECISION-LOG.md`](DECISION-LOG.md)
- [`../06-privacy-and-safety/APPLICANT-SAFETY.md`](../06-privacy-and-safety/APPLICANT-SAFETY.md)
- [`../07-quality/RELEASE-CHECKLIST.md`](../07-quality/RELEASE-CHECKLIST.md)
