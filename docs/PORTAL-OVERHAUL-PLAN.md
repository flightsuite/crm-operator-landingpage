# Portal & Dashboard Overhaul Plan

## Five Whys: Why Is the Portal Trash?

### Why #1: Users can't accomplish their goals in the portal.
The dashboard shows 4 cards (credits, subscription, CRM connections, phone numbers) — but provides no actionable context. A user who just installed the extension lands here and sees "Free plan, 0/20 credits used" with no guidance on what to do next.

### Why #2: The portal exists in a design vacuum.
The homepage is Awwwards-tier dark immersive. The portal is a generic light-theme SaaS dashboard with `#f5f5f7` backgrounds, `system-ui` fallback fonts, and completely different nav/footer. The brand dissolves the moment you sign in.

### Why #3: The portal duplicates extension functionality poorly.
CRM connection, phone registration, and billing management all exist in BOTH the extension settings AND the portal — but with different UX flows, different error states, and in connect.html's case, a **hardcoded ngrok dev URL** that makes it completely non-functional in production.

### Why #4: There's no unified mental model.
The extension uses `proxy_token` (CRM-scoped) for chat and `user_token` (Google-scoped) for account management. The portal uses `user_token` only. But the portal has no visibility into active CRM sessions, chat history, or what the extension is actually doing. They're two disconnected surfaces for the same product.

### Why #5: The portal was built as an afterthought to solve billing.
The entire dashboard exists because Stripe checkout needs a web page to redirect to. Everything else — CRM connection, phone numbers — was bolted on because "we already have a signed-in web page." There was no product thinking about what the portal's JOB is.

---

## The Portal's Job (Reframed)

The portal has exactly **3 jobs**:

1. **Convert**: Turn a Chrome Web Store installer into a signed-in, CRM-connected, paying user
2. **Manage**: Let users control billing, CRM connections, and messaging channels
3. **Expand**: Surface usage insights that drive upgrades and deeper adoption

Everything else is noise.

---

## Critical Bugs (Fix Before Redesign)

| Bug | File | Line | Severity |
|-----|------|------|----------|
| **Hardcoded ngrok URL** — entire portal hits dev server, not production | `app/index.html` | 773 | **P0 — portal is broken in prod** |
| **Same ngrok URL** in connect.html | `app/connect.html` | ~447 | **P0** |
| `ngrok-skip-browser-warning` header sent to prod API (harmless but sloppy) | `app/index.html` | 779-780 | P2 |
| No error boundary — JS errors silently break dashboard with no recovery | `app/index.html` | Throughout | P1 |
| `/subscribe` link in credit card goes nowhere | `app/index.html` | 949, 951 | P1 |

---

## Data Flow Map

```
┌─────────────────────────────────────────────────────────────────┐
│                        BROWSER EXTENSION                         │
│                                                                   │
│  chrome.identity.launchWebAuthFlow()                             │
│        │                                                          │
│        ▼                                                          │
│  Google Access Token ──► POST /auth/google ──► user_token        │
│                                │                                  │
│                                ▼                                  │
│  POST /auth/{crm}/oauth/start ──► auth_url + polling_token       │
│  Poll /auth/{crm}/oauth/session ──► proxy_token                  │
│                                │                                  │
│                                ▼                                  │
│  POST /chat (proxy_token) ──► AI Agent ──► CRM Actions           │
│                                                                   │
│  Storage: chrome.storage.local (user_token, saved_accounts)      │
│           chrome.storage.session (proxy_token, session_id)        │
└───────────────────────────────┬───────────────────────────────────┘
                                │ Same backend, same tokens
                                │ NO direct IPC between extension & portal
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FASTAPI BACKEND (prod.flightsuite.ai)         │
│                                                                   │
│  Auth:     POST /auth/google, /auth/email/*, /auth/{crm}/*      │
│  Users:    GET /users/me, POST /users/me/crm-links              │
│  Billing:  POST /billing/checkout, /billing/portal, GET /status  │
│  Channels: POST /channels/{sms,whatsapp}/{send,verify}-code     │
│  Chat:     POST /chat (proxy_token → Gemini → CRM tools)        │
│                                                                   │
│  DynamoDB: USER# → PROFILE, CRM#, CHANNEL#, USAGE#             │
│  Stripe:   checkout → webhook → tier update                      │
│  Twilio:   inbound SMS/WA → PHONE_MAP → route to user           │
└───────────────────────────────┬───────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     WEB PORTAL (/app/)                            │
│                                                                   │
│  app/index.html  — Login (Google + Email OTP) → Dashboard        │
│  app/connect.html — CRM OAuth connection page (BROKEN - ngrok)   │
│                                                                   │
│  Auth: Google OAuth (GIS library) or Email OTP                   │
│  Token: user_token in localStorage                               │
│  Calls: /billing/status, /users/me, /billing/checkout            │
│         /auth/{crm}/oauth/start, /channels/sms/*                 │
│                                                                   │
│  DOES NOT: See chat history, active sessions, or extension state  │
│  CANNOT: Communicate with extension directly                      │
└─────────────────────────────────────────────────────────────────┘
```

**Key insight**: The extension and portal are independent clients sharing the same backend API and the same `user_token`. They cannot talk to each other. Any "sync" between them happens through the backend (e.g., CRM links created in the portal appear when the extension calls `/users/me/sessions`).

---

## Phase 1: Emergency Fixes (Day 1)

### 1A. Fix Production API URL
**Files**: `app/index.html`, `app/connect.html`

```javascript
// BEFORE (broken)
const API = 'https://treasonable-refugio-uncoincidentally.ngrok-free.dev/api/v1';

// AFTER
const API = 'https://prod.flightsuite.ai/api/v1';
```

Remove `ngrok-skip-browser-warning` header from both `auth()` and `noauth()` functions.

### 1B. Fix Dead Links
- `/subscribe` links in credit remaining text → `onclick="openPlanModal()"` or `javascript:void(0)` with plan modal trigger

### 1C. Add Global Error Boundary
Wrap all async functions with try/catch that shows a recoverable error state instead of silently breaking.

---

## Phase 2: Dark Theme Conversion (Days 2-3)

### 2A. Port Portal to Dark Theme
**Same pattern as sub-pages**: Link `css/shared.css`, replace inline CSS.

The portal has ~500 lines of inline `<style>` that need to become dark-themed. Key conversions:

| Element | Current (Light) | Target (Dark) |
|---------|-----------------|---------------|
| Background | `#f5f5f7` | `#000000` (true black) |
| Cards | `#ffffff` | `rgba(255,255,255,0.04)` glass + border |
| Text primary | `#1d1d1f` | `#F5F5F7` |
| Text secondary | `#6e6e73` | `#8A8A9A` |
| Accent | `#0071e3` | `var(--color-accent-blue)` |
| Header | Light pill | Dark floating pill (from shared.css) |
| Inputs | `#f5f5f7` border | Glass input with `rgba` border |
| Toast | Box shadow | Glass toast with backdrop |
| Plan modal | White sheet | Glass morphism sheet |

### 2B. Replace Header/Footer
- Login view: Minimal header (logo + sign-in link) — no full nav needed
- Dashboard view: Full floating pill header with user email + sign out
- Footer: 5-column footer from shared.css (consistent with all pages)

### 2C. Typography
- Replace `system-ui, -apple-system` fallback → `'Space Grotesk'` for headings, `'DM Sans'` for body
- Add Google Fonts link

---

## Phase 3: UX Redesign (Days 4-7)

### 3A. Kill connect.html — Merge Into Dashboard
**Why it exists**: Dedicated page for CRM OAuth flow with polling overlay.
**Why it should die**: The same CRM connection UI already exists in `app/index.html` (the CRM card with polling overlay). Two pages doing the same thing = confusion.

- Move all CRM OAuth logic into the dashboard CRM card
- Delete `app/connect.html`
- Redirect `/app/connect` → `/app/` (or handle via JS routing)

### 3B. Redesign Login View

**Current**: Generic login card with Google button + email OTP
**Target**: Premium sign-in experience that matches the product's personality

```
┌─────────────────────────────────────────────┐
│                                             │
│          ✦ FlightSuite                      │
│                                             │
│     Sign in to your                         │
│     command center.                         │
│                                             │
│     Manage CRM connections, messaging       │
│     channels, and your subscription.        │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │  [G] Continue with Google           │    │
│  └─────────────────────────────────────┘    │
│                                             │
│           ── or with email ──               │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │  you@company.com                    │    │
│  └─────────────────────────────────────┘    │
│  ┌─────────────────────────────────────┐    │
│  │  Send sign-in code              →   │    │
│  └─────────────────────────────────────┘    │
│                                             │
│     By signing in, you agree to our         │
│     Terms of Service and Privacy Policy.    │
│                                             │
└─────────────────────────────────────────────┘
```

Key changes:
- Dark glass card with subtle border
- Gradient orb background (already exists, just needs dark treatment)
- "command center" language reinforces the product metaphor
- Terms/privacy links at bottom

### 3C. Redesign Dashboard Layout

**Current layout** (2x2 grid of cards):
```
[ Credits    ] [ Subscription ]
[ CRM Conns  ] [ Phone Numbers]
```

**Proposed layout** (information hierarchy by user need):

```
┌──────────────────────────────────────────────────────────┐
│  Welcome back, John.              [Pro] ● Active         │
│  john@company.com                                        │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌── Quick Actions ──────────────────────────────────┐   │
│  │  [Connect a CRM]  [Add Phone]  [Upgrade Plan]    │   │
│  │  (contextual — only show what's not done yet)     │   │
│  └───────────────────────────────────────────────────┘   │
│                                                          │
│  ┌── Connected CRMs ─────────────────────────────────┐   │
│  │  [HS] HubSpot  ● Connected  Mar 5, 2026  [···]   │   │
│  │  [+] Connect GoHighLevel                          │   │
│  └───────────────────────────────────────────────────┘   │
│                                                          │
│  ┌── Messaging Channels ─┐  ┌── Subscription ────────┐  │
│  │  💬 +1 (704) 555-0123 │  │  Pro · $10/mo          │  │
│  │  SMS → HubSpot        │  │  142 / 300 credits      │  │
│  │                       │  │  ████████░░░░  47%      │  │
│  │  [+ Add number]       │  │  Renews Apr 12, 2026    │  │
│  │                       │  │  [Manage →]             │  │
│  └───────────────────────┘  └─────────────────────────┘  │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

Key UX changes:

1. **Quick Actions bar** — contextual CTAs based on account state:
   - No CRM connected? → "Connect your CRM" (primary)
   - No phone number? → "Add a phone number"
   - On free tier? → "Upgrade to unlock SMS"
   - All done? → Bar disappears (zero-state noise eliminated)

2. **CRM card promoted to top** — this is the #1 thing users need to do after signing in. Move it from bottom-left to directly below quick actions.

3. **Channels + Subscription side-by-side** — these are "check occasionally" cards, not primary actions. Equal weight, below CRM.

4. **Credits integrated into subscription card** — no need for a separate card. Credits ARE the subscription value. Merge them.

### 3D. Progressive Onboarding States

The dashboard should adapt to where the user is in their journey:

| State | What they see |
|-------|---------------|
| **Just signed up** | Welcome message + single CTA: "Connect your first CRM" with a brief explanation |
| **CRM connected, no channels** | CRM card shows connected, Quick Actions highlights "Add a phone number for SMS/WhatsApp" |
| **CRM + channel, free tier** | Usage card shows "5/20 credits used", upgrade prompt becomes prominent as they approach limit |
| **Paying customer** | Clean dashboard, no upsell noise, "Manage subscription" is subtle |

### 3E. Plan Selection Redesign

**Current**: Modal overlay with 3 plan tiles
**Problem**: Plans are presented identically except price — no story about WHY to upgrade

**Target**: Inline upgrade section (not modal) with clear value ladder:

```
┌─────────────────────────────────────────────────┐
│  Starter · $5/mo        Pro · $10/mo  ★         │
│  100 SMS credits        300 SMS credits          │
│  For trying SMS/WA      For daily SMS users      │
│  [Get Starter]          [Get Pro]                │
│                                                  │
│  Business · $15/mo                               │
│  600 SMS credits + SLA                           │
│  For teams              [Get Business]           │
└─────────────────────────────────────────────────┘
```

Key change: Each plan has a one-line persona ("For trying SMS/WA", "For daily SMS users", "For teams") so users self-select.

---

## Phase 4: Functionality Gaps (Days 8-12)

### 4A. Usage & Activity Dashboard

**Why**: Users have no visibility into how they're using FlightSuite. The backend already has `GET /users/me/usage` that returns monthly query counts — but the portal never calls it.

Add a usage section:
- Monthly chart (simple bar chart, last 3 months) of chat queries
- SMS/WhatsApp messages sent
- "You've saved approximately X hours this month" (queries × 3 min average)

This is critical for **upgrade justification** — when a user sees "You processed 87 CRM actions this month, saving ~4.3 hours", the $10/mo Pro plan sells itself.

### 4B. Session Awareness

**Current gap**: The portal has zero visibility into active extension sessions. A user could have 3 CRM accounts connected in the extension, but the portal only shows what's in the backend's `CRM_LINK` records.

Add:
- "Active sessions" indicator on CRM cards (if sessions were restored from `/users/me/sessions`)
- Last activity timestamp per CRM connection

### 4C. Getting Started Guide

For new users (no CRM connected), show an inline setup checklist:

```
Getting started with FlightSuite
─────────────────────────────────
✓  Create your account
◻  Install the Chrome extension  [Install →]
◻  Connect your first CRM        [Connect →]
◻  Send your first command        (open extension)
◻  Add a phone number for SMS     [Add number →]
```

This replaces the empty-state dashboard with something actionable.

### 4D. Mobile Responsiveness

The current portal has basic mobile CSS (`@media max-width: 700px`) but it's not tested against the main site's standards. Apply:
- Same breakpoints as main site (375, 768, 1024, 1440, 1920)
- 16px minimum inputs (iOS zoom prevention)
- No `backdrop-filter` on mobile
- Touch-friendly tap targets (44px minimum)

---

## Phase 5: Polish & Integration (Days 13-15)

### 5A. Extension ↔ Portal Deep Link

When the extension links to `https://flightsuite.ai/app`, pass context via URL params:
- `?upgrade=true` → auto-open plan selector
- `?connect=hubspot` → auto-start HubSpot OAuth
- `?pair={token}` → handle SMS/WhatsApp pairing (already partially supported)

### 5B. Toast/Notification System
Replace the current basic toast with a consistent notification system matching the main site's visual language.

### 5C. Loading States
Replace skeleton loaders with shimmer animations matching the dark theme's glass aesthetic.

### 5D. SEO & Meta
- Add proper `<head>` meta tags (noindex for portal — it's authenticated content)
- Add favicon, Open Graph fallbacks
- Proper `<title>` tags per view state

---

## Implementation Priority Matrix

| Priority | Item | Impact | Effort |
|----------|------|--------|--------|
| **P0** | Fix ngrok API URL | Portal literally broken | 5 min |
| **P0** | Fix dead `/subscribe` links | Broken upgrade funnel | 10 min |
| **P1** | Dark theme conversion | Brand consistency | 4 hrs |
| **P1** | Kill connect.html, merge into dashboard | Remove broken page | 2 hrs |
| **P1** | Quick Actions bar | Guides user journey | 2 hrs |
| **P2** | Dashboard layout redesign | Better information hierarchy | 4 hrs |
| **P2** | Progressive onboarding states | Reduces new-user confusion | 3 hrs |
| **P2** | Login view redesign | First impression | 2 hrs |
| **P3** | Usage/activity dashboard | Upgrade justification | 4 hrs |
| **P3** | Getting started checklist | New user activation | 2 hrs |
| **P3** | Plan selection redesign | Better conversion | 2 hrs |
| **P4** | Mobile responsiveness | Mobile users | 3 hrs |
| **P4** | Extension deep links | Cross-surface UX | 2 hrs |
| **P4** | Polish (toasts, loading, meta) | Fit and finish | 2 hrs |

---

## Files Affected

| File | Changes |
|------|---------|
| `app/index.html` | Complete overhaul: dark theme, layout, API URL, new sections |
| `app/connect.html` | **DELETE** — merge OAuth flow into dashboard |
| `css/shared.css` | Add portal-specific dark components (if not already covered) |
| `js/main.js` | None (portal has its own inline JS) |

## Backend Endpoints Used by Portal

| Endpoint | Portal Usage | Status |
|----------|-------------|--------|
| `POST /auth/google` | Google sign-in | ✅ Working |
| `POST /auth/email/request-otp` | Email OTP | ✅ Working |
| `POST /auth/email/verify-otp` | Email verify | ✅ Working |
| `GET /users/me` | Load CRM + channels | ✅ Working |
| `GET /billing/status` | Credits + subscription | ✅ Working |
| `POST /billing/checkout` | Stripe checkout | ✅ Working |
| `POST /billing/portal` | Stripe management | ✅ Working |
| `POST /auth/{crm}/oauth/start` | CRM OAuth | ✅ Working |
| `GET /auth/{crm}/oauth/session` | OAuth polling | ✅ Working |
| `DELETE /users/me/crm-links/{type}/{id}` | Disconnect CRM | ✅ Working |
| `POST /channels/sms/send-code` | Phone registration | ✅ Working |
| `POST /channels/sms/verify-code` | Phone verify | ✅ Working |
| `DELETE /channels/{type}/{phone}` | Remove phone | ✅ Working |
| `GET /users/me/usage` | Activity data | ⚠️ Exists but **not called by portal** |
| `GET /users/me/sessions` | Active sessions | ⚠️ Exists but **not called by portal** |

## What NOT to Change

- **Backend API** — Zero changes needed. Every endpoint the portal needs already exists.
- **Extension code** — The extension is a separate client. Don't couple them.
- **Auth model** — user_token + proxy_token architecture is sound. Keep it.
- **DynamoDB schema** — No new entities needed.
- **Google OAuth client ID** — Shared between extension and portal (different redirect URIs, same project).

---

## Verification Checklist

After each phase:
- [ ] `python -m http.server 8000` → `/app/` loads without console errors
- [ ] Google sign-in works → dashboard renders
- [ ] Email OTP works → dashboard renders
- [ ] Credits and subscription load from `/billing/status`
- [ ] CRM connections load from `/users/me`
- [ ] CRM OAuth flow (HubSpot) completes with polling
- [ ] Phone number registration works (send code → verify)
- [ ] Plan selection → Stripe checkout redirect works
- [ ] "Manage subscription" → Stripe portal redirect works
- [ ] Mobile: 375px renders correctly, inputs don't zoom on iOS
- [ ] Dark theme matches homepage visual language
- [ ] No console errors, no broken network requests
