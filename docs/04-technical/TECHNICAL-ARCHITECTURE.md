# Technical Architecture

**Status:** Implemented.

## Shape

A single Next.js App Router application, statically rendered, with no server-side logic owned by this project.

```text
Browser
  │
  ├── Static HTML/CSS (all informational pages)
  ├── Small client bundles (nav, FAQ accordion, application form)
  │
  └── fetch POST ──► Configurable external submission endpoint
                     (owned by the team; provider TBD)
```

There is no `app/api` directory, no server actions, no middleware, no database client, no auth.

## Stack

| Layer | Choice | Version |
| --- | --- | --- |
| Framework | Next.js App Router | 16.4.6 |
| UI | React | 19.3.1 |
| Language | TypeScript (strict) | 5.9.3 |
| Styling | Tailwind CSS v4 (`@theme` tokens) | 4.3.5 |
| Icons | lucide-react | 0.545.x |
| Validation | zod | 4.x |
| Class utilities | clsx + tailwind-merge | — |

Deliberately absent: shadcn/ui CLI (no Radix dependency tree was needed for the primitives used), animation libraries, form libraries, state managers, analytics.

### Why not a form library

The form is five steps with ~27 fields and simple synchronous validation. A hand-written reducer plus zod keeps the bundle small and the behaviour explicit, including the submission state machine and draft persistence, which would otherwise require custom adapters.

### Why zod

Standalone schema validation with inferred TypeScript types means the same shape defines the payload type, the review summary and the validators. It works client-side only, so it does not violate the no-backend rule.

## Rendering strategy

| Route | Type | Client JS |
| --- | --- | --- |
| `/` | Static | Header nav (mobile), link tracking only |
| `/about` | Static | Header nav |
| `/cohort` | Static | Header nav |
| `/faq` | Static shell + client accordion | Accordion |
| `/privacy` | Static | Header nav |
| `/apply` | Static shell + client form | Form (~zod + component code) |

No `dynamic = "force-dynamic"`, no `cookies()`, no `headers()` in pages. The build should emit prerendered HTML for all six routes.

## Form submission adapter

`src/lib/submission.ts` is the only module that talks to the network.

- Reads `NEXT_PUBLIC_APPLICATION_ENDPOINT` and optional `NEXT_PUBLIC_APPLICATION_PUBLIC_KEY` at build time.
- Returns a discriminated union result: `{ ok: true, reference }` or `{ ok: false, reason: "not-configured" | "network" | "timeout" | "rejected" | "server" }`.
- Applies an `AbortController` timeout.
- Sends a JSON envelope with an idempotency key.
- Never logs the payload.

See [`FORM-SUBMISSION-ARCHITECTURE.md`](FORM-SUBMISSION-ARCHITECTURE.md).

## Data flow

```text
ApplicationForm (client)
  values ──► zod step schema ──► errors (field-level)
        ──► full schema ──► ApplicationData
        ──► buildEnvelope(submissionId, data)
        ──► submitApplication(envelope)  [submission.ts]
                 │
                 └── result ──► SubmissionStatus UI
```

No global state. No context provider. The form owns its data for the lifetime of the page.

## Environment handling

Only `NEXT_PUBLIC_*` variables are read, because the app has no server runtime. This is a hard constraint of the frontend-only requirement: anything given to the browser is public. The endpoint must therefore be a public ingest URL (form endpoint with a public form id, or a hosted function with its own origin restrictions).

Secrets must never be placed in `NEXT_PUBLIC_*`. See [`ENVIRONMENT-CONFIGURATION.md`](ENVIRONMENT-CONFIGURATION.md).

## Failure modes

| Mode | Detection | User experience |
| --- | --- | --- |
| No endpoint configured | Build-time constant missing | Submit disabled, honest demo notice, draft retained |
| Network offline | `fetch` rejects | Error + Retry |
| Slow endpoint | Abort at timeout | Timeout message + Retry (same idempotency key) |
| 4xx | `!response.ok` | "We could not accept this application" + retry + fallback contact note |
| 5xx | `!response.ok` | "Something went wrong on our side" + retry |
| Duplicate click | `status === "submitting"` | Button disabled; key reused |

## Security posture

- No secrets in the bundle (verified by convention and audit of `process.env` usage).
- No applicant data in URLs, console output, or third-party requests.
- Draft in `localStorage` limited to data fields, no consent flag, user-clearable.
- `poweredByHeader: false`.
- External links (none currently) would use `rel="noopener noreferrer"`.

## Scalability and maintenance

The site is static; traffic scaling is the host's problem. Content changes are code changes — acceptable at this stage and appropriate for a site with a fixed, audited message. If the team later needs non-technical editing, a headless CMS can be added without changing routes, but that is out of scope now.

## Related documents

- [`PROJECT-STRUCTURE.md`](PROJECT-STRUCTURE.md)
- [`FORM-SUBMISSION-ARCHITECTURE.md`](FORM-SUBMISSION-ARCHITECTURE.md)
- [`DEPLOYMENT-GUIDE.md`](DEPLOYMENT-GUIDE.md)
- [`../08-planning/DECISION-LOG.md`](../08-planning/DECISION-LOG.md)
