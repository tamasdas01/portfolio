"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { WORKS } from "@/lib/constants";
import { ease, fadeUp, fadeUpSmall, lineReveal } from "@/lib/animations";

function WorkItem({
    work,
    index,
}: {
    work: (typeof WORKS)[number];
    index: number;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-80px" });

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
        >
            {/* Top border line */}
            <motion.div
                variants={lineReveal}
                className="h-px origin-left bg-border"
            />

            <a
                href={work.href}
                className="group block py-8 md:py-12"
            >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-3 md:max-w-xl">
                        <motion.h3
                            variants={fadeUp}
                            className="text-2xl font-light tracking-tight transition-colors duration-300 group-hover:text-accent md:text-3xl"
                        >
                            {work.title}
                        </motion.h3>

                        <motion.p
                            variants={fadeUpSmall}
                            className="text-base text-text-secondary"
                        >
                            {work.description}
                        </motion.p>
                    </div>

                    <motion.div
                        variants={fadeUpSmall}
                        className="flex flex-wrap items-center gap-3 md:flex-col md:items-end md:gap-2"
                    >
                        <span className="font-mono text-sm text-text-tertiary">
                            {work.year}
                        </span>
                        <div className="flex flex-wrap gap-2">
                            {work.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="font-mono text-xs text-text-secondary"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </a>
        </motion.div>
    );
}

export function Work() {
    return (
        <section id="work" className="px-6 py-24 md:px-8 md:py-32">
            <div className="mx-auto max-w-7xl">
                <Reveal>
                    <p className="font-mono text-sm text-text-secondary">
                        Selected Work
                    </p>
                </Reveal>

                <div className="mt-12 md:mt-16">
                    {WORKS.map((work, i) => (
                        <WorkItem key={work.title} work={work} index={i} />
                    ))}

                    {/* Bottom border */}
                    <Reveal variants={lineReveal}>
                        <div className="h-px origin-left bg-border" />
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
