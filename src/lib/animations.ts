import type { Variants, Transition } from "framer-motion";

// Core easing — used everywhere
export const ease = [0.16, 1, 0.3, 1] as const;

// Core transition preset
export const baseTransition: Transition = {
    duration: 0.7,
    ease,
};

// Stagger children preset
export const staggerContainer: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1,
        },
    },
};

// Fade up — the primary reveal animation
export const fadeUp: Variants = {
    hidden: {
        opacity: 0,
        y: 24,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: baseTransition,
    },
};

// Fade in — no movement, just opacity
export const fadeIn: Variants = {
    hidden: {
        opacity: 0,
    },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.8,
            ease,
        },
    },
};

// Subtle fade up — for smaller elements, less movement
export const fadeUpSmall: Variants = {
    hidden: {
        opacity: 0,
        y: 12,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease,
        },
    },
};

// Line reveal — for decorative dividers
export const lineReveal: Variants = {
    hidden: {
        scaleX: 0,
    },
    visible: {
        scaleX: 1,
        transition: {
            duration: 0.8,
            ease,
        },
    },
};
