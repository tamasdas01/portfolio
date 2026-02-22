"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useIntro } from "@/providers/IntroProvider";

// ─────────────────────────────────────────────────────────────
// Text-Scramble Effect
// ─────────────────────────────────────────────────────────────

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*";

function useTextScramble(
    target: string,
    shouldStart: boolean,
    duration = 1200,
    delay = 400
) {
    const [display, setDisplay] = useState("");
    const rafRef = useRef<number>(0);

    useEffect(() => {
        if (!shouldStart) {
            setDisplay("");
            return;
        }

        const startTime = performance.now() + delay;
        const chars = target.split("");

        function tick(now: number) {
            const elapsed = now - startTime;
            if (elapsed < 0) {
                // Still in delay — show scrambled
                setDisplay(
                    chars.map(() => CHARS[Math.floor(Math.random() * CHARS.length)]).join("")
                );
                rafRef.current = requestAnimationFrame(tick);
                return;
            }

            const progress = Math.min(elapsed / duration, 1);
            const resolved = Math.floor(progress * chars.length);

            const output = chars
                .map((ch, i) =>
                    i < resolved ? ch : CHARS[Math.floor(Math.random() * CHARS.length)]
                )
                .join("");

            setDisplay(output);

            if (progress < 1) {
                rafRef.current = requestAnimationFrame(tick);
            }
        }

        rafRef.current = requestAnimationFrame(tick);

        return () => cancelAnimationFrame(rafRef.current);
    }, [target, shouldStart, duration, delay]);

    return display;
}

// ─────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────

interface HeroIdentityProps {
    name?: string;
    accentColor?: string;
}

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

export function HeroIdentity({
    name = "TAMAS",
    accentColor = "#8B5CF6",
}: HeroIdentityProps) {
    const { isIntroComplete } = useIntro();
    const sectionRef = useRef<HTMLElement>(null);
    const [entered, setEntered] = useState(false);

    // Trigger entrance after intro completes
    useEffect(() => {
        if (!isIntroComplete) return;
        const timer = setTimeout(() => setEntered(true), 150);
        return () => clearTimeout(timer);
    }, [isIntroComplete]);

    // Text scramble for the name
    const scrambledName = useTextScramble(name, entered, 1000, 600);

    // ── Scroll-based parallax + fade ─────────────────────────
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.8], [1, 0.95]);
    const nameBlur = useTransform(scrollYProgress, [0, 0.5], [0, 6]);

    // Build the accent glow + text-shadow dynamically
    const glowStyle = {
        color: accentColor,
        textShadow: `0 0 40px ${accentColor}44, 0 0 80px ${accentColor}22`,
    };

    return (
        <section
            ref={sectionRef}
            className="relative flex min-h-screen items-center justify-center overflow-hidden"
        >
            <motion.div
                style={{ y, opacity, scale }}
                className="relative z-10 flex flex-col items-center gap-0"
            >
                {/* "I am" — calm, white, minimal */}
                <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={entered ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0 }}
                    className="block font-light tracking-wide"
                    style={{
                        fontFamily: "var(--font-sans-var), system-ui, sans-serif",
                        fontSize: "clamp(1.1rem, 2.5vw, 2rem)",
                        color: "rgba(255,255,255,0.8)",
                        letterSpacing: "0.18em",
                        marginBottom: "0.25em",
                    }}
                >
                    I am
                </motion.span>

                {/* "TAMAS" — bold, accent, text-scramble reveal */}
                <motion.h1
                    initial={{ opacity: 0, y: 24 }}
                    animate={entered ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                    style={{
                        ...glowStyle,
                        fontFamily: "var(--font-sans-var), system-ui, sans-serif",
                        fontSize: "clamp(3.5rem, 12vw, 10rem)",
                        fontWeight: 700,
                        lineHeight: 1,
                        letterSpacing: "-0.02em",
                        filter: useTransformToFilter(nameBlur),
                    }}
                >
                    {entered ? scrambledName : ""}
                </motion.h1>

                {/* Subtle subtitle — appears after name settles */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={entered ? { opacity: 1 } : {}}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 2 }}
                    className="mt-6"
                    style={{
                        fontFamily: "var(--font-mono-var), ui-monospace, monospace",
                        fontSize: "clamp(0.65rem, 1vw, 0.8rem)",
                        letterSpacing: "0.25em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.3)",
                    }}
                >
                    Creative Developer &nbsp;·&nbsp; Crafting digital experiences
                </motion.p>

                {/* Scroll indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={entered ? { opacity: 1 } : {}}
                    transition={{ duration: 1, delay: 2.8 }}
                    className="absolute -bottom-24 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
                >
                    <span
                        style={{
                            fontFamily: "var(--font-mono-var), ui-monospace, monospace",
                            fontSize: "0.55rem",
                            letterSpacing: "0.3em",
                            textTransform: "uppercase",
                            color: "rgba(255,255,255,0.15)",
                        }}
                    >
                        scroll
                    </span>
                    <motion.div
                        animate={{ y: [0, 6, 0] }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                        className="h-8 w-px"
                        style={{ background: `linear-gradient(to bottom, rgba(255,255,255,0.2), transparent)` }}
                    />
                </motion.div>
            </motion.div>

            {/* Subtle radial gradient vignette */}
            <div
                className="pointer-events-none absolute inset-0"
                style={{
                    background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${accentColor}08 0%, transparent 70%)`,
                }}
            />
        </section>
    );
}

// ─────────────────────────────────────────────────────────────
// Helper — convert MotionValue<number> to CSS filter string
// Framer Motion style prop doesn't support motion values inside
// template strings, so we do it the React way.
// ─────────────────────────────────────────────────────────────

function useTransformToFilter(blurValue: ReturnType<typeof useTransform<number, number>>) {
    // We use a state to bridge the motion value to a CSS string.
    const [filter, setFilter] = useState("blur(0px)");

    useEffect(() => {
        const unsubscribe = blurValue.on("change", (v) => {
            setFilter(`blur(${v}px)`);
        });
        return unsubscribe;
    }, [blurValue]);

    return filter;
}
