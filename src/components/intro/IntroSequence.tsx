"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { useIntro } from "@/providers/IntroProvider";
import { HELLO_LANGUAGES } from "@/lib/constants";

export function IntroSequence() {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);
    const timelineRef = useRef<gsap.core.Timeline | null>(null);
    const { isIntroComplete, completeIntro } = useIntro();

    const skip = useCallback(() => {
        if (timelineRef.current) {
            timelineRef.current.kill();
        }
        completeIntro();
    }, [completeIntro]);

    useEffect(() => {
        if (isIntroComplete) return;

        const container = containerRef.current;
        const textEl = textRef.current;
        if (!container || !textEl) return;

        const tl = gsap.timeline({
            onComplete: completeIntro,
        });

        timelineRef.current = tl;

        // Phase 1: Rapid language cycling (2.5s)
        const cycleDuration = 2.5;
        const wordCount = HELLO_LANGUAGES.length;
        const perWord = cycleDuration / wordCount;

        HELLO_LANGUAGES.forEach((word, i) => {
            const isLast = i === wordCount - 1;

            tl.to(textEl, {
                duration: 0.02,
                opacity: 0,
                onComplete: () => {
                    textEl.textContent = word;
                },
            }).to(textEl, {
                duration: isLast ? 0.4 : perWord - 0.02,
                opacity: 1,
                ease: "power2.out",
            });
        });

        // Phase 2: Hold on "Hello" (0.6s)
        tl.to(textEl, {
            duration: 0.6,
            opacity: 1,
        });

        // Phase 3: Fade out everything (0.8s)
        tl.to(container, {
            duration: 0.8,
            opacity: 0,
            ease: "power3.inOut",
        });

        return () => {
            tl.kill();
        };
    }, [isIntroComplete, completeIntro]);

    if (isIntroComplete) return null;

    return (
        <div
            ref={containerRef}
            onClick={skip}
            onKeyDown={(e) => {
                if (e.key === "Escape" || e.key === " " || e.key === "Enter") {
                    skip();
                }
            }}
            tabIndex={0}
            role="button"
            aria-label="Skip intro"
            className="fixed inset-0 z-50 flex cursor-pointer items-center justify-center bg-bg"
        >
            <span
                ref={textRef}
                className="text-5xl font-light tracking-tight text-text-primary sm:text-7xl md:text-8xl"
            >
                {HELLO_LANGUAGES[0]}
            </span>

            <span className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-xs text-text-tertiary">
                click to skip
            </span>
        </div>
    );
}
