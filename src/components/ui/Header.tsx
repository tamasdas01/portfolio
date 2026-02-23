"use client";

import { motion } from "framer-motion";
import { useIntro } from "@/providers/IntroProvider";
import { SITE } from "@/lib/constants";
import { fadeIn, ease } from "@/lib/animations";

export function Header() {
    const { isIntroComplete } = useIntro();

    if (!isIntroComplete) return null;

    return (
        <motion.header
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            // Mobile: remove mix-blend-difference (causes harsh colour inversion
            // on some Android WebView layers); use normal opacity transition instead
            className="fixed top-0 left-0 right-0 z-40 md:mix-blend-difference"
        >
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-8 md:py-6">
                <a
                    href="#"
                    /* Mobile: slightly smaller mono text */
                    className="font-mono text-xs text-text-primary transition-opacity duration-300 hover:opacity-60 md:text-sm"
                >
                    {SITE.name}
                </a>

                <div
                    /* Mobile: tighter gap + smaller text for thumb-friendly targets */
                    className="flex items-center gap-5 md:gap-8"
                >
                    {["Work", "About", "Contact"].map((item, i) => (
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
                            /* Mobile: text-xs for readability; md: restore text-sm */
                            className="font-mono text-xs text-text-primary transition-opacity duration-300 hover:opacity-60 md:text-sm"
                        >
                            {item}
                        </motion.a>
                    ))}
                </div>
            </nav>
        </motion.header>
    );
}
