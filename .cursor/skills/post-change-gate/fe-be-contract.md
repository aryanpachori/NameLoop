# NameLoop FE ↔ BE contract (quick ref)

## Base URLs

- FE prod: `https://nameloop.vercel.app`
- BE prod: `https://nameloop-a58q.onrender.com`
- FE → API: `NEXT_PUBLIC_API_URL` (prod = Render URL; local default `http://127.0.0.1:8000`)
- Supabase: `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- BE DB: `DATABASE_URL` Session pooler on Render (`*.pooler.supabase.com`), `sslmode=require`
- BE CORS must include `https://nameloop.vercel.app`

## Auth

1. FE: Supabase Google OAuth or magic link (`signInWithOAuth` / `signInWithOtp`, `shouldCreateUser: true`)
2. Callback: `/auth/callback` exchanges `code` → session cookies
3. API calls: `Authorization: Bearer <session.access_token>`
4. BE: `GET {SUPABASE_URL}/auth/v1/user` with bearer (+ apikey) → upsert `profiles` + default `tenants`/`memberships`

## Key endpoints

| Method | Path | Notes |
|--------|------|--------|
| GET | `/health` | DB ping, oauth configured flags |
| GET | `/api/me` | Auth required → user + tenant |
| POST | `/api/me/bootstrap` | `{ workspace_name?, product_url? }` |
| POST | `/api/me/onboarded` | Mark tenant onboarded |

Stub routers (not implemented yet): `/api/accounts`, `/api/brain`, `/api/drafts`, `/api/approvals`.

## Domain alignment

- Tracker stages (FE labels): ready → sent → FU1–5 → replied / bounced / unsub / completed / no_email / DQ
- BE column: `leads.tracker_stage` (string)
- Senders: `gmail` \| `resend`
- Product URL: BE `tenants.product_url`; FE may send without scheme — BE normalizes `https://`

## Do not

- Put `GOOGLE_CLIENT_SECRET` or service role key in `NEXT_PUBLIC_*`
- Trust `user_metadata` for authorization decisions
- Let FE write Postgres directly while API is source of truth
