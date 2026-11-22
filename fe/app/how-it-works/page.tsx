import type { Metadata } from "next";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { HowItWorksView } from "@/components/marketing/how-it-works-view";
import { homeMeta } from "@/lib/home-copy";

export const metadata: Metadata = {
  title: homeMeta.howTitle,
  description: homeMeta.howDescription,
  openGraph: {
    title: `${homeMeta.howTitle} · NameLoop`,
    description: homeMeta.howDescription,
  },
};

export default function HowItWorksPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <SiteHeader />
      <HowItWorksView />
      <SiteFooter />
    </div>
  );
}
