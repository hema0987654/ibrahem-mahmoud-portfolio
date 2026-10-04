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
| `content/` | All copy and data (profile, evolution, stack, systems). Edit here, not in components. |
| `app/globals.css` | Design tokens (`@theme`), paper grid, grain, motion keyframes. |
| `components/sections/` | Page sections. |
| `components/ui/` | Shared pieces (header, section header, magnetic link, copy email). |
| `app/fonts/` | Self-hosted variable fonts (OFL licences included). |
| `scripts/process-photo.mjs` | One-off portrait processing (`npm run photo`). Source lives in git-ignored `assets-src/`. |

## Configuration

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL` to the deployed URL.

## Status

Phase 1 of 6: foundation, Hero, Evolution, Stack, About, Contact.
Next: Systems, The Trace, case studies, SEO assets.
