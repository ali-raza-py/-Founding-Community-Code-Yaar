# Form Submission Architecture

## Adapter selection

1. If `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` is set → submit via Web3Forms `https://api.web3forms.com/submit`
2. Else if `NEXT_PUBLIC_APPLICATION_ENDPOINT` is set → POST JSON envelope to endpoint
3. Else → `not-configured`: form shows honest "submission not configured" message; answers saved locally only

## Envelope

```
{
  submissionId: string (UUID, stable across retries),
  formVersion: string ("1.0.0"),
  submittedAt: string (ISO),
  application: ApplicationData
}
```

## Endpoint validation

- Must parse as URL
- Protocol https://, or http:// only on localhost/127.0.0.1
- Invalid → `null` (treated as not-configured)

## Timeout

- `NEXT_PUBLIC_APPLICATION_TIMEOUT_MS`, clamped 5s–60s, default 20s
- AbortController enforces timeout

## Result handling

- `ok: true` → success state, optional reference, draft cleared, session guard set
- `ok: false` → error state with reason: network / timeout / rejected / server / not-configured; retry offered
- Never throws; never logs applicant data; only diagnostic metadata

## Honesty rules

- No fake submission success without a successful endpoint response
- `not-configured` shown plainly when no endpoint/key is set
- Duplicate-prevention: same `submissionId` retries; sessionStorage guard after success
