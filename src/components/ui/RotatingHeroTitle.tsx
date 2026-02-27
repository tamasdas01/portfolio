"use client";

import { useEffect, useState } from "react";

const WORDS = [
    { text: "Man", color: "#c4f046" },        // accent lime
    { text: "Myth", color: "#a855f7" },       // vivid purple
    { text: "Legend", color: "#f59e0b" },     // gold
];

export const RotatingHeroTitle = () => {
    const [index, setIndex] = useState(0);
    const [phase, setPhase] = useState<"in" | "out">("in");

    useEffect(() => {
        const interval = setInterval(() => {
            // Start exit animation
            setPhase("out");

            // After exit completes (600ms), swap word and enter
            setTimeout(() => {
                setIndex((prev) => (prev + 1) % WORDS.length);
                setPhase("in");
            }, 600);
        }, 2800);

        return () => clearInterval(interval);
    }, []);

    const current = WORDS[index];

    return (
        <div className="text-center">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-light tracking-tight leading-none select-none">
                <span className="text-text-primary">The </span>
                <span
                    className="rht-word-container"
                    style={{ "--word-color": current.color, minWidth: "7ch" } as React.CSSProperties}
                >
                    <span
                        key={current.text}
                        className={`rht-word ${phase === "in" ? "rht-enter" : "rht-exit"}`}
                        style={{ color: current.color }}
                    >
                        {current.text}
                    </span>
                </span>
            </h2>
        </div>
    );
};
