# Fund Me Friend — Setup Guide

## What's been built

A full crowdfunding platform with:
- Home page with featured campaigns
- Browse & search campaigns by category
- Create campaign (with photo upload)
- Campaign detail page with progress bar & donor list
- Donation flow via Ozow instant EFT
- User registration & login (Supabase Auth)
- Dashboard: my campaigns + my donations
- Campaign management: post updates, view donors, cancel campaign
- Ozow webhook to auto-update payment status

---

## Step 1 — Supabase Setup

1. Go to https://supabase.com and create a free account
2. Create a new project (choose a South Africa-friendly region, e.g. US East)
3. Once created, go to **Settings → API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`

5. Go to **SQL Editor** and paste the entire contents of `supabase/migrations/001_initial.sql`, then run it

6. Go to **Storage → New bucket**, create a bucket called `campaign-images`, set it to **Public**

---

## Step 2 — Ozow Setup

1. Go to https://ozow.com and register as a merchant
2. Once approved, log into the merchant portal
3. Copy:
   - **Site Code** → `OZOW_SITE_CODE`
   - **Private Key** → `OZOW_PRIVATE_KEY`
   - **API Key** → `OZOW_API_KEY`

4. In Ozow settings, set your **Notify URL** to: `https://yourdomain.com/api/ozow/notify`

> During development, set `IsTest: 'true'` in `src/lib/ozow.ts` (already done automatically when `NODE_ENV !== 'production'`)

---

## Step 3 — Fill in .env.local

Open `.env.local` and replace all placeholder values:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

NEXT_PUBLIC_SITE_URL=http://localhost:3000

OZOW_SITE_CODE=your_site_code
OZOW_PRIVATE_KEY=your_private_key
OZOW_API_KEY=your_api_key
```

---

## Step 4 — Run locally

```bash
npm run dev
```

Open http://localhost:3000

---

## Step 5 — Deploy to Vercel (free)

1. Push the project to GitHub
2. Go to https://vercel.com and import the repo
3. Add all environment variables from `.env.local`
4. Change `NEXT_PUBLIC_SITE_URL` to your Vercel domain
5. Update Ozow Notify URL to your Vercel domain

---

## Pages

| URL | Description |
|-----|-------------|
| `/` | Home page |
| `/campaigns` | Browse all campaigns |
| `/campaigns/[id]` | Campaign detail + donate |
| `/create` | Start a new campaign |
| `/dashboard` | Your campaigns & donations |
| `/dashboard/campaigns/[id]` | Manage a campaign |
| `/login` | Sign in |
| `/register` | Create account |
| `/donate/success` | After successful payment |
| `/donate/cancel` | After cancelled payment |
