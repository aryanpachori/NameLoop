import { JsonLd, softwareApplicationJsonLd } from "@/components/marketing/json-ld";
import { homeMeta } from "@/lib/home-copy";
import { absoluteUrl, getSiteUrl } from "@/lib/site-url";

export function SiteJsonLd() {
  const base = getSiteUrl();

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: homeMeta.title,
    url: base,
    logo: absoluteUrl("/icon.png"),
    description: homeMeta.description,
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: homeMeta.title,
    url: base,
    description: homeMeta.description,
    publisher: {
      "@type": "Organization",
      name: homeMeta.title,
      url: base,
    },
  };

  const software = softwareApplicationJsonLd({
    name: homeMeta.title,
    description: homeMeta.description,
    url: base,
    offers: [
      {
        name: "Starter",
        price: 10,
        billingDuration: "P1M",
        url: absoluteUrl("/pricing"),
        description: "One product. Email + posts to prove the loop.",
      },
      {
        name: "Growth",
        price: 50,
        billingDuration: "P1M",
        url: absoluteUrl("/pricing"),
        description: "More sends, more posts, room for a small team.",
      },
      {
        name: "Enterprise",
        price: null,
        url: absoluteUrl("/pricing"),
        description: "Custom limits, seats, and dedicated setup.",
      },
    ],
  });

  return <JsonLd data={[organization, website, software]} />;
}