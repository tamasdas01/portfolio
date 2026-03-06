"use client";

import { useRef } from "react";
import {
    motion,
    useInView,
    type Variants,
} from "framer-motion";
import { fadeUp, baseTransition } from "@/lib/animations";
import { useIsMobile } from "@/lib/use-mobile";

interface RevealProps {
    children: React.ReactNode;
    variants?: Variants;
    className?: string;
    delay?: number;
    width?: "fit" | "full";
}

export function Reveal({
    children,
    variants = fadeUp,
    className,
    delay = 0,
    width = "full",
}: RevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isMobile = useIsMobile();
    const isInView = useInView(ref, {
        once: true,
        // Mobile: fire a little earlier (-10px) so animations feel snappier
        // on short screens without the user having to over-scroll.
        // Desktop: keep a conservative -20px for a more deliberate reveal, 
        // but small enough to guarantee footer visibility.
        margin: isMobile ? "-10px" : "-20px",
    });

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={variants}
            transition={{ ...baseTransition, delay }}
            className={width === "full" ? className : `w-fit ${className ?? ""}`}
        >
            {children}
        </motion.div>
    );
}
