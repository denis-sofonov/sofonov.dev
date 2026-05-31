# sofonov.dev

My personal site — a single editorial landing page plus a standalone résumé.
Lead frontend developer going fullstack: **Vue 3 / Nuxt · React / Next · Node ·
Python · PHP**.

**Live →** [sofonov.dev](https://sofonov.dev)

## What's inside

A dossier-style one-pager built around six sections — hero, experience, stack,
projects, now and contacts — with scroll-scrubbed motion and a WebGL particle
mark. Bilingual (en / ru), light & dark, reduced-motion aware.

| | |
|---|---|
| **Framework** | Vue 3 + Vite, TypeScript |
| **Routing / i18n** | vue-router, vue-i18n |
| **Motion** | GSAP (ScrollTrigger), Lenis smooth scroll |
| **3D** | three.js (hero particle name, logo mark) |
| **Styling** | SCSS, CSS custom properties |

## Run locally

```bash
npm install
npm run dev      # vite dev server
npm run build    # type-check (vue-tsc) + production build
npm run preview  # preview the build
```

## Notes

- Every animation degrades gracefully under `prefers-reduced-motion`, and the
  hero name stays static on touch devices (no pointer to re-gather it).
- Heavy libraries (three.js, gsap) are split into their own cacheable chunks.

— Denis Sofonov · [telegram](https://t.me/denis_sofonov) · [github](https://github.com/denis-sofonov)
