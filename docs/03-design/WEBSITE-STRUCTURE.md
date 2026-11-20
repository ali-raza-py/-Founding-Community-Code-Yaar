# Website Structure

## Route map

| Route | Title | Sections |
|---|---|---|
| `/` | Code Yaar | Hero, Mission, Principles, Founding cohort intro, Community journey, Final CTA |
| `/about` | About the Founding Community | Intro, Why we're building it, Founding team |
| `/cohort` | The First 100 — Founding Cohort | What is it, Who should apply, What members contribute, Selection, Global participation |
| `/apply` | Apply to The First 100 | Five-step form, Review, Submit |
| `/faq` | FAQ — The First 100 | 9 accordion questions |
| `/privacy` | Privacy — Founding Community | Data collection, use, access, storage, rights, minors, security |

## Shared layout

- `SiteHeader` — sticky navbar, Code Yaar logo mark + wordmark, About/The Cohort/FAQ links, Apply CTA, mobile menu
- `SiteFooter` — link columns (Community, Company), logo, social, copyright, tagline "Think. Build. Evolve."
- `Section` / `SectionInner` — consistent padding (`--space-section: 6rem`) and max-width container (`max-w-[1152px]`)

## UI primitives

- `Button` — primary (emerald), outline, ghost; sizes sm/default/lg
- `Field` — label + input/select/textarea + error/hint
- `Badge` — default, outline, emerald
- `SectionHeading` — eyebrow, title, description

## Visual tokens

Canvas `#F7F8F5`, surface `#FFFFFF`, ink `#19231D`, ink-muted `#46534A`, emerald `#087A52`, emerald-hover `#176B47`, line `#E8ECE8`, surface-selected `#D9E7DC`. Radius 12px cards, 8px inputs/buttons.
