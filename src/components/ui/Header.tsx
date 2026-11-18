"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useIntro } from "@/providers/IntroProvider";
import { SITE } from "@/lib/constants";
import { fadeIn, ease } from "@/lib/animations";
import { Text_03 } from "@/components/ui/wave-text";

/** Thin purple reading-progress line. Transform-only (scaleX), so it costs ~nothing. */
function ScrollProgress() {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });
    return (
        <motion.div
            aria-hidden="true"
            className="fixed top-0 left-0 right-0 z-50 h-[2px] origin-left pointer-events-none"
            style={{
                scaleX,
                background: "linear-gradient(90deg, rgba(167,139,250,0), #A78BFA 30%, #7C3AED)",
            }}
        />
    );
}

export function Header() {
    const { isIntroComplete } = useIntro();

    if (!isIntroComplete) return null;

    return (
        <>
            <ScrollProgress />
            <motion.header
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                className="fixed top-0 left-0 right-0 z-40 md:mix-blend-difference"
            >
                {/* Mobile only: soft backing so nav text never collides with content */}
                <div
                    aria-hidden="true"
                    className="md:hidden absolute inset-x-0 top-0 h-[84px] pointer-events-none bg-gradient-to-b from-black/85 via-black/45 to-transparent"
                />
                <nav
                    aria-label="Primary"
                    className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-8 md:py-6"
                >
                    <a
                        href="#"
                        aria-label="Tamas Das — back to top"
                        className="font-mono text-xs tracking-widest text-text-primary transition-opacity duration-300 hover:opacity-60 md:text-sm"
                    >
                        {SITE.name}
                    </a>

                    <div className="flex items-center gap-5 md:gap-8">
                        {["WORK", "ABOUT", "CONTACT"].map((item, i) => (
                            <motion.a
                                key={item}
                                href={`#${item.toLowerCase()}`}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.5,
                                    ease,
                                    delay: 0.1 + i * 0.05,
                                }}
                                className="font-mono text-xs tracking-widest text-white md:text-gray-400 transition-colors duration-300 hover:text-white md:text-sm"
                            >
                                <Text_03 text={item} />
                            </motion.a>
                        ))}
                    </div>
                </nav>
            </motion.header>
        </>
    );
}
