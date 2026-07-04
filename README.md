# Keegan Lanier — Personal Brand Site

A single-page portfolio + online resume. Built with **Astro + Tailwind v4 + GSAP**, static
output, deployed to **Cloudflare Pages**.

Design concept: *"Ride Blueprint"* — technical-drawing minimalism with light (drafting paper)
and dark (night blueprint) themes. The passions (coasters, theme parks) live in the drawings:
a hero elevation that draws itself, project spec sheets with inspection stamps, a career
timeline as a coaster elevation profile with a loop, and an end-of-ride brake run in the footer.
Subtle by default; one signature motif per section.

## Develop

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output → dist/
npm run preview  # preview the production build
```

## Project structure

```
src/
  data/content.json        ← ALL editable copy lives here (CMS binds here in Phase 2)
  layouts/Base.astro       ← html shell, meta/OG, theme + no-FOUC script, grain overlay
  components/              ← Nav, Hero, Work, Operator, Experience, TrackProfile,
                             Philosophy, Connect, Footer, SectionDivider, ThemeToggle, Icon
  scripts/motion.ts        ← GSAP scenes: DrawSVG draw-ins, scrubbed career track + car,
                             stamp presses, brake-run arrival (+ reduced-motion guard;
                             mobile never loads GSAP)
  styles/global.css        ← two-layer theme tokens (light/dark), fonts, atmosphere
  content/blog/            ← blog posts (Markdown) — scaffolded, unlinked from v1 nav
  pages/                   ← index.astro, blog/index.astro, blog/[...slug].astro
```

**Editing copy:** change `src/data/content.json`. Components read from it — no markup edits needed.

**Theming:** raw palette vars live on `:root` (light) and `[data-theme="dark"]` in
`global.css`; `@theme inline` maps them to Tailwind tokens. The toggle lives in the footer
(`LIGHTING: DAY OPS / NIGHT OPS`), persists to localStorage, and defaults to the OS preference.
Keep the no-JS `prefers-color-scheme` fallback block in sync with the dark block above it.

## Deploy — Cloudflare Pages

Connected to this GitHub repo. Pushes to `main` auto-deploy to production; PR branches get
preview URLs. Build command: `npm run build` · Output directory: `dist` · Preset: Astro.

## Phase 2 (after launch)

- Git-based CMS (Pages CMS or Sveltia) bound to `content.json` + the blog collection.
- Admin gated by GitHub OAuth, optionally sealed behind Cloudflare Access (Zero Trust).
- og:image — add a social-share image + `<meta property="og:image">` in `Base.astro`.
