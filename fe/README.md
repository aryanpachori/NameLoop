# NameLoop frontend

Next.js app · prod: https://nameloop.vercel.app · API: https://nameloop-a58q.onrender.com

## Local

```bash
cp .env.example .env.local
npm install
npm run dev
```

## Vercel env (Production + Preview)

Set these in **Vercel → Project → Settings → Environment Variables**, then redeploy:

| Name | Value |
|------|--------|
| `NEXT_PUBLIC_SITE_URL` | `https://nameloop.vercel.app` |
| `NEXT_PUBLIC_API_URL` | `https://nameloop-a58q.onrender.com` |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://tebasqwrxrzxzyniwrtb.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | publishable key from Supabase |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth web client id |

Also allow redirect URLs in Supabase Auth:

- `https://nameloop.vercel.app/auth/callback`
- `http://localhost:3000/auth/callback`
