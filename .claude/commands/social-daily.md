# Daily Social Media Post Runner

You are executing the daily social media posts for FlightSuite's LinkedIn and Facebook pages. You provide **2 days of content at a time**.

## Platforms

- **LinkedIn**: https://www.linkedin.com/company/flight-suite-ai
- **Facebook**: https://www.facebook.com/flightsuiteai/

## Execution Steps

1. **Read the progress tracker** at `docs/SOCIAL-MEDIA-PROGRESS.json` to determine the current day
2. **Read the strategy** at `docs/SOCIAL-MEDIA-STRATEGY.md` to get the post content
3. **Search Google for a thumbnail** for each day's post
4. **Output the posts** with all details ready for copy-paste
5. **Update the progress tracker** with the new current day

## For Each Day, Output:

```
## Day [X]: [Title]

**Theme**: [Theme from strategy]

**Post Copy** (same for LinkedIn and Facebook):
[Full post copy]

**Hashtags**:
- LinkedIn: [3-5 hashtags]
- Facebook: [2-3 hashtags or none]

**Link to Include**: [URL or "None"]

**Thumbnail**:
- Search: "[search query used]"
- Recommended Image: [Image URL from search]
- Alt option: [Second image URL]

**Instructions**:
1. Download the thumbnail image
2. Post to LinkedIn with the copy above
3. Post to Facebook with the copy above
4. Save thumbnail URL to progress tracker
```

## Thumbnail Search Guidelines

When searching for thumbnails:
1. Search Google Images for relevant, professional stock photos
2. Look for images that are:
   - High resolution (min 1200x630)
   - Professional, not cheesy
   - Relevant to the post topic
   - Light on text (social platforms penalize text-heavy images)
3. Provide 2 options when possible
4. Use search queries like:
   - "[topic] business professional stock photo"
   - "[concept] office worker"
   - "[theme] sales team"

## After Providing Posts

Update `docs/SOCIAL-MEDIA-PROGRESS.json`:
- Increment `currentDay` by 2
- Update `lastRunDate` to today's date
- Set `status` to "in_progress" if first run

## Quality Checklist

Before outputting each post:
- [ ] Post copy matches strategy document
- [ ] Hashtags are appropriate for each platform
- [ ] Link is included if specified
- [ ] Thumbnail search was performed
- [ ] Instructions are clear

## Example Output Format

---

## Day 1: The Opening Hook

**Theme**: Relatable pain point

**Post Copy**:
```
Sales reps spend 5-10 hours per week on CRM data entry.

That's 200-400 hours per year.

Not on selling. Not on building relationships. Not on closing deals.

On clicking through dashboards to log information they already know.

If this feels familiar, you're not alone. This is the reality for most sales teams.

The question isn't IF this is a problem.

The question is: what are you doing about it?

#SalesProductivity #CRM #SalesLife
```

**Hashtags**:
- LinkedIn: #SalesProductivity #CRM #SalesLife
- Facebook: #SalesProductivity #CRM

**Link to Include**: None

**Thumbnail**:
- Search: "frustrated sales rep at computer stock photo"
- Recommended Image: [URL to image found]
- Alt option: [URL to second image found]

**Instructions**:
1. Download the recommended thumbnail image
2. Post to LinkedIn company page with the copy above
3. Post to Facebook page with the same copy
4. Best posting time: Tuesday-Thursday, 8-10 AM or 5-7 PM

---

## Day 2: The "I'll Update It Later" Problem

[Continue with Day 2...]

---

## After You Post

Come back and mark these as complete by running `/social-daily` again when ready for the next 2 days.
