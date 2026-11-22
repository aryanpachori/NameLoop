import type { FaqItem } from "@/lib/home-copy";

type JsonLdObject = Record<string, unknown>;

export function JsonLd({ data }: { data: JsonLdObject | JsonLdObject[] }) {
  const payload = Array.isArray(data) ? data : [data];
  return (
    <>
      {payload.map((block) => {
        const key = String(block["@type"] ?? "schema");
        return (
          <script
            key={key}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
          />
        );
      })}
    </>
  );
}

export function faqPageJsonLd(items: FaqItem[], pageUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: {
        "@type": "Answer",
        text: a,
      },
    })),
    url: pageUrl,
  } satisfies JsonLdObject;
}

export type SoftwareOffer = {
  name: string;
  price: number | null;
  priceCurrency?: string;
  billingDuration?: string;
  url: string;
  description?: string;
};

export function softwareApplicationJsonLd(opts: {
  name: string;
  description: string;
  url: string;
  applicationCategory?: string;
  offers: SoftwareOffer[];
}) {
  const { name, description, url, applicationCategory = "BusinessApplication", offers } = opts;

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    url,
    applicationCategory,
    operatingSystem: "Web",
    offers: offers.map((offer) => {
      const base = {
        "@type": "Offer",
        name: offer.name,
        url: offer.url,
        ...(offer.description ? { description: offer.description } : {}),
      };
      if (offer.price === null) {
        return { ...base, priceSpecification: { "@type": "PriceSpecification", priceCurrency: "USD" } };
      }
      return {
        ...base,
        price: offer.price,
        priceCurrency: offer.priceCurrency ?? "USD",
        ...(offer.billingDuration
          ? { priceSpecification: { "@type": "UnitPriceSpecification", billingDuration: offer.billingDuration } }
          : {}),
      };
    }),
  } satisfies JsonLdObject;
}