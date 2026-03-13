# Daily Social Media Post Runner

You are executing the daily social media posts for FlightSuite's LinkedIn and Facebook pages. You provide **2 days of content at a time**.

## Platforms

- **LinkedIn**: https://www.linkedin.com/company/flight-suite-ai
- **Facebook**: https://www.facebook.com/flightsuiteai/

---

## CRITICAL: Dynamic Content Analysis (Do This First!)

Before generating posts, you MUST perform these analyses:

### Step 1: Fetch Current Blog Content

Use WebFetch on `https://www.flightsuite.ai/blog.html` to:
- List ALL current blog posts and pages
- Note any NEW content not previously promoted
- Identify high-value content for promotion

### Step 2: Check LinkedIn for Recent Posts

Use WebFetch on `https://www.linkedin.com/company/flight-suite-ai` to:
- See what topics have been posted recently
- Identify themes that are getting stale/repeated
- Find gaps in content coverage
- Avoid duplicating recent posts

### Step 3: Read Progress Tracker

Read `docs/SOCIAL-MEDIA-PROGRESS.json` to:
- Check which blog posts have already been promoted
- See what themes were recently covered
- Determine current day number

### Step 4: Cross-Reference and Decide

Based on all three sources:
1. **Prioritize NEW blog content** that hasn't been promoted yet
2. **Avoid repeating** themes posted on LinkedIn in last 2 weeks
3. **Balance content mix** (don't do 3 blog promos in a row)
4. **Adapt the day's planned theme** if it would be repetitive

---

## Content Framework (Flexible, Not Rigid)

The strategy document provides a framework, but you should ADAPT based on real-time analysis:

### Content Pillars (Target Mix)

| Pillar | Target % | Purpose |
|--------|----------|---------|
| **Blog/Content Promos** | 30% | Drive traffic to new SEO content |
| **Relatable Pain Points** | 25% | Build connection through shared frustrations |
| **Actionable Tips** | 25% | Provide immediate value |
| **Statistics & Data** | 10% | Build authority |
| **Engagement Posts** | 10% | Polls, questions, discussions |

### Blog Promotion Priority

When promoting blogs, prioritize in this order:
1. **Brand new posts** (published in last 7 days)
2. **Comparison/alternatives pages** (high SEO value)
3. **Industry-specific guides** (real estate, agencies, small business)
4. **Evergreen content** (rotate through older posts)

---

## Execution Steps

### 1. Perform Dynamic Analysis
```
[ ] Fetched blog.html - listed all current content
[ ] Fetched LinkedIn - checked recent post themes
[ ] Read progress tracker - checked promoted content
[ ] Identified what's NEW and what's STALE
```

### 2. Decide Today's Content
```
[ ] Day X theme from strategy: [original theme]
[ ] LinkedIn recent posts about: [themes]
[ ] Adaptation needed? [yes/no]
[ ] Final decision: [what you'll post]
```

### 3. Generate Posts with Thumbnails
For each of the 2 days, search Google Images for a relevant thumbnail.

### 4. Output Complete Posts
Use the format below.

### 5. Update Progress Tracker

---

## Output Format

For each day, output:

```
---

## Day [X]: [Title]

**Original Theme**: [From strategy doc]
**Adapted To**: [What you're actually posting, if different]
**Why This Choice**: [Brief explanation based on your analysis]

### Post Copy

[Full post copy here - ready to copy-paste]

### Platform Details

**LinkedIn Hashtags**: #Tag1 #Tag2 #Tag3 #Tag4
**Facebook Hashtags**: #Tag1 #Tag2 (or none)
**Link**: [URL to include, or "None"]

### Thumbnail

**Search Query**: "[what you searched]"
**Recommended**: [Image URL]
**Backup Option**: [Second image URL]

### Posting Instructions

1. Download thumbnail from URL above
2. Post to LinkedIn company page
3. Post to Facebook page with same copy
4. Best time: [Tuesday-Thursday, 8-10 AM or 5-7 PM]
5. Respond to all comments within 24 hours

---
```

---

## Adaptation Rules

### If LinkedIn Recently Posted About CRM Pain Points:
- Skip another pain point post
- Switch to an actionable tip or blog promo instead

### If a New Blog Post Exists:
- Bump it to the front of the promotion queue
- Replace a generic value post with a blog promo

### If a Blog Post Was Already Promoted:
- Don't promote the same post within 14 days
- Find a different angle or promote different content

### If Multiple New Blogs Exist:
- Spread them out (don't do back-to-back blog promos)
- Alternate: Blog promo → Value post → Blog promo

### If LinkedIn Hasn't Posted in 7+ Days:
- Start with high-engagement content (poll or question)
- Avoid hard sell on first post back

---

## Progress Tracker Updates

After providing posts, update `docs/SOCIAL-MEDIA-PROGRESS.json`:

```json
{
  "currentDay": [increment by 2],
  "lastRunDate": "[today's date]",
  "status": "in_progress",
  "dayDetails": {
    "[day]": {
      "status": "provided",
      "blogLink": "[if promoted]",
      "adaptedFrom": "[original theme if changed]",
      "actualTheme": "[what was posted]"
    }
  },
  "promotedBlogs": [
    {
      "url": "[blog URL]",
      "promotedOn": "[date]",
      "day": [day number]
    }
  ]
}
```

---

## Example Dynamic Analysis Output

```
## Pre-Post Analysis

### Blog Content Check (fetched blog.html)
Current blog posts:
1. Best CRM for Your Business (evergreen)
2. HubSpot vs Salesforce for Small Teams (evergreen)
3. Stop Wasting 10 Hours: AI Eliminates CRM Data Entry (evergreen)
4. Complete Guide to AI CRM Automation (evergreen)
5. Why Sales Reps Hate Data Entry (evergreen)
6. HubSpot vs Salesforce Comparison (NEW - from SEO Day 9)
7. GoHighLevel vs HubSpot (NEW - from SEO Day 31)
8. Salesforce Alternatives (NEW - from SEO Day 32)
9. HubSpot Alternatives (NEW - from SEO Day 33)
10. Best CRM for Small Business (NEW - from SEO Day 34)
11. Best CRM for Real Estate (NEW - from SEO Day 35)

### LinkedIn Recent Posts Check
Recent themes on LinkedIn:
- CRM adoption/usage problems (posted 3 days ago)
- AI automation features (posted 5 days ago)
- Lead generation (posted 8 days ago)

### Progress Tracker Check
- Current day: 5
- Last promoted: "Why Sales Reps Hate Data Entry" on Day 3
- Not yet promoted: All comparison pages, alternatives pages

### Decision
- Day 5 planned theme: "The Hidden Cost" (statistics)
- LinkedIn recently posted about: CRM problems, AI
- Adaptation: Keep Day 5 as-is (statistics is fresh angle)
- Day 6 planned: "3 Types of Reps" (relatable)
- Adaptation: Keep as-is, but for Day 7, promote NEW "GoHighLevel vs HubSpot" comparison instead of planned theme
```

---

## Quality Checklist

Before outputting each post:
- [ ] Checked blog.html for current content
- [ ] Checked LinkedIn for recent posts
- [ ] Verified this content isn't repetitive
- [ ] Blog promo (if any) hasn't been promoted in 14 days
- [ ] Post copy is engaging and provides value
- [ ] Thumbnail search completed with 2 options
- [ ] Instructions are clear
