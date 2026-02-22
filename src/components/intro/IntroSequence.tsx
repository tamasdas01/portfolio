"use client";

import { useCallback } from "react";
import { useIntro } from "@/providers/IntroProvider";
import { ParticleHeroIntro } from "@/components/ui/particle-hero-intro";

export function IntroSequence() {
    const { isIntroComplete, completeIntro } = useIntro();

    const handleComplete = useCallback(() => {
        completeIntro();
    }, [completeIntro]);

    if (isIntroComplete) return null;

    return (
        <ParticleHeroIntro
            words={["Hello"]}
            particleDensity={3}
            autoDismissAfter={3000}
            onComplete={handleComplete}
        />
    );
}
