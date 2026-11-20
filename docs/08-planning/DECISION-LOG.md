# Decision Log

| Decision | Rationale |
|---|---|
| Light theme primary, no theme toggle | Matches official Code Yaar light theme; prompt requires light primary; avoids decorative toggle |
| Montserrat headings / Figtree body / JetBrains Mono | Matches prompt typography spec; aligned with official (Fraunces/Figtree/JB Mono) |
| Inline SVGs instead of lucide-react | lucide-react failed module resolution in this toolchain; SVGs lighter and dependency-free |
| Next.js static export (`output: "export"`) | Frontend-only marketing site; all public pages prerendered |
| No shadcn/ui `@radix-ui/react-slot` | Not installed; custom button avoids unnecessary dependency |
| Application form client-side only | Frontend-only constraint; no server actions/API routes |
| Local save fallback | When no endpoint is configured, envelopes save to browser localStorage and a local reference is returned — nothing sent over the network |
| Removed `/benefits` route | Duplicated homepage content; not a required route |
| Removed framer-motion | Presentational animation only; unnecessary dependency; slows load |
| Actual founder photographs from official repo | Prompt requires actual photographs; official repo provides them |
| No promises of jobs/internships/certifications | Prompt and content explicitly prohibit overpromising |
| TBD items marked in privacy | Honest about unresolved policies; requires founder confirmation |
