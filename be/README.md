# NameLoop API

FastAPI + Supabase Postgres.

## Setup

```bash
cd be
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # or use existing .env
```

Apply schema (optional — app also `create_all` on boot):

```bash
python scripts/init_db.py
```

### Render + Supabase

Render cannot reach Supabase **direct** DB (`db.*.supabase.co`) over IPv6.
On Render, set `DATABASE_URL` to the **Session pooler** string from
Supabase → **Connect** → **Session pooler** (host like `aws-0-….pooler.supabase.com`,
user `postgres.<project-ref>`, port `5432`, add `?sslmode=require`).

Primary URL after deploy: `https://nameloop-a58q.onrender.com`  
Health: `/health` · Docs: `/docs`

Run:

```bash
uvicorn app.main:app --reload --port 8000
```

- Health: `GET /health` (includes DB ping)
- Me: `GET /api/me` with `Authorization: Bearer <supabase_access_token>`
- Docs: `/docs`

## Auth

Frontend signs in with Supabase (Google + magic link). API verifies the JWT via Supabase `/auth/v1/user` and upserts `profiles` + default `tenants` / `memberships`.
