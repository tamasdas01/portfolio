"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useIsMobile } from "@/lib/use-mobile";
import { TechGlobe } from "@/components/ui/TechGlobe";

const EASE = [0.22, 1, 0.36, 1] as const;

export function StatementSection() {
    const isMobile = useIsMobile();
    const sectionRef = useRef<HTMLElement>(null);

    // Desktop parallax for subtle exit
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end start"],
    });

    const exitOpacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 1, 0.85]);

    const accentColor = "#8B5CF6";

    // Reusing the same gradient logic from HeroIdentity
    const glowStyle: React.CSSProperties = {
        background: `linear-gradient(to bottom, #A78BFA, #7C3AED)`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        // Slight glow
        textShadow: `0 0 40px ${accentColor}44, 0 0 80px ${accentColor}22`,
    };

    return (
        <section
            ref={sectionRef}
            className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black"
        >
            <motion.div
                style={isMobile ? {} : { opacity: exitOpacity }}
                className="relative z-10 flex w-full h-full flex-col md:grid md:grid-cols-2"
            >
                {/* ── Left Side (Text) ───────────────────────────────── */}
                <div className="flex h-full flex-col justify-center px-8 md:px-16 pt-32 md:pt-0 pb-12 md:pb-0 z-[2]">
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.8, ease: EASE }}
                        className="flex flex-col gap-2 md:gap-4 select-none"
                    >
                        {/* 1. "I build" */}
                        <motion.span
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
                            className="text-[#9CA3AF] font-light"
                            style={{
                                fontFamily: "var(--font-sans-var), system-ui, sans-serif",
                                fontSize: isMobile ? "clamp(2rem, 8vw, 3rem)" : "clamp(3rem, 5vw, 4rem)",
                                letterSpacing: "-0.01em",
                            }}
                        >
                            I build
                        </motion.span>

                        {/* 2. "digital" */}
                        <motion.span
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
                            className="italic"
                            style={{
                                fontFamily: "var(--font-display-var), Georgia, serif",
                                fontSize: isMobile ? "clamp(3.5rem, 15vw, 5rem)" : "clamp(5rem, 8vw, 7.5rem)",
                                letterSpacing: "-0.02em",
                                lineHeight: 1,
                                paddingRight: "0.1em", // prevent italic clipping
                                ...glowStyle
                            }}
                        >
                            digital
                        </motion.span>

                        {/* 3. "experiences." */}
                        <motion.span
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, ease: EASE, delay: 0.3 }}
                            className="font-bold font-sans text-gray-200"
                            style={{
                                fontFamily: "var(--font-sans-var), system-ui, sans-serif",
                                fontSize: isMobile ? "clamp(2.5rem, 10vw, 3.5rem)" : "clamp(4rem, 6vw, 5.5rem)",
                                letterSpacing: "-0.02em",
                                lineHeight: 1.1,
                            }}
                        >
                            experiences.
                        </motion.span>

                        {/* Decorative line divider */}
                        <motion.div
                            initial={{ scaleX: 0, opacity: 0 }}
                            whileInView={{ scaleX: 1, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: EASE, delay: 0.6 }}
                            className="mt-8 h-px w-16 origin-left md:mt-12 md:w-20"
                            style={{
                                background: "linear-gradient(to right, rgba(139,92,246,0.6), transparent)",
                            }}
                        />
                    </motion.div>
                </div>

                {/* ── Right Side (3D Globe) ──────────────────────────── */}
                <div className="relative flex h-full items-center justify-center z-[1] border-t border-white/5 md:border-t-0 md:border-l">
                    <TechGlobe />
                </div>
            </motion.div>
        </section>
    );
}
