# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static landing page for **FlightSuite** (branded as "CRM CoPilot"), a Chrome extension that automates CRM data entry through natural language. The site is deployed at https://flightsuite.ai.

## Architecture

**Static site with automation scripts** - No build process required for the site itself, but includes Node.js scripts for data sync.

- `index.html` - Main landing page (~157KB, contains all HTML/CSS/JS inline)
- `airtable-config.js` - Form submission logic using Google Sheets webhooks
- `blog/` - SEO blog articles (static HTML files)
- `experts/` - Expert directory (auto-synced from Airtable)
- `Assets/` - Images, logos, favicons
- `docs/` - Design documentation and project summaries
- `scripts/` - Automation scripts (Airtable sync, GHL scraper)

## Development

**To develop locally:**
```bash
# Open directly in browser
open index.html

# Or use any static server
python -m http.server 8000
npx serve .
```

**For automation scripts:**
```bash
npm install
npm run sync           # Sync experts from Airtable
npm run sync:dry-run   # Preview sync without changes
```

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

## SEO/AEO 60-Day Growth Plan

This project has an active SEO optimization plan spanning 60 days in two phases. Run the daily task with:

```
/seo-daily
```

### Phases

| Phase | Days | Focus |
|-------|------|-------|
| Phase 1 | 1-30 | On-site SEO: Schema, content, technical optimization |
| Phase 2 | 31-60 | Off-page SEO: Backlinks, social, outreach, reviews |

### Key SEO Files

| File | Purpose |
|------|---------|
| `docs/SEO-AEO-STRATEGY.md` | Phase 1 strategy (Days 1-30) |
| `docs/SEO-PROGRESS.json` | Phase 1 progress tracker |
| `docs/SEO-PHASE2-STRATEGY.md` | Phase 2 strategy (Days 31-60) |
| `docs/SEO-PHASE2-PROGRESS.json` | Phase 2 progress tracker |
| `.claude/commands/seo-daily.md` | Daily task runner skill |

### Phase 2 Task Types

Phase 2 introduces three task types to handle work that requires human action:

| Type | Description |
|------|-------------|
| **CODE** | Claude executes fully (content creation, technical work) |
| **TEAM** | Requires human action - Claude provides copy-paste ready Slack messages |
| **HYBRID** | Claude does prep work, then provides Slack message for team portions |

For TEAM and HYBRID tasks, Claude outputs ready-to-copy messages you can paste directly into Slack for your team. These include:
- Specific people/sites to contact
- Exact email templates
- Step-by-step instructions
- Goals and success metrics

### How the Daily SEO Runner Works

1. Detects which phase we're in based on progress
2. Reads the appropriate strategy and progress files
3. For CODE tasks: Executes completely
4. For TEAM tasks: Outputs copy-paste Slack message
5. For HYBRID tasks: Does prep work + outputs Slack message
6. Updates progress tracker

### Session Budget Targets

- **Pro users**: ~44,000 tokens per 5-hour window
- **Max5 users**: ~88,000 tokens per 5-hour window
- **Max20 users**: ~220,000 tokens per 5-hour window

The `/seo-daily` skill is designed to maximize session usage by completing substantial work.

### Manual Progress Reset

To restart from a specific day in Phase 1:
```json
// docs/SEO-PROGRESS.json
{
  "currentDay": 1,
  "status": "not_started"
}
```

To restart from a specific day in Phase 2:
```json
// docs/SEO-PHASE2-PROGRESS.json
{
  "currentDay": 31,
  "status": "not_started"
}
```

## Social Media 30-Day Growth Plan

This project has an active social media plan for LinkedIn and Facebook. Run the daily task with:

```
/social-daily
```

### Platforms

- **LinkedIn**: https://www.linkedin.com/company/flight-suite-ai
- **Facebook**: https://www.facebook.com/flightsuiteai/

### Key Social Media Files

| File | Purpose |
|------|---------|
| `docs/SOCIAL-MEDIA-STRATEGY.md` | Content templates and framework |
| `docs/SOCIAL-MEDIA-PROGRESS.json` | Progress and promotion tracker |
| `.claude/commands/social-daily.md` | Daily task runner skill |

### Dynamic Content System

The social media skill is **dynamic** - it adapts based on real-time analysis:

1. **Fetches blog content** from https://www.flightsuite.ai/blog.html to find new posts
2. **Checks LinkedIn** for recent post themes to avoid repetition
3. **Selects content templates** based on what's needed
4. **Prioritizes new SEO content** (comparison pages, alternatives, guides)

### How the Daily Social Runner Works

1. Fetches live blog to see current content
2. Checks LinkedIn for recent post themes
3. Cross-references with progress tracker
4. Selects appropriate content (adapts if needed)
5. Provides **2 days of posts** with thumbnail URLs
6. Updates progress tracker

### Content Mix Targets

| Content Pillar | Target % |
|----------------|----------|
| Blog/Content Promos | 30% |
| Relatable Pain Points | 25% |
| Actionable Tips | 25% |
| Statistics & Data | 10% |
| Engagement Posts | 10% |

### SEO Integration

New SEO content is automatically prioritized for promotion:
- **Tier 1**: New comparison/alternatives pages (promote within 48 hours)
- **Tier 2**: New blog posts (promote within 1 week)
- **Tier 3**: Evergreen content (rotate monthly)

### Manual Progress Reset

To restart from a specific day:
```json
// docs/SOCIAL-MEDIA-PROGRESS.json
{
  "currentDay": 1,
  "status": "not_started",
  "promotedBlogs": []
}
```

## Expert Directory (Airtable Integration)

The Expert Directory at `/experts/` is automatically synced from Airtable. When new CRM admin interviews are added to Airtable, they automatically appear on the website.

### Airtable Configuration

| Setting | Value |
|---------|-------|
| Base ID | `appK4eoFrLRthiENZ` |
| Table ID | `tbldVnfJ0SBfo0hiK` |
| Required Secret | `AIRTABLE_API_KEY` (set in GitHub Secrets) |

### How the Sync Works

1. **GitHub Action** runs daily at 6 AM UTC (or manually triggered)
2. **Fetches records** from Airtable via API
3. **Scrapes GHL directory** for each expert to get ratings, reviews, certifications
4. **Merges data** (Airtable interview data + GHL directory data)
5. **Updates** `experts/experts-data.json`
6. **Generates HTML pages** for any new experts
7. **Commits and pushes** changes automatically

### Key Files

| File | Purpose |
|------|---------|
| `scripts/sync-airtable.js` | Main sync script |
| `scripts/update-expert-rankings.js` | GHL scraper (standalone) |
| `.github/workflows/sync-experts.yml` | GitHub Action for automated sync |
| `experts/experts-data.json` | Expert data (auto-generated) |
| `experts/*.html` | Individual expert pages (auto-generated) |

### Airtable Fields Mapped

| Airtable Column | Used For |
|-----------------|----------|
| Lead Name | Expert name, page title, slug |
| CRM Type | GHL vs HubSpot classification |
| Website or Profile Link | GHL directory URL for scraping |
| Email | Contact (not displayed) |
| Fathom Link | Video embed on profile |
| Core Services | Services section |
| Prices | Pricing section, budget tier |
| Target Clients | "Best For" tags |
| Booking link | CTA button |

### Manual Sync

To run a sync locally:
```bash
export AIRTABLE_API_KEY=pat...your-key-here
npm run sync

# Or dry run to preview:
npm run sync:dry-run
```

### Triggering Sync from Airtable

You can set up an Airtable automation to trigger the sync when records change:

1. In Airtable, create an automation with trigger "When record is updated"
2. Add action: "Run script"
3. Use this script to call the GitHub webhook:
```javascript
let response = await fetch('https://api.github.com/repos/YOUR_ORG/YOUR_REPO/dispatches', {
    method: 'POST',
    headers: {
        'Authorization': 'Bearer YOUR_GITHUB_TOKEN',
        'Accept': 'application/vnd.github.v3+json'
    },
    body: JSON.stringify({ event_type: 'airtable-update' })
});
```
