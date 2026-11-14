import type { BusinessModel, IcpCard, ModelFollowUps } from "@/lib/types";

export const MODEL_OPTIONS: { id: BusinessModel; label: string; blurb: string }[] = [
  { id: "b2b", label: "B2B", blurb: "You sell to companies. A buyer title signs off." },
  { id: "b2c", label: "B2C", blurb: "You sell to individuals, usually a service or app." },
  { id: "d2c", label: "D2C", blurb: "You sell physical products straight to shoppers." },
  { id: "b2b2c", label: "B2B2C", blurb: "You sell through partners to their customers." },
  { id: "marketplace", label: "Marketplace", blurb: "You connect a supply side with a demand side." },
];

export const GOAL_OPTIONS = [
  { id: "signups", label: "Signups" },
  { id: "demos", label: "Demos booked" },
  { id: "sales", label: "Sales" },
  { id: "waitlist", label: "Waitlist" },
];

export type FollowUpField = {
  key: Exclude<keyof ModelFollowUps, "marketplaceSide">;
  label: string;
  placeholder: string;
};

const dealSize: FollowUpField = { key: "dealSize", label: "Typical deal size", placeholder: "$8–25k ACV" };
const salesCycle: FollowUpField = { key: "salesCycle", label: "Sales cycle", placeholder: "45–90 days" };
const buyerTitle: FollowUpField = { key: "buyerTitle", label: "Buyer title", placeholder: "Controller / VP Finance" };
const pricePoint: FollowUpField = { key: "pricePoint", label: "Price point", placeholder: "$28–64 average order" };
const purchaseFrequency: FollowUpField = {
  key: "purchaseFrequency",
  label: "How often they buy",
  placeholder: "Once, then a refill every 3 months",
};
const sellWhere: FollowUpField = { key: "sellWhere", label: "Where you sell", placeholder: "Own site, Amazon, retail" };

export const FOLLOWUP_FIELDS: Record<BusinessModel, FollowUpField[]> = {
  b2b: [dealSize, salesCycle, buyerTitle],
  b2c: [pricePoint, purchaseFrequency, sellWhere],
  d2c: [pricePoint, purchaseFrequency, sellWhere],
  b2b2c: [
    { ...dealSize, label: "Partner contract size" },
    { ...buyerTitle, label: "Partner decision maker" },
    { ...pricePoint, label: "End-customer price" },
  ],
  marketplace: [
    { ...sellWhere, label: "Where transactions happen", placeholder: "In app, with escrow" },
    { ...pricePoint, label: "Typical transaction value", placeholder: "$120 per booking" },
  ],
};

export const SIDE_OPTIONS: { value: NonNullable<ModelFollowUps["marketplaceSide"]>; label: string }[] = [
  { value: "supply", label: "Supply" },
  { value: "demand", label: "Demand" },
  { value: "both", label: "Both" },
];

/** Mock heuristic for "Not sure, suggest one". Real version would use the scan. */
export function suggestModel(
  text: string,
  fallback: BusinessModel
): { model: BusinessModel; reason: string } {
  const t = text.toLowerCase();
  if (/(marketplace|sellers|hosts|listings|two-sided)/.test(t)) {
    return {
      model: "marketplace",
      reason: "Your site talks about two sides transacting. Growth depends on which side is thin.",
    };
  }
  if (/(ship|shop|store|collection|order|brand|checkout|cart|desk|wear)/.test(t)) {
    return {
      model: "d2c",
      reason: "Your site sells products to shoppers directly, so visual channels and creators usually win.",
    };
  }
  if (/(team|finance|invoice|enterprise|saas|platform|ops|compliance|api|workflow)/.test(t)) {
    return {
      model: "b2b",
      reason: "Your offer is pitched at teams and job titles, so email and LinkedIn are the likely core.",
    };
  }
  return {
    model: fallback,
    reason: "Not enough signal on the page. This is the closest match to your workspace today.",
  };
}

const src = (field: string) => [{ label: "Model template", field }];

const TEMPLATES: Record<BusinessModel, IcpCard[]> = {
  b2b: [
    {
      id: "tpl-b2b-1",
      name: "Operations lead",
      who: "Ops or finance leads at 50–500 person companies replacing a spreadsheet process",
      pains: ["Manual work every month", "No owner for the process"],
      hangouts: ["LinkedIn", "Email", "Slack communities"],
      whyNow: "Headcount freeze, same workload",
      reachableSize: "~6k accounts",
      confidence: 0.78,
      sources: src("icp"),
    },
    {
      id: "tpl-b2b-2",
      name: "Founder-led team",
      who: "Founders at Series A companies who still approve this work themselves",
      pains: ["Founder is the bottleneck", "Tool sprawl"],
      hangouts: ["X", "LinkedIn", "Email"],
      whyNow: "Hiring their first specialist",
      reachableSize: "~3k accounts",
      confidence: 0.66,
      sources: src("icp"),
    },
  ],
  b2c: [
    {
      id: "tpl-b2c-1",
      name: "Habit builders",
      who: "25–40 year olds trying to fix one daily routine with an app",
      pains: ["Drop off after week two", "Too many apps"],
      hangouts: ["Instagram", "YouTube", "Reddit"],
      whyNow: "New year and new quarter resets",
      reachableSize: "~2M reachable",
      confidence: 0.7,
      sources: src("icp"),
    },
    {
      id: "tpl-b2c-2",
      name: "Switchers",
      who: "People on a competing app who complain about price or limits",
      pains: ["Price hikes", "Missing features"],
      hangouts: ["Reddit", "X", "TikTok"],
      whyNow: "Competitor changed pricing",
      reachableSize: "~400k reachable",
      confidence: 0.62,
      sources: src("icp"),
    },
  ],
  d2c: [
    {
      id: "tpl-d2c-1",
      name: "Aesthetic-first shoppers",
      who: "22–34 year olds who buy for how it looks on camera",
      pains: ["Generic products", "Slow shipping"],
      hangouts: ["Instagram", "TikTok", "Pinterest"],
      whyNow: "Seasonal refresh and gifting",
      reachableSize: "~900k reachable",
      confidence: 0.8,
      sources: src("icp"),
    },
    {
      id: "tpl-d2c-2",
      name: "Creator-adjacent buyers",
      who: "Hobbyists and small creators who copy what bigger creators use",
      pains: ["Hard to pick gear", "Distrust ads"],
      hangouts: ["YouTube", "TikTok", "Reddit"],
      whyNow: "Setup tours trending",
      reachableSize: "~250k reachable",
      confidence: 0.69,
      sources: src("icp"),
    },
  ],
  b2b2c: [
    {
      id: "tpl-bbc-1",
      name: "Partner product owner",
      who: "Product or partnerships leads at platforms that want to embed your offer",
      pains: ["Build vs buy", "Customer churn on their side"],
      hangouts: ["LinkedIn", "Email"],
      whyNow: "Their roadmap lacks this feature",
      reachableSize: "~1.2k partners",
      confidence: 0.68,
      sources: src("icp"),
    },
    {
      id: "tpl-bbc-2",
      name: "End customers of partners",
      who: "The people already using a partner product who would use yours",
      pains: ["Switching cost", "No trust in new brands"],
      hangouts: ["Instagram", "Email", "Partner communities"],
      whyNow: "Partner launch window",
      reachableSize: "~150k reachable",
      confidence: 0.6,
      sources: src("icp"),
    },
  ],
  marketplace: [
    {
      id: "tpl-mkt-1",
      name: "Thin side: supply",
      who: "Independent providers with spare capacity and no distribution",
      pains: ["Empty calendar", "Platform fees elsewhere"],
      hangouts: ["Instagram", "Facebook groups", "WhatsApp"],
      whyNow: "Seasonal demand spike coming",
      reachableSize: "~40k providers",
      confidence: 0.74,
      sources: src("icp"),
    },
    {
      id: "tpl-mkt-2",
      name: "Demand: repeat buyers",
      who: "Buyers who already pay for this off-platform and would switch for trust",
      pains: ["Hard to compare", "Fear of scams"],
      hangouts: ["Reddit", "TikTok", "Google search"],
      whyNow: "Supply is live in their city",
      reachableSize: "~500k reachable",
      confidence: 0.65,
      sources: src("icp"),
    },
  ],
};

export function icpTemplates(model: BusinessModel): IcpCard[] {
  return TEMPLATES[model].map((card) => ({ ...card, pains: [...card.pains], hangouts: [...card.hangouts] }));
}
