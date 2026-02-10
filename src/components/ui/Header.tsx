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
            className="fixed top-0 left-0 right-0 z-40 mix-blend-difference"
        >
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-8">
                <a
                    href="#"
                    className="font-mono text-sm text-text-primary transition-opacity duration-300 hover:opacity-60"
                >
                    {SITE.name}
                </a>

                <div className="flex items-center gap-8">
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
                            className="font-mono text-sm text-text-primary transition-opacity duration-300 hover:opacity-60"
                        >
                            {item}
                        </motion.a>
                    ))}
                </div>
            </nav>
        </motion.header>
    );
}
