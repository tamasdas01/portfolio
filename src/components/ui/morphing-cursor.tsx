"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/lib/use-mobile";

// ─────────────────────────────────────────────────────────────
// MagneticText — Desktop: magnetic hover with expanding mask
//                Mobile: tap-to-change animated button
// ─────────────────────────────────────────────────────────────

interface MagneticTextProps {
    text: string;
    hoverText: string;
    href?: string;
    className?: string;
}

const SPRING_CONFIG = { damping: 25, stiffness: 300, mass: 0.5 };

export function MagneticText({
    text,
    hoverText,
    href = "#work",
    className = "",
}: MagneticTextProps) {
    const isMobile = useIsMobile();

    if (isMobile) {
        return (
            <MobileCTA text={text} hoverText={hoverText} href={href} className={className} />
        );
    }

    return (
        <DesktopMagnetic text={text} hoverText={hoverText} href={href} className={className} />
    );
}

// ─────────────────────────────────────────────────────────────
// Mobile: Clean tap-to-expand button
// ─────────────────────────────────────────────────────────────

function MobileCTA({
    text,
    hoverText,
    href,
    className,
}: MagneticTextProps) {
    const [tapped, setTapped] = useState(false);

    const handleTap = useCallback(() => {
        setTapped(true);
        // Auto-reset after animation completes
        setTimeout(() => setTapped(false), 1800);
    }, []);

    return (
        <motion.a
            href={href}
            onClick={handleTap}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
            className={`inline-flex items-center justify-center ${className}`}
        >
            <motion.div
                animate={{
                    scale: tapped ? 1.06 : 1,
                    backgroundColor: tapped
                        ? "rgba(139, 92, 246, 0.2)"
                        : "rgba(255, 255, 255, 0.04)",
                    borderColor: tapped
                        ? "rgba(139, 92, 246, 0.5)"
                        : "rgba(255, 255, 255, 0.1)",
                }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="relative overflow-hidden rounded-full border px-8 py-4"
            >
                <AnimatePresence mode="wait">
                    <motion.span
                        key={tapped ? "hover" : "default"}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="block font-mono text-sm tracking-[0.2em]"
                        style={{
                            color: tapped
                                ? "rgba(139, 92, 246, 0.9)"
                                : "rgba(255, 255, 255, 0.5)",
                        }}
                    >
                        {tapped ? hoverText : text}
                    </motion.span>
                </AnimatePresence>

                {/* Expanding circle on tap */}
                <AnimatePresence>
                    {tapped && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0.4 }}
                            animate={{ scale: 3, opacity: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6 }}
                            className="absolute inset-0 m-auto h-12 w-12 rounded-full"
                            style={{ background: "rgba(139, 92, 246, 0.15)" }}
                        />
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.a>
    );
}

// ─────────────────────────────────────────────────────────────
// Desktop: Magnetic text with cursor morph and expanding mask
// ─────────────────────────────────────────────────────────────

function DesktopMagnetic({
    text,
    hoverText,
    href,
    className,
}: MagneticTextProps) {
    const containerRef = useRef<HTMLAnchorElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    // Magnetic offset
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, SPRING_CONFIG);
    const springY = useSpring(y, SPRING_CONFIG);

    // Expanding mask progress
    const maskProgress = useSpring(0, { damping: 30, stiffness: 200 });

    const handleMouseMove = useCallback(
        (e: React.MouseEvent) => {
            const el = containerRef.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            // Subtle magnetic pull (max ~12px)
            x.set((e.clientX - centerX) * 0.15);
            y.set((e.clientY - centerY) * 0.15);
        },
        [x, y]
    );

    const handleMouseEnter = useCallback(() => {
        setIsHovered(true);
        maskProgress.set(1);
    }, [maskProgress]);

    const handleMouseLeave = useCallback(() => {
        setIsHovered(false);
        maskProgress.set(0);
        x.set(0);
        y.set(0);
    }, [maskProgress, x, y]);

    return (
        <motion.a
            ref={containerRef}
            href={href}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
            style={{ x: springX, y: springY }}
            className={`group relative inline-flex cursor-pointer items-center justify-center ${className}`}
        >
            <div
                className="relative overflow-hidden rounded-full border px-10 py-5 transition-colors duration-500"
                style={{
                    borderColor: isHovered
                        ? "rgba(139, 92, 246, 0.5)"
                        : "rgba(255, 255, 255, 0.1)",
                    background: isHovered
                        ? "rgba(139, 92, 246, 0.08)"
                        : "rgba(255, 255, 255, 0.02)",
                }}
            >
                {/* Default text */}
                <span
                    className="relative z-10 block font-mono text-sm tracking-[0.2em] transition-all duration-500"
                    style={{
                        color: isHovered ? "transparent" : "rgba(255, 255, 255, 0.5)",
                    }}
                >
                    {text}
                </span>

                {/* Hover text — slides in via mask */}
                <motion.span
                    initial={{ opacity: 0, y: 4 }}
                    animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0 z-20 flex items-center justify-center font-mono text-sm tracking-[0.2em]"
                    style={{ color: "rgba(139, 92, 246, 0.9)" }}
                >
                    {hoverText}
                </motion.span>

                {/* Expanding circular highlight */}
                <motion.div
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                    animate={{
                        width: isHovered ? "120%" : "0%",
                        height: isHovered ? "200%" : "0%",
                        opacity: isHovered ? 1 : 0,
                    }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                        background:
                            "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)",
                    }}
                />
            </div>

            {/* Outer glow on hover */}
            <motion.div
                className="pointer-events-none absolute inset-0 rounded-full"
                animate={{
                    boxShadow: isHovered
                        ? "0 0 40px rgba(139,92,246,0.15), 0 0 80px rgba(139,92,246,0.08)"
                        : "0 0 0px transparent",
                }}
                transition={{ duration: 0.5 }}
            />
        </motion.a>
    );
}
