# Form Submission Architecture

## Adapter selection

1. If `NEXT_PUBLIC_APPLICATION_ENDPOINT` is set → POST JSON envelope to the endpoint over HTTPS.
2. Else → save the envelope to browser localStorage and return a local reference — nothing is sent over the network.

## Envelope

```
{
  submissionId: string (UUID, stable across retries),
  formVersion: string ("1.0.0"),
  submittedAt: string (ISO),
  application: ApplicationData,
  referralCode: string | null
}
```

## Endpoint validation

- Must parse as URL
- Protocol https://, or http:// only on localhost/127.0.0.1
- Invalid → treated as not configured (local save)

## Timeout

- `NEXT_PUBLIC_APPLICATION_TIMEOUT_MS`, clamped 5s–60s, default 20s
- AbortController enforces timeout

## Result handling

- `ok: true` → success state, optional reference, draft cleared, session guard set
- `ok: false` → error state with reason: network / timeout / rejected / server; retry offered
- Never throws; never logs applicant data; only diagnostic metadata

## Honesty rules

- No fake submission success without a successful endpoint response.
- When no endpoint is configured, applications are saved to browser localStorage (not submitted anywhere) and a local reference is returned — this is honest about where the data lives.
- Duplicate-prevention: same `submissionId` retries; sessionStorage guard after success.
