# Keegan Lanier — Personal Brand Site

A single-page credibility hub. Built with **Astro + Tailwind v4 + GSAP**, static output,
deployed to **Cloudflare Pages**.

Design concept: *"Backstage of the Experience"* — dark + warm ember, coaster-style scroll
choreography. Themes (theme parks, metal, video games, coffee) live in the feel, not in literal icons.

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
  layouts/Base.astro       ← html shell, meta/OG, grain overlay, motion bootstrap
  components/              ← Nav, Hero, Operator, Builds, Philosophy, Connect, Icon
  scripts/motion.ts        ← GSAP scroll choreography (+ reduced-motion guard)
  styles/global.css        ← design tokens, fonts, atmosphere
  content/blog/            ← blog posts (Markdown) — scaffolded, unlinked from v1 nav
  pages/                   ← index.astro, blog/index.astro, blog/[...slug].astro
```

**Editing copy:** change `src/data/content.json`. Components read from it — no markup edits needed.

## Deploy — Cloudflare Pages

1. Push this repo to GitHub.
2. Cloudflare Pages → Create project → connect the repo.
3. Build command: `npm run build` · Output directory: `dist` · Framework preset: Astro.
4. Pushes to `main` auto-deploy; PR branches get preview URLs.
5. **At go-live:** attach the custom domain in the Pages dashboard and point DNS (already on Cloudflare).

## Open items before go-live

- [ ] **Social URLs** — fill `connect.socials[].href` in `content.json` (LinkedIn, X, Instagram, Facebook are currently `#`).
- [ ] **og:image** — add a social-share image + `<meta property="og:image">` in `Base.astro` (optional but recommended).
- [ ] **DNS cutover** to the custom domain when ready.

## Phase 2 (after launch)

- Git-based CMS (Pages CMS or Sveltia) bound to `content.json` + the blog collection.
- Admin gated by GitHub OAuth, optionally sealed behind Cloudflare Access (Zero Trust).
