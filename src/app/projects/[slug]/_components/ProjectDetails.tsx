"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import type { ProjectData } from "@/lib/projects";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface Props {
    project: ProjectData;
}

const ProjectDetails = ({ project }: Props) => {
    const containerRef = useRef<HTMLDivElement>(null);

    /* ── Staggered fade-in on load ── */
    useGSAP(
        () => {
            if (!containerRef.current) return;

            gsap.set(".fade-in-later", {
                autoAlpha: 0,
                y: 30,
            });

            gsap.timeline({ delay: 0.3 }).to(".fade-in-later", {
                autoAlpha: 1,
                y: 0,
                stagger: 0.1,
                duration: 0.6,
                ease: "power3.out",
            });
        },
        { scope: containerRef }
    );

    /* ── Sticky info blur-out on scroll (desktop) ── */
    useGSAP(
        () => {
            if (window.innerWidth < 992) return;

            gsap.to("#info", {
                filter: "blur(3px)",
                autoAlpha: 0,
                scale: 0.9,
                scrollTrigger: {
                    trigger: "#info",
                    start: "bottom bottom",
                    end: "bottom top",
                    pin: true,
                    pinSpacing: false,
                    scrub: 0.5,
                },
            });
        },
        { scope: containerRef }
    );

    /* ── Parallax images on scroll ── */
    useGSAP(
        () => {
            gsap.utils
                .toArray<HTMLDivElement>("#images > div")
                .forEach((imageDiv, i) => {
                    gsap.to(imageDiv, {
                        backgroundPosition: "center 0%",
                        ease: "none",
                        scrollTrigger: {
                            trigger: imageDiv,
                            start: () => (i ? "top bottom" : "top 50%"),
                            end: "bottom top",
                            scrub: true,
                        },
                    });
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
                    href="/#selected-projects"
                    className="mb-16 inline-flex gap-2 items-center group h-12 font-mono text-sm text-text-secondary hover:text-accent transition-colors"
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
                        <div className="flex items-start gap-6 mx-auto mb-10 max-w-[635px]">
                            <h1 className="fade-in-later text-4xl md:text-[60px] leading-none font-display font-light tracking-tight">
                                {project.title}
                            </h1>

                            <div className="fade-in-later flex gap-3 mt-2">
                                {project.sourceCode && (
                                    <a
                                        href={project.sourceCode}
                                        target="_blank"
                                        rel="noreferrer noopener"
                                        className="text-text-tertiary hover:text-accent transition-colors"
                                        title="Source code"
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
                                    >
                                        <ExternalLink size={28} />
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Meta fields */}
                        <div className="max-w-[635px] space-y-7 pb-20 mx-auto">
                            <div className="fade-in-later">
                                <p className="text-text-tertiary font-mono text-xs tracking-widest uppercase mb-3">
                                    Year
                                </p>
                                <div className="text-lg text-text-primary">
                                    {project.year}
                                </div>
                            </div>

                            <div className="fade-in-later">
                                <p className="text-text-tertiary font-mono text-xs tracking-widest uppercase mb-3">
                                    Tech &amp; Technique
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {project.techStack.map((t) => (
                                        <span
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
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="fade-in-later">
                                <p className="text-text-tertiary font-mono text-xs tracking-widest uppercase mb-3">
                                    Description
                                </p>
                                <div className="text-base leading-relaxed text-text-secondary">
                                    {project.description}
                                </div>
                            </div>

                            {project.role && (
                                <div className="fade-in-later">
                                    <p className="text-text-tertiary font-mono text-xs tracking-widest uppercase mb-3">
                                        My Role
                                    </p>
                                    <div className="text-base leading-relaxed text-text-secondary">
                                        {project.role}
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
                        <div
                            key={image + i}
                            className="group relative w-full aspect-[750/400] rounded-lg overflow-hidden"
                            style={{
                                backgroundImage: `url(${image})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center 50%",
                                backgroundRepeat: "no-repeat",
                            }}
                        >
                            <a
                                href={image}
                                target="_blank"
                                className="absolute top-4 right-4 w-10 h-10 rounded-full inline-flex justify-center items-center transition-all opacity-0 group-hover:opacity-100 text-text-primary hover:text-accent"
                                style={{
                                    background: "rgba(10,10,10,0.7)",
                                }}
                            >
                                <ExternalLink size={18} />
                            </a>
                        </div>
                    ))}
                </div>

                {/* ── Footer back link ── */}
                <div className="mt-20 text-center">
                    <Link
                        href="/#selected-projects"
                        className="inline-flex items-center gap-2 font-mono text-sm text-text-tertiary hover:text-accent transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Back to all projects
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default ProjectDetails;
