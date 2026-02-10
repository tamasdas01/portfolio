"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Lenis from "lenis";
import { useIntro } from "./IntroProvider";

export function LenisProvider({ children }: { children: ReactNode }) {
    const lenisRef = useRef<Lenis | null>(null);
    const { isIntroComplete } = useIntro();

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
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
