"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, ExternalLink, Github } from "lucide-react";
import type { ProjectData } from "@/lib/projects";
import { getPerfTier, prefersReducedMotion } from "@/lib/perf";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface Props {
    project: ProjectData;
    nextProject: Pick<ProjectData, "slug" | "title">;
}

/** Splits "\n\n"-separated copy into real paragraphs (readable + better for SEO). */
const Paragraphs = ({ text }: { text: string }) => (
    <>
        {text
            .split(/\n{2,}/)
            .map((p) => p.trim())
            .filter(Boolean)
            .map((p, i) => (
                <p key={i} className={i > 0 ? "mt-4" : undefined}>
                    {p}
                </p>
            ))}
    </>
);

const ProjectDetails = ({ project, nextProject }: Props) => {
    const containerRef = useRef<HTMLDivElement>(null);

    /* ── Always start at the top of the page ── */
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
    }, []);

    /* ── Staggered fade-in on load ── */
    useGSAP(
        () => {
            if (!containerRef.current) return;

            gsap.set(".fade-in-later", {
                autoAlpha: 0,
                y: 30,
            });

            gsap.timeline({ delay: 0.15 }).to(".fade-in-later", {
                autoAlpha: 1,
                y: 0,
                stagger: 0.08,
                duration: 0.6,
                ease: "power3.out",
            });
        },
        { scope: containerRef }
    );

    /* ── Sticky info fade-out on scroll (desktop) ── */
    useGSAP(
        () => {
            if (window.innerWidth < 992) return;
            // The blur is the costly part — keep it for capable machines only.
            const lowTier = getPerfTier() === "low";

            gsap.to("#info", {
                ...(lowTier ? {} : { filter: "blur(3px)" }),
                autoAlpha: 0,
                scale: 0.9,
                scrollTrigger: {
                    trigger: "#info",
                    start: "bottom bottom",
                    end: "bottom top",
                    pin: true,
                    pinSpacing: true,
                    scrub: 0.5,
                },
            });
        },
        { scope: containerRef }
    );

    /* ── Gallery: reveal each shot as it enters + gentle parallax ── */
    useGSAP(
        () => {
            const reduced = prefersReducedMotion();
            gsap.utils
                .toArray<HTMLDivElement>("#images > figure")
                .forEach((frame, i) => {
                    const img = frame.querySelector("img");

                    if (!reduced) {
                        gsap.fromTo(
                            frame,
                            { clipPath: "inset(12% 6% 12% 6% round 12px)", autoAlpha: 0.3 },
                            {
                                clipPath: "inset(0% 0% 0% 0% round 8px)",
                                autoAlpha: 1,
                                duration: 1,
                                ease: "power3.out",
                                scrollTrigger: { trigger: frame, start: "top 88%", once: true },
                            }
                        );
                    }

                    if (img) {
                        gsap.to(img, {
                            objectPosition: "50% 0%",
                            ease: "none",
                            scrollTrigger: {
                                trigger: frame,
                                start: () => (i ? "top bottom" : "top 50%"),
                                end: "bottom top",
                                scrub: true,
                            },
                        });
                    }
                });
        },
        { scope: containerRef }
    );

    return (
        <section className="min-h-screen pt-5 pb-14">
            <div
                className="mx-auto max-w-5xl px-6 md:px-8"
                ref={containerRef}
            >
                {/* ── Back button ── */}
                <Link
                    href="/#work"
                    className="mb-12 md:mb-16 inline-flex gap-2 items-center group h-12 font-mono text-sm text-text-secondary hover:text-accent transition-colors"
                >
                    <ArrowLeft
                        size={20}
                        className="group-hover:-translate-x-1 transition-transform duration-300"
                    />
                    Back
                </Link>

                {/* ── Hero info block ── */}
                <div
                    className="top-0 min-h-[calc(100svh-100px)] flex"
                    id="info"
                >
                    <div className="relative w-full">
                        {/* Title + external links */}
                        <div className="mx-auto mb-10 max-w-[635px]">
                            <div className="flex items-start gap-4 md:gap-6">
                                <h1 className="fade-in-later text-4xl md:text-[60px] leading-none font-display font-light tracking-tight">
                                    {project.title}
                                </h1>

                                <div className="fade-in-later flex gap-3 mt-1 md:mt-2 shrink-0">
                                    {project.sourceCode && (
                                        <a
                                            href={project.sourceCode}
                                            target="_blank"
                                            rel="noreferrer noopener"
                                            className="text-text-tertiary hover:text-accent transition-colors"
                                            title="Source code"
                                            aria-label={`${project.title} source code`}
                                        >
                                            <Github size={28} />
                                        </a>
                                    )}
                                    {project.liveUrl && (
                                        <a
                                            href={project.liveUrl}
                                            target="_blank"
                                            rel="noreferrer noopener"
                                            className="text-text-tertiary hover:text-accent transition-colors"
                                            title="Live project"
                                            aria-label={`Visit ${project.title} live website`}
                                        >
                                            <ExternalLink size={28} />
                                        </a>
                                    )}
                                </div>
                            </div>
                            <p className="fade-in-later mt-4 font-mono text-xs tracking-widest uppercase text-text-tertiary">
                                {project.category} · Built by Tamas Das
                            </p>
                        </div>

                        {/* Meta fields */}
                        <div className="max-w-[635px] space-y-7 pb-20 mx-auto">
                            <div className="fade-in-later">
                                <h2 className="text-text-tertiary font-mono text-xs tracking-widest uppercase mb-3">
                                    Year
                                </h2>
                                <div className="text-lg text-text-primary">
                                    {project.year}
                                </div>
                            </div>

                            <div className="fade-in-later">
                                <h2 className="text-text-tertiary font-mono text-xs tracking-widest uppercase mb-3">
                                    Tech &amp; Technique
                                </h2>
                                <ul className="flex flex-wrap gap-2">
                                    {project.techStack.map((t) => (
                                        <li
                                            key={t}
                                            className="rounded-full px-3 py-1 font-mono text-xs"
                                            style={{
                                                background:
                                                    "rgba(196,240,70,0.08)",
                                                color: "rgba(196,240,70,0.8)",
                                                border: "1px solid rgba(196,240,70,0.15)",
                                            }}
                                        >
                                            {t}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="fade-in-later">
                                <h2 className="text-text-tertiary font-mono text-xs tracking-widest uppercase mb-3">
                                    Description
                                </h2>
                                <div className="text-base leading-relaxed text-text-secondary">
                                    <Paragraphs text={project.description} />
                                </div>
                            </div>

                            {project.role && (
                                <div className="fade-in-later">
                                    <h2 className="text-text-tertiary font-mono text-xs tracking-widest uppercase mb-3">
                                        My Role
                                    </h2>
                                    <div className="text-base leading-relaxed text-text-secondary">
                                        <Paragraphs text={project.role} />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Scroll hint */}
                        <div className="fade-in-later flex flex-col items-center gap-2 pb-8">
                            <span className="font-mono text-[0.6rem] tracking-[0.4em] uppercase text-text-tertiary">
                                Scroll for gallery
                            </span>
                            <div className="w-px h-10 bg-border" />
                        </div>
                    </div>
                </div>

                {/* ── Project images gallery ── */}
                <div
                    className="fade-in-later relative flex flex-col gap-4 max-w-[800px] mx-auto"
                    id="images"
                >
                    {project.images.map((image, i) => (
                        <figure
                            key={image.src + i}
                            className="group relative w-full aspect-[750/400] rounded-lg overflow-hidden bg-surface"
                        >
                            <Image
                                src={image.src}
                                alt={image.alt}
                                fill
                                sizes="(max-width: 860px) 100vw, 800px"
                                className="object-cover transition-transform duration-700 ease-out md:group-hover:scale-[1.02]"
                                style={{ objectPosition: "50% 50%" }}
                            />
                            <a
                                href={image.src}
                                target="_blank"
                                rel="noopener"
                                aria-label={`Open full-size screenshot: ${image.alt}`}
                                className="absolute top-4 right-4 w-10 h-10 rounded-full inline-flex justify-center items-center transition-all opacity-0 group-hover:opacity-100 focus-visible:opacity-100 text-text-primary hover:text-accent"
                                style={{
                                    background: "rgba(10,10,10,0.7)",
                                }}
                            >
                                <ExternalLink size={18} />
                            </a>
                        </figure>
                    ))}
                </div>

                {/* ── Footer navigation ── */}
                <nav
                    aria-label="Project navigation"
                    className="mt-20 flex flex-col-reverse items-center gap-8 md:flex-row md:justify-between max-w-[800px] mx-auto"
                >
                    <Link
                        href="/#work"
                        className="inline-flex items-center gap-2 font-mono text-sm text-text-tertiary hover:text-accent transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Back to all projects
                    </Link>
                    <Link
                        href={`/projects/${nextProject.slug}`}
                        className="group inline-flex items-center gap-3 text-right"
                    >
                        <span className="font-mono text-xs tracking-widest uppercase text-text-tertiary">
                            Next project
                        </span>
                        <span className="font-display text-2xl md:text-3xl font-light text-text-primary group-hover:text-accent transition-colors">
                            {nextProject.title}
                        </span>
                        <ArrowRight
                            size={18}
                            className="text-text-tertiary group-hover:text-accent group-hover:translate-x-1 transition-all duration-300"
                        />
                    </Link>
                </nav>
            </div>
        </section>
    );
};

export default ProjectDetails;
