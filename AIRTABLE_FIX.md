# ⚠️ Airtable Not Recording? Fix It Here

## The Issue

Your forms are not saving to Airtable because **the Base ID hasn't been configured yet**.

## ✅ Quick Fix (2 minutes)

### Step 1: Get Your Airtable Base ID

1. Go to [Airtable.com](https://airtable.com) and sign in
2. Create a new base (if you haven't):
   - Click **"Add a base"**
   - Name it: **"FlightSuite Landing Page"**
3. Open your base
4. Look at the URL in your browser:
   ```
   https://airtable.com/appXXXXXXXXXXXXXX/...
                        ^^^^^^^^^^^^^^^^^^^
                        This is your Base ID
   ```
5. Copy everything starting with `app` (e.g., `appABC123XYZ456789`)

### Step 2: Update the Config File

1. Open this file: **`airtable-config.js`**
2. Find line 10:
   ```javascript
   baseId: 'YOUR_BASE_ID_HERE', // TODO: Replace with actual base ID
   ```
3. Replace `YOUR_BASE_ID_HERE` with your actual Base ID:
   ```javascript
   baseId: 'appABC123XYZ456789', // ✅ Your actual Base ID
   ```
4. **Save the file**

### Step 3: Create Your Tables

In your Airtable base, create these 2 tables:

#### Table 1: "CRM Waitlist"
Create a table with this EXACT name and these fields:

| Field Name | Field Type | Notes |
|------------|------------|-------|
| Name | Single line text | |
| Email | Email | |
| CRM Type | Single line text | |
| Submission Date | Date | Include time |
| Source | Single line text | |
| Status | Single select | Options: New, Contacted, Qualified, Not Interested |

#### Table 2: "Mobile Email Capture"
Create a table with this EXACT name and these fields:

| Field Name | Field Type | Notes |
|------------|------------|-------|
| Name | Single line text | |
| Email | Email | |
| Submission Date | Date | Include time |
| Source | Single line text | |
| Status | Single select | Options: New, Email Sent, Installed, Not Interested |

**IMPORTANT:** Field names must match EXACTLY (case-sensitive)

### Step 4: Test It

1. Open `test-airtable.html` in your browser
2. Click **"Send Test Submission"**
3. If you see ✅ Success, check Airtable - the test record should be there!
4. If successful, your forms will now work!

## 🎉 What's Fixed

### ✅ Airtable Integration
- Added better error messages
- Shows alert if Base ID not configured
- Helpful console logs for debugging

### ✅ Enter Key Support
All forms now submit when you press Enter:
- CRM Waitlist form (Name, Email, CRM Type)
- Mobile Email Capture (Name, Email)
- Auto-focuses inputs for better UX

## 🔍 Still Not Working?

### Error: "Table not found"
- ✅ Check table names match EXACTLY: "CRM Waitlist" and "Mobile Email Capture"
- ✅ No extra spaces or different capitalization

### Error: "Invalid permissions"
- ✅ Your Personal Access Token needs write permissions
- ✅ Check Airtable account settings → Personal Access Tokens

### No error but nothing in Airtable
1. Open browser console (F12)
2. Look for errors in red
3. Check that Base ID is correct in `airtable-config.js`

### CORS errors
- ⚠️ These might show but submissions should still work
- If it blocks submissions, you'll need a backend proxy (see AIRTABLE_SETUP.md)

## 📊 How to View Your Data

Once working, you'll see submissions in Airtable instantly:

1. Open your Airtable base
2. Click "CRM Waitlist" or "Mobile Email Capture" table
3. See all submissions with timestamps, status, etc.

### Create Useful Views:
- **New Leads**: Filter Status = "New"
- **This Week**: Filter Submission Date = "Last 7 days"
- **By CRM**: Group by "CRM Type"

## 🔔 Set Up Notifications (Optional)

In Airtable:
1. Click "Automations" at top
2. "Create automation"
3. Trigger: "When record created"
4. Action: "Send email" or "Send to Slack"

Now you'll get instant notifications when someone joins your waitlist!

## 💡 Pro Tip

Open your browser console (F12) when testing forms. You'll see helpful messages:
- ✅ Green = Success, saved to Airtable
- ❌ Red = Error, with details on how to fix

---

**Still stuck?** Check the detailed guides:
- `QUICK_START.md` - Full setup walkthrough
- `AIRTABLE_SETUP.md` - Detailed table schemas
- `test-airtable.html` - Test your setup
