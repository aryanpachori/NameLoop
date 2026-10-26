import type { Metadata } from "next";
import { Inter, Inter_Tight, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const tight = Inter_Tight({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const mono = JetBrains_Mono({
  variable: "--font-code",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "NameLoop. Discovery, outreach, content",
  description:
    "Discovery, outreach, and content in one suite. You pick where it runs. 7 days free, then $10 a month.",
  openGraph: {
    title: "NameLoop. Discovery, outreach, content",
    description: "Discovery, outreach, and content in one suite. You pick where it runs.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "NameLoop. Discovery, outreach, content",
    description: "Discovery, outreach, and content in one suite. You pick where it runs.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${tight.variable} ${mono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className={`${inter.className} flex min-h-full flex-col`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
