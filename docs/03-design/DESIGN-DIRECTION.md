# Design Direction

## Source of truth

Official Code Yaar frontend (`github.com/ali-raza-py/Code-Yaar`, `frontend/` directory): `src/app/globals.css`, `src/components/layout/public-header.tsx`, `src/components/layout/footer.tsx`, brand assets.

## Primary theme — Light

| Token | Value |
|---|---|
| Canvas (background) | `#F7F8F5` |
| Surface (cards) | `#FFFFFF` |
| Ink (primary text) | `#19231D` |
| Ink-muted | `#46534A` |
| Ink-subtle | `#6B7A70` |
| Emerald (primary) | `#087A52` |
| Emerald hover | `#176B47` |
| Emerald soft | `#EAF3EE` |
| Forest (deep) | `#123D2B` |
| Supporting green | `#26966A` |
| Line (border) | `#E8ECE8` |
| Surface-raised | `#F2F5F3` |
| Surface-selected | `#D9E7DC` |

## Typography

- Headings: Montserrat (400/500/600/700/800)
- Body/UI: Figtree (400/500/600)
- Technical/mono: JetBrains Mono (400/500)
- All via `next/font/google`, Latin subset, `display: "swap"`

## Layout

- Container `max-w-[1152px]`, px-4/sm:px-6/lg:px-8
- Section padding `--space-section: 6rem`
- Header height `h-16`, sticky, bottom border
- Cards: hairline 1px border, white surface, 12px radius, subtle hover lift
- Buttons: solid emerald primary; outlined secondary; not pills

## Rules

- Light theme primary; dark mode fully functional if retained
- No theme toggle (decorative)
- No purple/pink/neon blue/rainbow
- No gradients as layout devices
- No mascots/bots/dots/particles
- Respect reduced motion
- Subtle interactions only
