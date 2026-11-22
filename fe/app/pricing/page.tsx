import type { Metadata } from "next";
import { PageFaqJsonLd } from "@/components/marketing/page-faq-json-ld";
import { PricingView } from "@/components/marketing/pricing-view";
import { pricingFaq } from "@/lib/pricing-copy";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { homeMeta } from "@/lib/home-copy";
import { marketingPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = marketingPageMetadata({
  path: "/pricing",
  title: homeMeta.pricingTitle,
  description: homeMeta.pricingDescription,
});

export default function PricingPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <PageFaqJsonLd items={pricingFaq} path="/pricing" />
      <SiteHeader />
      <PricingView />
      <SiteFooter />
    </div>
  );
}
