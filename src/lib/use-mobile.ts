import { useSyncExternalStore } from "react";

const QUERY = "(max-width: 768px)";

function subscribe(onChange: () => void) {
    const mql = window.matchMedia(QUERY);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
}

/**
 * Returns true when the viewport width is ≤ 768px (mobile).
 * SSR-safe: the server snapshot is `false`, so hydration matches,
 * then React re-renders with the real value. Re-evaluates on resize.
 */
export function useIsMobile(): boolean {
    return useSyncExternalStore(
        subscribe,
        () => window.matchMedia(QUERY).matches,
        () => false
    );
}
