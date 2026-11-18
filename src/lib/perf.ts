"use client";

import { useSyncExternalStore } from "react";

/* ─────────────────────────────────────────────────────────
   Adaptive performance tier.

   "high" → full quality.  "low" → identical animations, but
   the expensive *invisible* parts are dialled down (WebGL
   pixel ratio, WebGL frame rate, backdrop blurs).

   Tier comes from two places:
   1. PERF_BOOT_SCRIPT (inline in <head>) — flags devices that
      report ≤ 4 GB RAM, ≤ 4 CPU threads, or Data Saver, before
      anything renders.
   2. startFpsWatchdog() — samples real frame rate for the
      first ~20 s; a machine that can't hold ~45 fps is
      downgraded live, so weak laptops that report "8 GB"
      still get the lighter path.
   ───────────────────────────────────────────────────────── */

export type PerfTier = "high" | "low";

// Also flags repeat visits (intro already seen this session) so the intro
// overlay is hidden at first paint instead of flashing black until hydration.
export const PERF_BOOT_SCRIPT = `(function(){var d=document.documentElement;try{var n=navigator,m=n.deviceMemory,c=n.hardwareConcurrency,s=n.connection&&n.connection.saveData;if((m&&m<=4)||(c&&c<=4)||s){d.setAttribute('data-perf','low')}}catch(e){}try{if(sessionStorage.getItem('introSeen')){d.setAttribute('data-intro-seen','')}}catch(e){}})();`;

const listeners = new Set<() => void>();

function readTier(): PerfTier {
    if (typeof document === "undefined") return "high";
    return document.documentElement.getAttribute("data-perf") === "low" ? "low" : "high";
}

export function getPerfTier(): PerfTier {
    return readTier();
}

export function setPerfTier(tier: PerfTier) {
    if (typeof document === "undefined" || readTier() === tier) return;
    if (tier === "low") document.documentElement.setAttribute("data-perf", "low");
    else document.documentElement.removeAttribute("data-perf");
    listeners.forEach((l) => l());
}

export function subscribePerfTier(cb: () => void) {
    listeners.add(cb);
    return () => {
        listeners.delete(cb);
    };
}

export function usePerfTier(): PerfTier {
    return useSyncExternalStore(subscribePerfTier, readTier, () => "high");
}

export function prefersReducedMotion(): boolean {
    return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

let watchdogStarted = false;

/** Samples FPS in 1.5 s windows; two slow windows in a row → "low". Stops after ~20 s. */
export function startFpsWatchdog() {
    if (watchdogStarted || typeof window === "undefined") return;
    watchdogStarted = true;
    if (readTier() === "low") return;

    const WINDOW_MS = 1500;
    const MIN_FPS = 45;
    const MAX_RUNTIME_MS = 20000;

    let frames = 0;
    let windowStart = performance.now();
    const startedAt = windowStart;
    let slowWindows = 0;
    let raf = 0;

    const tick = (now: number) => {
        frames++;
        const elapsed = now - windowStart;
        if (elapsed >= WINDOW_MS) {
            // Ignore windows where the tab was hidden (rAF is paused/throttled).
            if (!document.hidden) {
                const fps = (frames * 1000) / elapsed;
                slowWindows = fps < MIN_FPS ? slowWindows + 1 : 0;
                if (slowWindows >= 2) {
                    setPerfTier("low");
                    return;
                }
            }
            frames = 0;
            windowStart = now;
        }
        if (now - startedAt < MAX_RUNTIME_MS) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    void raf;
}

/**
 * Frame limiter for render loops: returns true when a frame should be drawn.
 * "low" tier draws every other display frame (~30 fps on a 60 Hz screen).
 */
export function createFrameGate() {
    let skip = false;
    return (tier: PerfTier) => {
        if (tier !== "low") return true;
        skip = !skip;
        return !skip;
    };
}
