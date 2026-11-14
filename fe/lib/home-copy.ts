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
  title: "NameLoop. GTM that gets smarter each cycle",
  description:
    "Paste your product URL. We help figure out who to sell to, where they hang out, and what to say. Nothing sends until you approve.",
};

export const homeHero = {
  eyebrow: "GTM help · not another spammy AI SDR",
  line1: "Stop guessing who to sell to.",
  accentWords: ["who"],
  line2: "We find them. You approve every send.",
  body: "Drop your product URL. We sketch who might buy, where to show up, and what to say. Then we wait. You fill in the rest once you're inside.",
  micro: "Early access · takes about a minute.",
  pricingLink: "See pricing",
};

export const homeVs = {
  eyebrow: "Why this isn't another AI SDR",
  headline: "Most tools just send more. We start earlier.",
  support:
    "Figure out who's worth talking to, where they actually are, and what to say. You stay in the loop until you trust it.",
  rows: [
    {
      label: "AI SDRs",
      copy: "They blast the inbox first and ask questions later. Volume over judgment.",
      tag: "Skip",
      accent: false,
    },
    {
      label: "Sequencers",
      copy: "Fine if you already have the list and the channel. They just run the cadence.",
      tag: "Skip",
      accent: false,
    },
    {
      label: "NameLoop",
      copy: "We find who and where. You approve every draft. What works feeds the next round.",
      tag: "This",
      accent: true,
    },
  ] satisfies VsRow[],
};

export const homeLoop = {
  eyebrow: "How it runs",
  headline: "Three moves. Each pass gets a little sharper.",
  chapters: [
    {
      n: "01",
      title: "Who",
      kicker: "Your customer",
      copy: "We read your site and sketch who might buy. Real traits, real pains, a reason to talk now. Not a vague persona slide.",
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
      kicker: "Channels",
      copy: "Places ranked for that customer and how you sell. Drafts land in one inbox. Nothing posts until you say go.",
      channels: ["email", "linkedin", "reddit", "x"],
      card: {
        eyebrow: "Ranked for you",
        title: "",
        detail: "",
        scores: [
          { id: "email", score: 88 },
          { id: "linkedin", score: 81 },
          { id: "reddit", score: 46 },
        ],
      },
    },
    {
      n: "03",
      title: "What worked",
      kicker: "Next cycle",
      copy: "Replies and posts tell you what stuck. Keep doing that. Put a little budget behind winners when it feels real.",
      channels: ["linkedin", "meta_ads", "google_ads"],
      card: {
        eyebrow: "Boost · estimate",
        title: "Month-end close checklist",
        detail: "Top organic · LinkedIn",
        bigNumber: "$420–680",
        footerRight: "You approve before it runs.",
      },
    },
  ] satisfies LoopChapter[],
};

export const homeFaq = {
  eyebrow: "FAQ",
  headline: "Quick answers.",
  support: "Still figuring it out? Start with a URL. We'll ask what we need after you're in.",
  items: [
    {
      q: "How is this different from an AI SDR?",
      a: "Those tools optimize for sending a lot, on their own. We start earlier: who's worth selling to, which channels fit, and drafts you approve. Autopilot is optional, after you trust a channel.",
    },
    {
      q: "What does the AI actually do?",
      a: "It reads your site, proposes ICPs, ranks channels, and drafts posts and outreach. Nothing sends until you say so.",
    },
    {
      q: "Do I need a finished GTM plan first?",
      a: "Nope. Paste a URL and start. Business model and the rest get asked inside the product.",
    },
    {
      q: "Is this only for B2B?",
      a: "Nope. B2B, B2C, D2C, marketplace. The ICP and channels shift with the model you pick.",
    },
  ] satisfies FaqItem[],
};

export const homeClose = {
  eyebrow: "Early access",
  headline: "Paste a URL and hop in. We'll ask the rest inside.",
  support: "We draft who to sell to and where to show up. You approve every send until you trust the channel.",
  primaryCta: "Get started",
  secondaryCta: "See pricing",
};

export const homeFooter = {
  blurb:
    "Help figuring out who to sell to, where they are, and what to do next. Not another AI that emails people without you.",
};
