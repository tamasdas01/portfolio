"use client";

import { useRef } from "react";
import {
    motion,
    useInView,
    type Variants,
} from "framer-motion";
import { fadeUp, baseTransition } from "@/lib/animations";

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
    const isInView = useInView(ref, {
        once: true,
        margin: "-80px",
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
