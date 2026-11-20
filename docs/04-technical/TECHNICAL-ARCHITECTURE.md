# Technical Architecture

## Stack

- Next.js 16.4.6 (App Router, Turbopack, static export `output: "export"`)
- React 19
- TypeScript (strict)
- Tailwind CSS v4 (`@theme` tokens)
- Lucide icons replaced with inline SVGs (lighter, no dependency)
- `next/font/google` (Montserrat, Figtree, JetBrains Mono)
- Zod (form validation)
- clsx/tailwind-merge (`cn` helper)

## Frontend-only constraints (enforced)

- No Django / Python backend
- No PostgreSQL / Supabase / custom database
- No custom authentication
- No custom API routes
- No server actions
- No main Code Yaar backend integration

## Submission adapter

Configurable via environment variables:
- `NEXT_PUBLIC_APPLICATION_ENDPOINT` — primary endpoint (https:// or localhost http://)
- `NEXT_PUBLIC_APPLICATION_PUBLIC_KEY` — optional `X-Application-Key` header
- `NEXT_PUBLIC_APPLICATION_TIMEOUT_MS` — 5s–60s, default 20s

Adapter: POST the envelope to the configured endpoint. When no endpoint is set, the envelope is saved to browser localStorage and a local reference is returned. Never logs applicant data.

## Rendering

All public pages static prerendered (`next build` generates `out/` HTML). Application page is client-side (form state, draft, submission).

## File layout (key)

```
src/app/{layout,page,not-found}.tsx
src/app/{about,cohort,apply,faq,privacy}/page.tsx
src/app/globals.css
src/components/layout/{site-header,site-footer,wordmark}.tsx
src/components/sections/{hero,mission,principles,cohort-intro,journey,final-cta}.tsx
src/components/faq-item.tsx
src/components/ui/{button,container,section,section-heading,badge,field}.tsx
src/lib/{constants,validation,application,draft,submission,utils}.ts
src/types/application.ts
```

## Prohibited dependencies removed

- framer-motion (presentational animation only)
- shadcn/ui `@radix-ui/react-slot` (unused)
