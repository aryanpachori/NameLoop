import type { Metadata } from "next";
import { homeMeta } from "@/lib/home-copy";
import { absoluteUrl, getSiteUrl } from "@/lib/site-url";

const ogImage = {
  url: "/apple-icon.png",
  width: 180,
  height: 180,
  alt: "NameLoop",
} as const;

type MarketingPageMetadataInput = {
  /** Site path for canonical + openGraph.url, e.g. `/pricing`. Use `/` for home. */
  path: string;
  /** Page title (uses root template) or absolute title string. */
  title: string | { absolute: string };
  description: string;
  /** Defaults to title when string, or absolute title when object. */
  openGraphTitle?: string;
  twitterTitle?: string;
};

export function marketingPageMetadata(input: MarketingPageMetadataInput): Metadata {
  const canonical = absoluteUrl(input.path);
  const resolvedOgTitle =
    input.openGraphTitle ??
    (typeof input.title === "string" ? `${input.title} · ${homeMeta.title}` : input.title.absolute);
  const resolvedTwitterTitle =
    input.twitterTitle ?? resolvedOgTitle;

  return {
    title: input.title,
    description: input.description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: resolvedOgTitle,
      description: input.description,
      url: canonical,
      type: "website",
      locale: "en_US",
      siteName: homeMeta.title,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTwitterTitle,
      description: input.description,
      images: [ogImage.url],
    },
  };
}

export function rootSiteMetadata(): Pick<
  Metadata,
  "metadataBase" | "openGraph" | "twitter" | "icons"
> & { metadataBase: URL } {
  return {
    metadataBase: new URL(getSiteUrl()),
    icons: {
      icon: [
        { url: "/icon.svg", type: "image/svg+xml" },
        { url: "/icon.png", sizes: "512x512", type: "image/png" },
        { url: "/favicon.ico", sizes: "any" },
      ],
      apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
      shortcut: ["/favicon.ico"],
    },
    openGraph: {
      title: homeMeta.absoluteTitle,
      description: homeMeta.description,
      siteName: homeMeta.title,
      type: "website",
      locale: "en_US",
      url: absoluteUrl("/"),
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: homeMeta.absoluteTitle,
      description: homeMeta.description,
      images: [ogImage.url],
    },
  };
}
