"use client";

import {
    createContext,
    useContext,
    useState,
    useCallback,
    useMemo,
    type ReactNode,
} from "react";

interface IntroContextType {
    /** True once the home intro has finished (or was skipped). Drives hero entrance timing. */
    isIntroComplete: boolean;
    /** True only while the intro overlay is actually playing — the only time scroll is locked. */
    isIntroPlaying: boolean;
    completeIntro: () => void;
    setIntroPlaying: (playing: boolean) => void;
}

const IntroContext = createContext<IntroContextType | null>(null);

export function IntroProvider({ children }: { children: ReactNode }) {
    const [isIntroComplete, setIsIntroComplete] = useState(false);
    const [isIntroPlaying, setIsIntroPlaying] = useState(false);

    const completeIntro = useCallback(() => {
        setIsIntroComplete(true);
        setIsIntroPlaying(false);
    }, []);

    const setIntroPlaying = useCallback((playing: boolean) => {
        setIsIntroPlaying(playing);
    }, []);

    const value = useMemo(
        () => ({ isIntroComplete, isIntroPlaying, completeIntro, setIntroPlaying }),
        [isIntroComplete, isIntroPlaying, completeIntro, setIntroPlaying]
    );

    return <IntroContext.Provider value={value}>{children}</IntroContext.Provider>;
}

export function useIntro() {
    const context = useContext(IntroContext);
    if (!context) {
        throw new Error("useIntro must be used within IntroProvider");
    }
    return context;
}
