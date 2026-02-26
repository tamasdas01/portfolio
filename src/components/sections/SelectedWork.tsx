"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { useIsMobile } from "@/lib/use-mobile";
import { lineReveal } from "@/lib/animations";
import { motion, useInView } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { ExternalLink } from "lucide-react";
import { PLACEHOLDER_WORKS, type ProjectData } from "@/lib/projects";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* ─────────────────────────────────────────────────────────
   Individual project row with hover arrow animation
   ───────────────────────────────────────────────────────── */
const ProjectItem = ({
    index,
    project,
    selectedProject,
    onMouseEnter,
}: {
    index: number;
    project: ProjectData;
    selectedProject: string | null;
    onMouseEnter: (slug: string) => void;
}) => {
    const isMobile = useIsMobile();
    const externalLinkSVGRef = useRef<SVGSVGElement>(null);
    const itemRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(itemRef, { once: true, margin: "-80px" });

    const { context, contextSafe } = useGSAP(
        () => { },
        {
            scope: externalLinkSVGRef,
            revertOnUpdate: true,
        }
    );

    const handleMouseEnter = contextSafe?.(() => {
        onMouseEnter(project.slug);

        if (isMobile) return;

        const arrowLine = externalLinkSVGRef.current?.querySelector(
            "#arrow-line"
        ) as SVGPathElement;
        const arrowCurb = externalLinkSVGRef.current?.querySelector(
            "#arrow-curb"
        ) as SVGPathElement;
        const box = externalLinkSVGRef.current?.querySelector(
            "#box"
        ) as SVGPathElement;

        if (!arrowLine || !arrowCurb || !box) return;

        gsap.set(box, {
            opacity: 0,
            strokeDasharray: box.getTotalLength(),
            strokeDashoffset: box.getTotalLength(),
        });
        gsap.set(arrowLine, {
            opacity: 0,
            strokeDasharray: arrowLine.getTotalLength(),
            strokeDashoffset: arrowLine.getTotalLength(),
        });
        gsap.set(arrowCurb, {
            opacity: 0,
            strokeDasharray: arrowCurb.getTotalLength(),
            strokeDashoffset: arrowCurb.getTotalLength(),
        });

        const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
        tl.to(externalLinkSVGRef.current, {
            autoAlpha: 1,
        })
            .to(box, {
                opacity: 1,
                strokeDashoffset: 0,
                duration: 0.4,
            })
            .to(
                arrowLine,
                {
                    opacity: 1,
                    strokeDashoffset: 0,
                    duration: 0.3,
                },
                "<0.2"
            )
            .to(arrowCurb, {
                opacity: 1,
                strokeDashoffset: 0,
                duration: 0.3,
            })
            .to(
                externalLinkSVGRef.current,
                {
                    autoAlpha: 0,
                    duration: 0.3,
                },
                "+=1"
            );
    });

    const handleMouseLeave = contextSafe?.(() => {
        context.kill();
        if (externalLinkSVGRef.current) {
            gsap.set(externalLinkSVGRef.current, { autoAlpha: 0 });
        }
    });

    return (
        <motion.div
            ref={itemRef}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="group/item"
        >
            <motion.div
                variants={lineReveal}
                className="h-px origin-left bg-border"
            />
            <div
                className="project-item relative group block py-8 md:py-12 md:hover:opacity-100 transition-all cursor-pointer"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {/* Mobile Thumbnail */}
                {selectedProject === null && isMobile && (
                    <Link href={`/projects/${project.slug}`}>
                        <Image
                            src={project.thumbnail}
                            alt={project.title}
                            width={400}
                            height={300}
                            className="w-full object-cover mb-6 aspect-[3/2] object-center rounded-lg"
                            priority
                        />
                    </Link>
                )}
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between opacity-50 md:group-hover/item:opacity-100 transition-opacity duration-500">
                    <div className="flex gap-4 md:gap-8 items-start">
                        <div className="font-mono text-text-tertiary mt-2">
                            {(index + 1).toString().padStart(2, "0")}
                        </div>
                        <div className="space-y-3 md:max-w-xl">
                            <div className="flex items-center gap-4">
                                {/* Project name → detail page */}
                                <Link href={`/projects/${project.slug}`}>
                                    <h4 className="text-3xl md:text-5xl font-display font-light transition-all text-text-secondary group-hover/item:text-text-primary hover:text-white">
                                        {project.title}
                                    </h4>
                                </Link>

                                {/* External link button → project's live website */}
                                {project.liveUrl && (
                                    <a
                                        href={project.liveUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hidden md:flex items-center justify-center w-10 h-10 rounded-full border border-border text-text-tertiary transition-all duration-300 hover:border-accent hover:text-accent hover:scale-110 shrink-0"
                                        title="Visit live project"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <ExternalLink size={18} />
                                    </a>
                                )}

                                {/* Animated SVG Arrow – GSAP driven, hidden by default */}
                                <span
                                    className="hidden md:block shrink-0"
                                    style={{ visibility: "hidden" }}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="36"
                                        height="36"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-accent"
                                        ref={externalLinkSVGRef}
                                    >
                                        <path
                                            id="box"
                                            d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
                                        />
                                        <path
                                            id="arrow-line"
                                            d="M10 14 21 3"
                                        />
                                        <path
                                            id="arrow-curb"
                                            d="M15 3h6v6"
                                        />
                                    </svg>
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-2 pt-2 text-text-secondary">
                                {project.techStack.map(
                                    (tech, idx, stackArr) => (
                                        <div
                                            className="gap-2 flex items-center"
                                            key={tech}
                                        >
                                            <span className="font-mono text-xs tracking-wider uppercase text-text-tertiary">
                                                {tech}
                                            </span>
                                            {idx !== stackArr.length - 1 && (
                                                <span className="inline-block w-1 h-1 rounded-full bg-border" />
                                            )}
                                        </div>
                                    )
                                )}
                            </div>

                            {/* Mobile external link */}
                            {isMobile && project.liveUrl && (
                                <a
                                    href={project.liveUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 font-mono text-xs text-accent mt-2"
                                >
                                    <ExternalLink size={14} />
                                    Visit live project
                                </a>
                            )}
                        </div>
                    </div>

                    <div className="hidden md:flex flex-wrap items-center gap-3 md:flex-col md:items-end md:gap-2 self-end md:self-auto group-hover/item:opacity-100 opacity-0 transition-opacity duration-300">
                        <Link
                            href={`/projects/${project.slug}`}
                            className="font-mono text-xs tracking-widest text-text-tertiary uppercase hover:text-accent transition-colors"
                        >
                            View <span className="text-accent">Details</span>
                        </Link>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

/* ─────────────────────────────────────────────────────────
   Main section – project list + floating image
   ───────────────────────────────────────────────────────── */
export const SelectedWork = () => {
    const isMobile = useIsMobile();
    const containerRef = useRef<HTMLDivElement>(null);
    const imageContainer = useRef<HTMLDivElement>(null);
    const [selectedProject, setSelectedProject] = useState<string | null>(
        PLACEHOLDER_WORKS[0].slug
    );

    // Image follows the cursor vertically inside the project list
    useGSAP(
        (_ctx, contextSafe) => {
            if (isMobile) {
                setSelectedProject(null);
                return;
            }

            const handleMouseMove = contextSafe?.((e: globalThis.MouseEvent) => {
                if (
                    !containerRef.current ||
                    !imageContainer.current ||
                    isMobile
                )
                    return;

                const containerRect =
                    containerRef.current.getBoundingClientRect();
                const imageRect =
                    imageContainer.current.getBoundingClientRect();

                const offsetTop = e.clientY - containerRect.y;
                const yPos = offsetTop - imageRect.height / 2;

                if (
                    e.clientY < containerRect.top ||
                    e.clientY > containerRect.bottom ||
                    e.clientX < containerRect.left - 50 ||
                    e.clientX > containerRect.right + 50
                ) {
                    return gsap.to(imageContainer.current, {
                        duration: 0.4,
                        opacity: 0,
                        ease: "power2.out",
                    });
                }

                gsap.to(imageContainer.current, {
                    y: yPos,
                    duration: 0.8,
                    opacity: 1,
                    ease: "power3.out",
                });
            }) as EventListener;

            window.addEventListener("mousemove", handleMouseMove);

            return () => {
                window.removeEventListener("mousemove", handleMouseMove);
            };
        },
        { scope: containerRef, dependencies: [isMobile] }
    );

    const handleMouseEnter = (slug: string) => {
        if (isMobile) {
            setSelectedProject(null);
            return;
        }
        setSelectedProject(slug);
    };

    return (
        <section
            id="selected-projects"
            className="relative px-6 py-24 md:px-8 md:py-32 overflow-hidden"
        >
            <div className="mx-auto max-w-6xl relative" ref={containerRef}>
                <Reveal>
                    <p
                        className="font-mono text-sm mb-12"
                        style={{
                            color: "rgba(255,255,255,0.3)",
                            letterSpacing: "0.15em",
                        }}
                    >
                        Selected Work
                    </p>
                </Reveal>

                {/* Floating Image Container (Desktop Only) */}
                {!isMobile && selectedProject !== null && (
                    <div
                        className="absolute right-0 top-0 z-[1] pointer-events-none w-[280px] xl:w-[400px] aspect-[4/5] overflow-hidden opacity-0 rounded-sm shadow-2xl"
                        ref={imageContainer}
                        style={{ willChange: "transform, opacity" }}
                    >
                        {PLACEHOLDER_WORKS.map((project) => (
                            <Image
                                src={project.thumbnail}
                                alt={project.title}
                                fill
                                sizes="(max-width: 768px) 100vw, 400px"
                                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${project.slug === selectedProject
                                    ? "opacity-100"
                                    : "opacity-0"
                                    }`}
                                key={project.slug}
                                priority
                            />
                        ))}
                    </div>
                )}

                {/* Project List */}
                <div className="flex flex-col relative z-[2]">
                    {PLACEHOLDER_WORKS.map((project, index) => (
                        <ProjectItem
                            index={index}
                            project={project}
                            selectedProject={selectedProject}
                            onMouseEnter={handleMouseEnter}
                            key={project.slug}
                        />
                    ))}

                    {/* Bottom border for the last item */}
                    <Reveal variants={lineReveal}>
                        <div className="h-px origin-left bg-border" />
                    </Reveal>
                </div>
            </div>
        </section>
    );
};
