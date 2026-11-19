# Application Form Specification

**Status:** Implemented. Field list confirmed; validation thresholds are recommendations.

Source of truth in code: `src/types/application.ts` (types), `src/lib/validation.ts` (rules), `src/lib/constants.ts` (option lists).

## Overview

| Property | Value |
| --- | --- |
| Route | `/apply` |
| Steps | 5 (4 data steps + review/consent) |
| Required fields | 21 |
| Optional fields | 6 |
| Storage in browser | Draft only, `localStorage`, user-clearable, no consent flag |
| Transport | `POST` JSON to one endpoint from `NEXT_PUBLIC_APPLICATION_ENDPOINT` |
| Timeout | 20s default (`NEXT_PUBLIC_APPLICATION_TIMEOUT_MS`) |
| Anti-duplicate | In-flight lock, idempotency key, success lock |

## Step 1 — Personal information

| Field | Key | Type | Required | Validation | Purpose | Privacy |
| --- | --- | --- | --- | --- | --- | --- |
| Full name | `fullName` | text | Yes | 2–100 chars | Address the applicant | Personal identifier |
| Email address | `email` | email | Yes | Valid email, ≤254 chars | Selection notification only | Contact data |
| Country | `country` | select | Yes | Must be in country list | Time-zone/region planning, aggregate diversity | Sensitive-ish (location) |
| City | `city` | text | Yes | 1–80 chars | Planning live-session clusters | Location |
| Region / state | `region` | text | No | ≤80 chars | Disambiguation only | Location |
| Age range | `ageRange` | select | Yes | One of six ranges | Safeguarding (minors), cohort composition | Sensitive (age band only) |

**Not collected, by design:** exact date of birth, street address, phone number, identity documents, government IDs, gender, photo.

Age ranges: `Under 16`, `16–17`, `18–24`, `25–34`, `35–44`, `45 and above`. No birthdate is requested. `Under 16` and `16–17` trigger the minors policy in [`../06-privacy-and-safety/APPLICANT-SAFETY.md`](../06-privacy-and-safety/APPLICANT-SAFETY.md).

## Step 2 — Education

| Field | Key | Type | Required | Validation | Notes |
| --- | --- | --- | --- | --- | --- |
| Current education level | `educationLevel` | select | Yes | Enumerated | Includes `Self-taught` and `Not currently studying` |
| School / college / university | `institution` | text | No | ≤120 chars | Optional so self-taught applicants are not blocked |
| Field of study | `fieldOfStudy` | text | No | ≤100 chars | Optional for the same reason; placeholder suggests "Self-taught / independent" |
| Current year or grade | `yearOrGrade` | text | Yes | 1–60 chars | Free text ("2nd year", "Final year", "Self-paced") |

Education level options: `School`, `High school / college`, `Undergraduate`, `Postgraduate`, `Bootcamp or online programme`, `Self-taught`, `Not currently studying`.

## Step 3 — Programming background

| Field | Key | Type | Required | Validation | Notes |
| --- | --- | --- | --- | --- | --- |
| Programming experience | `experienceLevel` | radio | Yes | `beginner` \| `intermediate` \| `advanced` | Self-assessed; not a filter |
| Languages / technologies | `languages` | textarea | Yes | 1–300 chars | "None yet" is acceptable and explicitly allowed |
| Previous projects | `previousProjects` | textarea | No | ≤1000 chars | Rough or unfinished work is welcome |
| GitHub | `github` | url | No | `https://` URL, ≤200 chars | Context only, never scored |
| LinkedIn | `linkedin` | url | No | `https://` URL, ≤200 chars | Context only |
| Portfolio | `portfolio` | url | No | `https://` URL, ≤200 chars | Context only |

**Never mandatory:** GitHub, LinkedIn, portfolio. The form states this in helper text.

## Step 4 — Motivation and contribution

| Field | Key | Type | Required | Validation | Prompt guidance |
| --- | --- | --- | --- | --- | --- |
| Why The First 100 | `motivation` | textarea | Yes | 80–1500 chars | Specific, personal, no generic answers |
| What you hope to learn | `learningGoals` | textarea | Yes | 40–1000 chars | Name a skill or a gap |
| What you could contribute | `contribution` | textarea | Yes | 40–1000 chars | Any form: answers, reviews, docs, translation, organisation |
| Weekly time | `weeklyTime` | select | Yes | Enum | `Under 2h`, `2–4h`, `5–7h`, `8–10h`, `10h+` |
| Preferred language | `preferredLanguage` | text | Yes | 1–60 chars | Planning only; not a criterion |
| Time zone | `timezone` | text | Yes | 1–60 chars | e.g. `Asia/Karachi (UTC+5)` |

Character minimums exist to make generic one-word answers impossible. They are deliberately low enough that a sincere short answer passes.

## Step 5 — Review and submit

Displays every answer grouped by step, with an "Edit" control per group that returns to that step. Includes:

- Privacy summary and link to `/privacy`.
- Required consent checkbox: "I have read the privacy information and agree to my application being reviewed."
- A statement that submitting does not guarantee acceptance.
- Submit button, disabled while in flight or when the endpoint is unconfigured.
- Draft notice and "Clear saved progress" action.

## Validation behaviour

- **On blur** for each field, once touched.
- **On step advance:** all fields in the step validated; first error receives focus.
- **Error copy:** specific and actionable ("Enter an email address such as you@example.com"), rendered next to the field with `aria-describedby`.
- **Invalid state:** `aria-invalid="true"`, error text with `role="alert"` at the form level summary once per submit attempt.
- **Server/network errors** never discard answers.

## Submission behaviour

1. Validate all steps again (defensive).
2. Ensure a `submissionId` exists (UUID v4 via `crypto.randomUUID`), generated once per application attempt and reused for retries.
3. `POST` `{ submissionId, formVersion, submittedAt, application }` with `Content-Type: application/json` and optional public form key header.
4. `AbortController` timeout; state moves to `submitting` → `success` | `error`.
5. On success: clear the draft, set a session flag, show success screen with what happens next and no dates.
6. On error: keep draft, show retry, record nothing in the URL.

**Never:** log the payload, put answers in query strings, or show success before a 2xx response.

## Accessibility requirements

- `fieldset`/`legend` per step; labelled inputs; `aria-required`.
- Step indicator is a list with `aria-current="step"`.
- Progress uses a labelled `<progress>`-like bar with text alternative ("Step 2 of 5").
- Errors announced; focus managed on step change to the step heading.
- Fully operable by keyboard; no drag or hover-only interaction.

## Related documents

- [`../04-technical/FORM-SUBMISSION-ARCHITECTURE.md`](../04-technical/FORM-SUBMISSION-ARCHITECTURE.md)
- [`../06-privacy-and-safety/DATA-COLLECTION.md`](../06-privacy-and-safety/DATA-COLLECTION.md)
- [`../07-quality/ACCESSIBILITY-CHECKLIST.md`](../07-quality/ACCESSIBILITY-CHECKLIST.md)
