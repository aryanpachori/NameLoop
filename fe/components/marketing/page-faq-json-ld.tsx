import { JsonLd, faqPageJsonLd } from "@/components/marketing/json-ld";
import type { FaqItem } from "@/lib/home-copy";
import { absoluteUrl } from "@/lib/site-url";

type PageFaqJsonLdProps = {
  items: FaqItem[];
  /** Site path, e.g. `/` or `/pricing` */
  path: string;
};

export function PageFaqJsonLd({ items, path }: PageFaqJsonLdProps) {
  return <JsonLd data={faqPageJsonLd(items, absoluteUrl(path))} />;
}