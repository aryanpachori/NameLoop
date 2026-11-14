"use client";

import dynamic from "next/dynamic";

const HeroGridWebgl = dynamic(
  () => import("@/components/marketing/hero-grid-webgl").then((m) => m.HeroGridWebgl),
  { ssr: false, loading: () => null }
);

/** Client-only WebGL field so the landing JS stays light until needed. */
export function HeroField({ className }: { className?: string }) {
  return <HeroGridWebgl className={className} />;
}
