"use client";

import { useRef, useState, useCallback } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";
import { ease } from "@/lib/animations";
import { useIsMobile } from "@/lib/use-mobile";

// ─────────────────────────────────────────────────────────────
// Node data
// ─────────────────────────────────────────────────────────────

interface MindNode {
    id: string;
    label: string;
    insight: string;
    x: number; // % from left
    y: number; // % from top
    color: string;
}

const NODES: MindNode[] = [
    {
        id: "systems",
        label: "Systems Thinking",
        insight: "I architect before I code. Structure first — features follow.",
        x: 50, y: 30,
        color: "#8B5CF6",
    },
    {
        id: "3d",
        label: "3D & Motion",
        insight: "Motion isn't decoration. It's how interfaces communicate intention.",
        x: 22, y: 22,
        color: "#06B6D4",
    },
    {
        id: "precision",
        label: "UI Precision",
        insight: "Details no one notices consciously are the ones everyone feels.",
        x: 78, y: 25,
        color: "#3B82F6",
    },
    {
        id: "performance",
        label: "Performance",
        insight: "Speed is a feature. I optimise for perceived and actual performance.",
        x: 28, y: 55,
        color: "#10B981",
    },
    {
        id: "storytelling",
        label: "Storytelling",
        insight: "Code tells the machine what to do. Design tells the human what to feel.",
        x: 72, y: 58,
        color: "#F59E0B",
    },
    {
        id: "fullstack",
        label: "Full Stack",
        insight: "From database schema to micro-animations — I own the entire stack.",
        x: 50, y: 72,
        color: "#EF4444",
    },
];

// Connections between nodes — pairs of indices
const CONNECTIONS: [number, number][] = [
    [0, 1], [0, 2], [0, 3], [0, 4], [0, 5],
    [1, 3], [2, 4], [3, 5], [4, 5],
];

// ─────────────────────────────────────────────────────────────
// Mobile: Vertical card list — all content visible on tap
// ─────────────────────────────────────────────────────────────

function MindMapMobile() {
    const sectionRef = useRef<HTMLElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-60px" });

    return (
        <section
            ref={sectionRef}
            id="how-i-think"
            className="relative px-6 py-24"
        >
            <div className="mx-auto max-w-xl">
                {/* Section heading */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, ease }}
                    className="font-mono text-sm"
                    style={{ color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em" }}
                >
                    How I Think
                </motion.p>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, ease, delay: 0.1 }}
                    className="mt-4 text-3xl font-light tracking-tight"
                    style={{ color: "rgba(255,255,255,0.9)" }}
                >
                    A connected mind
                </motion.h2>

                {/* Vertical card list — all insight text directly visible */}
                <div className="mt-10 flex flex-col gap-4">
                    {NODES.map((node, i) => (
                        <motion.div
                            key={node.id}
                            initial={{ opacity: 0, y: 24 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.55, ease, delay: 0.2 + i * 0.08 }}
                            className="flex items-start gap-4 rounded-2xl border px-5 py-4"
                            style={{
                                // (backdrop blur removed — costly while scrolling on phones; slightly denser fill instead)
                                background: "rgba(17,17,17,0.82)",
                                borderColor: `${node.color}22`,
                            }}
                        >
                            {/* Color dot */}
                            <div
                                className="mt-1 flex-shrink-0 h-3 w-3 rounded-full"
                                style={{
                                    background: node.color,
                                    boxShadow: `0 0 8px ${node.color}88`,
                                }}
                            />
                            <div>
                                <p
                                    className="font-mono text-xs font-medium"
                                    style={{ color: node.color, letterSpacing: "0.08em" }}
                                >
                                    {node.label}
                                </p>
                                <p
                                    className="mt-1 text-sm leading-relaxed"
                                    style={{ color: "rgba(255,255,255,0.55)" }}
                                >
                                    {node.insight}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ─────────────────────────────────────────────────────────────
// Desktop: Original SVG canvas with hover + mouse parallax
// ─────────────────────────────────────────────────────────────

function MindMapDesktop() {
    const sectionRef = useRef<HTMLElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
    const [hovered, setHovered] = useState<string | null>(null);
    // Mouse position as motion values → nodes drift without React re-renders.
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Subtle mouse-reactive distortion for nodes
    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        mouseX.set(((e.clientX - rect.left) / rect.width - 0.5) * 2);
        mouseY.set(((e.clientY - rect.top) / rect.height - 0.5) * 2);
    }, [mouseX, mouseY]);

    return (
        <section
            ref={sectionRef}
            id="how-i-think"
            className="relative px-6 py-24 md:px-8 md:py-32"
        >
            <div className="mx-auto max-w-6xl">
                {/* Section heading */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease }}
                    className="font-mono text-sm"
                    style={{ color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em" }}
                >
                    How I Think
                </motion.p>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease, delay: 0.1 }}
                    className="mt-4 text-3xl font-light tracking-tight md:text-4xl"
                    style={{ color: "rgba(255,255,255,0.9)" }}
                >
                    A connected mind
                </motion.h2>
            </div>

            {/* Mind map container */}
            <div
                ref={containerRef}
                onMouseMove={handleMouseMove}
                className="relative mx-auto mt-16 md:mt-24"
                style={{ maxWidth: "900px", height: "clamp(400px, 50vh, 600px)" }}
            >
                {/* SVG connections */}
                <svg className="absolute inset-0 h-full w-full" style={{ overflow: "visible" }}>
                    {CONNECTIONS.map(([a, b], i) => {
                        const nA = NODES[a];
                        const nB = NODES[b];
                        const isActive = hovered === nA.id || hovered === nB.id;

                        return (
                            <motion.line
                                key={`${a}-${b}`}
                                x1={`${nA.x}%`}
                                y1={`${nA.y}%`}
                                x2={`${nB.x}%`}
                                y2={`${nB.y}%`}
                                stroke={
                                    isActive
                                        ? (hovered === nA.id ? nA.color : nB.color)
                                        : "rgba(255,255,255,0.06)"
                                }
                                strokeWidth={isActive ? 1.5 : 0.5}
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={
                                    isInView
                                        ? { pathLength: 1, opacity: 1 }
                                        : { pathLength: 0, opacity: 0 }
                                }
                                transition={{
                                    pathLength: { duration: 1.2, ease: "easeOut", delay: 0.3 + i * 0.08 },
                                    opacity: { duration: 0.4, delay: 0.3 + i * 0.08 },
                                    stroke: { duration: 0.4 },
                                    strokeWidth: { duration: 0.4 },
                                }}
                            />
                        );
                    })}
                </svg>

                {/* Nodes */}
                {NODES.map((node, i) => (
                    <MindNodeView
                        key={node.id}
                        node={node}
                        index={i}
                        isInView={isInView}
                        isActive={hovered === node.id}
                        mouseX={mouseX}
                        mouseY={mouseY}
                        onEnter={() => setHovered(node.id)}
                        onLeave={() => setHovered(null)}
                    />
                ))}
            </div>
        </section>
    );
}

// ─────────────────────────────────────────────────────────────
// Desktop node — drifts with the cursor via springs (no re-renders)
// ─────────────────────────────────────────────────────────────

function MindNodeView({
    node,
    index: i,
    isInView,
    isActive,
    mouseX,
    mouseY,
    onEnter,
    onLeave,
}: {
    node: MindNode;
    index: number;
    isInView: boolean;
    isActive: boolean;
    mouseX: MotionValue<number>;
    mouseY: MotionValue<number>;
    onEnter: () => void;
    onLeave: () => void;
}) {
    const dirX = node.x > 50 ? 3 : -3;
    const dirY = node.y > 50 ? 3 : -3;
    const x = useSpring(useTransform(mouseX, (v) => v * dirX), { stiffness: 70, damping: 18, mass: 0.6 });
    const y = useSpring(useTransform(mouseY, (v) => v * dirY), { stiffness: 70, damping: 18, mass: 0.6 });

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
            transition={{
                opacity: { duration: 0.5, delay: 0.4 + i * 0.1 },
                scale: { duration: 0.6, ease, delay: 0.4 + i * 0.1 },
            }}
            onMouseEnter={onEnter}
            onMouseLeave={onLeave}
            className="absolute flex -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col items-center gap-2"
            style={{
                x,
                y,
                left: `${node.x}%`,
                top: `${node.y}%`,
                zIndex: isActive ? 10 : 1,
            }}
        >
            {/* Node dot */}
            <div
                className="relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-500 md:h-12 md:w-12"
                style={{
                    background: isActive
                        ? `${node.color}30`
                        : "rgba(255,255,255,0.04)",
                    border: `1.5px solid ${isActive ? node.color : "rgba(255,255,255,0.08)"}`,
                    boxShadow: isActive
                        ? `0 0 30px ${node.color}40, 0 0 60px ${node.color}15`
                        : "none",
                }}
            >
                <div
                    className="h-2 w-2 rounded-full transition-all duration-500 md:h-2.5 md:w-2.5"
                    style={{
                        background: isActive ? node.color : "rgba(255,255,255,0.2)",
                        boxShadow: isActive ? `0 0 8px ${node.color}` : "none",
                    }}
                />

                {/* Pulse ring on hover */}
                {isActive && (
                    <motion.div
                        initial={{ scale: 1, opacity: 0.6 }}
                        animate={{ scale: 2, opacity: 0 }}
                        transition={{ duration: 1.2, repeat: Infinity }}
                        className="absolute inset-0 rounded-full"
                        style={{ border: `1px solid ${node.color}` }}
                    />
                )}
            </div>

            {/* Label */}
            <span
                className="whitespace-nowrap font-mono text-xs transition-colors duration-300"
                style={{
                    color: isActive ? node.color : "rgba(255,255,255,0.3)",
                    fontSize: "0.65rem",
                    letterSpacing: "0.08em",
                }}
            >
                {node.label}
            </span>

            {/* Insight tooltip */}
            <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={
                    isActive
                        ? { opacity: 1, y: 0, scale: 1 }
                        : { opacity: 0, y: 8, scale: 0.95 }
                }
                transition={{ duration: 0.3 }}
                className="pointer-events-none absolute top-full mt-3 w-56 rounded-xl border p-4"
                style={{
                    background: "rgba(17,17,17,0.95)",
                    borderColor: `${node.color}30`,
                    boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px ${node.color}15`,
                }}
            >
                <p
                    className="text-xs leading-relaxed"
                    style={{ color: "rgba(255,255,255,0.6)" }}
                >
                    {node.insight}
                </p>
            </motion.div>
        </motion.div>
    );
}

// ─────────────────────────────────────────────────────────────
// Exported component — switches between layouts by screen size
// ─────────────────────────────────────────────────────────────

export function MindMap() {
    const isMobile = useIsMobile();
    // Render mobile card list on small screens, original SVG canvas on desktop
    return isMobile ? <MindMapMobile /> : <MindMapDesktop />;
}
