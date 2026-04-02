# Supabase Setup Instructions

## 1. Create Supabase Project
- Go to https://supabase.com
- Create a new project
- Copy your project URL and anon key

## 2. Update Environment Variables
Edit `.env.local`:
```
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_PAYSTACK_PUBLIC_KEY=pk_test_your_public_key
```
> The Paystack **secret key** is NEVER stored in `.env.local`. It lives only in Supabase Edge Function secrets (see step 5).

## 3. Run SQL Schema
- Go to Supabase Dashboard → SQL Editor
- Copy and paste content from `supabase-schema.sql`
- Run the query

## 4. Create Storage Buckets
In Supabase Dashboard → Storage, create:
- `sermons` (for audio files)
- `books` (for PDFs)
- `images` (for blog/event images)

Make all buckets public.

## 5. Deploy Edge Function (Paystack Verification)

### Install Supabase CLI
```bash
npm install -g supabase
```

### Login & link project
```bash
supabase login
supabase link --project-ref kmpieismaeexhndrweqk
```

### Set secrets (secret key stays server-side only)
```bash
supabase secrets set PAYSTACK_SECRET_KEY=sk_test_your_secret_key_here
```
Get your secret key from https://dashboard.paystack.com → Settings → API Keys

### Deploy the function
```bash
supabase functions deploy verify-paystack
```

### Verify it's live
You should see it at:
`https://kmpieismaeexhndrweqk.supabase.co/functions/v1/verify-paystack`

## 6. Install Dependencies
```bash
npm install
```

## 7. Run the App
```bash
npm run dev
```
