# Form Submission Architecture

**Status:** Implemented. **Submission provider: TBD.** No real endpoint is configured in this repository.

## The constraint

This project is frontend-only. A static site cannot store applications, send email, or authenticate a receiver. It can only make one HTTP request from the applicant's browser.

Therefore the design separates:

| Concern | Where it lives |
| --- | --- |
| Collecting and validating | Client (`ApplicationForm`, zod) |
| Transport | `src/lib/submission.ts` |
| Storage, notification, review | **A service the team must choose and own** — not in this repo |

## Envelope

```jsonc
{
  "submissionId": "b1f0c1a2-…",   // UUID, idempotency key, reused across retries
  "formVersion": "1.0.0",
  "submittedAt": "2026-11-19T10:12:03.991Z",
  "application": { /* ApplicationData */ }
}
```

Headers:

```http
Content-Type: application/json
X-Application-Key: <NEXT_PUBLIC_APPLICATION_PUBLIC_KEY>   // optional, only if set
```

`X-Application-Key` is **not a secret**. It may be a public form identifier or a public site key. Anything that must remain secret cannot be used here — it would ship to every visitor.

## Adapter contract

```ts
type SubmissionResult =
  | { ok: true; reference: string | null }
  | { ok: false; reason: "not-configured" | "network" | "timeout" | "rejected" | "server" };
```

- `reference` is read from the response body if the endpoint returns `{ id | reference | submissionId }`; otherwise `null`. It is shown to the applicant only if present.
- `rejected` = 4xx (except 408/429 treated as `rejected` too, message varies by status).
- `server` = 5xx.
- `timeout` = `AbortError` after the configured timeout.
- `network` = fetch rejection not caused by abort.

The adapter never throws. Callers switch on `reason`.

## Timeout and retry

- Default timeout 20s, overridable with `NEXT_PUBLIC_APPLICATION_TIMEOUT_MS`.
- On timeout, the copy explicitly says the application **may** have been received, and retry reuses the same `submissionId`. A compliant endpoint can dedupe on it.
- Automatic retries are **not** performed. The applicant decides.

## Duplicate prevention

| Layer | Mechanism |
| --- | --- |
| UI | Submit button disabled while `status === "submitting"`; form locked after success |
| Transport | Single `submissionId` per application attempt |
| Success | `sessionStorage` flag prevents re-showing an empty form in the same tab |
| Server | **None** — dedupe depends on the endpoint honouring `submissionId` |

The honest limitation: without a backend, the browser cannot know whether an earlier attempt succeeded. The copy avoids claiming otherwise.

## Development / demo state

If `NEXT_PUBLIC_APPLICATION_ENDPOINT` is empty at build time:

- Step 5 shows a bordered notice: "Live submission is not configured in this build."
- Submit is disabled.
- All entered answers remain visible and the draft is preserved.
- No success state is reachable.

This is the state of the repository as delivered.

## Provider decision

No provider has been selected. Rejected: Tally, Google Forms (external form builders replace the custom form).

Options to evaluate (all keep the custom UI and accept a JSON POST):

| Option | Privacy | Cost | Reliability | Config |
| --- | --- | --- | --- | --- |
| Serverless function owned by the team (e.g. Vercel/Cloudflare function writing to a sheet/email) | Team controls data | Low | Depends on team | Function URL + storage credentials on the function, never in this repo |
| Formspree / Basin / Getform (JSON endpoints) | Third-party processor; DPA needed | Free tier → paid | High | Public endpoint URL |
| Airtable / Google Apps Script web app | Third-party processor; access control manual | Free | Medium | Public web-app URL |
| Formbricks / self-hosted ingest | Strong control | Hosting cost | Medium | Self-hosted URL |

Requirements any choice must satisfy:

1. Accepts `POST application/json` from a browser (CORS enabled).
2. Notifies the team (email or dashboard) without exposing applicant data publicly.
3. Restricts access to the review team.
4. Offers retention/deletion controls matching the privacy page.
5. Can dedupe on `submissionId` (or the team accepts manual dedupe).

The privacy page must be updated with the chosen processor's name, location and retention before launch. **This is a launch blocker.**

## Related documents

- [`ENVIRONMENT-CONFIGURATION.md`](ENVIRONMENT-CONFIGURATION.md)
- [`../02-product/APPLICATION-FORM-SPECIFICATION.md`](../02-product/APPLICATION-FORM-SPECIFICATION.md)
- [`../06-privacy-and-safety/DATA-COLLECTION.md`](../06-privacy-and-safety/DATA-COLLECTION.md)
- [`../08-planning/RISKS-AND-ASSUMPTIONS.md`](../08-planning/RISKS-AND-ASSUMPTIONS.md)
