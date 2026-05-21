import type { MetadataRoute } from "next";
import { PLACEHOLDER_WORKS } from "@/lib/projects";

const BASE_URL = "https://portfolio-tamas.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date("2026-05-04"), // update this when homepage content changes
      changeFrequency: "monthly",
      priority: 1.0,
    },
  ];

  // Dynamic project routes — automatically includes every project in PLACEHOLDER_WORKS.
  // When you add a new project to projects.ts, it appears here AND gets a static page
  // via generateStaticParams() in [slug]/page.tsx — no extra work needed.
  const projectRoutes: MetadataRoute.Sitemap = PLACEHOLDER_WORKS.map(
    (project) => ({
      url: `${BASE_URL}/projects/${project.slug}`,
      lastModified: new Date(project.lastModified), // set per-project in projects.ts
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })
  );

  return [...staticRoutes, ...projectRoutes];
}
