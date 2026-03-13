# 🎉 Airtable Webhook Integration - Super Simple!

Your landing page now uses **Airtable Webhooks** - the easiest and most secure way to submit forms!

## ✅ Why Webhooks Are Better

| Feature | Webhook | API Direct |
|---------|---------|------------|
| **Setup** | ✅ 2 minutes | ❌ 30+ minutes |
| **Security** | ✅ No API keys to expose | ❌ API key in code |
| **Authentication** | ✅ Built into webhook URL | ❌ Manual token management |
| **CORS Issues** | ✅ None | ❌ Common |
| **Maintenance** | ✅ Zero | ❌ Token expiration |

## 🚀 How It Works

```
User fills form
    ↓
Form posts to webhook URL
    ↓
Airtable automation receives data
    ↓
Airtable creates record
    ↓
Done! ✅
```

## 📋 Your Webhook is Already Set Up!

Your webhook URL is already configured in `airtable-config.js`:
```
https://hooks.airtable.com/workflows/v1/genericWebhook/app46JHq6Rm3TpbpT/wflTT6C1culC8Nuad/wtrpYgynXs2c9Ph1o
```

## ⚙️ Configure Your Airtable Automation

To make the webhook work, you need to set up an automation in Airtable:

### Step 1: Create Automation

1. Open your **FlightSuite Landing Page** base in Airtable
2. Click **"Automations"** at the top
3. You should already see an automation linked to your webhook

### Step 2: Configure the Trigger

If you need to create it:
1. Click **"Create automation"**
2. Trigger: **"When webhook received"**
3. It will give you a webhook URL (you already have this!)

### Step 3: Configure the Action

**For CRM Waitlist submissions:**
1. Action: **"Create record"**
2. Table: **"CRM Waitlist"**
3. Map the fields:
   - Name → `name` from webhook
   - Email → `email` from webhook
   - CRM Type → `crmType` from webhook
   - Submission Date → `submissionDate` from webhook
   - Source → `source` from webhook

**For Mobile Email submissions:**
Same thing but use the **"Mobile Email Capture"** table

### Step 4: Add a Condition (Optional)

To route different forms to different tables:
1. Add a **"Condition"** step
2. If `formType` = "CRM Waitlist" → Create in CRM Waitlist table
3. If `formType` = "Mobile Email Capture" → Create in Mobile Email Capture table

## 🧪 Test It Right Now!

1. Open your **index.html** in a browser
2. Fill out the CRM Waitlist form
3. Submit it
4. Check browser console - should see: ✅ **Successfully submitted to Airtable!**
5. Check your Airtable base - record should appear!

## 📊 What Data is Sent

### CRM Waitlist Form:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "crmType": "HubSpot",
  "submissionDate": "2025-12-31T19:00:00.000Z",
  "source": "Landing Page",
  "formType": "CRM Waitlist"
}
```

### Mobile Email Capture:
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "submissionDate": "2025-12-31T19:00:00.000Z",
  "source": "Landing Page - Mobile",
  "formType": "Mobile Email Capture"
}
```

## 🔒 Security

**Is the webhook URL secret?**
- ⚠️ The webhook URL is visible in your HTML source
- ✅ But it's designed to be public - that's how webhooks work!
- ✅ Rate limits prevent abuse
- ✅ You can regenerate it anytime if needed

**To regenerate webhook URL:**
1. Go to your Airtable automation
2. Delete and recreate the webhook trigger
3. Update the URL in `airtable-config.js`

## 🐛 Troubleshooting

### Form submits but no record in Airtable

**Check your automation:**
1. Go to Airtable → Automations
2. Make sure your automation is **turned ON** (toggle in top right)
3. Check the automation history for errors

**Check field mapping:**
- Make sure your automation maps the webhook fields to table columns
- Field names are case-sensitive: `name` not `Name`

### "Failed to save" error in console

1. Check browser console for the exact error
2. Try submitting directly to the webhook URL:
   ```bash
   curl -X POST https://hooks.airtable.com/workflows/v1/genericWebhook/app46JHq6Rm3TpbpT/wflTT6C1culC8Nuad/wtrpYgynXs2c9Ph1o \
   -H "Content-Type: application/json" \
   -d '{"name":"Test","email":"test@test.com","formType":"CRM Waitlist"}'
   ```
3. If curl works but form doesn't, check your JavaScript console

### Webhook URL not working

- Make sure your automation is turned ON in Airtable
- Check that you copied the full webhook URL
- Try regenerating the webhook in Airtable

## 🎯 Advantages vs Netlify Functions

You no longer need:
- ❌ Netlify deployment
- ❌ Environment variables
- ❌ API keys
- ❌ Backend functions
- ❌ Node.js dependencies

Just:
- ✅ Upload HTML to any host
- ✅ Works immediately
- ✅ Zero configuration

## 🌐 Deploy Anywhere!

Since you're using webhooks, you can deploy to:
- ✅ Netlify (static hosting)
- ✅ Vercel
- ✅ GitHub Pages
- ✅ Any web host
- ✅ Even local file system for testing!

**No backend needed!** 🎉

## 💡 Next Steps

1. ✅ Test the form (it should work now!)
2. ✅ Configure your Airtable automation
3. ✅ Deploy to your preferred host
4. ✅ Set up email notifications in Airtable automation

---

**This is the simplest, most reliable way to connect forms to Airtable!** No API keys, no authentication headaches, just pure simplicity. 🚀
