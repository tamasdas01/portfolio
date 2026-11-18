import type { MetadataRoute } from "next";
import { PLACEHOLDER_WORKS } from "@/lib/projects";
import { PERSON, SITE_URL, absoluteUrl } from "@/lib/site";

// Bump when homepage content changes.
const HOME_LAST_MODIFIED = "2026-11-18";

export default function sitemap(): MetadataRoute.Sitemap {
    const home: MetadataRoute.Sitemap[number] = {
        url: SITE_URL,
        lastModified: new Date(HOME_LAST_MODIFIED),
        changeFrequency: "monthly",
        priority: 1.0,
        // Image sitemap entries help Google Images associate these with the page.
        images: [absoluteUrl(PERSON.image), ...PLACEHOLDER_WORKS.map((p) => absoluteUrl(p.thumbnail))],
    };

    // Every project in projects.ts gets a static page (generateStaticParams)
    // and an entry here automatically.
    const projects: MetadataRoute.Sitemap = PLACEHOLDER_WORKS.map((project) => ({
        url: absoluteUrl(`/projects/${project.slug}`),
        lastModified: new Date(project.lastModified),
        changeFrequency: "monthly" as const,
        priority: 0.8,
        images: project.images.map((img) => absoluteUrl(img.src)),
    }));

    return [home, ...projects];
}
