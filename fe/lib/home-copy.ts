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
  absoluteTitle: "NameLoop",
  description:
    "Grow your product. Outbound that books. Inbound that compounds. The growth loop founders run — without a GTM team.",
  pricingTitle: "Pricing",
  pricingDescription:
    "Pay for channels, emails, posts, and seats. Ads stay on Meta and Google.",
  howTitle: "How it works",
  howDescription:
    "The growth loop founders run — without a GTM team. Paste a URL, pick who you're selling to, send outreach, schedule posts, check what worked.",
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
      a: "You talk to the right people (email), show up where they already scroll (posts), and stop doing what didn't work. The score is meetings and real interest — not how many emails left the building.",
    },
    {
      q: "Do I have to do outreach and content?",
      a: "No. Lean on whichever you need. Most founders end up wanting both: email for conversations this month, posts so you're not starting from zero every Monday.",
    },
    {
      q: "What do you do vs what do I do?",
      a: "We find leads, draft, schedule, and flag problems. You pick the customer, set limits, approve drafts, and answer humans. Pause and kill switch are always yours.",
    },
    {
      q: "Will you spam people or reply for me?",
      a: "No. Caps are yours. If someone replies, we stop that lead and put it in Needs you. We don't pretend to be you in the inbox.",
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
