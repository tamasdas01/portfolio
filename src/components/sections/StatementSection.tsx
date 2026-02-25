"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MagneticText } from "@/components/ui/morphing-cursor";
import { MusicReactiveCanvas } from "@/components/ui/music-reactive-hero-section";
import { useIsMobile } from "@/lib/use-mobile";

// ─────────────────────────────────────────────────────────────
// Statement lines — each can have its own typographic style
// ─────────────────────────────────────────────────────────────

interface StatementLine {
    text: string;
    /** Use the serif display font (Playfair Display) */
    serif?: boolean;
    /** Render in italic */
    italic?: boolean;
    /** Visually dominant line */
    emphasis?: boolean;
}

const LINES: StatementLine[] = [
    { text: "I build", serif: false, italic: false, emphasis: false },
    { text: "digital", serif: true, italic: true, emphasis: true },
    { text: "experiences.", serif: true, italic: false, emphasis: false },
];

const EASE = [0.22, 1, 0.36, 1] as const;

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

export function StatementSection() {
    const isMobile = useIsMobile();
    const sectionRef = useRef<HTMLElement>(null);

    // ── Desktop-only: subtle exit parallax on scroll-out ────
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end start"],
    });

    const exitScale = useTransform(scrollYProgress, [0, 0.8, 1], [1, 1, 0.96]);
    const exitOpacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 1, 0.85]);

    return (
        <section
            ref={sectionRef}
            className="relative flex min-h-screen items-center justify-center overflow-hidden"
            style={{ background: "rgba(0, 0, 0, 0.85)" }}
        >
            {/* ── Music-reactive animated background ─────────── */}
            <div className="absolute inset-0 z-0">
                <MusicReactiveCanvas intensity={isMobile ? 0.6 : 1} />
            </div>

            {/* Dark overlay to ensure text readability */}
            <div
                className="pointer-events-none absolute inset-0 z-[1]"
                style={{
                    background:
                        "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 70%, rgba(0,0,0,0.85) 100%)",
                }}
            />

            {/* ── Text content ───────────────────────────────── */}
            <motion.div
                style={
                    isMobile
                        ? {}
                        : { scale: exitScale, opacity: exitOpacity }
                }
                className="relative z-[2] flex w-full flex-col items-center px-6"
            >
                {/* Section entrance animation */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.8, ease: EASE }}
                    className="flex flex-col items-center"
                >
                    {/* Statement lines with stagger */}
                    <div className="flex flex-col items-center gap-0 md:gap-3">
                        {LINES.map((line, i) => (
                            <motion.div
                                key={line.text}
                                initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                                whileInView={{
                                    opacity: 1,
                                    y: 0,
                                    filter: "blur(0px)",
                                }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 0.6,
                                    ease: EASE,
                                    delay: i * 0.15,
                                }}
                            >
                                <span
                                    className="block text-center select-none"
                                    style={{
                                        // Font family: serif (Playfair Display) vs sans (Inter)
                                        fontFamily: line.serif
                                            ? "var(--font-display-var), Georgia, serif"
                                            : "var(--font-sans-var), system-ui, sans-serif",
                                        // Italic for "digital"
                                        fontStyle: line.italic ? "italic" : "normal",
                                        // Responsive font sizing
                                        fontSize: line.emphasis
                                            ? isMobile
                                                ? "clamp(3.5rem, 15vw, 5rem)"
                                                : "clamp(4rem, 7vw, 6rem)"
                                            : isMobile
                                                ? "clamp(1.5rem, 8vw, 2.5rem)"
                                                : "clamp(2rem, 4vw, 3rem)",
                                        fontWeight: line.emphasis ? 700 : 300,
                                        lineHeight: isMobile ? 1.0 : 1.1,
                                        letterSpacing: line.emphasis
                                            ? "-0.02em"
                                            : line.serif
                                                ? "0.01em"
                                                : "0.04em",
                                        color: line.emphasis
                                            ? "rgba(255, 255, 255, 0.97)"
                                            : "rgba(234, 234, 234, 0.65)",
                                        // Subtle glow behind the dominant word
                                        textShadow: line.emphasis
                                            ? "0 0 80px rgba(139,92,246,0.25), 0 0 160px rgba(139,92,246,0.1)"
                                            : undefined,
                                    }}
                                >
                                    {line.text}
                                </span>
                            </motion.div>
                        ))}
                    </div>

                    {/* Decorative line divider */}
                    <motion.div
                        initial={{ scaleX: 0, opacity: 0 }}
                        whileInView={{ scaleX: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{
                            duration: 0.8,
                            ease: EASE,
                            delay: 0.5,
                        }}
                        className="mt-10 h-px w-16 origin-center md:mt-14 md:w-20"
                        style={{
                            background:
                                "linear-gradient(to right, transparent, rgba(139,92,246,0.3), transparent)",
                        }}
                    />

                    {/* CTA */}
                    <div className="mt-10 md:mt-14">
                        <MagneticText text="EXPLORE" hoverText="MY WORK" href="#work" />
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
}
