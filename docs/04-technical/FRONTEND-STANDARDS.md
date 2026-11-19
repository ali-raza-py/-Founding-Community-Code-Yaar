# Frontend Standards

**Status:** Implemented conventions.

## TypeScript

- `strict: true`. No `any` without a comment explaining why.
- Discriminated unions for state machines (`SubmissionState`, `SubmissionResult`).
- Types derived from zod schemas where the shape is validated (`z.infer`).
- Avoid type assertions; where unavoidable (`as const` for option lists, `sessionStorage` parsing), narrow immediately.

## React and Next.js

- Server Components by default. Add `"use client"` only for state, effects, refs, or event handlers.
- No client component may import a server-only module (there are none here, but the rule holds).
- `next/link` for internal navigation; plain `<a>` only for external links with `rel="noopener noreferrer"`.
- Pages own `metadata`; the root layout owns `metadataBase` and template.
- No `useEffect` for data that can be derived during render.
- Stable keys from data ids, never array indexes for reorderable lists.

## Styling

- Tailwind utilities with design tokens only.
- `cn()` (clsx + tailwind-merge) for conditional classes.
- Long repeated class strings become a component, not a `@apply` soup.
- Component variants via small maps or `class-variance-authority` where two+ variants exist.
- Never style by element selector in a page; global element styles live only in `globals.css` base layer.

## Accessibility standards

- Interactive element = real `<button>` / `<a>` / `<input>`, never a clickable `<div>`.
- Every form control has a programmatic label.
- Focus-visible styling never removed.
- Colour is never the only signal (errors have text and an icon).
- `aria-live` for async status ("Submitting…", errors, success).

## Copy and content

- No hardcoded marketing strings inside layout components; use content modules for anything reused or longer than a sentence fragment.
- Sentence case for headings and buttons (except the campaign label and eyebrows which are uppercase by design).
- Curly apostrophes in prose; straight in code.

## Error handling

- No empty `catch`. Each failure maps to a user-visible state.
- Network layer returns typed results instead of throwing where the caller must render a message.
- Never surface raw error messages or stack traces to applicants.

## Privacy in code

- Do not `console.log` form values, ever.
- Do not put application data in query strings or `localStorage` keys beyond the documented draft key.
- Do not add third-party scripts without an explicit decision in the decision log and a privacy page update.

## Performance standards

- Client component boundaries kept small; form steps are presentational leaves.
- No heavy dependencies for trivial behaviour.
- Fonts loaded via `next/font` with `display: swap` and limited weights.
- Images via `next/image` when real images exist.

## Review checklist

- [ ] No new dependency without a documented reason.
- [ ] No `any`, no non-null assertions on user input.
- [ ] Every new route has metadata.
- [ ] Every new interactive element is keyboard accessible.
- [ ] Copy follows [`../02-product/CONTENT-STRATEGY.md`](../02-product/CONTENT-STRATEGY.md).
- [ ] `npm run typecheck` and `npm run build` pass.

## Related documents

- [`PROJECT-STRUCTURE.md`](PROJECT-STRUCTURE.md)
- [`../03-design/COMPONENT-GUIDELINES.md`](../03-design/COMPONENT-GUIDELINES.md)
- [`../07-quality/TESTING-STRATEGY.md`](../07-quality/TESTING-STRATEGY.md)
