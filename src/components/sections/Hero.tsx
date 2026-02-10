"use client";

import { motion } from "framer-motion";
import { useIntro } from "@/providers/IntroProvider";
import { SITE } from "@/lib/constants";
import { ease, staggerContainer, fadeUp, fadeUpSmall } from "@/lib/animations";

export function Hero() {
    const { isIntroComplete } = useIntro();

    return (
        <section className="relative flex min-h-screen items-end px-6 pb-16 md:px-8 md:pb-24">
            <div className="mx-auto w-full max-w-7xl">
                {isIntroComplete && (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="space-y-6"
                    >
                        <motion.p
                            variants={fadeUpSmall}
                            className="font-mono text-sm text-text-secondary"
                        >
                            {SITE.title}
                        </motion.p>

                        <motion.h1
                            variants={fadeUp}
                            className="max-w-5xl text-5xl font-light leading-[1.05] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
                        >
                            {SITE.description}
                        </motion.h1>

                        <motion.div
                            variants={fadeUpSmall}
                            className="pt-4"
                        >
                            <a
                                href={`mailto:${SITE.email}`}
                                className="group inline-flex items-center gap-2 font-mono text-sm text-text-secondary transition-colors duration-300 hover:text-accent"
                            >
                                {SITE.email}
                                <span className="inline-block transition-transform duration-300 ease-expo group-hover:translate-x-1">
                                    →
                                </span>
                            </a>
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
