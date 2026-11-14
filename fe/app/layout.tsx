import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Instrument_Serif } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const instrument = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "NameLoop. AI go-to-market that compounds",
  description:
    "AI that finds who to sell to, where they are, and what to do next. Paste your URL and get started — we ask the rest inside.",
  openGraph: {
    title: "NameLoop. AI go-to-market that compounds",
    description: "Know who to sell to. AI finds them. You approve.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "NameLoop. AI go-to-market that compounds",
    description: "Know who to sell to. AI finds them. You approve.",
  },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf9" },
    { media: "(prefers-color-scheme: dark)", color: "#111110" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} ${instrument.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className={`${GeistSans.className} flex min-h-full flex-col`}>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
