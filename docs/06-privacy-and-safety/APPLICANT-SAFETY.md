# Applicant Safety

**Status:** Requirements identified. **Minors policy is unresolved — a launch blocker for accepting under-18 applicants.**

## Risks specific to this application

| Risk | Description | Mitigation |
| --- | --- | --- |
| Minors in an open community | Members under 18 interacting with adults | Guardian consent, public-only contact, moderation, no DMs between adults and minors |
| Sensitive disclosure | Applicants oversharing personal hardship in motivation answers | Guidance in the prompt: "No need to share private circumstances" |
| Data exposure via shared devices | Draft saved in `localStorage` | Clear notice + clear button; consent never saved |
| Phishing after submission | Attackers impersonating Code Yaar | State the official contact channel once confirmed; never ask for payment or documents |
| Unverified claims to applicants | Someone promises a job/certificate on the team's behalf | Public copy states no such promises; consistent messaging |
| Harassment in community | Later-stage risk | Code of conduct + moderation route |
| Scam applications | Spam or fraudulent submissions | Manual review; no automated rejection |

## Minors policy (proposed, requires founder decision)

The brief forbids inventing policy, so this is a recommendation:

1. Age range is collected; `Under 16` and `16–17` are flagged in review.
2. **No minor is accepted or onboarded** until a guardian-consent process exists.
3. Guardian consent should be a verifiable step (e.g. a signed/emailed consent from a parent or guardian to a monitored address), recorded with the application.
4. Community participation for minors happens in public channels only.
5. No private messaging between adult members and minors.
6. Local child-protection law may impose additional duties; obtain advice.
7. A named safeguarding contact is required. `TBD`.

**Recommendation:** launch the first cohort as 18+ if the safeguarding process cannot be completed in time, and state that clearly on the site and in the FAQ. This is a scope decision for the founders, not the engineering team.

## Applicant-facing safety copy

The form includes:

- "We only ask for what we need to review your application."
- "Do not include identity documents, addresses, or sensitive personal details."
- "Your application is not published."
- Privacy link next to the consent checkbox.

The site includes no public applicant listing, no comment system, and no user-generated content.

## Reporting route

A member or applicant who feels unsafe must have a private way to report. Contact address `TBD`; until it exists, do not claim a reporting process.

## Related documents

- [`PRIVACY-REQUIREMENTS.md`](PRIVACY-REQUIREMENTS.md)
- [`DATA-RETENTION.md`](DATA-RETENTION.md)
- [`../05-operations/COMMUNICATION-GUIDELINES.md`](../05-operations/COMMUNICATION-GUIDELINES.md)
- [`../08-planning/OPEN-QUESTIONS.md`](../08-planning/OPEN-QUESTIONS.md)
