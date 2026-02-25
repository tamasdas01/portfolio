"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/lib/use-mobile";
import { Accordion05 } from "@/components/ui/Accordion05";

const ROLES = ["STRATEGIST", "DESIGNER", "DEVELOPER", "STORYTELLER"];

export function CinematicProcess() {
    const isMobile = useIsMobile();
    const [currentRole, setCurrentRole] = useState(0);

    // ── Ref-based parallax (zero re-renders) ──────────────────────
    const parallaxRef = useRef<HTMLDivElement>(null);
    const target = useRef({ x: 0, y: 0 });
    const current = useRef({ x: 0, y: 0 });
    const rafId = useRef<number>(0);

    useEffect(() => {
        if (isMobile) return;

        const onMove = (e: MouseEvent) => {
            target.current.x = (e.clientX / window.innerWidth - 0.5) * 16;
            target.current.y = (e.clientY / window.innerHeight - 0.5) * 16;
        };

        const tick = () => {
            current.current.x += (target.current.x - current.current.x) * 0.08;
            current.current.y += (target.current.y - current.current.y) * 0.08;

            if (parallaxRef.current) {
                parallaxRef.current.style.transform =
                    `translate3d(${current.current.x}px,${current.current.y}px,0)`;
            }
            rafId.current = requestAnimationFrame(tick);
        };

        window.addEventListener("mousemove", onMove, { passive: true });
        rafId.current = requestAnimationFrame(tick);

        return () => {
            window.removeEventListener("mousemove", onMove);
            cancelAnimationFrame(rafId.current);
        };
    }, [isMobile]);

    // ── Role cycling ──────────────────────────────────────────────
    useEffect(() => {
        const id = setInterval(() => {
            setCurrentRole((p) => (p + 1) % ROLES.length);
        }, 3000);
        return () => clearInterval(id);
    }, []);

    // ── Mobile layout ─────────────────────────────────────────────
    if (isMobile) {
        return (
            <section id="process" className="relative bg-black">
                <div className="px-6 pt-20 pb-10">
                    <p className="font-mono text-xs uppercase tracking-[0.3em] text-white/20">
                        Process
                    </p>
                </div>
                <div className="py-10" style={{ background: '#0e0e0e' }}>
                    <Accordion05 />
                </div>
            </section>
        );
    }

    // ── Desktop split-screen ──────────────────────────────────────
    return (
        <section id="process" className="relative flex min-h-screen w-full" style={{ background: '#0a0a0a' }}>
            {/* Left: Sticky Panel (40%) */}
            <div className="sticky top-0 h-screen w-[40%] bg-black flex flex-col justify-center px-12 overflow-hidden border-r border-white/5">
                {/* Subtle radial glow – pure CSS, zero cost */}
                <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                        background:
                            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(139,92,246,0.04) 0%, transparent 70%)",
                    }}
                />

                {/* Parallax container – transformed via ref, never re-renders */}
                <div
                    ref={parallaxRef}
                    className="relative z-10"
                    style={{ willChange: "transform" }}
                >
                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.05 }}
                        className="font-mono text-xs uppercase tracking-[0.4em] text-white/25 mb-8"
                    >
                        Process
                    </motion.p>

                    <motion.h2
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{
                            duration: 0.9,
                            ease: [0.22, 1, 0.36, 1],
                            delay: 0.15,
                        }}
                        className="text-[clamp(48px,5vw,90px)] font-bold leading-[0.95] tracking-[-0.02em] mb-6"
                        style={{
                            background: 'linear-gradient(to bottom, #A78BFA, #7C3AED)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}
                    >
                        TAMAS
                    </motion.h2>

                    {/* Cycling role text */}
                    <div className="h-14 overflow-hidden relative">
                        <AnimatePresence mode="wait">
                            <motion.h3
                                key={currentRole}
                                initial={{ y: 16, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -16, opacity: 0 }}
                                transition={{
                                    duration: 0.5,
                                    ease: [0.16, 1, 0.3, 1],
                                }}
                                className="text-2xl md:text-3xl font-light tracking-[0.12em] text-white/50 uppercase"
                            >
                                {ROLES[currentRole]}
                            </motion.h3>
                        </AnimatePresence>
                    </div>

                    {/* Divider */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: 0.4 }}
                        className="mt-10 h-px w-20 bg-white/15 origin-left"
                    />

                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 0.45 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="mt-7 max-w-[260px] text-[13px] leading-[1.7] text-white/50 font-light"
                    >
                        Bridging perception and reality through intentional
                        digital architecture.
                    </motion.p>
                </div>

                {/* Vertical side label – static, no animation cost */}
                <div className="absolute right-5 top-1/2 -translate-y-1/2 rotate-180 [writing-mode:vertical-lr] font-mono text-[9px] uppercase tracking-[0.5em] text-white/[0.06] pointer-events-none select-none">
                    STRATEGY · DESIGN
                </div>
            </div>

            {/* Right: Scrollable Content (60%) */}
            <div
                className="w-[60%] flex flex-col py-28 px-12 md:px-16 min-h-screen"
                style={{ background: '#0e0e0e' }}
            >
                <div className="max-w-3xl">
                    <Accordion05 />
                </div>
            </div>
        </section>
    );
}
