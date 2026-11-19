# Deployment Guide

**Status:** Instructions verified locally (`npm run build` succeeds). No deployment has been performed from this repository.

## Requirements

- Node.js 20+ (verified on 24).
- npm 10+.
- A static-capable host. Any of Vercel, Netlify, Cloudflare Pages, GitHub Pages (with `output: "export"` adjusted) or a Node server for `next start`.

## Build and run

```bash
npm ci
npm run typecheck
npm run lint
npm run build
npm run start        # serves the production build on :3000
```

`npm run build` prerenders all routes. Expect the output to list `/`, `/about`, `/cohort`, `/apply`, `/faq`, `/privacy` as static.

## Environment before the first deploy

Set these in the host's environment configuration (see `.env.example`):

```
NEXT_PUBLIC_SITE_URL=https://<final-domain>
NEXT_PUBLIC_APPLICATION_ENDPOINT=https://<approved-endpoint>
NEXT_PUBLIC_APPLICATION_PUBLIC_KEY=<optional public form id>
NEXT_PUBLIC_APPLICATION_TIMEOUT_MS=20000
```

Because values are inlined at build time, set them **before** building.

## Vercel (recommended, no extra config)

1. Import the repository.
2. Framework preset: Next.js. Build `npm run build`, output default.
3. Add the environment variables for Production and Preview.
4. Deploy. Attach the custom domain.
5. Re-deploy after setting `NEXT_PUBLIC_SITE_URL` so canonical and OG URLs are correct.

## Netlify / Cloudflare Pages

- Build command `npm run build`.
- Use the Next.js runtime adapter supplied by the platform (`@netlify/plugin-nextjs`, `@cloudflare/next-on-pages`) or switch to `output: "export"` in `next.config.ts` for a purely static host. Static export is viable here because there are no server features; if you enable it, `sitemap.ts` and `robots.ts` still work at build time, but `next/image` optimisation requires `images.unoptimized = true`.

## Self-hosted Node

```bash
npm ci && npm run build && PORT=3000 npm run start
```

Put it behind a reverse proxy with TLS. It is still a static-content server; the app makes no outbound calls.

## Post-deploy verification

- [ ] All six routes return 200.
- [ ] `/sitemap.xml` and `/robots.txt` return the production domain.
- [ ] Page titles and OG tags are correct (view source, not devtools runtime).
- [ ] Mobile menu opens and closes with keyboard.
- [ ] Application form reaches step 5.
- [ ] With endpoint configured: a test application arrives at the provider; success state appears; draft cleared.
- [ ] With endpoint unset (preview env): demo notice appears and submit is disabled.
- [ ] Privacy page names the real provider.
- [ ] No console errors on any route.

## Rollback

Vercel/Netlify keep previous deployments; promote the last known good one. For self-hosted, keep the previous build artifact and restart. No database means rollback is safe and complete.

## Related documents

- [`ENVIRONMENT-CONFIGURATION.md`](ENVIRONMENT-CONFIGURATION.md)
- [`../07-quality/RELEASE-CHECKLIST.md`](../07-quality/RELEASE-CHECKLIST.md)
