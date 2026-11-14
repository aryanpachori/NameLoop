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
  title: homeMeta.title,
  description: homeMeta.description,
  openGraph: {
    title: homeMeta.title,
    description: homeMeta.description,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: homeMeta.title,
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
