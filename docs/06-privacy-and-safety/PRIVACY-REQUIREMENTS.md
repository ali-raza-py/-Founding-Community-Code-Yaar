# Privacy Requirements

**Status:** Requirements confirmed as obligations; implementation partially complete. **Not legal advice.**

## Must-haves before collecting a single real application

1. **A named processor.** The submission provider must be chosen and named on `/privacy`.
2. **A working contact route.** A privacy contact (email or form) must exist. Currently `TBD` on the site.
3. **A retention period.** Stated in days/months, not "as long as necessary".
4. **A deletion procedure.** Who does it, within what time, and how requests are verified.
5. **An access list.** Who can see applications, on what basis.
6. **Guardian-consent process** for applicants under 18 (see [`APPLICANT-SAFETY.md`](APPLICANT-SAFETY.md)).
7. **Legal review** for the jurisdictions where applicants live. The brief forbids claiming compliance; that does not remove the obligation to assess it.

## Principles applied

| Principle | Implementation |
| --- | --- |
| Data minimisation | Only fields needed for review; optional fields explicitly optional; no DOB, no phone, no docs |
| Purpose limitation | Fields are collected for review, notification and cohort planning — stated on `/privacy` |
| Storage limitation | No server storage by this project; retention belongs to the provider and must be defined |
| Integrity & confidentiality | Transport over HTTPS; access limited to reviewers; no public posting of applications |
| Transparency | `/privacy` explains categories, purposes, access, retention and rights in plain language |
| Accountability | Founder owner named in [`../05-operations/TEAM-RESPONSIBILITIES.md`](../05-operations/TEAM-RESPONSIBILITIES.md) |

## What the site must never claim

- GDPR/CCPA compliance (or any other regime) without review.
- "Bank-level encryption" or similar unverified security language.
- That data is "never shared" if a third-party processor stores it.
- That data is deleted after a period the team does not actually enforce.

## Public privacy page requirements

The page must state, accurately:

- what is collected and why (per category),
- who can access it,
- where it is stored (processor, once chosen),
- how long it is kept,
- how to request access, correction or deletion,
- how minors are handled,
- what to do if something goes wrong.

Anything not yet decided is presented as "not yet confirmed" rather than invented. Bare `TBD` in public copy is acceptable only alongside an honest sentence.

## Cookies and tracking

None. No analytics, no advertising pixels, no embeds. If this changes, the privacy page must change first, and consent handling must be designed.

## Breach handling (proposed)

1. Contain: revoke access, disable endpoint if needed.
2. Assess: what data, how many applicants, what risk.
3. Notify: affected applicants and, where required by law, authorities. Timelines `TBD` — legal input needed.
4. Record: what happened and what changed.

## Related documents

- [`DATA-COLLECTION.md`](DATA-COLLECTION.md)
- [`DATA-RETENTION.md`](DATA-RETENTION.md)
- [`APPLICANT-SAFETY.md`](APPLICANT-SAFETY.md)
- [`../08-planning/RISKS-AND-ASSUMPTIONS.md`](../08-planning/RISKS-AND-ASSUMPTIONS.md)
