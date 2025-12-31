# 🚀 Deploy to Netlify - Complete Guide

Your landing page is now configured with a **secure backend proxy** using Netlify Functions. This keeps your Airtable API key completely hidden and secure!

## ✅ What You Have Now

- ✅ **Secure Backend**: API key is hidden on the server
- ✅ **No CORS issues**: Backend handles all Airtable requests
- ✅ **Free hosting**: Netlify free tier is generous
- ✅ **Auto-deploy**: Push to GitHub and it deploys automatically
- ✅ **Enter key support**: All forms submit on Enter

## 🎯 Quick Deploy (10 minutes)

### Step 1: Create Your Airtable Personal Access Token

1. Go to [Airtable Developer Hub](https://airtable.com/create/tokens)
2. Click **"Create new token"**
3. Name it: `FlightSuite Landing Page`
4. Add these scopes:
   - ✅ `data.records:read`
   - ✅ `data.records:write`
5. Add access to your base:
   - Click **"Add a base"**
   - Select **"FlightSuite Landing Page"**
6. Click **"Create token"**
7. **Copy the token** (you won't see it again!)

### Step 2: Push to GitHub

1. **Initialize Git** (if not already done):
   ```bash
   cd "/Users/fitzlight/Desktop/CRM Operator Landing Page"
   git add .
   git commit -m "Add Netlify backend proxy for secure Airtable integration"
   git push
   ```

### Step 3: Deploy to Netlify

#### Option A: Netlify UI (Easiest)

1. Go to [Netlify](https://netlify.com) and sign in/sign up
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect to GitHub and select your repository
4. **Build settings:**
   - Base directory: (leave empty)
   - Build command: (leave empty)
   - Publish directory: `.`
   - Functions directory: `netlify/functions`
5. Click **"Deploy site"**

#### Option B: Netlify CLI (For Developers)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize and deploy
netlify init

# Follow the prompts
```

### Step 4: Configure Environment Variables

**IMPORTANT:** Add your secrets to Netlify (not in your code!)

1. In Netlify, go to **Site settings** → **Environment variables**
2. Click **"Add a variable"**
3. Add these variables:

   **Variable 1:**
   - Key: `AIRTABLE_API_KEY`
   - Value: `your_personal_access_token` (from Step 1)

   **Variable 2:**
   - Key: `AIRTABLE_BASE_ID`
   - Value: `app46JHq6Rm3TpbpT`

4. Click **"Save"**
5. Go to **Deploys** and click **"Trigger deploy"** → **"Clear cache and deploy site"**

### Step 5: Test Your Forms

1. Visit your Netlify URL (e.g., `https://your-site.netlify.app`)
2. Fill out the CRM Waitlist form
3. Check your Airtable base - the record should appear!
4. Check browser console for ✅ success message

## 🧪 Local Development

To test the Netlify functions locally:

```bash
# Install dependencies
npm install

# Start local dev server with functions
netlify dev
```

This will:
- Start a local server at `http://localhost:8888`
- Run your Netlify functions locally
- Use environment variables from `.env` file

**Create a `.env` file** (copy from `.env.example`):
```bash
AIRTABLE_API_KEY=your_token_here
AIRTABLE_BASE_ID=app46JHq6Rm3TpbpT
```

Then run:
```bash
netlify dev
```

Your site will be available at `http://localhost:8888` with working forms!

## 🔐 Security Benefits

Your new setup is **much more secure**:

| Before | After |
|--------|-------|
| ❌ API key exposed in browser | ✅ API key hidden on server |
| ❌ Anyone can see your token | ✅ Only server has access |
| ❌ Risk of token abuse | ✅ Secure backend proxy |
| ❌ CORS issues | ✅ No CORS issues |

## 📊 How It Works

```
User fills form
    ↓
Frontend sends to /.netlify/functions/submit-to-airtable
    ↓
Netlify Function (with API key)
    ↓
Airtable API
    ↓
Data saved! ✅
```

## 🐛 Troubleshooting

### Forms not submitting after deploy

1. Check **Site settings** → **Environment variables** are set
2. Check **Deploys** → Latest deploy log for errors
3. Check browser console (F12) for error messages

### "Function not found" error

- Make sure `netlify.toml` is in your repo root
- Check **Site settings** → **Functions** shows the directory

### "Invalid token" error

1. Regenerate your Personal Access Token in Airtable
2. Make sure it has `data.records:write` scope
3. Make sure it has access to your specific base
4. Update the token in Netlify Environment Variables
5. Trigger a new deploy

### Local development not working

```bash
# Make sure you have .env file (copy from .env.example)
cp .env.example .env

# Edit .env and add your token
# Then run
netlify dev
```

## 🎉 You're Done!

Your landing page is now:
- ✅ Deployed on Netlify
- ✅ Securely saving to Airtable
- ✅ Auto-deploying when you push to GitHub
- ✅ Forms submit on Enter key
- ✅ API key is completely hidden

## 🔄 Making Changes

Whenever you update your code:

```bash
git add .
git commit -m "Your changes"
git push
```

Netlify will automatically:
1. Detect the push
2. Build your site
3. Deploy the new version
4. Your changes are live!

## 💡 Next Steps

1. **Custom domain**: Add your own domain in Netlify settings
2. **Analytics**: Enable Netlify Analytics to track visitors
3. **Forms**: Check Airtable regularly for new submissions
4. **Notifications**: Set up Airtable automations for email/Slack alerts

---

**Need help?** Check the Netlify logs or browser console for detailed error messages.
