# Project Structure

**Status:** Implemented. Keep this file in sync when files move.

```text
.
├── docs/                       Documentation (this folder)
├── public/
│   ├── code-yaar-logo.png      Official mark (dark, transparent)
│   └── code-yaar-logo-light.png Official mark (light, transparent)
├── src/
│   ├── app/
│   │   ├── layout.tsx          Root layout: fonts, header/footer, metadata base
│   │   ├── icon.png            Favicon, generated from the official mark
│   │   ├── apple-icon.png      Apple touch icon, generated from the mark
│   │   ├── page.tsx            Landing
│   │   ├── globals.css         Tailwind import + @theme tokens + base styles
│   │   ├── about/page.tsx
│   │   ├── cohort/page.tsx
│   │   ├── apply/page.tsx
│   │   ├── faq/page.tsx
│   │   ├── privacy/page.tsx
│   │   ├── not-found.tsx
│   │   ├── sitemap.ts
│   │   └── robots.ts
│   ├── components/
│   │   ├── layout/
│   │   │   ├── site-header.tsx
│   │   │   ├── desktop-nav.tsx
│   │   │   ├── mobile-navigation.tsx
│   │   │   ├── site-footer.tsx
│   │   │   └── wordmark.tsx
│   │   ├── sections/
│   │   │   ├── page-hero.tsx
│   │   │   ├── hero-section.tsx
│   │   │   ├── hero-atmosphere.tsx
│   │   │   ├── hero-stage.tsx
│   │   │   ├── mission-section.tsx
│   │   │   ├── principles-section.tsx
│   │   │   ├── cohort-section.tsx
│   │   │   ├── benefits-section.tsx
│   │   │   ├── journey-section.tsx
│   │   │   └── final-cta-section.tsx
│   │   ├── forms/
│   │   │   ├── application-form.tsx
│   │   │   ├── form-progress.tsx
│   │   │   ├── step-navigation.tsx
│   │   │   ├── personal-information-step.tsx
│   │   │   ├── education-step.tsx
│   │   │   ├── programming-background-step.tsx
│   │   │   ├── motivation-step.tsx
│   │   │   ├── review-step.tsx
│   │   │   └── submission-status.tsx
│   │   └── ui/
│   │       ├── button.tsx
│   │       ├── container.tsx
│   │       ├── section.tsx
│   │       ├── section-heading.tsx
│   │       ├── field.tsx
│   │       ├── inputs.tsx        (Input, Textarea, Select)
│   │       ├── checkbox.tsx
│   │       ├── radio-group.tsx
│   │       ├── accordion.tsx
│   │       └── badge.tsx
│   ├── lib/
│   │   ├── content/              Copy modules (home, about, cohort, faq, privacy)
│   │   ├── constants.ts          Navigation, options, campaign metadata
│   │   ├── validation.ts         zod schemas + helpers
│   │   ├── submission.ts         Endpoint adapter
│   │   ├── draft.ts              localStorage draft helpers
│   │   └── utils.ts              `cn()`
│   └── types/
│       └── application.ts
├── .env.example
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```

## Rules of placement

| Kind of code | Location |
| --- | --- |
| Route + metadata | `src/app/**/page.tsx` |
| Copy that is reused or long | `src/lib/content/*` |
| Enumerable options | `src/lib/constants.ts` |
| Types shared across files | `src/types/` |
| Network access | `src/lib/submission.ts` only |
| Browser storage | `src/lib/draft.ts` only |

## Naming

- Files: `kebab-case.tsx`.
- Components: `PascalCase`.
- Hooks/utilities: `camelCase`.
- CSS tokens: `--color-*`, `--font-*`, `--radius-*`, `--shadow-*`.

## Related documents

- [`FRONTEND-STANDARDS.md`](FRONTEND-STANDARDS.md)
- [`TECHNICAL-ARCHITECTURE.md`](TECHNICAL-ARCHITECTURE.md)
