import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Source_Serif_4 } from "next/font/google";
import { Providers } from "@/components/providers";
import { SiteJsonLd } from "@/components/marketing/site-json-ld";
import { homeMeta } from "@/lib/home-copy";
import { rootSiteMetadata } from "@/lib/page-metadata";
import "./globals.css";

/* Real medium/semibold cuts — Instrument Serif is 400-only and reads thin on dark. */
const display = Source_Serif_4({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const site = rootSiteMetadata();

export const metadata: Metadata = {
  metadataBase: site.metadataBase,
  title: {
    default: homeMeta.absoluteTitle,
    template: homeMeta.titleTemplate,
  },
  description: homeMeta.description,
  applicationName: homeMeta.title,
  alternates: {
    canonical: "/",
    types: {
      "text/plain": [{ url: "/llms.txt", title: "NameLoop for LLMs" }],
    },
  },
  icons: site.icons,
  openGraph: site.openGraph,
  twitter: site.twitter,
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "dark",
  themeColor: "#111110",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`dark ${GeistSans.variable} ${GeistMono.variable} ${display.variable} h-full`}
      suppressHydrationWarning
    >
      <body className={`${GeistSans.className} flex min-h-full flex-col antialiased`}>
        <SiteJsonLd />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
