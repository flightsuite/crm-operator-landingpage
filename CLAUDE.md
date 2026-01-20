# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static landing page for **FlightSuite** (branded as "CRM CoPilot"), a Chrome extension that automates CRM data entry through natural language. The site is deployed at https://flightsuite.ai.

## Architecture

**Single-file static site** - No build process, no package manager, no bundler.

- `index.html` - Main landing page (~157KB, contains all HTML/CSS/JS inline)
- `airtable-config.js` - Form submission logic using Google Sheets webhooks
- `blog/` - SEO blog articles (static HTML files)
- `Assets/` - Images, logos, favicons
- `docs/` - Design documentation and project summaries

## Development

**To develop locally:**
```bash
# Open directly in browser
open index.html

# Or use any static server
python -m http.server 8000
npx serve .
```

No build, lint, or test commands exist - this is pure static HTML/CSS/JS.

## Key Integration Points

- **Chrome Web Store**: Primary CTA links to the FlightSuite extension
- **Form submissions**: Posts to Google Sheets via Apps Script webhook (configured in `airtable-config.js`)
- **Loom video embed**: Lazy-loaded demo video in product section
- **Analytics**: `data-event` attributes on CTAs for tracking

## Important Files

| File | Purpose |
|------|---------|
| `index.html` | Main landing page with inline CSS/JS |
| `airtable-config.js` | Webhook URL and form submission functions |
| `installation-guide.html` | CRM installation instructions |
| `blog.html` | Blog listing page |

## Design System

- **Colors**: Primary blue (`#0071E3`), iOS purple (`#5E5CE6`), near-black text (`#1D1D1F`)
- **Typography**: System fonts (`-apple-system, BlinkMacSystemFont, "SF Pro Display"`)
- **Breakpoints**: Mobile-first with responsive clamp() values
- **Animations**: CSS transitions with custom easing (`--ease-smooth`, `--ease-spring`)

## Notes

- All styles and scripts are inline in `index.html` for performance
- Forms use `no-cors` mode for Google Apps Script compatibility
- The `WEBHOOK_SETUP.md` documents the Airtable webhook integration (now using Google Sheets)
