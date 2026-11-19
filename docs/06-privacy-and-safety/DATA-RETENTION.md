# Data Retention

**Status:** Recommendation only. Actual retention is controlled by the submission provider, which is not yet chosen.

## Retention schedule (proposed)

| Data | Retention | Basis |
| --- | --- | --- |
| Declined applications | 6 months after decision, then delete | Enough time to answer "why was I rejected?" |
| Waitlisted applications | Until the cohort closes or 12 months, whichever is sooner | Reactivation possibility |
| Accepted applications | Duration of membership + 12 months | Operational contact |
| Anonymised aggregate counts | Indefinite | No personal data |
| Review notes | Same as the application | Must not outlive the source |
| Browser draft | Until cleared by the applicant, submission, or browser cleanup | Applicant-controlled |

No schedule is enforceable until the provider supports deletion, export and scheduled purge.

## Deletion requests

Required process (to be documented once a contact exists):

1. Applicant emails the privacy contact (`TBD`) from the address used to apply.
2. Team verifies the request against the submission.
3. Data is deleted from the provider and from any local exports.
4. Confirmation is sent within a stated window (`TBD`; 30 days is a common target).

Caveat: if the applicant was accepted, some records (e.g. consent records, safeguarding records) may need to be retained for legal or safety reasons. Scope must be defined with legal advice.

## Access and correction

Applicants may request a copy of their application or correct factual errors. Same verification route as deletion.

## Exports

If reviewers export applications to a spreadsheet for review, that file is a **second copy** of the data and must follow the same retention and access rules. Deleting from the provider alone is insufficient.

## Practical requirements for the provider

- Individual record deletion.
- Export of all records.
- Documented data location.
- Documented backup retention (backups can outlive deletions).
- A DPA or equivalent terms, if applicable.

Any provider that cannot support these should not be selected. See [`../04-technical/FORM-SUBMISSION-ARCHITECTURE.md`](../04-technical/FORM-SUBMISSION-ARCHITECTURE.md).

## Related documents

- [`DATA-COLLECTION.md`](DATA-COLLECTION.md)
- [`PRIVACY-REQUIREMENTS.md`](PRIVACY-REQUIREMENTS.md)
- [`../08-planning/OPEN-QUESTIONS.md`](../08-planning/OPEN-QUESTIONS.md)
