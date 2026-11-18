"use client";

import { useCallback, useState } from "react";
import { useIntro } from "@/providers/IntroProvider";
import { MultilingualIntro } from "@/components/intro/MultilingualIntro";

export function IntroSequence() {
    const { completeIntro } = useIntro();
    const [mounted, setMounted] = useState(true);

    // onReveal fires as the overlay *starts* fading, so the hero entrance
    // overlaps the cross-fade instead of waiting on a black screen.
    const handleReveal = useCallback(() => completeIntro(), [completeIntro]);
    const handleDone = useCallback(() => setMounted(false), []);

    if (!mounted) return null;

    return <MultilingualIntro onReveal={handleReveal} onDone={handleDone} />;
}
