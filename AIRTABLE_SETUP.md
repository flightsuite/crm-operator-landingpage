# Airtable Setup Guide for FlightSuite Landing Page

This guide will help you set up Airtable to capture form submissions from your landing page.

## Step 1: Create an Airtable Base

1. Go to [Airtable](https://airtable.com)
2. Click **"Add a base"** or **"Create a base"**
3. Name it: **"FlightSuite Landing Page"**
4. Once created, note the **Base ID** from the URL:
   - URL format: `https://airtable.com/appXXXXXXXXXXXXXX/...`
   - The Base ID is the part that starts with `app` (e.g., `appXXXXXXXXXXXXXX`)

## Step 2: Create Tables

You need to create **3 tables** with the following structure:

### Table 1: CRM Waitlist

**Table Name:** `CRM Waitlist`

| Field Name | Field Type | Description |
|------------|------------|-------------|
| Name | Single line text | User's name |
| Email | Email | User's email address |
| CRM Type | Single line text | Which CRM they use (Salesforce, HubSpot, etc.) |
| Submission Date | Date | When they submitted the form |
| Source | Single line text | Where the submission came from (default: "Landing Page") |
| Status | Single select | Options: New, Contacted, Qualified, Not Interested |

**To create this table:**
1. Click **"+"** to add a new table
2. Name it: `CRM Waitlist`
3. Add the fields above by clicking **"+"** in the field header
4. For **Status** field:
   - Choose "Single select" type
   - Add options: New, Contacted, Qualified, Not Interested
   - Set "New" as the default

### Table 2: Mobile Email Capture

**Table Name:** `Mobile Email Capture`

| Field Name | Field Type | Description |
|------------|------------|-------------|
| Name | Single line text | User's name |
| Email | Email | User's email address |
| Submission Date | Date | When they submitted |
| Source | Single line text | Source (default: "Landing Page - Mobile") |
| Status | Single select | Options: New, Email Sent, Installed, Not Interested |

**To create this table:**
1. Click **"+"** to add a new table
2. Name it: `Mobile Email Capture`
3. Add the fields above
4. For **Status** field, add the options listed

### Table 3: Install Clicks (Optional)

**Table Name:** `Install Clicks`

| Field Name | Field Type | Description |
|------------|------------|-------------|
| Timestamp | Date & time | When the install button was clicked |
| User Agent | Long text | Browser/device information |
| Referrer | Single line text | Where the user came from |
| Page URL | URL | Full page URL when clicked |

## Step 3: Configure the Integration

1. **Get your Base ID:**
   - Open your Airtable base
   - Look at the URL: `https://airtable.com/{BASE_ID}/...`
   - Copy the Base ID (starts with `app`)

2. **Update the config file:**
   - Open `airtable-config.js`
   - Replace `YOUR_BASE_ID_HERE` with your actual Base ID
   - The API key is already configured

3. **Add the script to your website:**
   - The script tag has already been added to `index.html`

## Step 4: Testing

1. Open your landing page in a browser
2. Fill out the CRM Waitlist form
3. Check your Airtable base - you should see a new record!
4. Try the Mobile Email Capture form on a mobile device

## Step 5: Set Up Views (Recommended)

### For CRM Waitlist Table:
1. **New Leads** view: Filter by Status = "New"
2. **By CRM Type** view: Group by "CRM Type"
3. **This Week** view: Filter by Submission Date in the last 7 days

### For Mobile Email Capture Table:
1. **Pending** view: Filter by Status = "New"
2. **This Week** view: Filter by Submission Date in the last 7 days

## Step 6: Set Up Automations (Optional)

You can create Airtable automations to:

1. **Send email notifications** when a new lead submits
   - Trigger: When record created
   - Action: Send email to your team

2. **Add to email list** (integrate with Mailchimp, ConvertKit, etc.)
   - Trigger: When record created
   - Action: Send to email service

3. **Slack notifications**
   - Trigger: When record created
   - Action: Send message to Slack channel

## Troubleshooting

### "Invalid Base ID" error
- Make sure you copied the full Base ID from the URL
- It should start with `app` followed by alphanumeric characters
- Update `airtable-config.js` with the correct ID

### "Table not found" error
- Verify table names match exactly (case-sensitive)
- Check for extra spaces in table names

### "Permission denied" error
- Verify your API key has write access
- Make sure the Personal Access Token is valid

### "CORS error" in browser console
- This is normal for client-side requests
- Consider setting up a backend proxy for production
- Or use Airtable's web forms as an alternative

## Security Note

**IMPORTANT:** The API key is currently visible in the client-side JavaScript. For production use, consider:

1. **Backend Proxy:** Create a simple serverless function (Netlify, Vercel, AWS Lambda) to handle Airtable submissions
2. **Environment Variables:** Move the API key to a backend service
3. **Airtable Forms:** Use Airtable's built-in forms as an alternative

For now, this setup works for testing and small-scale use. The Personal Access Token has limited scope and can be revoked if needed.

## Next Steps

1. Set up your Airtable base following the steps above
2. Add your Base ID to `airtable-config.js`
3. Test the forms on your landing page
4. Set up views and automations
5. Consider moving to a backend proxy for production
