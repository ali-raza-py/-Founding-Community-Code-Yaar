# Application Form Specification

## Source of truth

`src/app/apply/page.tsx`, `src/lib/validation.ts`, `src/lib/draft.ts`, `src/lib/submission.ts`, `src/lib/application.ts`, `src/types/application.ts`

## Steps

| Step | Label | Required fields | Optional fields |
|---|---|---|---|
| 1 | Personal | fullName, email, country, city, ageRange | region |
| 2 | Education | educationLevel, yearOrGrade | institution, fieldOfStudy |
| 3 | Programming | experienceLevel, languages | previousProjects, github, linkedin, portfolio |
| 4 | Motivation | motivation, learningGoals, contribution, weeklyTime, preferredLanguage, timezone | (none) |
| 5 | Review | consent | Edit any step |

## Validation (Zod)

- fullName: 2–100 chars
- email: valid email, max 254
- country/city: from COUNTRIES list / max 80
- ageRange: enum from AGE_RANGES
- educationLevel: enum from EDUCATION_LEVELS
- yearOrGrade: 1–60 chars
- experienceLevel: enum from EXPERIENCE_LEVELS
- languages: 1–300 chars
- previousProjects: max 1000
- github/linkedin/portfolio: valid https URL or empty
- motivation: 80–1500 chars
- learningGoals/contribution: 40–1000 chars
- weeklyTime: enum from WEEKLY_TIME_OPTIONS
- preferredLanguage/timezone: 1–60 chars

## Submission

- Envelope: `{ submissionId, formVersion, submittedAt, application }`
- submissionId: UUID, reused across retries for de-duplication
- adapter: Web3Forms first (if access key), else configurable endpoint
- endpoint validated: https:// or localhost http://
- timeout: configurable (5s–60s), default 20s
- Never logs applicant data; only diagnostic metadata
- Honest states: idle / submitting / success / error (network, timeout, rejected, server, not-configured)
- No fake success without endpoint response
- Retry button on error; duplicate-prevention via session guard

## Privacy

- No date of birth, home address, phone, ID numbers, photographs
- Consent text: "I have read the privacy information and agree that my application may be reviewed by the Code Yaar team."
- Consent and submissionId never persisted to localStorage
