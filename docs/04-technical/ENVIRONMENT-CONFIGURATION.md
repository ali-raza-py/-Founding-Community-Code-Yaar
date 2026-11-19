# Environment Configuration

**Status:** Implemented. All variables are optional; the site builds and runs without any of them.

## Variables

| Name | Required | Exposure | Default | Purpose |
| --- | --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | No | Public | `http://localhost:3000` | Canonical URLs, sitemap, Open Graph URLs |
| `NEXT_PUBLIC_APPLICATION_ENDPOINT` | **Yes for live applications** | Public | empty | Absolute `https://` URL that receives the application POST |
| `NEXT_PUBLIC_APPLICATION_PUBLIC_KEY` | No | Public | empty | Sent as `X-Application-Key`; must be a *public* form id, never a secret |
| `NEXT_PUBLIC_APPLICATION_TIMEOUT_MS` | No | Public | `20000` | Client-side request timeout |

`.env.example` in the repository root documents these and is the file to copy.

## Why everything is `NEXT_PUBLIC_`

The application has no server. There is no server runtime to hold a secret, and Next.js only exposes `NEXT_PUBLIC_*` values to the browser bundle. This is a deliberate consequence of the frontend-only requirement, not an oversight.

**Rules:**

- Never put an API secret, SMTP password, database URL or private key in any `.env` file used by this project.
- If the chosen provider needs a secret to write data, that secret belongs to a separate service the team controls (e.g. a serverless function), and this site calls that function's public URL.
- Treat `NEXT_PUBLIC_APPLICATION_PUBLIC_KEY` as visible in page source at all times.

## Local setup

```bash
cp .env.example .env.local
# edit .env.local
npm install
npm run dev
```

Without `NEXT_PUBLIC_APPLICATION_ENDPOINT`, the form runs in demo mode: every step and the review work, and step 5 clearly states that live submission is not configured.

## Build-time semantics

`NEXT_PUBLIC_*` values are inlined during `next build`. Changing them requires a rebuild and redeploy — restarting the server is not enough for a static export.

## Validation performed in code

- Endpoint must start with `https://` (a `http://localhost` URL is accepted only in development). If the endpoint is malformed, it is treated as not configured with a console-free UI notice.
- Timeout is parsed as an integer and clamped to 5 000–60 000 ms.
- The public key is forwarded only if non-empty.

## Production checklist

- [ ] `NEXT_PUBLIC_SITE_URL` set to the final domain (no trailing slash).
- [ ] `NEXT_PUBLIC_APPLICATION_ENDPOINT` points to the approved provider.
- [ ] Endpoint tested with a real submission; team received it.
- [ ] CORS allows the production origin.
- [ ] Privacy page names the actual provider and retention.
- [ ] No secret values exist in the deployment environment for this project.

## Related documents

- [`FORM-SUBMISSION-ARCHITECTURE.md`](FORM-SUBMISSION-ARCHITECTURE.md)
- [`DEPLOYMENT-GUIDE.md`](DEPLOYMENT-GUIDE.md)
- [`../06-privacy-and-safety/PRIVACY-REQUIREMENTS.md`](../06-privacy-and-safety/PRIVACY-REQUIREMENTS.md)
