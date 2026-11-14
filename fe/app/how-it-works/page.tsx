import type { Metadata } from "next";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { HowItWorksView } from "@/components/marketing/how-it-works-view";

export const metadata: Metadata = {
  title: "How it works. NameLoop",
  description:
    "Pick your business model, then run the GTM loop: understand, ICP, channels, run the plan, measure, and amplify winners.",
};

export default function HowItWorksPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <HowItWorksView />
      <SiteFooter />
    </div>
  );
}
