"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { WORKS } from "@/lib/constants";
import { ease } from "@/lib/animations";

gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────────────────────
// Project Card with 3D tilt
// ─────────────────────────────────────────────────────────────

const ACCENT_COLORS = [
    "rgba(139,92,246,0.4)",   // purple
    "rgba(59,130,246,0.4)",   // blue
    "rgba(6,182,212,0.4)",    // cyan
    "rgba(196,240,70,0.4)",   // lime (accent)
];

function ProjectCard({
    work,
    index,
    onExpand,
}: {
    work: (typeof WORKS)[number];
    index: number;
    onExpand: () => void;
}) {
    const cardRef = useRef<HTMLDivElement>(null);
    const glowColor = ACCENT_COLORS[index % ACCENT_COLORS.length];

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const card = cardRef.current;
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        gsap.to(card, {
            rotateY: x * 12,
            rotateX: -y * 12,
            duration: 0.4,
            ease: "power2.out",
        });
    }, []);

    const handleMouseLeave = useCallback(() => {
        const card = cardRef.current;
        if (!card) return;
        gsap.to(card, {
            rotateY: 0,
            rotateX: 0,
            duration: 0.6,
            ease: "expo.out",
        });
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease, delay: index * 0.12 }}
            style={{ perspective: "800px" }}
        >
            <div
                ref={cardRef}
                onClick={onExpand}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border transition-colors duration-500"
                style={{
                    background: "rgba(17,17,17,0.8)",
                    borderColor: "rgba(255,255,255,0.06)",
                    transformStyle: "preserve-3d",
                    willChange: "transform",
                    backdropFilter: "blur(12px)",
                }}
            >
                {/* Glow border on hover */}
                <div
                    className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                        boxShadow: `inset 0 0 0 1px ${glowColor}, 0 0 30px ${glowColor.replace("0.4", "0.15")}`,
                    }}
                />

                {/* Card content */}
                <div className="relative z-10 p-8 md:p-10">
                    {/* Year badge */}
                    <span
                        className="inline-block rounded-full px-3 py-1 font-mono text-xs"
                        style={{
                            background: "rgba(255,255,255,0.05)",
                            color: "rgba(255,255,255,0.4)",
                        }}
                    >
                        {work.year}
                    </span>

                    {/* Title */}
                    <h3
                        className="mt-6 text-2xl font-light tracking-tight transition-colors duration-300 group-hover:text-white md:text-3xl"
                        style={{ color: "rgba(255,255,255,0.85)" }}
                    >
                        {work.title}
                    </h3>

                    {/* Description */}
                    <p
                        className="mt-3 max-w-md text-sm leading-relaxed"
                        style={{ color: "rgba(255,255,255,0.4)" }}
                    >
                        {work.description}
                    </p>

                    {/* Tags */}
                    <div className="mt-6 flex flex-wrap gap-2">
                        {work.tags.map((tag) => (
                            <span
                                key={tag}
                                className="rounded-full px-3 py-1 font-mono text-xs"
                                style={{
                                    background: "rgba(255,255,255,0.04)",
                                    color: "rgba(255,255,255,0.35)",
                                    border: "1px solid rgba(255,255,255,0.06)",
                                }}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* View arrow */}
                    <div className="mt-8 flex items-center gap-2 font-mono text-xs transition-colors duration-300"
                        style={{ color: "rgba(255,255,255,0.25)" }}
                    >
                        <span className="transition-colors group-hover:text-white">
                            View project
                        </span>
                        <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                            →
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// ─────────────────────────────────────────────────────────────
// Expanded Project Overlay
// ─────────────────────────────────────────────────────────────

function ProjectDetail({
    work,
    onClose,
}: {
    work: (typeof WORKS)[number];
    onClose: () => void;
}) {
    // Close on Escape
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [onClose]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(20px)" }}
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.85, opacity: 0, y: 40 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ duration: 0.5, ease }}
                onClick={(e) => e.stopPropagation()}
                className="relative mx-6 w-full max-w-3xl overflow-hidden rounded-3xl border"
                style={{
                    background: "rgba(17,17,17,0.95)",
                    borderColor: "rgba(255,255,255,0.08)",
                }}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute right-6 top-6 z-10 flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-200"
                    style={{
                        background: "rgba(255,255,255,0.05)",
                        color: "rgba(255,255,255,0.5)",
                    }}
                >
                    ✕
                </button>

                <div className="p-10 md:p-14">
                    <span
                        className="font-mono text-xs"
                        style={{ color: "rgba(255,255,255,0.3)" }}
                    >
                        {work.year}
                    </span>

                    <h2
                        className="mt-4 text-4xl font-light tracking-tight md:text-5xl"
                        style={{ color: "rgba(255,255,255,0.95)" }}
                    >
                        {work.title}
                    </h2>

                    <p
                        className="mt-6 max-w-lg text-base leading-relaxed"
                        style={{ color: "rgba(255,255,255,0.5)" }}
                    >
                        {work.description}
                    </p>

                    <div className="mt-8 flex flex-wrap gap-2">
                        {work.tags.map((tag) => (
                            <span
                                key={tag}
                                className="rounded-full px-4 py-1.5 font-mono text-xs"
                                style={{
                                    background: "rgba(139,92,246,0.12)",
                                    color: "rgba(139,92,246,0.8)",
                                    border: "1px solid rgba(139,92,246,0.2)",
                                }}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>

                    <a
                        href={work.href}
                        className="mt-10 inline-flex items-center gap-2 rounded-full px-6 py-3 font-mono text-sm transition-all duration-300 hover:gap-3"
                        style={{
                            background: "rgba(139,92,246,0.15)",
                            color: "rgba(139,92,246,0.9)",
                            border: "1px solid rgba(139,92,246,0.25)",
                        }}
                    >
                        Visit project
                        <span>→</span>
                    </a>
                </div>
            </motion.div>
        </motion.div>
    );
}

// ─────────────────────────────────────────────────────────────
// Main Section
// ─────────────────────────────────────────────────────────────

export function ProjectShowcase() {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    return (
        <section
            id="work"
            className="relative px-6 py-24 md:px-8 md:py-32"
        >
            <div className="mx-auto max-w-6xl">
                {/* Section label */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease }}
                    className="font-mono text-sm"
                    style={{ color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em" }}
                >
                    Selected Work
                </motion.p>

                {/* Project grid */}
                <div className="mt-14 grid gap-6 md:mt-20 md:grid-cols-2 md:gap-8">
                    {WORKS.map((work, i) => (
                        <ProjectCard
                            key={work.title}
                            work={work}
                            index={i}
                            onExpand={() => setExpandedIndex(i)}
                        />
                    ))}
                </div>
            </div>

            {/* Expanded detail overlay */}
            <AnimatePresence>
                {expandedIndex !== null && (
                    <ProjectDetail
                        work={WORKS[expandedIndex]}
                        onClose={() => setExpandedIndex(null)}
                    />
                )}
            </AnimatePresence>
        </section>
    );
}
