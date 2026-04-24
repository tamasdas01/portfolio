"use client";

import { useEffect, useRef, useCallback } from "react";
import { useIsMobile } from "@/lib/use-mobile";

// ─────────────────────────────────────────────────────────────
// CustomCursor — Dot + Lagged Ring
//
// Dot   : snaps instantly to mouse position
// Ring  : follows with LERP lag (factor 0.11) for a fluid feel
// Hover : ring expands (44px → 68px) and switches to purple tint
//
// Theme: matches the site's black + purple (#8B5CF6) palette.
// Hidden on mobile — no-op when touch is the primary input.
// ─────────────────────────────────────────────────────────────

const LERP = 0.11; // lower = more lag

export function CustomCursor() {
  const isMobile = useIsMobile();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const mx = useRef(0);
  const my = useRef(0);
  const rx = useRef(0);
  const ry = useRef(0);
  const rafId = useRef<number>(0);

  const animate = useCallback(() => {
    rx.current += (mx.current - rx.current) * LERP;
    ry.current += (my.current - ry.current) * LERP;

    if (ringRef.current) {
      ringRef.current.style.transform = `translate(${rx.current}px, ${ry.current}px) translate(-50%, -50%)`;
    }

    rafId.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (isMobile) return; // no custom cursor on touch devices

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Kick off the LERP animation loop
    rafId.current = requestAnimationFrame(animate);

    // Dot follows instantly
    const onMove = (e: MouseEvent) => {
      mx.current = e.clientX;
      my.current = e.clientY;
      dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    };

    // Interactive targets — ring expands + turns purple
    const SELECTORS = "a, button, [data-magnetic], input, textarea, label, [role='button']";

    const onEnter = () => ring.classList.add("cursor-ring--hover");
    const onLeave = () => ring.classList.remove("cursor-ring--hover");

    // Attach enter/leave via event delegation (catches dynamic elements too)
    const onOverDelegate = (e: MouseEvent) => {
      if ((e.target as Element)?.closest(SELECTORS)) onEnter();
    };
    const onOutDelegate = (e: MouseEvent) => {
      if ((e.target as Element)?.closest(SELECTORS)) onLeave();
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOverDelegate);
    document.addEventListener("mouseout", onOutDelegate);

    // Hide default cursor via class on <html>
    document.documentElement.classList.add("custom-cursor-active");

    return () => {
      cancelAnimationFrame(rafId.current);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOverDelegate);
      document.removeEventListener("mouseout", onOutDelegate);
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, [isMobile, animate]);

  // On mobile, render nothing
  if (isMobile) return null;

  return (
    <>
      {/* Dot — instant follow */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 9,
          height: 9,
          borderRadius: "50%",
          background: "#A78BFA",
          pointerEvents: "none",
          zIndex: 99999,
          transform: "translate(-50%, -50%)",
          willChange: "transform",
          // Subtle inner glow matching the purple accent
          boxShadow: "0 0 6px 1px rgba(167,139,250,0.5)",
        }}
      />

      {/* Ring — LERP lag follow */}
      <div
        ref={ringRef}
        className="cursor-ring"
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: "1.5px solid rgba(139,92,246,0.55)",
          pointerEvents: "none",
          zIndex: 99998,
          transform: "translate(-50%, -50%)",
          willChange: "transform",
          transition: "width 0.35s cubic-bezier(0.16,1,0.3,1), height 0.35s cubic-bezier(0.16,1,0.3,1), border-color 0.35s, background 0.35s",
        }}
      />
    </>
  );
}
