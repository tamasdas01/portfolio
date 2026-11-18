"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Lenis from "lenis";
import { useIntro } from "./IntroProvider";

export function LenisProvider({ children }: { children: ReactNode }) {
    const lenisRef = useRef<Lenis | null>(null);
    const { isIntroPlaying } = useIntro();

    useEffect(() => {
        // On mobile, skip smooth-wheel so the browser's native touch-momentum
        // (kinetic scrolling) stays in charge.
        const isMobile = window.matchMedia("(max-width: 768px)").matches;

        const lenis = new Lenis({
            duration: 1.2,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: !isMobile, // desktop only — mobile uses native inertia
            autoRaf: true,
        });

        lenisRef.current = lenis;

        return () => {
            lenis.destroy();
            lenisRef.current = null;
        };
    }, []);

    // Lock scrolling ONLY while the intro overlay is playing.
    // (Previously this keyed off "intro not complete", which locked every
    //  page that has no intro — e.g. /projects/* opened directly from Google.)
    useEffect(() => {
        const lenis = lenisRef.current;
        if (!lenis) return;
        if (isIntroPlaying) lenis.stop();
        else lenis.start();
    }, [isIntroPlaying]);

    return <>{children}</>;
}
