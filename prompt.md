Your job is to DESIGN + BUILD a high-converting landing page for a Chrome extension product.

PRODUCT
- Name: FlightSuite (FlightSuite CRM Operator)
- What it is: A “CRM Operator” delivered through a Chrome extension that performs CRM data entry for sales + operations teams.
- Core function: Users tell the extension what they want to record; FlightSuite automatically updates contacts, pipelines, notes (and related CRM objects) without users logging into the CRM UI.
- Primary outcome: Clean CRM data + saves ~5–10 hours per rep per week.
- Current integration: GoHighLevel (live)
- Next integration: HubSpot (coming soon)
- Demo Loom: https://www.loom.com/share/56f02ca55d0d4254b45353c90d1be254
- Chrome Web Store link (primary CTA destination): https://chromewebstore.google.com/detail/flightsuite-crm-operator/blmnkgfabhnalpmmodfbpicmedfgdgbb?hl=en-US
- Brand asset: logo is in the repo’s /assets folder (use it).
- The extension is free to download. They user can get started today. 

GOAL (NON-NEGOTIABLE)
Create a production-quality landing page whose single primary conversion goal is:
→ “Install Chrome Extension” (links to Chrome Web Store URL above)

SECONDARY GOALS
- Capture “HubSpot coming soon” interest via waitlist/email capture (secondary CTA), without distracting from install.
- Build trust and reduce install friction (security/privacy language, how it works, social proof placeholders).

TARGET ICP (write and design for this)
Primary: Owners/Operators of GoHighLevel agencies and their sales teams (SMB + mid-market service businesses using GHL).
Also: Sales reps + sales ops / RevOps at SMBs who hate CRM admin work and want automatic logging.
Buying trigger: “We lose hours to CRM busywork; our data is messy; managers can’t trust pipeline.”

POSITIONING (working draft, improve it with research)
FlightSuite is the CRM operator that logs your sales activity for you. Tell the extension what happened; it updates your CRM automatically—no dashboards, no clicking, no workflow babysitting. Clean data and 5–10 hours saved per rep per week.

RESEARCH REQUIREMENTS (DO THIS FIRST)
1) Watch the Loom demo and extract:
   - 5–7 key product capabilities (in plain English)
   - 3 strongest proof points / “aha moments”
   - The simplest “How it works” 3-step flow
2) Analyze the Chrome Web Store listing to understand what users see after clicking install.
3) Research the web for “best converting Chrome extension landing pages” and “B2B SaaS high-converting landing pages”.
   - Identify common patterns: hero structure, CTA placement, trust blocks, video usage, objection handling, mobile layout.
   - Produce a short “Conversion Blueprint” that you will implement (section order + rationale).
4) Determine best-practice copy patterns for this ICP (GHL agencies + sales teams):
   - Short, outcome-first headlines
   - Strong “time saved” & “clean data” framing
   - Risk reducers (privacy/security, permissions clarity, works with GHL, easy uninstall)
   - Tight “Install → First win in 10 minutes” narrative

DELIVERABLES
A) A complete landing page implementation in the repo (create files as needed) including:
   - Responsive design (mobile-first)
   - Fast load (optimize video embedding, images)
   - Clear visual hierarchy, strong typography, and generous spacing
   - A sticky (or repeated) primary CTA: “Install for Chrome”
   - Secondary CTA: “HubSpot Waitlist” (simple modal or section)
   - Sections (minimum):
     1. Hero (headline, subhead, primary CTA, secondary CTA)
     2. Social proof placeholder row (logos/testimonials)
     3. 3-step “How it works”
     4. Benefits (time saved, clean data, no CRM login)
     5. Product demo (embed Loom or a lightweight video preview)
     6. Trust & objections (privacy, permissions, security, support, uninstall)
     7. FAQ
     8. Final CTA block + footer (privacy policy, terms, contact)
B) Copywriting:
   - 3 hero headline options + 3 subhead options
   - Final selected headline/subhead based on conversion best practices
   - CTA microcopy variants (Install, Works with GoHighLevel, HubSpot coming soon)
C) Instrumentation:
   - Add analytics event hooks for CTA clicks (even as stubs), e.g. data attributes: data-event="install_click"
   - Ensure all CTAs point to the Chrome Web Store listing
D) Quality checks:
   - Accessibility basics (contrast, semantic HTML, aria labels)
   - Lighthouse-oriented performance (avoid heavy scripts)
   - SEO basics (title, meta description, OG tags)

TOOLS / METHODS (MANDATORY)
- Use your “front-end design” skill to implement a modern, clean, high-trust B2B SaaS look.
- Use Playwright MCP to:
  1) Take screenshots of the landing page at key breakpoints (mobile/tablet/desktop)
  2) Validate layout consistency, no overlap, and CTA visibility above the fold
  3) Verify the primary CTA is visible within first viewport on mobile and desktop
  4) Validate that Loom embed doesn’t tank performance (use lazy loading or poster/thumbnail first)
- Create a tight iterative loop: design → implement → Playwright test → adjust → repeat until top-tier.

SUB-AGENTS (CREATE THESE AND USE THEM)
Spin up 3 internal sub-agents and run them in an iterative review loop:
1) “PMM Strategist” agent:
   - Owns positioning, messaging hierarchy, headline/subhead, section narrative flow.
   - Flags jargon, weak claims, unclear ICP resonance.
2) “Conversion Designer” agent:
   - Owns layout, visual hierarchy, CTA prominence, scroll logic, friction reduction.
   - Suggests improvements based on conversion patterns from research.
3) “QA/Perf Engineer” agent:
   - Owns responsiveness, a11y, performance, and Playwright validation.
   - Ensures production readiness and no broken links.

WORKFLOW (FOLLOW THIS ORDER)
1) Research + Conversion Blueprint (write it down in the repo as /docs/landing_page_blueprint.md).
2) Draft copy variants (include in blueprint doc).
3) Implement first version of landing page.
4) Run Playwright MCP screenshot suite and document results in /docs/landing_page_qa.md.
5) Iterate until:
   - Hero is crystal clear in 5 seconds
   - CTA is unavoidable but not spammy
   - Page feels trustworthy and “enterprise-clean”
   - No layout bugs across breakpoints
6) Final pass: tighten copy, remove fluff, ensure sections are minimal and persuasive.

CONSTRAINTS / STYLE
- No distracting navigation. If you include a nav, keep it minimal (How it works, FAQ) and keep CTA persistent.
- Keep copy short and punchy. Avoid buzzwords like “revolutionary”, “cutting-edge”, “synergy”.
- Prefer “outcome + time saved” over feature lists.
- Make GoHighLevel integration explicit and credible.
- “HubSpot coming soon” should feel like momentum, not vaporware.
- Use the logo from /assets. Keep brand look clean (black/white + one accent).

OUTPUT EXPECTATION
When done, summarize:
- The final section structure + why it converts
- The chosen headline/subhead + reasoning
- Playwright screenshot verification notes (breakpoints + findings)
- Any TODO placeholders (testimonials/logos/privacy policy link) that I can fill in later
