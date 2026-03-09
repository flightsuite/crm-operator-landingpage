# FlightSuite — flightsuite.ai

The universal CRM Agent. AI-powered CRM data entry through natural language across Chrome, SMS, and WhatsApp.

## Quick Start

```bash
# No build step — open directly
open index.html

# Or use any static server
python -m http.server 8000
npx serve .
```

## Project Structure

```
├── index.html              # Main landing page
├── css/                    # Stylesheets (extracted from monolith)
│   ├── main.css            # All current styles
│   └── sections/           # Section-specific styles (planned)
├── js/                     # Scripts
│   ├── main.js             # Core functionality (demo, modals, sounds, analytics)
│   ├── init.js             # Dynamic expert count loader
│   └── hero-scene.js       # Three.js hero (planned)
├── airtable-config.js      # Form submission via Google Sheets webhook
├── Assets/                 # Images, logos, favicons
├── blog/                   # SEO blog articles (9 pages)
├── alternatives/           # CRM alternatives comparison pages
├── compare/                # CRM vs CRM comparison pages
├── experts/                # Auto-synced expert directory from Airtable
├── guides/                 # Product guides
├── tools/                  # Interactive tools (ROI calculator)
├── resources/              # Resource pages
├── templates/              # Page templates for new content
├── app/                    # Web app (login, connect CRM)
├── scripts/                # Automation (Airtable sync, scraper)
├── docs/                   # Strategy docs, progress trackers
└── .github/workflows/      # CI/CD (expert sync)
```

## Key Integrations

| Integration | Purpose |
|-------------|---------|
| Chrome Web Store | Primary CTA — free extension install |
| Google Sheets webhook | Form submissions (configured in `airtable-config.js`) |
| Airtable | Expert directory data source |
| Google Analytics | `G-0CSY283V4Y` |

## Expert Directory Sync

```bash
export AIRTABLE_API_KEY=pat...your-key
npm run sync           # Sync experts from Airtable
npm run sync:dry-run   # Preview without changes
```

Runs automatically daily via GitHub Actions. See `scripts/sync-airtable.js`.

## SEO Content

All pages have structured data (JSON-LD), Open Graph tags, and canonical URLs. Do not modify `<head>` content without verifying SEO impact.

## Design System

See `css/main.css` `:root` for design tokens (colors, typography, spacing, easing curves).
