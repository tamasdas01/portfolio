"use client";

import dynamic from "next/dynamic";

// three.js (~150 KB gz) is split out of the main bundle so the page hydrates
// faster on low-end devices; it downloads in parallel with the intro.
const DottedSurface = dynamic(
    () => import("@/components/ui/dotted-surface").then((m) => m.DottedSurface),
    { ssr: false }
);

export function BackgroundSurface() {
    return <DottedSurface />;
}
