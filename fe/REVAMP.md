# NameLoop frontend revamp

In-depth plan for the 5-batch FE redesign. Mock-first. Work only in `fe/`. No FastAPI wiring. Paste **one batch at a time** into Cursor; browser-verify before the next.

**North star:** NameLoop is a paid growth tool. Founder pastes a product URL → NameLoop learns the business → finds ICP → recommends channels → runs a **3-week** posting + outreach sprint → suggests which posts to turn into ads. Generic for any company. **Business model (B2B / B2C / D2C / B2B2C / Marketplace) is the first onboarding gate and decides everything after it.**

---

## 0. Current baseline (evidence, Nov 2026)

### Stack
- Next.js 16.4.3 App Router, React 19, Tailwind v4, shadcn/ui, Motion, `@dnd-kit`, sonner
- Fonts today: Inter + Inter Tight + JetBrains Mono (`app/layout.tsx`)
- Theme: paper `#fdfdfd`, ink `#0c0d10`, brand `#2450e8`, hero aurora wash (`app/globals.css`)
- Data: `lib/store.tsx` + `lib/mock/seed.ts`; `lib/api.ts` is a stub URL helper only

### Marketing routes
| Route | Notes |
|-------|--------|
| `/` | Suite positioning; Discovery→Conversion pipeline hero |
| `/how-it-works` | User story + architecture (Motion) |
| `/pricing` | Single $10/mo + waitlist email |
| `/signup` | Email waitlist + localStorage queue |
| `/login` | Exists; not linked from chrome |
| `/design` | **Missing** |

### App routes (`app/app/*`)
Today, Approvals, Targets, Pipeline, Content, Brain, Report, Health, Settings, Accounts `[id]`.  
Nav: `components/app/nav-items.ts`. Shell: kill switch, no tenant switcher, no Cmd-K.

### Types gap (`lib/types.ts`)
| Missing / narrow | Needed |
|------------------|--------|
| No `BusinessModel` | `b2b \| b2c \| d2c \| b2b2c \| marketplace` on Tenant + Brain |
| `Channel = email \| linkedin \| instagram` | Full set + ads platforms |
| No sprint / ads / ICP card entities | SprintPlan, SprintPost, IcpCard, ChannelRecommendation, AdSuggestion |
| One seed (`createSeedState`) | Dual B2B + D2C tenants |

### Design debt (Batch 1 kill list)
Blue aurora gradients, soft-card marketing language, “AI SDR” framing, channels-as-pipeline-stages history, no Geist / serif system, no `/design` styleguide, no cmdk, no channel glyph set, no dual theme ready for in-app choice.

---

## 1. Principles

1. **Model-first.** Business model is required early in onboarding; ICP shape, channel ranks, outreach variant, and ads audience all branch from it.
2. **Channels are settings, not stages.** Pipeline stages are Discovery → Outreach → Content → Conversion (work). Places to run are user-configured.
3. **Editorial product UI.** Linear / Attio / Vercel / Arc / Raycast density. No purple gradients, orbs, sparkles, emoji, “AI-powered” badges, or template three-card heroes.
4. **Human-in-the-loop at the start.** Approvals required until the founder trusts autopilot. Marketing can say this; product must show the inbox.
5. **Mock honesty.** Estimates labeled estimate. No fake ROAS precision. List still-mocked surfaces at the end of Batch 5.
6. **Serial batches.** Do not start Batch N until Batch N−1 is verified at 1440px and 390px.

---

## 2. Dependency graph

```text
Batch 1  Design system + /design
    │
Batch 2  Marketing (/, /how-it-works, /pricing, /login, /signup)
    │
Batch 3  Types + dual seeds + onboarding + /app/brain
    │
Batch 4  Channels + Sprint + Outreach + Approvals + shell/nav
    │
Batch 5  Report + Ads + Loop + Settings + Today + full QA
```

**Critical path:** Batch 3 type contract. Weak `BusinessModel` / `IcpCard` / `Channel` enums force rewrites in 4–5.

---

## 3. Batch 1 — Design reset and design system

### Goal
Replace AI-template look. Ship tokens, primitives, channel glyphs, and `/design`.

### Deliverables
1. **`fe/DESIGN.md`**
   - Principles, type scale, color, spacing, motion, channel glyph rules
   - Pattern provenance from Dribbble/Mobbin (pattern class only: CRM records, calendars, analytics, onboarding). Cite which pattern inspired what. Do not clone shots.
2. **`app/globals.css` token rebuild**
   - Light default (marketing); `.dark` for in-app choice
   - Ink/paper neutrals; **one** brand accent used sparingly (retire aurora / clay leftovers)
   - Semantic states only: AI working, Waiting approval, Needs human, Human-owned, Paused, Live, Scheduled, Failed
   - 4px grid; radius 8 / 12; hairline 1px borders; motion 150–200ms ease-out (no bounce)
3. **Fonts**
   - Geist Sans → UI
   - Geist Mono → numbers / metadata
   - Instrument Serif or Newsreader → marketing headlines + big stats only
4. **Components** (normalize / add on shadcn)
   - Button, Input, Select, Segmented control, Tag/Badge, State pill, Owner badge, Channel chip
   - Stat (number + delta + sparkline), Empty state, Skeleton, Toast (sonner), Command menu (cmdk), Side sheet, Data table sticky header
5. **Channel marks** (monochrome glyphs): Email, LinkedIn, X, Instagram, Facebook, TikTok, YouTube, Reddit, WhatsApp, Google Ads, Meta Ads
6. **`/design` route** — every token and component in all states

### Files likely touched
`app/globals.css`, `app/layout.tsx`, `app/design/page.tsx`, `DESIGN.md`, `components/ui/*`, new `components/channel-mark.tsx`, `components/stat.tsx`, `components/state-badge.tsx`, `components/owner-badge.tsx`, `components/providers.tsx`

### Packages
`geist` (or next/font Google for Instrument Serif / Newsreader), `cmdk`

### Acceptance
Browser `/design` at **1440** and **390**. No aurora on that route. Light readable. Kill list empty on styleguide surfaces.

### Out of scope
Marketing page rewrite, app nav changes, type model expansion (except if a State enum is needed for badges).

---

## 4. Batch 2 — Marketing site and pricing

### Goal
Sell the 3-week growth loop. Light paper default; dark toggle if system supports without breaking paper-first marketing.

### Landing `/` structure (fixed)
1. **Hero** — serif headline: turn “who should I sell to?” into a running growth loop in 3 weeks; input **Paste your product URL** + primary CTA; honest proof line; right: composed product UI (ICP + calendar), not abstract illustration
2. **The loop** — horizontal 6 steps: Understand business → ICP → Channels → 3-week sprint → Measure → Boost winners into ads; tiny live-looking UI fragment per step
3. **Works for any model** — tabs B2B / B2C / D2C / B2B2C / Marketplace; show how ICP + channel picks change (e.g. B2B: email + LinkedIn; D2C: Instagram + TikTok + Meta ads)
4. **Human-in-the-loop** — approval inbox fragment; “you approve every send at the start”
5. FAQ + footer

### Other routes
| Route | Work |
|-------|------|
| `/how-it-works` | Align to 6-step loop + model-first story (or thin companion to landing) |
| `/pricing` | Starter / Growth / Scale; monthly↔annual; limits by channels, posts/mo, outreach sends/mo, seats; “ad spend billed by the ad platform”; comparison table |
| `/signup` | 2-step: email/Google mock → workspace name + website |
| `/login` | Minimal; restore as linked surface |

### Copy rules
Realistic placeholders. No lorem. No “AI SDR” as category. No channels-as-pipeline-stages.

### Acceptance
390–1440 light. Pricing tiers coherent. URL paste hero present.

### Out of scope
Real OAuth, real checkout, changing app workspace screens.

---

## 5. Batch 3 — Onboarding, Business Brain, ICP

### Goal
Business model drives the rest. Dual tenants prove branching.

### Type contract (lock before screens)

```ts
type BusinessModel = "b2b" | "b2c" | "d2c" | "b2b2c" | "marketplace";

type Channel =
  | "email" | "linkedin" | "x" | "instagram" | "facebook"
  | "tiktok" | "youtube" | "reddit" | "whatsapp"
  | "google_ads" | "meta_ads";

type IcpCard = {
  id: string;
  name: string;
  who: string;              // firmographics OR demo/psycho by model
  pains: string[];
  hangouts: string[];       // places, not stages
  whyNow: string;
  reachableSize: string;
  confidence: number;
  sources: SourceRef[];
};

// Tenant.businessModel
// BusinessBrain: businessModel, modelFollowUps, goals, monthlyAdBudget?,
//   voiceSamples, soundsLike, claims/prohibited (existing), icps, selectedIcpIds
```

Expand `DraftKind` / `RecordState` as needed for Live / Scheduled / Failed (Batch 1 badges already named them).

### Onboarding `/onboarding`
Full-screen; left progress rail; one decision per screen; keyboard; back/skip:

1. **Website scan** — paste URL; honest “reading your site” checklist; editable summary card  
2. **Business model (required)** — B2B, B2C, D2C, B2B2C, Marketplace, + “Not sure, suggest one” with reason  
   - Follow-ups: B2B deal size / cycle / buyer; B2C/D2C price / frequency / where they sell; Marketplace which side to grow  
3. **Goals** — signups, demos, sales, waitlist; optional monthly ad budget slider  
4. **Voice** — 3 sample posts; “sounds like” field  
5. **Claims** — site-pulled; mark banned  
6. **ICP** — 2–3 cards side by side; pick 1–2; editable  
7. **Your Business Brain** review → `/app/brain` (editable + version history)

### Seeds
- **B2B tenant** (Ledgerline-like): email + LinkedIn-weighted  
- **D2C tenant**: Instagram / TikTok / Meta-weighted  
Store: `activeTenantId` + switcher hook (UI polish can finish in Batch 4)

### Acceptance
Onboard both models; brain edits persist in mock store; follow-ups change by model.

### Out of scope
Sprint calendar, ads launch UI (stubs OK).

---

## 6. Batch 4 — Channels, 3-week sprint, outreach, approvals

### Goal
Core product loop inside the app shell.

### Nav target
```text
Today
Approvals
Channels      NEW
Sprint        replaces Content as primary calendar
Outreach      B2B sequences OR D2C creator/partner
Brain
Report        polish in Batch 5
Ads           Batch 5
Loop          Batch 5
Settings
```

Redirect or retire: `/app/targets`, `/app/pipeline`, `/app/content`, `/app/health` — no dead nav links.

### Screens
1. **`/app/channels`** — ranked for ICP + model: mark, fit score, why + source, effort/week, expected outcome, connect / connected / needs reauth. Email includes sending domain, warmup, health.
2. **`/app/sprint`** — 21-day plan; week/month/list; dnd-kit reschedule; side sheet with platform-faithful preview; statuses Draft / Waiting approval / Scheduled / Posted / Failed; Day N of 21; autopilot toggle (approvals still required until trusted).
3. **`/app/outreach`** — B2B: prospects, sequence steps, daily cap, Needs human replies. D2C: creator/partner outreach.
4. **`/app/approvals`** — unified posts / emails / DMs / (ad stubs); filters; bulk approve; J/K, A, R+reason.

### New mock entities
`SprintPlan`, `SprintPost`, `OutreachSequence`, `ChannelConnection`, `ChannelRecommendation`

### Shell
Left nav update, Cmd-K command menu, tenant switcher visible.

### Acceptance
Switch B2B ↔ D2C: channel ranks + outreach UI change. Sprint drag + approve path works. Empty / loading / error on each route.

---

## 7. Batch 5 — Results, ads, next loop, settings, Today

### Goal
Close the loop: measure → ads → next sprint → ops.

| Route | Content |
|-------|---------|
| `/app` Today | Morning brief: overnight work, needs you, today’s posts, sprint progress |
| `/app/report` | KPI strip + deltas/sparklines; by channel; ranked best posts + why |
| `/app/ads` | From best posts after week 3; locked before day 21; Meta/LinkedIn/Google/TikTok; audience from ICP; budget/duration; cost-per-result **estimate** range; Approve & launch / Edit / Dismiss |
| `/app/loop` | Learnings + proposed next 3 weeks + start |
| `/app/settings` | Workspace, seats/roles, connectors, sending domain, billing meters (posts/sends/seats), invoices, notifications |

### Final QA
Every route at **1440 + 390**, **light + dark**, against `DESIGN.md`. End with **still-mocked inventory** (OAuth, ads spend, waitlist storage, etc.).

---

## 8. Cross-cutting engineering

### Data flow
```text
UI → useWorkspace() / lib/api facade → store.tsx → mock seeds
```
Keep `lib/api.ts` as the future swap point; do not call FastAPI yet.

### Packages (expected)
Already: motion, @dnd-kit/*, sonner, lucide-react  
Add: cmdk, Geist / Instrument Serif (or Newsreader)

### Decision locks
| Topic | Default in this plan |
|-------|----------------------|
| Brand accent | Ink-forward CTAs + one muted accent; retire loud `#2450e8` aurora |
| Login | Restored in Batch 2 marketing chrome |
| Pricing numbers | Consistent invented tiers until real limits provided |
| Nav kill | Targets / Pipeline / Content / Health fold into Channels / Sprint / Outreach / Report / Settings |
| Approvals | Required until autopilot trusted |

### Anti-goals
- No FastAPI work  
- No competing primary IAs (Pipeline + Sprint both live)  
- No Reddit/LinkedIn/Instagram as **pipeline stages**  
- No Batch 2 marketing promising Batch 4–5 screens that do not exist yet without mock UI fragments  
- No invented ROAS as fact  

---

## 9. Checkpoint discipline

| Batch | Checkpoint |
|-------|------------|
| 1 | `/design` signed off at 1440 + 390 |
| 2 | Landing + pricing at 390 + 1440 |
| 3 | Dual-tenant onboarding + brain |
| 4 | Sprint + channels + outreach + approvals |
| 5 | Full loop + light/dark QA + mocked inventory |

**User process:** paste Batch 1 prompt → verify → Batch 2 → …  

---

## 10. Immediate next action

**Batches 1–5 done** (2026-11-14):

| Batch | Status |
|-------|--------|
| 1 Design system + `/design` | Done |
| 2 Marketing + pricing + signup/login | Done |
| 3 Types, dual seeds, onboarding, Brain | Done |
| 4 Channels, Sprint, Outreach, Approvals, shell | Done |
| 5 Today, Report, Ads, Loop, Settings + `MOCKED.md` | Done |

Still-mocked inventory: `fe/MOCKED.md`.
