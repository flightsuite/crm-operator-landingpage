# Daily SEO/AEO Task Runner

You are executing the daily SEO/AEO task from the 30-day FlightSuite organic growth plan. This skill should MAXIMIZE the Claude Code session by completing substantial work.

## Session Budget Target
- Use the FULL session allocation (Pro: ~44k tokens, Max: ~88k+ tokens)
- Complete ALL subtasks for the current day
- If time/tokens remain, start the next day's tasks
- Create comprehensive, production-ready content

## Instructions

1. **Read the progress tracker** at `docs/SEO-PROGRESS.json` to determine the current day
2. **Read the full strategy** at `docs/SEO-AEO-STRATEGY.md` for context
3. **Execute that day's tasks completely** - don't do partial work
4. **Update the progress tracker** when tasks are complete
5. **If session budget remains**, continue to the next day

## Day-by-Day Task Details

### Day 1: FAQPage Schema Implementation
- Read current index.html and identify FAQ section
- Create comprehensive FAQPage schema JSON-LD with 8-10 Q&As
- Add Organization schema with full brand entity data
- Test markup validity with explanation of what was added
- Update index.html with both schemas

### Day 2: HowTo Schema & Installation Guide
- Read installation-guide.html
- Create HowTo schema for step-by-step installation process
- Add speakable schema for voice search optimization
- Ensure each step has clear name, text, and position
- Update the file with schemas

### Day 3: Blog Schema Enhancement
- Read ALL 5 blog posts completely
- Add Article schema to each with:
  - author (Person schema)
  - datePublished, dateModified
  - headline, description
  - publisher (Organization)
- Cross-link between related posts
- Add "Related Posts" sections

### Day 4: Answer Block Formatting
- Read index.html hero and key sections
- Identify 5-7 key value propositions
- Reformat each as 40-60 word answer blocks
- Add TL;DR summaries to each blog post (first paragraph)
- Use semantic HTML (blockquote or aside with proper structure)

### Day 5: Sitemap & Technical SEO
- Read current sitemap.xml
- Add best-crm-for-your-business.html (currently missing)
- Update all lastmod dates to today
- Verify all URLs are correct
- Create submission instructions for Google Search Console

### Day 6: Internal Linking Audit & Implementation
- Map all current internal links across the site
- Add 3-5 cross-links to each blog post
- Add breadcrumb navigation HTML + BreadcrumbList schema
- Link blog posts to relevant product features
- Create a linking strategy document

### Day 7: Performance Baseline Documentation
- Create docs/SEO-BASELINE.md documenting:
  - Current page count
  - Current schema types
  - Target keywords and current assumed positions
  - Technical SEO checklist status
  - Recommended Google Search Console setup steps

### Day 8: Comparison Page Template
- Create a reusable HTML template: `templates/comparison-template.html`
- Include structured data placeholders
- Design responsive comparison table CSS
- Add FAQ section with schema
- Include FlightSuite CTA section

### Day 9: HubSpot vs Salesforce Comparison Page
- Create `compare/hubspot-vs-salesforce.html`
- Write 2,500+ word comprehensive comparison
- Sections: Pricing, Features, Ease of Use, Integrations, Support, Verdict
- Include comparison table
- Add FAQPage schema with 5+ questions
- Target keyword: "hubspot vs salesforce"

### Day 10: GoHighLevel vs HubSpot Comparison Page
- Create `compare/gohighlevel-vs-hubspot.html`
- Focus on agency use cases vs enterprise
- Highlight automation differences
- Include FlightSuite integration benefits
- 2,000+ words with full schema

### Day 11: Salesforce Alternatives Page
- Create `alternatives/salesforce-alternatives.html`
- List 10 alternatives with pros/cons for each
- Include HubSpot, Zoho, Pipedrive, GoHighLevel, etc.
- Add ItemList schema for the alternatives
- Target keyword: "salesforce alternatives"

### Day 12: HubSpot Alternatives Page
- Create `alternatives/hubspot-alternatives.html`
- Similar structure to Day 11
- Different positioning for cost-conscious buyers
- Target keyword: "hubspot alternatives"

### Day 13: Best CRM for Small Business Page
- Create `best-crm/small-business.html`
- Decision tree format (budget, team size, needs)
- Include quiz-style recommendation logic
- Comprehensive 3,000+ word guide
- Target keyword: "best crm for small business"

### Day 14: Best CRM for Real Estate Page
- Create `best-crm/real-estate.html`
- Industry-specific features comparison
- MLS integration requirements
- Mobile access emphasis
- Target keyword: "best crm for real estate"

### Day 15: Best CRM for Agencies Page
- Create `best-crm/agencies.html`
- Focus on GoHighLevel, HubSpot, Salesforce
- Client management features
- White-label capabilities
- Automation workflow needs

### Day 16: CRM Data Entry Cost Deep Dive
- Create `blog/true-cost-of-manual-crm-data-entry.html`
- Research and include real statistics
- ROI calculations and examples
- Create linkable infographic description
- 2,500+ words with citations

### Day 17: GoHighLevel Complete Guide
- Create `guides/what-is-gohighlevel.html`
- Comprehensive 3,000+ word guide
- Pricing breakdown
- Feature walkthrough
- FlightSuite integration section
- HowTo schema for setup

### Day 18: HubSpot Automation Guide
- Create `guides/hubspot-automation-guide.html`
- "How to Automate HubSpot Data Entry with AI"
- Step-by-step with screenshots placeholder
- FlightSuite integration walkthrough
- Video embed from Loom

### Day 19: Sales Productivity Statistics Page
- Create `resources/sales-productivity-statistics.html`
- "50 Sales Productivity Statistics for 2026"
- Cite original sources
- Create shareable format
- ItemList schema for statistics

### Day 20: CRM ROI Calculator Page
- Create `tools/crm-roi-calculator.html`
- JavaScript interactive calculator
- Inputs: team size, hours on CRM, hourly rate
- Calculate time and money savings
- Lead capture form integration

### Day 21: Update All Existing Blog Posts
- Add 40-60 word TL;DR to each
- Improve internal linking (3+ links per post)
- Add "Related Posts" sections
- Update sitemap with new lastmod dates
- Verify all schema is valid

### Day 22: Expert Directory Database Design
- Create `docs/EXPERT-DIRECTORY-SPEC.md`
- Design data structure (JSON schema)
- Fields: name, certifications, CRMs, location, bio, reviews
- Plan submission workflow
- Define approval criteria

### Day 23: Expert Directory Landing Page
- Create `experts/index.html`
- Search/filter UI by CRM type
- Location-based filtering placeholder
- CTA for experts to apply
- Professional directory design

### Day 24: Expert Profile Template
- Create `templates/expert-profile-template.html`
- Person + ProfessionalService schema
- Review/rating display section
- Contact form
- Certification badges

### Day 25: First 5 Expert Profiles (Placeholder)
- Create `experts/profiles/` directory
- Create 5 placeholder expert pages
- Include realistic example data
- Demonstrate the profile template
- Create submission form page

### Day 26: CRM Category Expert Pages
- Create `experts/hubspot.html`
- Create `experts/salesforce.html`
- Create `experts/gohighlevel.html`
- Each with FAQ schema
- Filter to show relevant experts

### Day 27: Backlink Outreach Documentation
- Create `docs/BACKLINK-OUTREACH.md`
- List 20 target sites for comparison page links
- Email templates for outreach
- Track outreach status
- Follow-up schedule

### Day 28: Statistics Page Promotion Plan
- Create `docs/STATISTICS-PROMOTION.md`
- List journalist/blogger targets
- Social media promotion plan
- Data aggregator sites to submit to
- LinkedIn content plan

### Day 29: Google Business Profile Setup
- Create `docs/GOOGLE-BUSINESS-SETUP.md`
- Step-by-step GBP optimization guide
- Product listing content for Chrome Extension
- Review request templates
- Local SEO checklist

### Day 30: Month 1 Review & Month 2 Planning
- Create `docs/MONTH-1-REVIEW.md`
- Checklist of all completed tasks
- Metrics tracking template
- Month 2 content calendar draft
- Priority adjustments based on what was learned

## After Completing Tasks

1. Update `docs/SEO-PROGRESS.json`:
   - Increment `currentDay`
   - Add completed tasks to `completedTasks` array
   - Update `lastRunDate`
   - Add any notes about the work done

2. Update `sitemap.xml` if new pages were created

3. Provide summary of:
   - What was completed
   - Files created/modified
   - Next day's preview
   - Any issues encountered

## Quality Standards

- All HTML must be valid and accessible
- All schema must be valid JSON-LD
- Content must be comprehensive (word counts specified)
- Use semantic HTML throughout
- Mobile-responsive design
- Include proper meta tags on all new pages
