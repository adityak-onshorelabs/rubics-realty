import type { MetadataRoute } from "next";
import { projects } from "@/content/en";
import { pressStories } from "@/content/press";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["/", "/projects", "/about", "/press", "/contact", "/privacy", "/disclaimer"];
  return [
    ...pages.map((p) => ({ url: absoluteUrl(p), changeFrequency: "monthly" as const, priority: p === "/" ? 1 : 0.6 })),
    ...projects.map((p) => ({ url: absoluteUrl(`/projects/${p.slug}`), changeFrequency: "weekly" as const, priority: 0.9 })),
    ...pressStories.map((s) => ({ url: absoluteUrl(`/press/${s.slug}`), lastModified: s.date, priority: 0.4 })),
  ];
}
