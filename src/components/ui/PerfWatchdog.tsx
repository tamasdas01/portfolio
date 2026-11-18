"use client";

import { useEffect } from "react";
import { startFpsWatchdog } from "@/lib/perf";

/** Starts the FPS watchdog once per page load. Renders nothing. */
export function PerfWatchdog() {
    useEffect(() => {
        // Give hydration a moment so start-up work doesn't count as "slow".
        const t = setTimeout(startFpsWatchdog, 1200);
        return () => clearTimeout(t);
    }, []);
    return null;
}
