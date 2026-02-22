"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIntro } from "@/providers/IntroProvider";

gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

export function StatementHero() {
    const { isIntroComplete } = useIntro();
    const sectionRef = useRef<HTMLElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const line1Ref = useRef<HTMLSpanElement>(null);
    const line2Ref = useRef<HTMLSpanElement>(null);
    const line3Ref = useRef<HTMLSpanElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isIntroComplete) return;

        const section = sectionRef.current;
        const container = containerRef.current;
        const line1 = line1Ref.current;
        const line2 = line2Ref.current;
        const line3 = line3Ref.current;
        const overlay = overlayRef.current;
        if (!section || !container || !line1 || !line2 || !line3 || !overlay) return;

        // ── Entrance: stagger fade-in ──────────────────────────
        const enterTl = gsap.timeline({ delay: 0.3 });
        enterTl
            .fromTo(
                line1,
                { opacity: 0, y: 40 },
                { opacity: 1, y: 0, duration: 0.9, ease: "expo.out" }
            )
            .fromTo(
                line2,
                { opacity: 0, y: 60, scale: 0.85 },
                { opacity: 1, y: 0, scale: 1, duration: 1, ease: "expo.out" },
                "-=0.5"
            )
            .fromTo(
                line3,
                { opacity: 0, y: 40 },
                { opacity: 1, y: 0, duration: 0.9, ease: "expo.out" },
                "-=0.5"
            );

        // ── Scroll-pinned animation ────────────────────────────
        const mm = gsap.matchMedia();

        mm.add("(min-width: 768px)", () => {
            const scrollTl = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: "top top",
                    end: "+=180%",
                    pin: true,
                    scrub: 0.8,
                    anticipatePin: 1,
                },
            });

            scrollTl
                // Phase 1: "DIGITAL" scales up, letter-spacing expands, goes accent
                .to(line2, {
                    scale: 1.6,
                    letterSpacing: "0.08em",
                    duration: 1,
                    ease: "none",
                }, 0)
                .to(line1, {
                    opacity: 0.3,
                    y: -30,
                    duration: 1,
                    ease: "none",
                }, 0)
                .to(line3, {
                    opacity: 0.3,
                    y: 30,
                    duration: 1,
                    ease: "none",
                }, 0)

                // Phase 2: Everything compresses, blurs, fades
                .to(container, {
                    scale: 0.8,
                    opacity: 0,
                    duration: 0.8,
                    ease: "none",
                }, 1)
                .to(overlay, {
                    opacity: 1,
                    duration: 0.5,
                    ease: "none",
                }, 1.2);
        });

        // Mobile: no pinning, just entrance animation
        mm.add("(max-width: 767px)", () => {
            // On mobile just do a subtle parallax fade on scroll
            gsap.to(container, {
                scrollTrigger: {
                    trigger: section,
                    start: "top top",
                    end: "bottom top",
                    scrub: true,
                },
                y: -60,
                opacity: 0,
                ease: "none",
            });
        });

        return () => {
            enterTl.kill();
            mm.revert();
            ScrollTrigger.getAll().forEach((st) => {
                if (st.trigger === section) st.kill();
            });
        };
    }, [isIntroComplete]);

    return (
        <section
            ref={sectionRef}
            className="relative flex min-h-screen items-center justify-center overflow-hidden"
            style={{
                perspective: "1200px",
            }}
        >
            <div
                ref={containerRef}
                className="relative z-10 flex flex-col items-center gap-0 select-none"
                style={{
                    transformStyle: "preserve-3d",
                }}
            >
                {/* Line 1: "I build" */}
                <span
                    ref={line1Ref}
                    className="block opacity-0"
                    style={{
                        fontFamily: "var(--font-sans-var), system-ui, sans-serif",
                        fontSize: "clamp(1.2rem, 3vw, 2.2rem)",
                        fontWeight: 300,
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.6)",
                    }}
                >
                    I build
                </span>

                {/* Line 2: "DIGITAL" — the star */}
                <span
                    ref={line2Ref}
                    className="block opacity-0"
                    style={{
                        fontFamily: "var(--font-sans-var), system-ui, sans-serif",
                        fontSize: "clamp(4rem, 16vw, 14rem)",
                        fontWeight: 800,
                        lineHeight: 0.95,
                        letterSpacing: "-0.03em",
                        color: "#8B5CF6",
                        textShadow:
                            "0 0 60px rgba(139,92,246,0.3), 0 0 120px rgba(139,92,246,0.15)",
                        transform: "translateZ(40px)",
                    }}
                >
                    DIGITAL
                </span>

                {/* Line 3: "EXPERIENCES" */}
                <span
                    ref={line3Ref}
                    className="block opacity-0"
                    style={{
                        fontFamily: "var(--font-sans-var), system-ui, sans-serif",
                        fontSize: "clamp(1.4rem, 4.5vw, 3.5rem)",
                        fontWeight: 300,
                        letterSpacing: "0.25em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.5)",
                        marginTop: "0.1em",
                    }}
                >
                    EXPERIENCES
                </span>
            </div>

            {/* Fade-to-black overlay for exit transition */}
            <div
                ref={overlayRef}
                className="pointer-events-none absolute inset-0 z-20"
                style={{
                    background: "#0a0a0a",
                    opacity: 0,
                }}
            />

            {/* Subtle ambient gradient */}
            <div
                className="pointer-events-none absolute inset-0"
                style={{
                    background:
                        "radial-gradient(ellipse 50% 40% at 50% 50%, rgba(139,92,246,0.06) 0%, transparent 70%)",
                }}
            />
        </section>
    );
}
