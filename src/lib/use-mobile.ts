import { useEffect, useState } from "react";

/**
 * Returns true when the viewport width is ≤ 768px (mobile).
 * SSR-safe: defaults to false on the server to avoid hydration mismatch.
 * Re-evaluates on window resize.
 */
export function useIsMobile(): boolean {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const mql = window.matchMedia("(max-width: 768px)");
        const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);

        // Set initial value
        setIsMobile(mql.matches);

        mql.addEventListener("change", handler);
        return () => mql.removeEventListener("change", handler);
    }, []);

    return isMobile;
}
