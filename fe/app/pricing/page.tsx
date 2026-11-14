import type { Metadata } from "next";
import { PricingView } from "@/components/marketing/pricing-view";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";

export const metadata: Metadata = {
  title: "Pricing. NameLoop",
  description:
    "Starter, Growth and Scale. Limits by channels, posts, outreach sends and seats. Ad spend is billed by the ad platform.",
};

export default function PricingPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <PricingView />
      <SiteFooter />
    </div>
  );
}
