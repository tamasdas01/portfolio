"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { RotatingHeroTitle } from "@/components/ui/RotatingHeroTitle";

const METRICS = [
    { value: "E2E", label: "Product Builds" },
    { value: "Full Stack", label: "Architecture" },
    { value: "Production", label: "Deployments" },
    { value: "Performance", label: "Driven Engineering" },
];

const EDUCATION = [
    {
        level: "B.Tech",
        institution: "Guru Nanak Institute of Technology (MAKAUT)",
        focus: "Computer Science & Engineering",
        result: "7.76 CGPA",
    },
    {
        level: "XII (ISC)",
        institution: "International Public School",
        focus: "Science Stream",
        result: "80%",
    },
    {
        level: "X (ICSE)",
        institution: "St. Joseph and Mary's School",
        focus: "General Studies",
        result: "88%",
    },
];

const stagger: Variants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.12, delayChildren: 0.2 },
    },
};

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 28 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
    },
};

export const AboutSection = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

    return (
        <section
            id="about"
            ref={sectionRef}
            className="relative px-6 pt-12 pb-[120px] md:px-8 md:pt-16 md:pb-[160px] overflow-hidden"
        >
            {/* Subtle background gradient */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        "radial-gradient(ellipse 80% 50% at 50% 50%, rgba(196,240,70,0.03) 0%, transparent 70%)",
                }}
            />

            {/* Animated rotating title — full width, top of section */}
            <div className="mx-auto max-w-6xl relative mb-16 md:mb-20">
                <RotatingHeroTitle />
            </div>

            <motion.div
                className="mx-auto max-w-6xl relative grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
                variants={stagger}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
            >
                {/* ─── Left Column: Portrait + Scanning Animation ─── */}
                <motion.div variants={fadeUp} className="relative mx-auto lg:mx-0 w-full max-w-[420px]">
                    {/* Glow halo behind the image */}
                    <div
                        className="absolute inset-0 rounded-3xl"
                        style={{
                            background:
                                "radial-gradient(ellipse 70% 40% at 50% 30%, rgba(196,240,70,0.08) 0%, transparent 70%)",
                            filter: "blur(40px)",
                        }}
                    />

                    {/* Dark glass card */}
                    <div
                        className="relative rounded-3xl overflow-hidden"
                        style={{
                            background: "rgba(17,17,17,0.6)",
                            backdropFilter: "blur(12px)",
                            border: "1px solid rgba(255,255,255,0.06)",
                            boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
                        }}
                    >
                        {/* Portrait image */}
                        <div className="relative aspect-[3/4] overflow-hidden rounded-3xl">
                            <Image
                                src="/projects/me.webp"
                                alt="Portrait"
                                fill
                                sizes="(max-width: 768px) 90vw, 420px"
                                className="object-cover object-top"
                                priority
                            />

                            {/* ── Scanning line effect ── */}
                            <div className="about-scan-container absolute inset-0 pointer-events-none z-10">
                                {/* Main scan line */}
                                <div className="about-scan-line" />
                                {/* Faint noise overlay */}
                                <div
                                    className="absolute inset-0 opacity-[0.025]"
                                    style={{
                                        backgroundImage:
                                            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                                        backgroundSize: "128px 128px",
                                    }}
                                />
                            </div>

                            {/* Bottom fade for blend */}
                            <div
                                className="absolute bottom-0 left-0 right-0 h-24 z-[5]"
                                style={{
                                    background:
                                        "linear-gradient(to top, rgba(17,17,17,0.8), transparent)",
                                }}
                            />
                        </div>
                    </div>

                    {/* Floating particle dots (purely decorative) */}
                    <div className="about-particles absolute inset-0 pointer-events-none z-[1]">
                        <span className="about-particle" style={{ top: "15%", left: "8%", animationDelay: "0s" }} />
                        <span className="about-particle" style={{ top: "45%", right: "5%", animationDelay: "1.2s" }} />
                        <span className="about-particle" style={{ top: "75%", left: "12%", animationDelay: "2.4s" }} />
                        <span className="about-particle" style={{ bottom: "10%", right: "15%", animationDelay: "0.6s" }} />
                    </div>
                </motion.div>

                {/* ─── Right Column: Content ─── */}
                <div className="flex flex-col gap-8 max-w-[600px]">


                    {/* Description paragraphs */}
                    <motion.div variants={fadeUp} className="space-y-5 text-[15px] md:text-base leading-relaxed text-text-secondary">
                        <p>
                            I&apos;m a self-taught Full Stack Developer focused on building high-performance,
                            real-world web applications. I work across the entire stack—from clean, scalable
                            backend architecture to fast, intuitive front-end interfaces that feel deliberate
                            and refined.
                        </p>
                        <p>
                            My approach is system-first. I prioritize performance, structure, and long-term
                            maintainability over shortcuts. Every project I build is treated as a product—designed,
                            engineered, optimized, and shipped end-to-end.
                        </p>
                        <p>
                            Through continuous experimentation and independent projects, I&apos;ve developed strong
                            depth in modern JavaScript ecosystems, deployment pipelines, and production workflows.
                            I don&apos;t just write features. I design systems that scale, ship cleanly, and solve
                            actual problems.
                        </p>
                    </motion.div>

                    {/* Divider */}
                    <motion.div
                        variants={fadeUp}
                        className="h-px w-full"
                        style={{ background: "rgba(255,255,255,0.08)" }}
                    />

                    {/* Metrics Row */}
                    <motion.div
                        variants={fadeUp}
                        className="grid grid-cols-2 sm:grid-cols-4 gap-6"
                    >
                        {METRICS.map((m) => (
                            <div key={m.label} className="space-y-1">
                                <div className="font-mono text-sm font-medium text-text-primary tracking-wide">
                                    {m.value}
                                </div>
                                <div className="font-mono text-[0.65rem] tracking-widest uppercase text-text-tertiary">
                                    {m.label}
                                </div>
                            </div>
                        ))}
                    </motion.div>

                    {/* Divider */}
                    <motion.div
                        variants={fadeUp}
                        className="h-px w-full"
                        style={{ background: "rgba(255,255,255,0.08)" }}
                    />

                    {/* Education */}
                    <motion.div variants={fadeUp} className="space-y-5">
                        <h3 className="font-mono text-xs tracking-[0.2em] uppercase text-text-tertiary">
                            Education
                        </h3>

                        <div className="space-y-3">
                            {EDUCATION.map((edu) => (
                                <div
                                    key={edu.level}
                                    className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 py-3 px-4 rounded-xl"
                                    style={{
                                        background: "rgba(255,255,255,0.02)",
                                        border: "1px solid rgba(255,255,255,0.04)",
                                    }}
                                >
                                    <div
                                        className="font-mono text-[0.65rem] tracking-widest uppercase px-2.5 py-1 rounded-md shrink-0 w-fit font-medium"
                                        style={{
                                            background: "rgba(196,240,70,0.08)",
                                            color: "rgba(196,240,70,0.85)",
                                            border: "1px solid rgba(196,240,70,0.12)",
                                        }}
                                    >
                                        {edu.level}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm text-text-primary leading-snug">
                                            {edu.institution}
                                        </div>
                                        <div className="font-mono text-xs text-text-tertiary mt-0.5">
                                            {edu.focus}
                                        </div>
                                    </div>
                                    <div className="font-mono text-sm font-medium text-accent shrink-0">
                                        {edu.result}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
};
