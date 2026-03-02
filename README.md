# LoveSpot Website

Next.js 14 marketing site and web subscription page for the LoveSpot dating app.
Processes payments via **Stripe** (EUR/USD/GBP) and **Paystack** (NGN) — bypassing
Apple/Google's 15-30% store fees.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Marketing landing page |
| `/subscribe` | Web subscription & boost purchase |
| `/success` | Post-payment confirmation |
| `/cancel` | Cancelled payment |

## Setup

### 1. Install dependencies

```bash
cd website
npm install
```

### 2. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...   # from Supabase > Settings > API
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...         # from Stripe CLI or dashboard
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_...
PAYSTACK_SECRET_KEY=sk_live_...
NEXT_PUBLIC_APP_URL=https://lovespotapp.com
```

### 3. Run locally

```bash
npm run dev
```

Visit http://localhost:3000

### 4. Add logo assets

Copy the app icons to the public folder so Next.js can serve them:

```bash
cp icon.png  public/icon.png
cp image.png public/image.png
```

---

## Deploy to Vercel

1. Push this repo to GitHub.
2. Go to https://vercel.com/new, import the repo.
3. Set **Root Directory** to `website`.
4. Add all environment variables from `.env.local.example`.
5. Deploy.

### Connect lovespotapp.com domain

1. In Vercel → Project → Settings → Domains, add `lovespotapp.com`.
2. Update your DNS registrar with the CNAME/A record Vercel provides.
3. Vercel auto-provisions an SSL certificate.

---

## Stripe Webhook Setup

1. In the [Stripe Dashboard](https://dashboard.stripe.com/webhooks) → Webhooks → Add endpoint.
2. Endpoint URL: `https://lovespotapp.com/api/stripe-webhook`
3. Events to listen for: `checkout.session.completed`
4. Copy the **Signing secret** and set it as `STRIPE_WEBHOOK_SECRET` in Vercel env vars.

**Testing locally with Stripe CLI:**

```bash
stripe login
stripe listen --forward-to localhost:3000/api/stripe-webhook
```

The CLI prints a webhook secret — use it as `STRIPE_WEBHOOK_SECRET` in `.env.local`.

---

## Paystack Webhook Setup

1. In [Paystack Dashboard](https://dashboard.paystack.com/#/settings/developer) → API Keys & Webhooks.
2. Webhook URL: `https://lovespotapp.com/api/paystack-webhook`
3. The webhook is authenticated via HMAC-SHA512 using your `PAYSTACK_SECRET_KEY`.

---

## App Integration (React Native)

The app opens the web subscribe page via `expo-web-browser`:

```tsx
import * as WebBrowser from 'expo-web-browser';

const handleWebSubscription = async (tier: string, billing: 'monthly' | 'yearly') => {
  const returnUrl = 'exp+lovespot-dating-app://subscription/success';
  const url = `https://lovespotapp.com/subscribe?user_id=${user.id}&tier=${tier}&billing=${billing}&return_url=${encodeURIComponent(returnUrl)}`;
  await WebBrowser.openBrowserAsync(url);
  await refreshProfile(); // refresh after browser closes
};
```

After the user pays, the webhook updates Supabase directly. When the browser closes,
`refreshProfile()` fetches the updated subscription state.

### Deep link handling (future)

Add a deep link handler in `app.config.js` for `exp+lovespot-dating-app://subscription/success`
to automatically refresh the subscription when the user returns from the browser.

---

## Architecture

```
User taps "Subscribe" in app
        ↓
WebBrowser.openBrowserAsync(lovespotapp.com/subscribe?user_id=...&tier=...&billing=...)
        ↓
/subscribe page detects region via ipapi.co
        ↓
  ┌─────────────────┐     ┌──────────────────────┐
  │  African users  │     │ EU/US/UK users       │
  │  → NGN/Paystack │     │ → EUR/USD/GBP/Stripe │
  └────────┬────────┘     └──────────┬───────────┘
           ↓                         ↓
  POST /api/create-paystack-session  POST /api/create-stripe-session
           ↓                         ↓
  Redirect to Paystack             Redirect to Stripe Checkout
           ↓                         ↓
  /api/paystack-webhook            /api/stripe-webhook
           ↓                         ↓
  Update Supabase (profiles + subscriptions)
           ↓
  Browser closes → app calls refreshProfile()
```
