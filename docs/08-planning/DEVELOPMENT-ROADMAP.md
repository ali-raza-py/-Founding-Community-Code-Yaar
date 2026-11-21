# Development Roadmap

## Completed (this rebuild)

1. Repository inspection and design research (official Code Yaar frontend + founding repo)
2. Design audit (`docs/REFERENCE-DESIGN-AUDIT.md`)
3. Backup checkpoint branch `backup/pre-rebuild-20261120`
4. Removed failed UI (dark theme, mascots, dot grid, kinetic hero, framer-motion, theme toggle, `/benefits`)
5. Established official design tokens (`globals.css` `@theme`)
6. Rebuilt shared components (header, footer, ui primitives, section, typography)
7. Rebuilt all six pages (`/`, `/about`, `/cohort`, `/apply`, `/faq`, `/privacy`)
8. Rebuilt five-step application form with submission adapter
9. Downloaded official brand assets (`public/brand/`, `public/team/`)
10. Project documentation (`docs/`)
11. Lint, typecheck, production build all pass
12. Browser testing — all routes HTTP 200, content verified

## Remaining (founder approval required)

- Configure `NEXT_PUBLIC_APPLICATION_ENDPOINT` to enable real submissions over HTTPS; when unset, applications save to browser localStorage
- Legal review of privacy page (PRIVACY-REQUIREMENTS.md TBD items)
- Confirm retention period, privacy contact, guardian-consent process for minors
- Publish review timeline and onboarding details
- Select submission provider and update privacy page accordingly
