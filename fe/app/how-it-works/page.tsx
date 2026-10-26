import type { Metadata } from "next";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { HowItWorksView } from "@/components/marketing/how-it-works-view";

export const metadata: Metadata = {
  title: "How it works. NameLoop",
  description:
    "User story, end to end loop, and high-level architecture. Discovery, outreach, and content. You pick where it runs.",
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
