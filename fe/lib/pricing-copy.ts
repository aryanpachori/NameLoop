import type { FaqItem } from "@/lib/home-copy";

/** Pricing FAQ — shared by UI and FAQPage JSON-LD. Lead with a direct first sentence for snippets. */
export const pricingFaq: FaqItem[] = [
  {
    q: "Is ad spend included?",
    a: "No — NameLoop does not include Meta or Google ad spend in your plan. Those platforms bill you directly; we only suggest what to boost, with a rough budget, and nothing runs until you approve it.",
  },
  {
    q: "Do I get outreach and content?",
    a: "Yes — every paid plan includes both outreach email and scheduled posts. Your email limit covers outbound; your post limit covers the content calendar, driven by the same customer profile.",
  },
  {
    q: "Can I change plan or cancel?",
    a: "Yes — you can change your NameLoop plan or cancel on monthly billing anytime. Annual billing saves about 20% on Starter and Growth if you prefer to commit for the year.",
  },
  {
    q: "Is checkout live?",
    a: "Not yet — NameLoop checkout is invite-only while we onboard founders carefully. Join the waitlist or sign in if you already have access; we will email you when your spot opens.",
  },
];