/** Landing copy in one place. Talk like a person. No brochure voice. */

export type FaqItem = { q: string; a: string };

export type VsRow = {
  label: string;
  copy: string;
  tag: string;
  accent: boolean;
};

export type LoopChapter = {
  n: string;
  title: string;
  kicker: string;
  copy: string;
  channels: ("linkedin" | "email" | "reddit" | "x" | "meta_ads" | "google_ads" | "instagram" | "tiktok")[];
  card: {
    eyebrow: string;
    title: string;
    detail: string;
    footerLeft?: string;
    footerRight?: string;
    scores?: { id: "email" | "linkedin" | "reddit"; score: number }[];
    bigNumber?: string;
  };
};

export type EngineCard = {
  id: string;
  eyebrow: string;
  title: string;
  copy: string;
  beats: string[];
};

export const homeMeta = {
  title: "NameLoop",
  titleTemplate: "%s · NameLoop",
  absoluteTitle: "NameLoop — Founder GTM growth loop",
  description:
    "Grow your product. Outbound that books. Inbound that compounds. The growth loop founders run — without a GTM team.",
  pricingTitle: "Pricing",
  pricingDescription:
    "NameLoop pricing for founders: pay for channels, outreach emails, social posts, and seats. Meta and Google ads bill in their consoles.",
  howTitle: "How it works",
  howDescription:
    "How NameLoop works: paste your URL, choose who you sell to, approve outreach and posts, then see what booked meetings and what to run next week.",
  loginTitle: "Sign in",
  loginDescription:
    "Sign in to NameLoop with Google or a magic link. Run outbound that books and inbound that compounds — without a GTM team.",
};

export const homeHero = {
  eyebrow: "Early access · for founders",
  line1: "Grow your product.",
  accentWords: ["product."],
  line2: "Outbound that books. Inbound that compounds.",
  body: "The growth loop founders run — without a GTM team. Paste your URL. We sketch who might buy, draft the outreach and the posts, and put daily limits on sends so you don't torch your domain. You approve what goes out. When someone replies, that's your job — we don't fake it.",
  micro: "Takes about a minute.",
  pricingLink: "Pricing",
};

export const homeTrust = [
  "Outbound that books meetings",
  "Inbound that keeps working",
  "No GTM team required",
] as const;

export const homeEngines = {
  eyebrow: "The growth loop",
  headline: "Outbound that books. Inbound that compounds.",
  support:
    "Cold email tools only send. Social tools only post. Founders need both — aimed at the same people — without hiring a GTM team to stitch it together.",
  cards: [
    {
      id: "outbound",
      eyebrow: "Outreach",
      title: "Find people. Email them carefully.",
      copy: "We pull leads that fit, skip bad emails, and send a short sequence (first note + follow-ups). Daily caps. Bounce gets loud. If they reply, we stop and hand it to you.",
      beats: [
        "Board of who's ready, sent, or replied",
        "Gmail and Resend, with limits you set",
        "Pause if bounce looks ugly",
      ],
    },
    {
      id: "inbound",
      eyebrow: "Content",
      title: "Show up where they already are.",
      copy: "Drafts for LinkedIn, X, Instagram, and the rest — on a calendar. We also dig for angles that are working in your niche. You approve before anything posts. Winners get reused next week.",
      beats: [
        "One calendar across channels",
        "Ideas pulled from what's moving",
        "Next week starts from what worked",
      ],
    },
  ] satisfies EngineCard[],
};

export const homeVs = {
  eyebrow: "Honest compare",
  headline: "Built for founders — not for replacing a sales floor.",
  support:
    "AI SDRs spray. Schedulers only post. NameLoop is the growth loop: outbound that books, inbound that compounds — you keep the brakes.",
  rows: [
    {
      label: "AI SDRs",
      copy: "They optimize for volume. Reputation and weird replies become your problem.",
      tag: "Skip",
      accent: false,
    },
    {
      label: "Schedulers",
      copy: "Great at posting. Silent on who to email or what to do after a quiet week.",
      tag: "Skip",
      accent: false,
    },
    {
      label: "NameLoop",
      copy: "Outbound that books. Inbound that compounds. No GTM team required.",
      tag: "Us",
      accent: true,
    },
  ] satisfies VsRow[],
};

export const homeLoop = {
  eyebrow: "How founders run it",
  headline: "Three steps. Then next week starts smarter.",
  support: "Same buyer for email and posts. Nothing ships until you say so.",
  chapters: [
    {
      n: "01",
      title: "Who",
      kicker: "From your site",
      copy: "We read the site and guess who might buy — what hurts, where they hang out, why they'd care now. You pick one or two. Everything else aims at that.",
      channels: ["linkedin", "email"],
      card: {
        eyebrow: "Customer guess",
        title: "Finance ops at B2B SaaS",
        detail: "40–400 people · still closing in Sheets · hire or board week",
        footerLeft: "From your URL",
        footerRight: "You edit it",
      },
    },
    {
      n: "02",
      title: "Do the work",
      kicker: "Email + posts",
      copy: "Leads get checked, then emailed in slots so you don't blast all day. Posts sit on a calendar for the channels those people use. Approvals first. Always.",
      channels: ["email", "linkedin", "instagram", "x"],
      card: {
        eyebrow: "This week",
        title: "47 emails · 9 posts waiting",
        detail: "Gmail + Resend · LinkedIn and X queued",
        bigNumber: "Today",
        footerRight: "One morning brief",
      },
    },
    {
      n: "03",
      title: "Check the tape",
      kicker: "Then adjust",
      copy: "See what got replies, saves, meetings. Drop the junk. Keep the angles that worked. Next week's drafts start there — not from a blank page.",
      channels: ["linkedin", "meta_ads", "google_ads"],
      card: {
        eyebrow: "What worked",
        title: "Hiring emails beat generic pain",
        detail: "Do more of that. Kill the soft close note. Boost the top post if you want.",
        footerLeft: "Your call",
        footerRight: "Accept or edit",
      },
    },
  ] satisfies LoopChapter[],
};

export const homeFaq = {
  eyebrow: "Questions",
  headline: "Ask these first.",
  support: "Still fuzzy? Paste a URL — we ask the rest inside.",
  items: [
    {
      q: "How does this help my product grow?",
      a: "NameLoop helps your product grow by pairing capped email outreach with a content calendar so you reach the right buyers and show up where they already scroll. You keep what gets replies and meetings, and drop angles that do not — growth is measured in real conversations, not emails sent.",
    },
    {
      q: "Do I have to do outreach and content?",
      a: "No — you can lean on outreach, content, or both depending on what you need this month. Most founders use email for near-term conversations and posts so inbound compounds instead of restarting from a blank page every Monday.",
    },
    {
      q: "What do you do vs what do I do?",
      a: "NameLoop finds leads, drafts outreach and posts, schedules sends, and flags deliverability issues — you choose the customer, set limits, approve every draft, and reply when a human answers. Pause, caps, and kill switches stay in your hands at all times.",
    },
    {
      q: "Will you spam people or reply for me?",
      a: "No — NameLoop will not blast past your caps or reply as you in the inbox. When someone responds, we stop that lead and surface it in Needs you so you answer personally; we never pretend to be you.",
    },
  ] satisfies FaqItem[],
};

export const homeClose = {
  eyebrow: "Early access",
  headline: "Grow your product.",
  support:
    "Outbound that books. Inbound that compounds. Paste your URL — we'll sketch who to sell to, wire outreach and a content calendar, and show you the board. Limits, approvals, and replies stay with you.",
  primaryCta: "Get started",
  secondaryCta: "How it works",
};

export const homeFooter = {
  blurb:
    "The growth loop founders run — without a GTM team. Outbound that books. Inbound that compounds.",
};

/** Declarative entity facts for humans and GEO crawlers — plain sentences, no vanity metrics. */
export const homeEntityFacts = {
  eyebrow: "What NameLoop is",
  headline: "The growth loop, in plain terms.",
  facts: [
    "NameLoop is a founder growth platform that combines outbound email and inbound social content in one weekly loop.",
    "NameLoop helps founders book conversations through careful email outreach and stay visible through scheduled posts — without hiring a GTM team.",
    "NameLoop is for solo founders and small teams selling B2B, B2C, D2C, marketplace, or B2B2C products who want both outbound and inbound working toward the same buyer.",
    "NameLoop finds leads that fit, drafts email sequences with daily send caps, flags bounces, and stops outreach when someone replies.",
    "NameLoop drafts social posts for channels such as LinkedIn, X, and Instagram on a calendar; nothing sends or posts until the founder approves.",
    "NameLoop connects to Gmail and Resend for email. Paid ads on Meta and Google are billed by those platforms; NameLoop suggests boosts and budgets for founder approval.",
    "NameLoop is available at https://nameloop.vercel.app with Starter at $10/month, Growth at $50/month, and Enterprise on custom terms.",
  ],
} as const;
