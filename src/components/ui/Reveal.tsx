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
        // Mobile: fire a little earlier (-40px) so animations feel snappier
        // on short screens without the user having to over-scroll.
        // Desktop: keep the conservative -80px for a more deliberate reveal.
        margin: isMobile ? "-40px" : "-80px",
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
