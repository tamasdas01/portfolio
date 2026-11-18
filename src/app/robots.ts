import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
        },
        // Must point at the live domain — previously this referenced
        // tamasdas.dev, which doesn't resolve, so crawlers could not
        // discover the sitemap from robots.txt.
        sitemap: `${SITE_URL}/sitemap.xml`,
        host: SITE_URL,
    };
}
