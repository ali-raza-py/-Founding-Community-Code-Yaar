# Data Collection

**Status:** Implemented in the form. **Processors `TBD`.** Legal review required before launch.

## What is collected

| Category | Fields | Why | Required |
| --- | --- | --- | --- |
| Identity & contact | Full name, email | Review the application; notify the applicant | Yes |
| Location | Country, city, region (optional) | Regional planning; time-zone clustering | Country/city yes, region no |
| Age band | Age range | Safeguarding; cohort composition | Yes |
| Education | Level, institution (optional), field (optional), year/grade | Context for the applicant's stage | Level + year yes |
| Technical background | Experience level, languages, projects (optional) | Context; group activities | Experience + languages yes |
| Links | GitHub, LinkedIn, portfolio (optional) | Optional context | No |
| Motivation | Why join, learning goals, contribution | Primary review signal | Yes |
| Availability | Weekly time | Set realistic expectations | Yes |
| Language & time zone | Preferred language, time zone | Plan inclusive activities and support | Yes |
| Consent | Privacy agreement (checkbox) | Lawful basis record | Yes |

## What is deliberately not collected

Date of birth, home address, phone number, government ID, identity documents, gender, photos, health data, family or financial circumstances, IP-based analytics, device fingerprints, cookies for tracking.

## Where it goes

1. **Browser:** typed into a form; optionally saved as a draft in `localStorage` until submitted or cleared.
2. **Network:** one `POST` to the configured endpoint. No other requests are made with applicant data.
3. **Endpoint:** owned by the team's chosen provider. Storage, access control and retention are **that provider's responsibility and currently `TBD`**.

This repository stores nothing.

## Draft storage details

| Aspect | Behaviour |
| --- | --- |
| Key | `codeyaar.first100.application-draft.v1` |
| Contents | Steps 1–4 field values only; no consent flag, no submission id |
| When written | After step 1 passes validation, on subsequent value changes (debounced) |
| Cleared by | Successful submission, explicit "Clear saved progress", or browser data clearing |
| Notice | Visible on the form with a clear button |
| Risk | Shared-device exposure. Accepted because the benefit (not losing a long application) is real and the notice is explicit. |

## Logging

The application never logs form values. Error handling records only the failure reason. If hosting adds access logs, they contain URLs and IPs, not application bodies.

## Related documents

- [`PRIVACY-REQUIREMENTS.md`](PRIVACY-REQUIREMENTS.md)
- [`APPLICANT-SAFETY.md`](APPLICANT-SAFETY.md)
- [`DATA-RETENTION.md`](DATA-RETENTION.md)
- [`../04-technical/FORM-SUBMISSION-ARCHITECTURE.md`](../04-technical/FORM-SUBMISSION-ARCHITECTURE.md)
