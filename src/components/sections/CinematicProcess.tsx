"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

// ─────────────────────────────────────────────────────────────
// Layer visuals — rendered as styled divs (no images needed)
// ─────────────────────────────────────────────────────────────

function WireframeLayer() {
    return (
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full max-w-2xl px-6">
                {/* Dot grid */}
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)",
                        backgroundSize: "24px 24px",
                    }}
                />

                {/* Wireframe card */}
                <div
                    className="relative mx-auto w-full max-w-md rounded-xl border-2 border-dashed p-8"
                    style={{ borderColor: "rgba(255,255,255,0.15)" }}
                >
                    {/* Header bar */}
                    <div className="mb-6 flex items-center gap-3">
                        <div className="h-3 w-3 rounded-full" style={{ border: "1.5px solid rgba(255,255,255,0.25)" }} />
                        <div className="h-3 w-3 rounded-full" style={{ border: "1.5px solid rgba(255,255,255,0.25)" }} />
                        <div className="h-3 w-3 rounded-full" style={{ border: "1.5px solid rgba(255,255,255,0.25)" }} />
                    </div>

                    {/* Content skeletons */}
                    <div className="mb-4 h-3 w-3/4 rounded" style={{ background: "rgba(255,255,255,0.1)" }} />
                    <div className="mb-4 h-3 w-1/2 rounded" style={{ background: "rgba(255,255,255,0.07)" }} />
                    <div className="mb-8 h-3 w-2/3 rounded" style={{ background: "rgba(255,255,255,0.07)" }} />

                    {/* Button skeleton */}
                    <div className="h-8 w-28 rounded-lg" style={{ border: "1.5px dashed rgba(255,255,255,0.15)" }} />

                    {/* Label */}
                    <span
                        className="absolute -top-3 left-6 px-2 font-mono text-xs"
                        style={{ color: "rgba(255,255,255,0.3)", background: "#0a0a0a" }}
                    >
                        wireframe.sketch
                    </span>
                </div>
            </div>
        </div>
    );
}

function CodeLayer() {
    return (
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full max-w-2xl px-6">
                <div
                    className="mx-auto w-full max-w-md overflow-hidden rounded-xl border"
                    style={{
                        background: "rgba(17,17,17,0.9)",
                        borderColor: "rgba(255,255,255,0.08)",
                    }}
                >
                    {/* Editor top bar */}
                    <div
                        className="flex items-center gap-2 border-b px-4 py-3"
                        style={{ borderColor: "rgba(255,255,255,0.06)" }}
                    >
                        <div className="h-2.5 w-2.5 rounded-full" style={{ background: "#ff5f57" }} />
                        <div className="h-2.5 w-2.5 rounded-full" style={{ background: "#febc2e" }} />
                        <div className="h-2.5 w-2.5 rounded-full" style={{ background: "#28c840" }} />
                        <span
                            className="ml-3 font-mono text-xs"
                            style={{ color: "rgba(255,255,255,0.3)" }}
                        >
                            component.tsx
                        </span>
                    </div>

                    {/* Code lines */}
                    <div className="p-5 font-mono text-xs leading-6" style={{ color: "rgba(255,255,255,0.6)" }}>
                        <div>
                            <span style={{ color: "#c792ea" }}>const</span>{" "}
                            <span style={{ color: "#82aaff" }}>Hero</span>{" "}
                            <span style={{ color: "#89ddff" }}>=</span>{" "}
                            <span style={{ color: "#c792ea" }}>()</span>{" "}
                            <span style={{ color: "#89ddff" }}>=&gt;</span>{" "}
                            <span style={{ color: "#89ddff" }}>{"{"}</span>
                        </div>
                        <div className="pl-4">
                            <span style={{ color: "#c792ea" }}>return</span>{" "}
                            <span style={{ color: "#89ddff" }}>(</span>
                        </div>
                        <div className="pl-8">
                            <span style={{ color: "#89ddff" }}>&lt;</span>
                            <span style={{ color: "#f07178" }}>section</span>{" "}
                            <span style={{ color: "#c792ea" }}>className</span>
                            <span style={{ color: "#89ddff" }}>=</span>
                            <span style={{ color: "#c3e88d" }}>&quot;hero&quot;</span>
                            <span style={{ color: "#89ddff" }}>&gt;</span>
                        </div>
                        <div className="pl-12">
                            <span style={{ color: "#89ddff" }}>&lt;</span>
                            <span style={{ color: "#ffcb6b" }}>Motion</span>
                            <span style={{ color: "#89ddff" }}>&gt;</span>
                            <span style={{ color: "#c3e88d" }}>DIGITAL</span>
                            <span style={{ color: "#89ddff" }}>&lt;/</span>
                            <span style={{ color: "#ffcb6b" }}>Motion</span>
                            <span style={{ color: "#89ddff" }}>&gt;</span>
                        </div>
                        <div className="pl-8">
                            <span style={{ color: "#89ddff" }}>&lt;/</span>
                            <span style={{ color: "#f07178" }}>section</span>
                            <span style={{ color: "#89ddff" }}>&gt;</span>
                        </div>
                        <div className="pl-4">
                            <span style={{ color: "#89ddff" }}>)</span>
                        </div>
                        <div>
                            <span style={{ color: "#89ddff" }}>{"}"}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FinalUILayer() {
    return (
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full max-w-2xl px-6">
                <div
                    className="mx-auto w-full max-w-md overflow-hidden rounded-2xl border"
                    style={{
                        background: "linear-gradient(135deg, rgba(139,92,246,0.12), rgba(6,182,212,0.08))",
                        borderColor: "rgba(139,92,246,0.2)",
                        boxShadow: "0 0 60px rgba(139,92,246,0.1), 0 20px 80px rgba(0,0,0,0.4)",
                    }}
                >
                    <div className="p-8 md:p-10">
                        <div
                            className="mb-6 inline-block rounded-full px-3 py-1 font-mono text-xs"
                            style={{
                                background: "rgba(139,92,246,0.15)",
                                color: "rgba(139,92,246,0.8)",
                            }}
                        >
                            Live Component
                        </div>

                        <h3
                            className="text-3xl font-light tracking-tight md:text-4xl"
                            style={{ color: "rgba(255,255,255,0.95)" }}
                        >
                            DIGITAL
                        </h3>

                        <p
                            className="mt-3 text-sm leading-relaxed"
                            style={{ color: "rgba(255,255,255,0.45)" }}
                        >
                            Polished, animated, ready for production.
                            Every pixel intentional.
                        </p>

                        <div className="mt-6 flex gap-3">
                            <div
                                className="rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300"
                                style={{
                                    background: "#8B5CF6",
                                    color: "#ffffff",
                                    boxShadow: "0 0 20px rgba(139,92,246,0.3)",
                                }}
                            >
                                Explore
                            </div>
                            <div
                                className="rounded-full px-5 py-2.5 text-sm font-medium"
                                style={{
                                    background: "transparent",
                                    color: "rgba(255,255,255,0.6)",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                }}
                            >
                                Learn more
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// Phase labels
// ─────────────────────────────────────────────────────────────

const PHASES = ["01 — Research & Wireframe", "02 — Code & Build", "03 — Polish & Ship"];
const CYCLE_DURATION = 2500; // ms per phase

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────

export function CinematicProcess() {
    const sectionRef = useRef<HTMLElement>(null);
    const layerRefs = useRef<(HTMLDivElement | null)[]>([null, null, null]);
    const labelRefs = useRef<(HTMLSpanElement | null)[]>([null, null, null]);
    const [activePhase, setActivePhase] = useState(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const isVisibleRef = useRef(false);

    // Animate layer transition
    useEffect(() => {
        const layers = layerRefs.current;
        const labels = labelRefs.current;

        layers.forEach((layer, i) => {
            if (!layer) return;
            if (i === activePhase) {
                gsap.fromTo(layer,
                    { opacity: 0, scale: 1.06 },
                    { opacity: 1, scale: 1, duration: 0.7, ease: "expo.out" }
                );
            } else {
                gsap.to(layer, { opacity: 0, scale: 0.94, duration: 0.5, ease: "expo.in" });
            }
        });

        labels.forEach((label, i) => {
            if (!label) return;
            if (i === activePhase) {
                gsap.fromTo(label, { opacity: 0 }, { opacity: 1, duration: 0.5, delay: 0.2 });
            } else {
                gsap.to(label, { opacity: 0, duration: 0.3 });
            }
        });
    }, [activePhase]);

    // IntersectionObserver to start/stop auto-cycle
    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const isVisible = entries[0].isIntersecting;
                isVisibleRef.current = isVisible;

                if (isVisible && !timerRef.current) {
                    // Start cycling
                    timerRef.current = setInterval(() => {
                        setActivePhase((prev) => (prev + 1) % 3);
                    }, CYCLE_DURATION);
                } else if (!isVisible && timerRef.current) {
                    // Stop cycling when out of view
                    clearInterval(timerRef.current);
                    timerRef.current = null;
                }
            },
            { threshold: 0.3 }
        );

        observer.observe(section);

        return () => {
            observer.disconnect();
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    // Progress dots
    const dots = PHASES.map((_, i) => (
        <button
            key={i}
            onClick={() => setActivePhase(i)}
            className="group flex items-center gap-2"
        >
            <div
                className="h-1.5 rounded-full transition-all duration-500"
                style={{
                    width: i === activePhase ? "2rem" : "0.375rem",
                    background: i === activePhase
                        ? "rgba(139,92,246,0.8)"
                        : "rgba(255,255,255,0.15)",
                }}
            />
        </button>
    ));

    return (
        <section
            ref={sectionRef}
            className="relative py-24 md:py-32"
        >
            {/* Section heading */}
            <div className="relative z-20 px-6">
                <p
                    className="mx-auto max-w-6xl font-mono text-sm"
                    style={{ color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em" }}
                >
                    Process
                </p>
                <h2
                    className="mx-auto mt-4 max-w-6xl text-3xl font-light tracking-tight md:text-4xl"
                    style={{ color: "rgba(255,255,255,0.9)" }}
                >
                    How I think
                </h2>
            </div>

            {/* Layers container — fixed height, no pinning */}
            <div className="relative mx-auto mt-12 flex items-center justify-center overflow-hidden md:mt-16"
                style={{ height: "clamp(380px, 55vh, 550px)" }}
            >
                {/* Layer 1: Wireframe */}
                <div ref={(el) => { layerRefs.current[0] = el; }} className="absolute inset-0" style={{ opacity: 1 }}>
                    <WireframeLayer />
                </div>

                {/* Layer 2: Code */}
                <div ref={(el) => { layerRefs.current[1] = el; }} className="absolute inset-0" style={{ opacity: 0 }}>
                    <CodeLayer />
                </div>

                {/* Layer 3: Final UI */}
                <div ref={(el) => { layerRefs.current[2] = el; }} className="absolute inset-0" style={{ opacity: 0 }}>
                    <FinalUILayer />
                </div>

                {/* Phase label */}
                <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2">
                    {PHASES.map((phase, i) => (
                        <span
                            key={phase}
                            ref={(el) => { labelRefs.current[i] = el; }}
                            className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-xs"
                            style={{
                                color: "rgba(255,255,255,0.25)",
                                letterSpacing: "0.1em",
                                opacity: i === 0 ? 1 : 0,
                            }}
                        >
                            {phase}
                        </span>
                    ))}
                </div>
            </div>

            {/* Progress dots */}
            <div className="mt-8 flex items-center justify-center gap-3">
                {dots}
            </div>
        </section>
    );
}
