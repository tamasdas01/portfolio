"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useIsMobile } from "@/lib/use-mobile";
import { TechGlobe } from "@/components/ui/TechGlobe";

const EASE = [0.22, 1, 0.36, 1] as const;

const SKILL_CATEGORIES = [
    {
        label: "Languages",
        items: ["JAVA", "TypeScript", "Python", "SQL"],
    },
    {
        label: "Frontend & App",
        items: ["Flutter", "React", "Tailwind CSS", "Technical SEO"],
    },
    {
        label: "Backend & Database",
        items: ["Next.js", "Capacitor", "Firebase", "Supabase", "MySQL", "Node.js", "Cloudflare"],
    },
    {
        label: "Tools",
        items: ["Git/GitHub", "VS Code", "Antigravity", "Android Studio", "Google Play Console", "Vercel"],
    },
    {
        label: "Soft Skills",
        items: ["Problem Solving", "Communication", "Adaptability"],
    },
    {
        label: "AI Tools",
        items: ["ChatGPT", "Gemini", "Claude", "Perplexity", "NotebookLM", "Google AI Studio"],
    },
];

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
            id="toolkit"
            className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black"
        >
            <motion.div
                style={isMobile ? {} : { opacity: exitOpacity }}
                className="relative z-10 flex w-full h-full flex-col md:grid md:grid-cols-2"
            >
                {/* ── Left Side (Text + Skills) ─────────────────────── */}
                <div className="flex h-full flex-col justify-center px-8 md:px-16 pt-32 md:pt-0 pb-12 md:pb-0 z-[2]">
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.8, ease: EASE }}
                        className="flex flex-col gap-2 select-none"
                    >
                        {/* Headline — reduced size */}
                        <motion.span
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
                            className="text-[#9CA3AF] font-light"
                            style={{
                                fontFamily: "var(--font-sans-var), system-ui, sans-serif",
                                fontSize: isMobile ? "clamp(1.5rem, 6vw, 2rem)" : "clamp(2rem, 3.5vw, 2.8rem)",
                                letterSpacing: "-0.01em",
                            }}
                        >
                            I build
                        </motion.span>

                        <motion.span
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
                            className="italic"
                            style={{
                                fontFamily: "var(--font-display-var), Georgia, serif",
                                fontSize: isMobile ? "clamp(2.5rem, 12vw, 3.5rem)" : "clamp(3.5rem, 6vw, 5rem)",
                                letterSpacing: "-0.02em",
                                lineHeight: 1,
                                paddingRight: "0.1em",
                                ...glowStyle
                            }}
                        >
                            digital
                        </motion.span>

                        <motion.span
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, ease: EASE, delay: 0.3 }}
                            className="font-bold font-sans text-gray-200"
                            style={{
                                fontFamily: "var(--font-sans-var), system-ui, sans-serif",
                                fontSize: isMobile ? "clamp(1.8rem, 8vw, 2.5rem)" : "clamp(2.8rem, 4.5vw, 3.8rem)",
                                letterSpacing: "-0.02em",
                                lineHeight: 1.1,
                            }}
                        >
                            experiences.
                        </motion.span>
                    </motion.div>

                    {/* ── Skill Categories ─────────────────────── */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.7, ease: EASE, delay: 0.5 }}
                        className="mt-8 md:mt-12 grid grid-cols-1 sm:grid-cols-2 gap-3"
                    >
                        {SKILL_CATEGORIES.map((cat) => (
                            <div
                                key={cat.label}
                                className="rounded-xl px-4 py-3"
                                style={{
                                    background: "rgba(255,255,255,0.03)",
                                    backdropFilter: "blur(12px)",
                                    border: "1px solid rgba(255,255,255,0.06)",
                                }}
                            >
                                <div
                                    className="font-mono text-[0.6rem] tracking-[0.2em] uppercase mb-2 font-medium"
                                    style={{ color: "rgba(139,92,246,0.8)" }}
                                >
                                    {cat.label}
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    {cat.items.map((item) => (
                                        <span
                                            key={item}
                                            className="font-mono text-[0.65rem] px-2 py-0.5 rounded-md"
                                            style={{
                                                background: "rgba(255,255,255,0.05)",
                                                color: "rgba(255,255,255,0.65)",
                                                border: "1px solid rgba(255,255,255,0.06)",
                                            }}
                                        >
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
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
