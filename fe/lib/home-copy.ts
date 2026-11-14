/** Landing copy in one place. Casual, concrete, product-true. */

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
  channels: ("linkedin" | "email" | "reddit" | "x" | "meta_ads" | "google_ads")[];
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

export const homeMeta = {
  title: "NameLoop. Bring meetings in.",
  description:
    "Paste your product URL. Figure out who to sell to, grow inbound where they hang out, and pull meetings in. Nothing goes live until you say so.",
};

/** Short outcome headline (Ramp / Mercury / Sunset pattern). */
export const homeHero = {
  eyebrow: "Early access",
  line1: "Bring meetings in.",
  accentWords: ["meetings"],
  line2: "Without the spammy AI SDR.",
  body: "Paste your product URL. We sketch who might buy, where to grow organically, and what to post. You approve every draft. Outreach is optional.",
  micro: "About a minute to start.",
  pricingLink: "See pricing",
};

/** Thin proof strip — real product facts, no fake logo wall. */
export const homeTrust = [
  "Nothing goes live without you",
  "Inbound and organic first",
  "Meetings are the point",
] as const;

export const homeVs = {
  eyebrow: "Not another AI SDR",
  headline: "Most tools spray outbound. We build inbound.",
  support:
    "Sharp customer first. Show up where they already are. Book the meeting. Cold send when you want it, not by default.",
  rows: [
    {
      label: "AI SDRs",
      copy: "Inbox first, questions later. Volume over judgment.",
      tag: "Skip",
      accent: false,
    },
    {
      label: "Sequencers",
      copy: "Fine if you already have the list. They just run the cadence.",
      tag: "Skip",
      accent: false,
    },
    {
      label: "NameLoop",
      copy: "Who → where they hang out → posts that pull people in. You approve. Meetings show up.",
      tag: "This",
      accent: true,
    },
  ] satisfies VsRow[],
};

export const homeLoop = {
  eyebrow: "How it runs",
  headline: "Three moves. Each pass pulls harder.",
  chapters: [
    {
      n: "01",
      title: "Who",
      kicker: "Your customer",
      copy: "We read your site and sketch who might buy. Niche over vague. A real reason to talk now.",
      channels: ["linkedin", "email"],
      card: {
        eyebrow: "ICP · draft",
        title: "Finance leads at growing SaaS",
        detail: "Controllers · 40–400 people · hired this month",
        footerLeft: "82% fit",
        footerRight: "Waiting on you",
      },
    },
    {
      n: "02",
      title: "Where",
      kicker: "Inbound first",
      copy: "Organic and social ranked for that customer. Drafts wait in one inbox. Cold outbound is optional.",
      channels: ["linkedin", "x", "reddit", "email"],
      card: {
        eyebrow: "Ranked for you",
        title: "",
        detail: "",
        scores: [
          { id: "linkedin", score: 91 },
          { id: "reddit", score: 74 },
          { id: "email", score: 52 },
        ],
      },
    },
    {
      n: "03",
      title: "Meetings",
      kicker: "What worked",
      copy: "See what pulled people in. Keep that. Book the meetings. Boost winners when it feels real.",
      channels: ["linkedin", "meta_ads", "google_ads"],
      card: {
        eyebrow: "From a post",
        title: "Month-end close checklist",
        detail: "Top organic · LinkedIn → 3 meetings booked",
        bigNumber: "3 meets",
        footerRight: "You approve before anything boosts.",
      },
    },
  ] satisfies LoopChapter[],
};

export const homeFaq = {
  eyebrow: "FAQ",
  headline: "Quick answers.",
  support: "Still figuring it out? Start with a URL.",
  items: [
    {
      q: "Is this mostly cold outbound?",
      a: "Nope. Inbound first: organic social and content that bring people to you, then meetings. Outreach exists if you need it.",
    },
    {
      q: "How is this different from an AI SDR?",
      a: "Those tools optimize for sending a lot alone. We start with who and where, draft what you post, and nothing goes live until you say so.",
    },
    {
      q: "What does the AI actually do?",
      a: "Reads your site, proposes ICPs, ranks channels, drafts posts and outreach. You stay in the loop.",
    },
    {
      q: "Do I need a GTM plan first?",
      a: "Nope. Paste a URL and start. We ask the rest inside.",
    },
  ] satisfies FaqItem[],
};

export const homeClose = {
  eyebrow: "Early access",
  headline: "Paste a URL. Hop in.",
  support: "We sketch who, where, and what to say. You approve. Meetings are the goal.",
  primaryCta: "Get started",
  secondaryCta: "See pricing",
};

export const homeFooter = {
  blurb:
    "Inbound GTM that brings meetings in. Not another AI that cold-emails people without you.",
};
