import type { Metadata } from "next";
import { PricingView } from "@/components/marketing/pricing-view";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { homeMeta } from "@/lib/home-copy";

export const metadata: Metadata = {
  title: homeMeta.pricingTitle,
  description: homeMeta.pricingDescription,
  openGraph: {
    title: `${homeMeta.pricingTitle} · NameLoop`,
    description: homeMeta.pricingDescription,
  },
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
