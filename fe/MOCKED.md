# Still mocked

Everything below runs on `lib/mock/seed.ts` plus the in-memory store in `lib/store.tsx`. Nothing persists across a reload. No FastAPI calls.

## Auth and accounts
- Signup, login, workspace creation. Waitlist emails go to localStorage only (`lib/waitlist.ts`).
- Seats and invites: the Invite button shows a toast. Nobody receives anything.
- Two seeded tenants (`ledgerline` B2B, `pixelcart` D2C). The tenant switcher only switches between those.

## Channels and OAuth
- Connect, reauthorize, disconnect for every channel (email, LinkedIn, X, Instagram, TikTok, Meta/Google Ads) flips a status flag. No OAuth.
- Channels recommended without a connection record are tracked in component state only and reset on reload.
- Email sending domain, warmup, and health are static seed values. No DNS, SPF/DKIM, or deliverability checks.
- Gmail "drafts only" is copy. Approve does not write to Gmail.

## Onboarding and Brain
- Website scan is a timed checklist. It reads nothing. Offer, audience, claims, proof, and voice come from the seed.
- "Not sure, suggest one" is a keyword heuristic (`suggestModel` in `lib/model-config.ts`).
- ICP cards are seed data, or static per-model templates (`icpTemplates`) when the model differs from the seed. No research or firmographic data.
- Switching model in the Brain regenerates template ICPs.

## Sprint and approvals
- The 21-day plan is seeded. Day N of 21 is a static `dayOf21` number, not computed from dates.
- Posting, scheduling, and "Posted" status never leave the app. Nothing is published.
- Approving a draft does not link to the matching sprint post in any reliable way (the store matches by id or identical body).
- Autopilot toggle changes a flag only. Approvals are still required.
- Reordering reassigns existing day slots. It does not reschedule against real dates.

## Outreach
- Sequences, prospects, daily caps, and "needs human" states are seed data. No sending, no reply ingestion, no prospect discovery.

## Ads
- Proposals are seeded. Cost-per-result ranges are labeled estimates and are not computed from any ad platform.
- Approve/Launch/Dismiss change status only. No ad account connection, no spend.
- Edit (budget, duration) is held in page state and is lost on navigation or reload.

## Report and loop
- Report numbers, channel deltas, and best posts are seed data. There are no sparklines because there is no time series.
- Loop learnings and proposed changes are seeded. "Start next 3 weeks" resets `dayOf21` and the post days in memory.

## Settings and billing
- Billing meters read from tenant caps (`usedPosts`, `usedSends`, `seats`). Seat cap is a placeholder. No invoices, no checkout, no plan changes.
- Notification toggles are local state. Nothing is sent.
- Workspace Save shows a toast only.
- Kill switch and suppression list work in the store but do not affect any real sending.
