import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Source_Serif_4 } from "next/font/google";
import { Providers } from "@/components/providers";
import { homeMeta } from "@/lib/home-copy";
import "./globals.css";

/* Real medium/semibold cuts — Instrument Serif is 400-only and reads thin on dark. */
const display = Source_Serif_4({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: homeMeta.absoluteTitle,
    template: homeMeta.titleTemplate,
  },
  description: homeMeta.description,
  applicationName: homeMeta.title,
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: homeMeta.absoluteTitle,
    description: homeMeta.description,
    siteName: homeMeta.title,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: homeMeta.absoluteTitle,
    description: homeMeta.description,
  },
};

export const viewport: Viewport = {
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
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
