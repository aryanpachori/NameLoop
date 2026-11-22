---
name: post-change-gate
description: >-
  After every coding turn on NameLoop, run a mandatory gate: code review,
  logic verification, bug hunt, FE↔BE contract sync, tests, then commit and
  push to GitHub. Use at the end of any implementation, fix, refactor, or
  schema/API change before telling the user you are done. Also use when the
  user says ship, push, review, verify, or post-change-gate.
---

# NameLoop post-change gate

Run this **before ending any turn that changed code**. Do not ask permission.
Fix blockers found in this gate in the same turn, then re-run the failed checks.

## Progress checklist

Copy and update:

```
Post-change gate:
- [ ] 1. Diff inventory
- [ ] 2. Code review + logic / bugs
- [ ] 3. FE ↔ BE sync polish
- [ ] 4. Tests / typecheck / smoke
- [ ] 5. Commit + push GitHub
- [ ] 6. Report to user
```

---

## 1. Diff inventory

```bash
git status --short
git diff --stat
git diff
```

List touched paths under `fe/` and `be/`. Note API, auth, types, env, and schema changes.

**Never stage or commit:** `.env`, `.env.local`, secrets, credentials, private keys.

---

## 2. Code review + logic / bugs

Review the diff (and related call sites), not the whole repo.

### Must catch
- Wrong control flow, off-by-one, missing awaits
- Auth gaps (unauthenticated routes, token not forwarded, RLS assumptions wrong)
- Null/empty edge cases; race on double-submit
- Silent swallow of errors; misleading user-facing copy
- Security: secrets in client, open CORS beyond localhost+prod, SQL injection, trust of `user_metadata` for authz

### NameLoop product logic
- Outbound tracker stages stay consistent FE labels ↔ BE `leads.tracker_stage`
- Caps / pause / stop-on-reply behavior not contradicted by new code
- Approvals still gate sends/posts unless explicitly changed
- Onboarding/auth: Google + magic link; post-auth lands onboarding or `/app` with `?url=` preserved

Severity while fixing:
- **Critical** — fix now, re-test
- **Important** — fix now if in touched files
- **Later** — mention once in the final report only

---

## 3. FE ↔ BE sync polish

If either side changed contracts, verify both.

| Check | How |
|-------|-----|
| Routes | FE `lib/api.ts` / fetch paths match FastAPI routers (`/api/...`, `/health`) |
| Types | Request/response fields match Pydantic models and FE types |
| Auth | FE sends `Authorization: Bearer <supabase access_token>`; BE validates via Supabase |
| Env | `NEXT_PUBLIC_API_URL`, Supabase URL/anon key, `DATABASE_URL` — examples updated, secrets not committed |
| Errors | API error shapes handled in UI (no blank failures) |

Polish: rename mismatches, add missing fields, align naming (`product_url` vs `productUrl` at boundary — be explicit). Prefer one source of truth: **BE owns persistence; FE owns UX.**

Read [fe-be-contract.md](fe-be-contract.md) if unsure about current contracts.

---

## 4. Tests / typecheck / smoke

Run from repo root (skip only if path untouched **and** no shared types/API):

```bash
# FE
cd fe && npx tsc --noEmit

# BE (venv)
cd be && .venv/bin/python -c "from app.main import app; print('import_ok')"
curl -sf http://127.0.0.1:8000/health || true
```

If the API is not running and BE changed, start it briefly:

```bash
cd be && .venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8000
```

Optional helper: `bash .cursor/skills/post-change-gate/scripts/smoke.sh`

**Do not push if `tsc` or app import fails.** Fix first.

---

## 5. Commit + push GitHub

Only after checks pass (or failures are fixed).

1. `git status` / `git diff` / `git log -5 --oneline` (style)
2. Stage relevant files only (no secrets)
3. Commit with a short why-focused message (HEREDOC)
4. `git push -u origin HEAD`
5. Confirm `git status` clean / ahead resolved

Follow repo git safety: no force-push to main, no amend of others’ commits, no `--no-verify` unless user asked.

If there is **nothing to commit**, skip commit/push and say so.

If push fails (auth/network), report the error; do not fake success.

---

## 6. Report to user

Keep it short:

```
Gate: pass | pass with notes | blocked
- Review: …
- FE↔BE: …
- Tests: …
- Git: commit sha + pushed | nothing to push | push failed
```

Do not dump the full checklist. Do not claim pushed unless `git push` succeeded.

---

## When NOT to push

- User explicitly said not to commit/push
- Only docs/skill edits and user asked for local-only
- Critical test failure still open

Still run review + FE↔BE + tests; say why push was skipped.
