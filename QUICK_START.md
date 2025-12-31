# Quick Start: Airtable Integration

## What Was Set Up

Your landing page now has Airtable integration to capture all form submissions. Here's what was configured:

### Files Created

1. **`airtable-config.js`** - Contains all the Airtable integration code
2. **`AIRTABLE_SETUP.md`** - Detailed setup instructions
3. **`QUICK_START.md`** (this file) - Quick reference guide

### Forms Integrated

✅ **CRM Waitlist Form** - Captures: Name, Email, CRM Type
✅ **Mobile Email Capture Form** - Captures: Name, Email

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Your Airtable Base

1. Go to [Airtable](https://airtable.com) and sign in
2. Click **"Add a base"**
3. Name it: **"FlightSuite Landing Page"**
4. Get the Base ID from the URL: `https://airtable.com/appXXXXXXXXXXXXXX/...`
   - Copy everything starting with `app`

### Step 2: Create Tables

Create these 2 tables in your base:

#### Table 1: "CRM Waitlist"

Click the **+** to add fields with these exact names and types:

| Field Name | Type | Options/Notes |
|------------|------|---------------|
| Name | Single line text | |
| Email | Email | |
| CRM Type | Single line text | |
| Submission Date | Date | Include time |
| Source | Single line text | Default: "Landing Page" |
| Status | Single select | Options: New, Contacted, Qualified, Not Interested |

#### Table 2: "Mobile Email Capture"

| Field Name | Type | Options/Notes |
|------------|------|---------------|
| Name | Single line text | |
| Email | Email | |
| Submission Date | Date | Include time |
| Source | Single line text | Default: "Landing Page - Mobile" |
| Status | Single select | Options: New, Email Sent, Installed, Not Interested |

### Step 3: Update Your Config

1. Open **`airtable-config.js`**
2. Find this line:
   ```javascript
   baseId: 'YOUR_BASE_ID_HERE', // TODO: Replace with actual base ID
   ```
3. Replace `YOUR_BASE_ID_HERE` with your actual Base ID (from Step 1)
4. Save the file

### Step 4: Test It!

1. Open `index.html` in your browser
2. Click **"Join Waitlist for Your CRM"**
3. Fill out the form
4. Check your Airtable - you should see a new record! 🎉

## 📊 Viewing Your Data

### In Airtable:

1. Open your base
2. Click on "CRM Waitlist" or "Mobile Email Capture" table
3. You'll see all submissions in real-time

### Create Useful Views:

**New Leads (for CRM Waitlist):**
- Filter: Status = "New"
- Sort: Submission Date (newest first)

**This Week:**
- Filter: Submission Date is within "the last 7 days"

**By CRM Type:**
- Group by: CRM Type
- This shows which CRMs people are requesting

## 🔔 Set Up Notifications (Optional)

### Email Notifications:

1. In Airtable, click **"Automations"** in the top menu
2. Click **"Create automation"**
3. Trigger: "When record created"
4. Choose your table (e.g., "CRM Waitlist")
5. Action: "Send email"
6. Configure your email template

### Slack Notifications:

1. Create automation (same as above)
2. Action: "Send to Slack"
3. Connect your Slack workspace
4. Choose channel and customize message

## 🔒 Security Note

**IMPORTANT:** The API key is currently in the client-side JavaScript (`airtable-config.js`). This is fine for testing and low-volume use.

For production, consider:
- Moving the API to a backend/serverless function
- Using environment variables
- Setting up proper CORS restrictions in Airtable

The Personal Access Token provided has limited scope and can be revoked anytime from your Airtable account settings if needed.

## ❓ Troubleshooting

### "Invalid Base ID" Error
- ✅ Make sure you copied the full Base ID starting with `app`
- ✅ Check `airtable-config.js` has the correct ID
- ✅ No extra spaces or quotes around the ID

### "Table not found" Error
- ✅ Table names must match EXACTLY (case-sensitive)
- ✅ "CRM Waitlist" not "crm waitlist" or "CRM WAITLIST"
- ✅ Check for extra spaces in table names

### Form Submits But Nothing in Airtable
- ✅ Open browser console (F12) and check for errors
- ✅ Verify your Base ID is correct
- ✅ Make sure the Personal Access Token hasn't expired
- ✅ Check that field names match exactly

### CORS Error in Console
- ⚠️ This might appear but submissions should still work
- 🔧 If it blocks submissions, you'll need to set up a backend proxy
- 📖 See `AIRTABLE_SETUP.md` for backend proxy options

## 📈 Next Steps

1. ✅ Set up your Airtable base (follow steps above)
2. ✅ Test both forms
3. ✅ Create useful views for your data
4. ✅ Set up email/Slack notifications
5. ✅ Add team members to your Airtable workspace
6. 📊 Connect Airtable to your CRM or email marketing tools

## 💡 Pro Tips

### Automate Your Workflow:

- **Auto-add to email list:** Use Airtable automation to add emails to Mailchimp, ConvertKit, etc.
- **CRM integration:** Sync Airtable with Salesforce, HubSpot via Zapier/Make
- **Slack notifications:** Get instant alerts when someone joins the waitlist

### Organize Your Data:

- **Use views:** Create filtered views for different statuses
- **Color code:** Use colors for different CRM types or status
- **Link tables:** Create relationships between tables if needed

### Team Collaboration:

- **Share the base:** Invite team members with different permission levels
- **Comments:** Use Airtable comments to collaborate on leads
- **Assignments:** Use a "Owner" field to assign leads to team members

## 📞 Need Help?

1. Check `AIRTABLE_SETUP.md` for detailed instructions
2. Review Airtable's documentation: https://airtable.com/developers/web/api
3. Test in browser console to see any error messages

---

**Happy tracking! 🎉**

All your form submissions will now automatically flow into Airtable, organized and ready for action.
