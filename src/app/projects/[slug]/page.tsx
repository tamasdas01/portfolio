import { notFound } from "next/navigation";
import { PLACEHOLDER_WORKS } from "@/lib/projects";
import type { Metadata } from "next";
import ProjectDetails from "./_components/ProjectDetails";
import { JsonLd } from "@/components/seo/JsonLd";
import { projectGraph } from "@/lib/structured-data";

export const dynamicParams = false;

export const generateStaticParams = async () => {
    return PLACEHOLDER_WORKS.map((project) => ({ slug: project.slug }));
};

export const generateMetadata = async ({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> => {
    const { slug } = await params;
    const project = PLACEHOLDER_WORKS.find((p) => p.slug === slug);

    if (!project) {
        return { title: "Project Not Found", robots: { index: false } };
    }

    const title = `${project.title} — ${project.category}`;
    const url = `/projects/${project.slug}`;
    const ogImage = project.images[0];

    return {
        // Rendered as "<title> | Tamas Das" via the root template.
        title,
        description: project.summary,
        keywords: [project.title, ...project.techStack, "Tamas Das", "case study", "portfolio project"],
        alternates: { canonical: url },
        openGraph: {
            type: "article",
            url,
            title: `${title} | Tamas Das`,
            description: project.summary,
            siteName: "Tamas Das",
            locale: "en_IN",
            modifiedTime: project.lastModified,
            authors: ["Tamas Das"],
            images: ogImage
                ? [{ url: ogImage.src, width: 1900, height: 950, alt: ogImage.alt }]
                : undefined,
        },
        twitter: {
            card: "summary_large_image",
            title: `${title} | Tamas Das`,
            description: project.summary,
            images: ogImage ? [ogImage.src] : undefined,
        },
    };
};

const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params;
    const index = PLACEHOLDER_WORKS.findIndex((p) => p.slug === slug);
    const project = PLACEHOLDER_WORKS[index];

    if (!project) {
        return notFound();
    }

    const next = PLACEHOLDER_WORKS[(index + 1) % PLACEHOLDER_WORKS.length];

    return (
        <>
            <JsonLd data={projectGraph(project)} />
            <ProjectDetails
                project={project}
                nextProject={{ slug: next.slug, title: next.title }}
            />
        </>
    );
};

export default Page;
