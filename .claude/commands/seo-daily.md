# Daily SEO/AEO Task Runner

You are executing the daily SEO/AEO task from the FlightSuite organic growth plan. This skill handles both Phase 1 (Days 1-30) and Phase 2 (Days 31-60).

## Session Budget Target
- Use the FULL session allocation (Pro: ~44k tokens, Max: ~88k+ tokens)
- Complete ALL subtasks for the current day
- If time/tokens remain, start the next day's tasks
- Create comprehensive, production-ready content

## Phase Detection

First, check which phase we're in:

1. Read `docs/SEO-PROGRESS.json` - if `currentDay` <= 30 and not all Phase 1 tasks complete, use Phase 1
2. Read `docs/SEO-PHASE2-PROGRESS.json` - if Phase 1 complete OR currentDay >= 31, use Phase 2

## Task Types (Phase 2)

Phase 2 introduces three task types:

| Type | Action |
|------|--------|
| **CODE** | Execute fully - create pages, write code, technical work |
| **TEAM** | Output the ready-to-copy Slack message from the strategy doc |
| **HYBRID** | Execute the prep work, then output Slack message for team parts |

For TEAM and HYBRID tasks, your output should include:

```
## Today's Task: [Task Title]

**Type**: TEAM (requires human action)

**Slack Message for Your Team:**

[Copy the full Slack message from SEO-PHASE2-STRATEGY.md for this day]

---

**Task Tracking:**
- Mark as complete in SEO-PHASE2-PROGRESS.json once your team confirms they've sent the messages
```

## Phase 1 Instructions (Days 1-30)

1. **Read the progress tracker** at `docs/SEO-PROGRESS.json` to determine the current day
2. **Read the full strategy** at `docs/SEO-AEO-STRATEGY.md` for context
3. **Execute that day's tasks completely** - don't do partial work
4. **Update the progress tracker** when tasks are complete
5. **If session budget remains**, continue to the next day

### Phase 1 Day-by-Day Task Details

#### Day 1: FAQPage Schema Implementation
- Read current index.html and identify FAQ section
- Create comprehensive FAQPage schema JSON-LD with 8-10 Q&As
- Add Organization schema with full brand entity data
- Test markup validity with explanation of what was added
- Update index.html with both schemas

#### Day 2: HowTo Schema & Installation Guide
- Read installation-guide.html
- Create HowTo schema for step-by-step installation process
- Add speakable schema for voice search optimization
- Ensure each step has clear name, text, and position
- Update the file with schemas

#### Day 3: Blog Schema Enhancement
- Read ALL 5 blog posts completely
- Add Article schema to each with author, dates, headline, description, publisher
- Cross-link between related posts
- Add "Related Posts" sections

#### Day 4: Answer Block Formatting
- Read index.html hero and key sections
- Identify 5-7 key value propositions
- Reformat each as 40-60 word answer blocks
- Add TL;DR summaries to each blog post
- Use semantic HTML

#### Day 5: Sitemap & Technical SEO
- Read current sitemap.xml
- Add any missing pages
- Update all lastmod dates to today
- Create submission instructions for Google Search Console

#### Day 6: Internal Linking Audit & Implementation
- Map all current internal links across the site
- Add 3-5 cross-links to each blog post
- Add breadcrumb navigation HTML + BreadcrumbList schema
- Link blog posts to relevant product features

#### Day 7: Performance Baseline Documentation
- Create docs/SEO-BASELINE.md documenting current state

#### Days 8-30: See SEO-AEO-STRATEGY.md for full details

---

## Phase 2 Instructions (Days 31-60)

1. **Read the progress tracker** at `docs/SEO-PHASE2-PROGRESS.json`
2. **Read the full strategy** at `docs/SEO-PHASE2-STRATEGY.md`
3. **Check the task type** for the current day
4. **Execute based on type**:
   - CODE: Create content/code fully
   - TEAM: Output the Slack message
   - HYBRID: Do prep work + output Slack message
5. **Update the progress tracker**

### Phase 2 Day-by-Day Task Details

#### Day 31: GoHighLevel vs HubSpot Comparison [CODE]
- Create `/compare/gohighlevel-vs-hubspot.html`
- 2,500+ word comparison targeting "gohighlevel vs hubspot"
- Include comparison table, FAQPage schema, BreadcrumbList
- Add to sitemap

#### Day 32: Salesforce Alternatives Page [CODE]
- Create `/alternatives/salesforce-alternatives.html`
- 3,000+ words with 10 alternatives
- Pros/cons for each, ItemList schema
- Target: "salesforce alternatives" (6,600 searches/mo)

#### Day 33: HubSpot Alternatives Page [CODE]
- Create `/alternatives/hubspot-alternatives.html`
- Same structure as Day 32
- Target: "hubspot alternatives" (5,400 searches/mo)

#### Day 34: Best CRM for Small Business [CODE]
- Create `/best-crm/small-business.html`
- 3,500+ word comprehensive guide
- Decision tree format
- Target: "best crm for small business" (14,800 searches/mo)

#### Day 35: Best CRM for Real Estate [CODE]
- Create `/best-crm/real-estate.html`
- 2,500+ word industry-specific guide
- MLS integration focus
- Target: "best crm for real estate" (4,400 searches/mo)

#### Day 36: Best CRM for Agencies [CODE]
- Create `/best-crm/agencies.html`
- 2,500+ word agency-focused guide
- GoHighLevel emphasis
- Target: "best crm for agencies" (1,200 searches/mo)

#### Day 37: CRM ROI Calculator [CODE]
- Create `/tools/crm-roi-calculator.html`
- JavaScript interactive calculator
- Lead capture form

#### Day 38: Chrome Web Store Optimization [CODE]
- Create optimized listing copy document
- Keyword research for Chrome Web Store

#### Day 39: Review Request - Existing Users [TEAM]
- Output Slack message from strategy doc
- Template for emailing users 7+ days active
- Goal: 5-10 new Chrome Web Store reviews

#### Day 40: Review Request - Power Users [TEAM]
- Output Slack message from strategy doc
- Template for contacting top 5 users
- Goal: 3-5 detailed reviews

#### Day 41: G2/Capterra Profile Setup [TEAM]
- Output Slack message from strategy doc
- Company description and setup steps

#### Day 42: Product Hunt Preparation [HYBRID]
- Listing copy already in strategy doc
- Output Slack message for team setup tasks

#### Day 43: LinkedIn Company Page Optimization [HYBRID]
- About section copy in strategy doc
- Output Slack message for team to update page

#### Day 44: First LinkedIn Post [TEAM]
- Output Slack message with post content
- Engagement instructions

#### Day 45: Backlink Target Research [CODE]
- Research 50+ backlink targets
- Create spreadsheet with contacts, DA, opportunity type
- Save to `docs/BACKLINK-TARGETS.md`

#### Day 46: Guest Post Pitches [TEAM]
- Output Slack message from strategy doc
- 5 targets with contacts and pitch template

#### Day 47: Resource Page Link Requests [TEAM]
- Output Slack message from strategy doc
- 5 targets with contacts and request template

#### Day 48: HARO/Connectively Setup [HYBRID]
- Response template in strategy doc
- Output Slack message for account setup

#### Day 49: Podcast Pitches [TEAM]
- Output Slack message from strategy doc
- 5 podcasts with contacts and pitch template

#### Day 50: Integration Partner Outreach [TEAM]
- Output Slack message from strategy doc
- 4 partners with contacts and email template

#### Day 51: Competitor Backlink Analysis [CODE]
- Analyze competitor backlinks
- Create prioritized outreach list
- Save to `docs/COMPETITOR-BACKLINKS.md`

#### Day 52: Reddit Strategy [TEAM]
- Output Slack message from strategy doc
- Subreddit list, rules, sample comments

#### Day 53: Twitter/X Strategy [TEAM]
- Output Slack message from strategy doc
- Account setup, 5 pre-written tweets

#### Day 54: LinkedIn Content Calendar [HYBRID]
- 8 posts already written in strategy doc
- Output Slack message with scheduling instructions

#### Day 55: Facebook Group Engagement [TEAM]
- Output Slack message from strategy doc
- Groups list, engagement rules, sample responses

#### Day 56: YouTube Video Strategy [HYBRID]
- Video scripts in strategy doc
- Output Slack message for recording/upload

#### Day 57: Email Signatures & Internal Promo [TEAM]
- Output Slack message from strategy doc
- Signature templates, LinkedIn headline examples

#### Day 58: Customer Testimonial Collection [TEAM]
- Output Slack message from strategy doc
- Email template and questions

#### Day 59: Month 2 Review [CODE]
- Create `docs/MONTH-2-REVIEW.md`
- Compile all metrics
- Analyze what worked

#### Day 60: Month 3 Planning [HYBRID]
- Draft Phase 3 strategy
- Output Slack message with meeting agenda

---

## After Completing Tasks

### For CODE tasks:
1. Update the appropriate progress JSON file
2. Update `sitemap.xml` if new pages were created
3. Provide summary of files created/modified

### For TEAM tasks:
1. Output the full Slack message
2. Mark in progress tracker (status: "awaiting_team")
3. Note that user should mark complete when team confirms

### For HYBRID tasks:
1. Complete the CODE portions
2. Output the Slack message for team portions
3. Update progress tracker appropriately

## Quality Standards

- All HTML must be valid and accessible
- All schema must be valid JSON-LD
- Content must be comprehensive (word counts specified)
- Use semantic HTML throughout
- Mobile-responsive design
- Include proper meta tags on all new pages
- Slack messages must be copy-paste ready
