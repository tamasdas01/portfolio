import { PERSON, SEO, SITE_URL, absoluteUrl } from "@/lib/site";
import type { ProjectData } from "@/lib/projects";

/* ─────────────────────────────────────────────────────────
   JSON-LD builders (schema.org). Everything is linked by
   @id so Google can connect the Person ↔ WebSite ↔ pages
   ↔ projects into one entity — the foundation for name
   searches and an eventual Knowledge Panel.
   ───────────────────────────────────────────────────────── */

export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export function personSchema() {
    return {
        "@type": "Person",
        "@id": PERSON_ID,
        name: PERSON.name,
        alternateName: PERSON.shortName,
        url: absoluteUrl("/"),
        image: absoluteUrl(PERSON.image),
        email: `mailto:${PERSON.email}`,
        jobTitle: PERSON.jobTitle,
        description:
            "Creative full-stack developer based in Kolkata, India. AI-native and system-first — builds production web products end-to-end with Next.js, React and Node.js.",
        address: {
            "@type": "PostalAddress",
            addressLocality: PERSON.city,
            addressRegion: PERSON.region,
            addressCountry: PERSON.country,
        },
        homeLocation: {
            "@type": "Place",
            name: `${PERSON.city}, ${PERSON.countryName}`,
        },
        alumniOf: {
            "@type": "CollegeOrUniversity",
            name: PERSON.alumniOf,
        },
        knowsAbout: [...PERSON.knowsAbout],
        sameAs: [...PERSON.sameAs],
    };
}

export function websiteSchema() {
    return {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: absoluteUrl("/"),
        name: "Tamas Das — Creative Full-Stack Developer",
        alternateName: ["Tamas Das Portfolio", "Tamas Das"],
        inLanguage: "en",
        author: { "@id": PERSON_ID },
        publisher: { "@id": PERSON_ID },
    };
}

/** Site-wide graph rendered in the root layout. */
export function siteGraph() {
    return {
        "@context": "https://schema.org",
        "@graph": [personSchema(), websiteSchema()],
    };
}

/** Homepage: ProfilePage + the services Tamas offers (no fake address / map pin). */
export function homeGraph(projects: ProjectData[]) {
    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "ProfilePage",
                "@id": `${SITE_URL}/#profilepage`,
                url: absoluteUrl("/"),
                name: SEO.title,
                description: SEO.description,
                isPartOf: { "@id": WEBSITE_ID },
                mainEntity: { "@id": PERSON_ID },
                about: { "@id": PERSON_ID },
                primaryImageOfPage: absoluteUrl(PERSON.image),
                inLanguage: "en",
            },
            {
                "@type": "Service",
                "@id": `${SITE_URL}/#service`,
                serviceType: "Full-Stack Web & Product Development",
                name: "Creative full-stack web development",
                provider: { "@id": PERSON_ID },
                areaServed: [
                    { "@type": "City", name: "Kolkata" },
                    { "@type": "Country", name: "India" },
                    "Worldwide (remote)",
                ],
                description:
                    "End-to-end web product development: architecture, UI/UX and motion design, frontend, backend, deployment and technical SEO.",
            },
            {
                "@type": "ItemList",
                "@id": `${SITE_URL}/#projects`,
                name: "Selected work by Tamas Das",
                itemListElement: projects.map((p, i) => ({
                    "@type": "ListItem",
                    position: i + 1,
                    url: absoluteUrl(`/projects/${p.slug}`),
                    name: p.title,
                })),
            },
        ],
    };
}

/** Project pages: the work itself + breadcrumb trail. */
export function projectGraph(project: ProjectData) {
    const url = absoluteUrl(`/projects/${project.slug}`);
    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "CreativeWork",
                "@id": `${url}#work`,
                name: project.title,
                headline: `${project.title} — ${project.category}`,
                description: project.summary,
                url,
                image: project.images.map((img) => absoluteUrl(img.src)),
                thumbnailUrl: absoluteUrl(project.thumbnail),
                creator: { "@id": PERSON_ID },
                author: { "@id": PERSON_ID },
                keywords: project.techStack.join(", "),
                dateModified: project.lastModified,
                ...(project.liveUrl ? { sameAs: project.liveUrl } : {}),
                isPartOf: { "@id": WEBSITE_ID },
            },
            {
                "@type": "BreadcrumbList",
                itemListElement: [
                    { "@type": "ListItem", position: 1, name: "Tamas Das", item: absoluteUrl("/") },
                    { "@type": "ListItem", position: 2, name: "Work", item: absoluteUrl("/#work") },
                    { "@type": "ListItem", position: 3, name: project.title, item: url },
                ],
            },
        ],
    };
}
