"use client";

import { useCallback } from "react";
import { useIntro } from "@/providers/IntroProvider";
import { HorizonHeroSection } from "@/components/ui/horizon-hero-section";

export function IntroSequence() {
    const { isIntroComplete, completeIntro } = useIntro();

    const handleComplete = useCallback(() => {
        completeIntro();
    }, [completeIntro]);

    if (isIntroComplete) return null;

    return (
        <HorizonHeroSection
            autoPlay={true}
            onComplete={handleComplete}
        />
    );
}
