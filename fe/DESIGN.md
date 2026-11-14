# NameLoop design system

Batch 1 foundation. Editorial product UI. Calm, dense where it matters. Not an AI template.

## Principles

1. **Ink on paper.** Dark is the product and marketing default. Light remains available in-app.
2. **One accent.** Used for focus, active nav, and rare emphasis. Never gradients, orbs, or glow.
3. **Hairlines over shadows.** 1px borders. Elevation is rare and quiet.
4. **Type does the work.** Geist for UI. Instrument Serif for marketing headlines and big numbers.
5. **States are semantic.** Color means status, not decoration.
6. **Channels are marks.** Monochrome glyphs. No colorful brand kits in product chrome.

## Kill list

- Purple / blue aurora washes, glowing orbs, sparkle icons
- “AI-powered” badges
- Centered hero + three feature cards as the default composition
- Emoji in UI
- Bouncy springs, long blur reveals, decorative motion
- Rainbow channel logos in tables and nav

## Type

| Token | Size | Line | Tracking | Use |
|-------|------|------|----------|-----|
| `text-12` | 12 | 16 | 0 | Meta, captions |
| `text-13` | 13 | 18 | 0 | Secondary UI, table cells |
| `text-14` | 14 | 20 | 0 | Body UI default |
| `text-16` | 16 | 24 | 0 | Comfortable body / marketing |
| `text-20` | 20 | 28 | -0.01em | Section titles |
| `text-28` | 28 | 34 | -0.02em | Page titles |
| `text-40` | 40 | 44 | -0.03em | Marketing H2 / big stats |
| `text-64` | 64 | 68 | -0.04em | Marketing H1 |

- **Geist Sans** — product UI and marketing body
- **Geist Mono** — numbers, IDs, timestamps, caps, sparkline labels
- **Instrument Serif** — marketing H1/H2 and large display numbers (italic for accent)

## Color

### Neutrals (light)
Paper `#FAFAF9`, raised `#FFFFFF`, ink `#111110`, muted `#63635E`, border `#E8E8E3`, wash `#F3F3EE`

### Neutrals (dark)
Paper `#111110`, raised `#1C1C1A`, ink `#F5F5F0`, muted `#A1A19A`, border `#2A2A26`, wash `#181816`

### Brand
Accent `#1A5CFF` — sparingly. Primary buttons stay near-ink (`#171714` / inverse on dark).

### Semantic states
| State | Light bg / fg |
|-------|----------------|
| AI working | wash / ink |
| Waiting approval | accent soft / accent |
| Needs human | `#FEECEC` / `#B42318` |
| Human-owned | ink / paper |
| Paused | wash / muted |
| Live | `#EAF6EE` / `#0F7B3A` |
| Scheduled | wash / ink |
| Failed | `#FEECEC` / `#B42318` |

## Spacing and shape

- 4px grid. Common: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64
- Radius: **8** (controls), **12** (cards, sheets)
- Border: 1px `border`
- Motion: **150–200ms**, `cubic-bezier(0.2, 0, 0, 1)`. No bounce. Respect `prefers-reduced-motion`.

## Channel marks

Monochrome 16×16 glyphs in `components/channel-mark.tsx`: Email, LinkedIn, X, Instagram, Facebook, TikTok, YouTube, Reddit, WhatsApp, Google Ads, Meta Ads. Current color inherits. Never use official multicolor logos in product chrome.

## Components

Button, Input, Select, Segmented control, Tag/Badge, State pill, Owner badge (AI / Human), Channel chip, Stat (value + delta + sparkline), Empty state, Skeleton, Toast (sonner), Command menu (cmdk), Side sheet, Data table with sticky header.

Living catalog: **`/design`**.

## Pattern provenance (patterns only, not clones)

| Pattern class | Reference class | Used for |
|---------------|-----------------|----------|
| Dense CRM record rows + sticky table header | Attio / Linear issue tables (Mobbin-class CRM) | Data table, channel list |
| Editorial marketing type + paper | Vercel / Linear marketing | Type scale, hairline sections |
| Content calendar cards in a grid | Notion calendar / Buffer-class calendars | Future sprint cards (Batch 4) |
| Focused onboarding rail | Arc / Stripe onboarding flows | Future onboarding (Batch 3) |
| KPI strip + sparkline | Analytics dashboards (Mobbin) | Stat component |
| Command palette | Raycast / Linear Cmd-K | Command menu |

No single Dribbble shot is cloned. These are interaction and density references only.

## Marketing shell

- Width: `marketing-shell` → `max-w-6xl` (72rem), centered, `px-4` / `sm:px-6`
- Vertical rhythm: `section-pad` → `py-20` / `lg:py-24`
- Eyebrows: mono 12 / 0.16em uppercase, muted
- Hero: copy left, WebGL right (desktop only) — never overlay icons on headline
- Equal columns for comparison strips and loop chapters

## Review

Open `/` and `/design` at 1440px and 390px in **dark** (default) and light before shipping.
