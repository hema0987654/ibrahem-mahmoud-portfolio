# Ibrahem Mahmoud — Portfolio

Personal portfolio for a backend developer. Concept: **Follow the Request**.

## Stack

Next.js 16 (App Router, static) · React 19 · TypeScript (strict) · Tailwind CSS v4.
No WebGL, no dark mode, no backend, no analytics.

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck
npm run lint
npm run build
```

## Where things live

| Path | Purpose |
| --- | --- |
| `content/` | All copy and data (profile, trace, systems, case studies, evolution, stack). Edit here, not in components. |
| `app/globals.css` | Design tokens (`@theme`), paper grid, grain, motion keyframes. |
| `components/sections/` | Page sections. |
| `components/trace/`, `components/diagram/` | The Trace and the module maps. |
| `components/ui/` | Shared pieces (header, footer, section header, magnetic link, copy email). |
| `app/fonts/` | Self-hosted variable fonts (OFL licences included). |
| `scripts/process-photo.mjs` | One-off portrait processing (`npm run photo`). Source lives in git-ignored `assets-src/`. |

## Configuration

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL` to the deployed URL.

## Pages

- `/` — Hero, The Trace, Systems, Evolution, Stack, About, Contact
- `/systems/stockguard`, `/systems/talent-showcase`, `/systems/shopsphere` — case studies
- `/sitemap.xml`, `/robots.txt`, `/llms.txt`, Open Graph images (all generated from `content/`)

## Notes

- GSAP + ScrollTrigger is the only animation library and is loaded only for The Trace on wide screens.
  Small screens, reduced motion and no-JavaScript get the vertical stepper.
- Every project claim maps to a public repository. `live` links in `content/systems.ts` stay `null`
  until a deployment is verified.
