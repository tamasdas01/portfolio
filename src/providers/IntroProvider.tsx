"use client";

import {
    createContext,
    useContext,
    useState,
    useCallback,
    type ReactNode,
} from "react";

interface IntroContextType {
    isIntroComplete: boolean;
    completeIntro: () => void;
}

const IntroContext = createContext<IntroContextType | null>(null);

export function IntroProvider({ children }: { children: ReactNode }) {
    const [isIntroComplete, setIsIntroComplete] = useState(false);

    const completeIntro = useCallback(() => {
        setIsIntroComplete(true);
    }, []);

    return (
        <IntroContext.Provider value={{ isIntroComplete, completeIntro }}>
            {children}
        </IntroContext.Provider>
    );
}

export function useIntro() {
    const context = useContext(IntroContext);
    if (!context) {
        throw new Error("useIntro must be used within IntroProvider");
    }
    return context;
}
