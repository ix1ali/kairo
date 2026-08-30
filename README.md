# Koala

**A whole month of content. Done in a minute.**

Meet **Kai**, the koala — the brand character. Rendered as pure SVG with offset
radial gradients, ambient occlusion and a glossy visor; his eyes track the
pointer, he glances down as you scroll, and he blinks on his own.
(`components/Koala.tsx`)

Koala takes a brand — logo, colours, voice, products, audience, goals — and produces a real
marketing campaign: a written strategy, a competitor teardown, and a 30-day calendar where every
post is designed, written, hashtagged and ready to download.

The point of difference is that it is a *plan*, not a post generator. Every day has a funnel job,
a content pillar and a position in a five-week arc.

---

## Brand

- **Mark:** Kai's face reduced to what still reads at 20px (`components/Logo.tsx`)
- **Palette:** violet `#7C5CFF` → cyan `#22D3EE` on near-black `#07070B`, lime `#C8F751` for done states
- **Type:** Sora for display, Inter for body
- **Icons:** one stroke set of 44 UI glyphs plus 8 platform marks (`components/icons/`)

## Running it

```bash
npm install
```

```bash
npm run dev
```

Then open http://localhost:3000.

No API keys are needed. Koala ships with two engines that work offline:

- **Strategy engine** (`lib/strategy/`) — writes positioning, audience segments, competitor
  archetypes, pillar weighting and the full calendar.
- **Design engine** (`lib/render/poster.ts`) — renders every post as a real, downloadable SVG
  built from your brand palette, with twelve distinct composition systems.

---

## Import by link

Paste a link anywhere — the hero, the wizard, or the products step:

| Input | What happens |
|---|---|
| Store homepage | Shopify `/products.json` or the WooCommerce Store API pulls the catalogue with names, prices, descriptions and images |
| Product page | Shopify `/product.json`, then JSON-LD `Product`, then Open Graph |
| Any website | Name, tagline, description, palette, logo, socials and a guessed category |

Currency is read off the storefront (Shopify omits it from `products.json`), and
the cheapest variant is used since `variants[0]` is often a bundle.
SSRF-guarded: private and loopback hosts are refused. See `lib/importer.ts`.

---

## How the plan is built

**Five-week arc.** Week 1 plants the flag (positioning, reach). Week 2 earns trust (proof,
education, objections). Week 3 makes the offer (conversion; heroes pushed, slow movers rescued).
Week 4 deepens the loop (retention, community, UGC). Days 29–30 bridge to next month.

**Seven pillars,** weighted per week and per category: Authority, Product, Proof, Story, Offer,
Community, Objection. Each maps to a funnel stage.

**Day-of-week rhythm.** Tuesdays teach, Fridays sell, Saturdays are lifestyle. Pillars are placed
on the days they perform best.

**Category playbooks** (`lib/strategy/categories.ts`). Ten industries, each with its own audience
segments, competitor archetypes with named gaps and counter-moves, objections, hook libraries,
visual systems, video ideas, hashtag tiers and KPIs. A gym and a skincare brand get genuinely
different months.

**One look for thirty days.** Each brand theme maps to a constrained family of
five layouts (`THEME_LAYOUTS` in `lib/projects.ts`), so a month reads as one
campaign instead of thirty unrelated posts.

**Product logic.** Products are tagged hero / core / slow. Heroes anchor recommendations; slow
movers get deliberate rescue campaigns concentrated in week 3.

---

## Packages

| Plan | Price | Posts | Videos | Projects | Credits |
|---|---|---|---|---|---|
| Starter | $49/mo | 30 (1/day) | — | 1 | 120 |
| Growth | $129/mo | 90 (3/day) | — | 3 | 400 |
| Studio | $279/mo | 60 (2/day) | 15 (1 every 2 days) | 8 | 1,000 |

No free trial — every plan delivers a complete campaign on day one.

**Credits** are only for changing things: rewrite a caption (1), new angle (3), redesign the
visual (4), regenerate a day (6), regenerate a video (20), regenerate a week (25). Top-ups from
$19.

---

## Architecture

```
app/
  page.tsx                     Landing page (renders a real generated month)
  pricing/                     Pricing, comparison table, FAQ
  login/ signup/               Auth
  dashboard/                   Sidebar shell
    page.tsx                   Overview: brands, progress, next up
    projects/new/              5-step wizard (website + store import)
    projects/[id]/             Calendar, strategy doc, brand & products
    projects/[id]/edit/        Edit inputs, rebuild campaign, delete
    billing/ credits/ settings/
  api/
    auth/…                     signup, login, logout
    projects/…                 CRUD + plan generation
    posts/[id]                 status, edits, feedback, metrics
    posts/[id]/regenerate      credit-metered rebuilds
    render/[postId]            live SVG poster
    export/[projectId]         zip: strategy.md + calendar.csv + every asset
    import-site                reads a website and pre-fills the brand
    import-products            Shopify / WooCommerce / JSON-LD catalogue import
    billing, upload, demo, me
lib/
  strategy/  knowledge.ts, categories.ts, engine.ts
  render/    poster.ts, logo.ts
  importer.ts                store + product link parsing
  ai/        pluggable image/video/text providers
  db.ts auth.ts plans.ts projects.ts zip.ts
```

### Data

A JSON store at `data/db.json` (gitignored), with a small collection API in `lib/db.ts`. Uploads
go to `public/uploads/`. Swap `lib/db.ts` for Postgres/Prisma without touching the rest of the app —
everything goes through `read()` / `mutate()`.

### Auth

Email + password with `scrypt` hashing and HMAC-signed httpOnly session cookies. No external
dependency. Set `AUTH_SECRET` in production.

### Billing

`/api/billing` currently applies plan and credit changes directly so the whole product is usable
end to end. To take real payments, replace that route with a Stripe Checkout session and fulfil on
the webhook — the app reads `packageId`, `subscriptionStatus` and `credits` from the user record
and nothing else needs to change.

---

## Optional AI providers

Copy `.env.example` to `.env.local` and add any of:

| Key | Used for |
|---|---|
| `GEMINI_API_KEY` | Image generation, copy |
| `OPENAI_API_KEY` | `gpt-image-1` artwork, copy |
| `HIGGSFIELD_API_KEY` | Short-form video from the storyboard |
| `ANTHROPIC_API_KEY` | Caption and strategy refinement |

The first configured provider wins. With none set, the built-in engines handle everything — the
app is fully functional either way. Provider status is visible in **Settings**.

---

## Notes

- Exports are real: `/api/export/[projectId]` returns a zip with `00-strategy.md`,
  `01-calendar.csv` and per-day `.svg` + `.txt` files. `?scope=plan` for documents only,
  `?week=3` for a single week.
- Posters render at 1080×1350 (feed) or 1080×1920 (reel/story/video) as vector SVG.
- The landing page demo is generated by the production engine at request time, not hardcoded.
