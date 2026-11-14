import type { Metadata } from "next";
import { PricingView } from "@/components/marketing/pricing-view";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";

export const metadata: Metadata = {
  title: "Pricing. NameLoop",
  description:
    "Simple plans for inbound GTM. Channels, posts, and seats. Ad spend stays on the platforms you already use.",
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
