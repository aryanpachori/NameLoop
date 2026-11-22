import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site-url";

const marketingPaths = ["/", "/pricing", "/how-it-works", "/login"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return marketingPaths.map((path, index) => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : index === 3 ? 0.5 : 0.8,
  }));
}