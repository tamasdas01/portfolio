import { notFound } from "next/navigation";
import { PLACEHOLDER_WORKS } from "@/lib/projects";
import type { Metadata } from "next";
import ProjectDetails from "./_components/ProjectDetails";

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

    return {
        title: project
            ? `${project.title} — ${project.techStack.slice(0, 3).join(", ")}`
            : "Project Not Found",
        description: project?.description ?? "",
    };
};

const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params;
    const project = PLACEHOLDER_WORKS.find((p) => p.slug === slug);

    if (!project) {
        return notFound();
    }

    return <ProjectDetails project={project} />;
};

export default Page;
