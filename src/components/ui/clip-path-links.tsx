"use client";

import React from "react";
import {
    Github,
    Instagram,
    Linkedin,
    Mail,
} from "lucide-react";
import { useAnimate } from "framer-motion";

// ─────────────────────────────────────────────────────────────
// Clip-path keyframes
// ─────────────────────────────────────────────────────────────

const NO_CLIP = "polygon(0 0, 100% 0, 100% 100%, 0% 100%)";
const BOTTOM_RIGHT_CLIP = "polygon(0 0, 100% 0, 0 0, 0% 100%)";
const TOP_RIGHT_CLIP = "polygon(0 0, 0 100%, 100% 100%, 0% 100%)";
const BOTTOM_LEFT_CLIP = "polygon(100% 100%, 100% 0, 100% 100%, 0 100%)";
const TOP_LEFT_CLIP = "polygon(0 0, 100% 0, 100% 100%, 100% 0)";

const ENTRANCE_KEYFRAMES: Record<string, string[]> = {
    left: [BOTTOM_RIGHT_CLIP, NO_CLIP],
    bottom: [BOTTOM_RIGHT_CLIP, NO_CLIP],
    top: [BOTTOM_RIGHT_CLIP, NO_CLIP],
    right: [TOP_LEFT_CLIP, NO_CLIP],
};

const EXIT_KEYFRAMES: Record<string, string[]> = {
    left: [NO_CLIP, TOP_RIGHT_CLIP],
    bottom: [NO_CLIP, TOP_RIGHT_CLIP],
    top: [NO_CLIP, TOP_RIGHT_CLIP],
    right: [NO_CLIP, BOTTOM_LEFT_CLIP],
};

// ─────────────────────────────────────────────────────────────
// LinkBox
// ─────────────────────────────────────────────────────────────

interface LinkBoxProps {
    Icon?: React.ComponentType<{ className?: string }>;
    href: string;
    label?: string;
}

function LinkBox({ Icon, href, label }: LinkBoxProps) {
    const [scope, animate] = useAnimate();

    const getNearestSide = (e: React.MouseEvent) => {
        const box = (e.currentTarget as HTMLElement).getBoundingClientRect();

        const sides = [
            { proximity: Math.abs(box.left - e.clientX), side: "left" },
            { proximity: Math.abs(box.right - e.clientX), side: "right" },
            { proximity: Math.abs(box.top - e.clientY), side: "top" },
            { proximity: Math.abs(box.bottom - e.clientY), side: "bottom" },
        ];

        sides.sort((a, b) => a.proximity - b.proximity);
        return sides[0].side;
    };

    const handleMouseEnter = (e: React.MouseEvent) => {
        const side = getNearestSide(e);
        animate(scope.current, { clipPath: ENTRANCE_KEYFRAMES[side] });
    };

    const handleMouseLeave = (e: React.MouseEvent) => {
        const side = getNearestSide(e);
        animate(scope.current, { clipPath: EXIT_KEYFRAMES[side] });
    };

    return (
        <a
            href={href}
            target={href.startsWith("mailto:") ? undefined : "_blank"}
            rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="relative grid h-20 w-full place-content-center sm:h-28 md:h-36"
            style={{ background: "#0a0a0a", color: "rgba(255,255,255,0.6)" }}
        >
            {Icon && <Icon className="text-xl sm:text-3xl md:text-4xl" />}
            {label && !Icon && (
                <span className="text-sm sm:text-base md:text-lg font-mono tracking-wider uppercase">
                    {label}
                </span>
            )}

            {/* Hover overlay with clip-path animation */}
            <div
                ref={scope}
                style={{ clipPath: BOTTOM_RIGHT_CLIP }}
                className="absolute inset-0 grid place-content-center transition-colors duration-300"
            >
                <div
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(135deg, #A78BFA 0%, #7C3AED 100%)" }}
                />
                <div className="relative z-10 text-white">
                    {Icon && <Icon className="text-xl sm:text-3xl md:text-4xl" />}
                    {label && !Icon && (
                        <span className="text-sm sm:text-base md:text-lg font-mono tracking-wider uppercase">
                            {label}
                        </span>
                    )}
                </div>
            </div>
        </a>
    );
}

// ─────────────────────────────────────────────────────────────
// ClipPathLinks
// ─────────────────────────────────────────────────────────────

export function ClipPathLinks() {
    return (
        <div
            className="divide-y divide-white/[0.08] border border-white/[0.08]"
        >
            {/* Row 1: 2 columns — Email + Github */}
            <div className="grid grid-cols-2 divide-x divide-white/[0.08]">
                <LinkBox
                    Icon={Mail}
                    href="mailto:das.tamas13@gmail.com"
                />
                <LinkBox
                    Icon={Github}
                    href="https://github.com/tamasdas01"
                />
            </div>

            {/* Row 2: 2 columns — LinkedIn + Instagram */}
            <div className="grid grid-cols-2 divide-x divide-white/[0.08]">
                <LinkBox Icon={Linkedin} href="https://www.linkedin.com/in/tamas-das-12a6a6288" />
                <LinkBox Icon={Instagram} href="https://www.instagram.com/_tammy_anonymous_?igsh=MWgyNGxuNXFzZnBnaQ==" />
            </div>
        </div>
    );
}
