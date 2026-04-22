"use client";

import { useCallback } from "react";
import { useIntro } from "@/providers/IntroProvider";
import { MultilingualIntro } from "@/components/intro/MultilingualIntro";

export function IntroSequence() {
    const { isIntroComplete, completeIntro } = useIntro();

    const handleComplete = useCallback(() => {
        completeIntro();
    }, [completeIntro]);

    if (isIntroComplete) return null;

    return <MultilingualIntro onComplete={handleComplete} />;
}
