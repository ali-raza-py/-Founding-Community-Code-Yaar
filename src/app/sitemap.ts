import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/constants";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const routes: { path: string; priority: number }[] = [
    { path: "", priority: 1 },
    { path: "/cohort", priority: 0.9 },
    { path: "/apply", priority: 0.9 },
    { path: "/about", priority: 0.7 },
    { path: "/faq", priority: 0.7 },
    { path: "/privacy", priority: 0.3 },
  ];

  return routes.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified,
    changeFrequency: "monthly",
    priority: route.priority,
  }));
}
