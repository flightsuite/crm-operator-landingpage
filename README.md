# FlightSuite — flightsuite.ai

The Universal CRM Agent. AI-powered CRM data entry through natural language.

**Live**: https://flightsuite.ai
**Branch**: `redesign/immersive-v2` (active development)

## Quick Start

```bash
python -m http.server 8000   # Serve locally
open http://localhost:8000    # View in browser
```

No build step required. Static HTML/CSS/JS.

## Project Structure

```
index.html              # Landing page
css/main.css            # All styles
js/                     # All scripts (particles, demo, animations, command bar)
Assets/                 # Logos, favicons, press images
blog/                   # SEO articles
experts/                # Auto-synced from Airtable (don't edit manually)
scripts/                # Automation (Airtable sync)
docs/                   # SEO & social media strategy + progress
.claude/commands/       # AI slash commands (/seo-daily, /social-daily)
CLAUDE.md               # AI operating manual — read before making changes
```

## Key Commands

```bash
npm run sync            # Sync expert directory from Airtable
npm run sync:dry-run    # Preview sync without changes
```

## Design Philosophy

See `CLAUDE.md` for the full design philosophy. The short version:

> The site IS the product experience. Steve Jobs standard. Every element serves the story.

## Contributing

1. Read `CLAUDE.md` before touching code
2. Work on `redesign/immersive-v2` branch
3. Test mobile at 375px — no layout shifts, no scroll jank
4. Bump cache busters (`?v=N`) after CSS/JS changes
5. Don't modify `<head>` SEO tags without verification
