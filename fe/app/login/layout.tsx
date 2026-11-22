import type { Metadata } from "next";
import { homeMeta } from "@/lib/home-copy";
import { marketingPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = marketingPageMetadata({
  path: "/login",
  title: homeMeta.loginTitle,
  description: homeMeta.loginDescription,
});

export default function LoginLayout({ children }: LayoutProps<"/login">) {
  return children;
}