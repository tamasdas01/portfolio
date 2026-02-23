"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Lenis from "lenis";
import { useIntro } from "./IntroProvider";

export function LenisProvider({ children }: { children: ReactNode }) {
    const lenisRef = useRef<Lenis | null>(null);
    const { isIntroComplete } = useIntro();

    useEffect(() => {
        // On mobile, skip smooth-wheel so the browser's native touch-momentum
        // (kinetic scrolling) stays in charge.  Lenis is still initialised so
        // lenis.stop() can lock scroll during the intro via the CSS
        // .lenis-stopped class — that path works independently of smoothWheel.
        const isMobile = window.matchMedia("(max-width: 768px)").matches;

        const lenis = new Lenis({
            duration: 1.2,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: !isMobile, // desktop only — mobile uses native inertia
        });

        lenisRef.current = lenis;

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, []);

    // Lock scrolling during intro
    useEffect(() => {
        if (!lenisRef.current) return;

        if (isIntroComplete) {
            lenisRef.current.start();
        } else {
            lenisRef.current.stop();
        }
    }, [isIntroComplete]);

    return <>{children}</>;
}
