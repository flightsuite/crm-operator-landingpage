# CLAUDE.md

This file is the operating manual for any AI or engineer working in this repository. Read it fully before making changes.

## Mission & Design Philosophy

FlightSuite's website is not a marketing page — **the site IS the product experience**. Every interaction, animation, and visual element must answer one question:

> "How does this help a busy sales rep understand that FlightSuite eliminates their CRM pain?"

### Design Principles (Non-Negotiable)

1. **Steve Jobs standard** — Zero layout shifts, no bouncing, buttery-smooth transitions. If it's not crisp, iterate until it is.
2. **Purpose over decoration** — Apply the Five Whys to every design decision. No element exists without serving the product story.
3. **The boundary dissolves** — The marketing page and the product experience are the same thing. The command bar, the demo, the typing animation — visitors experience the product while learning about it.
4. **Predict, don't replicate** — We are building what design looks like in 2027, not copying what's trendy in 2026.
5. **50-year-old test** — Assume the reader is 50. Minimum 14px body text, high contrast, clear hierarchy.
6. **Self-evaluate honestly** — After building, ask: "Would Steve Jobs ship this?" If not, iterate. Don't stop at 80%.

### Quality Bar

- Reference sites: chirpley-ai.netlify.app, 8bit.ai, petertarka.com, kriss.ai, mont-fort.com
- Target: Awwwards-level, top 1% of sites
- No generic SaaS templates — fundamentally new interaction patterns only
- Mobile must feel as smooth as desktop — no second-class citizens

## Project Overview

**FlightSuite** — The Universal CRM Agent. Chrome extension that turns natural language into CRM actions. Deployed at https://flightsuite.ai.

| Detail | Value |
|--------|-------|
| Product | Chrome extension for CRM automation via natural language |
| ICP | Sales reps at SMBs, agency CRM admins (GHL), small business owners |
| Value Prop | Type what happened → agent logs it → save 5-10 hours/week |
| Supported CRMs | GoHighLevel (39 tools), HubSpot (69 tools), Salesforce (coming), Zoho (coming) |
| Channels | Chrome extension (live), SMS (launched), WhatsApp (coming) |

## Architecture

**Static site** — No build process. Serve directly or use `python -m http.server 8000`.

### File Map

```
index.html                  # Main landing page
css/main.css                # All styles (design tokens → components → sections → responsive)
js/
├── main.js                 # Core: header scroll, modals, analytics, typewriter
├── particles.js            # CRM Universe — canvas particle system with CRM logo planets
├── hero-demo.js            # Auto-playing demo: types commands → materializes CRM cards
├── dataflow.js             # Demo section: terminal → energy lines → CRM cards
├── animations.js           # GSAP ScrollTrigger entrance animations
├── before-after.js         # Draggable before/after split-screen reveal
├── command-bar.js          # Persistent bottom bar — type to navigate or demo CRM actions
├── ghost-agent.js          # Floating "Agent Active" widget with live action feed
├── spotlight.js            # Mouse-following glow effect on cards
├── generative-seed.js      # Timestamp-seeded per-visit variations (hue, direction, speed)
├── init.js                 # Dynamic expert count loader
airtable-config.js          # Form submission via Google Sheets webhook
Assets/                     # Logos (CRM SVGs), favicons, press images
blog/                       # SEO blog articles (static HTML)
alternatives/               # CRM alternatives pages
compare/                    # CRM vs CRM comparison pages
experts/                    # Auto-synced expert directory from Airtable
scripts/                    # Automation (Airtable sync, GHL scraper)
templates/                  # HTML templates for new comparison pages
docs/                       # Strategy docs and progress trackers
.claude/commands/           # Claude Code slash commands (/seo-daily, /social-daily)
```

### CRM Universe (particles.js)

The signature visual element. A canvas particle system where CRM platforms are planetary orbs with real logos, floating in a cosmic star field. Scroll drives the narrative:

| Section | State | Behavior |
|---------|-------|----------|
| Hero | Scattered | Vast star field, planets disconnected, logos visible |
| Pain | Drifting apart | Planets expand outward, data scatters |
| Demo | Connecting | Data pathways form between planets |
| Capabilities | Orbiting | Planets orbit a common center |
| CTA | Converging | All planets converge — one universe, one agent |

Key technical details:
- Logo images preloaded from `Assets/` (GoHighLevel.svg, hubspot.svg, etc.)
- Adaptive lerp (0.06 base, ease-out curve) for fluid state transitions
- Stars gravitationally attracted to nearest planet for "one body" cohesion
- Mobile: `STAR_COUNT = 0`, only 5 planet orbs render
- `backdrop-filter` disabled on mobile for scroll performance
- All content sections have solid backgrounds + `z-index: 1-2` to layer above canvas

## Development

```bash
# Local development
python -m http.server 8000

# Cache busting: bump ?v= params in index.html after CSS/JS changes
# Current: css/main.css?v=10, particles.js?v=7

# Expert directory sync
npm install
npm run sync           # Sync from Airtable
npm run sync:dry-run   # Preview without changes
```

### Deployment

- **Production**: Vercel (auto-deploys from branch)
- **Branch**: `redesign/immersive-v2` (active development)
- All script/CSS paths must be **relative** (e.g., `js/main.js` not `/js/main.js`) for Vercel compatibility

### Mobile Performance Rules

- No `backdrop-filter` on mobile (kills scroll performance)
- All inputs must be `font-size: 16px` minimum (prevents iOS auto-zoom)
- Fixed heights on containers that receive animated content (prevents layout shift)
- Particle canvas opacity reduced to 0.3 on mobile
- Test at 375px, 768px, 1024px, 1440px, 1920px

## SEO — Do Not Break

**Critical**: Do not modify these without verifying SEO impact:
- All `<head>` meta tags, Open Graph, Twitter cards
- All JSON-LD structured data (SoftwareApplication, Organization, FAQPage)
- URL structure (`/blog/*`, `/compare/*`, `/experts/*`, `/alternatives/*`)
- `sitemap.xml`, `robots.txt`
- H1 → H2 → H3 hierarchy
- `data-event` attributes on CTAs

## Growth Automation

### SEO (60-Day Plan)

```
/seo-daily
```

| File | Purpose |
|------|---------|
| `docs/SEO-AEO-STRATEGY.md` | Phase 1 strategy (Days 1-30) |
| `docs/SEO-PROGRESS.json` | Phase 1 progress tracker |
| `docs/SEO-PHASE2-STRATEGY.md` | Phase 2 strategy (Days 31-60) |
| `docs/SEO-PHASE2-PROGRESS.json` | Phase 2 progress tracker |

### Social Media (30-Day Plan)

```
/social-daily
```

| File | Purpose |
|------|---------|
| `docs/SOCIAL-MEDIA-STRATEGY.md` | Content templates and framework |
| `docs/SOCIAL-MEDIA-PROGRESS.json` | Progress tracker |

### Expert Directory (Airtable Sync)

Runs daily at 6 AM UTC via GitHub Actions. See `scripts/sync-airtable.js`.

| Setting | Value |
|---------|-------|
| Airtable Base | `appK4eoFrLRthiENZ` |
| Airtable Table | `tbldVnfJ0SBfo0hiK` |
| Secret | `AIRTABLE_API_KEY` in GitHub Secrets |

## Key Integrations

| Integration | Config |
|-------------|--------|
| Chrome Web Store | Primary CTA — free extension install |
| Google Sheets webhook | Form submissions (`airtable-config.js`) |
| Airtable | Expert directory data source |
| GSAP + ScrollTrigger | CDN, `defer` loaded |
| Google Fonts | Space Grotesk (display), DM Sans (body) |

## Design System (Quick Reference)

```css
/* Colors */
--color-bg-primary: #000000;        /* True black */
--color-accent-blue: #0071E3;       /* Primary CTA */
--color-accent-purple: #5E5CE6;     /* Brand accent */
--color-accent-cyan: #22D3EE;       /* Highlight */

/* Typography */
--font-display: 'Space Grotesk';    /* Headlines */
--font-body: 'DM Sans';             /* Body text */

/* Easing */
--ease-smooth: cubic-bezier(0.25, 0.46, 0.45, 0.94);
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);
```
