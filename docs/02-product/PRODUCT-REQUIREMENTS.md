# Product Requirements

## Pages (required)

1. `/` — Homepage
2. `/about` — About Code Yaar and founding team
3. `/cohort` — The First 100
4. `/apply` — Custom application experience
5. `/faq` — Frequently asked questions
6. `/privacy` — Privacy information

## Shared components

Header, footer, navigation, layout, buttons, form controls, typography components, section containers.

## Application form — five steps

1. Personal information: full name, email, country, city, region (optional), age range
2. Education: education level, institution (optional), field of study, year/grade
3. Programming background: experience level, languages, previous projects (optional), GitHub (optional), LinkedIn (optional), portfolio (optional)
4. Motivation: why join, what to learn, what to contribute, weekly availability, preferred language, time zone
5. Review and submit: summary, editing controls, privacy consent, submission status, loading state, failure state, retry, duplicate-prevention

## Constraints

- Frontend-only; no backend, auth, database, API routes, or server actions
- Submission endpoint configurable via `NEXT_PUBLIC_APPLICATION_ENDPOINT`
- Never fake submission success without a successful endpoint response
- Collect only necessary information (applicants may be minors)
- Draft persistence in localStorage; session guard after submission
- Accessible labels, visible focus states, reduced-motion support
- Light theme primary; dark mode fully functional if retained
