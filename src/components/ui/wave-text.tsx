"use client";

import { motion } from "framer-motion";

// Inline classname helper — no external dependency needed
function cn(...classes: (string | undefined | false)[]) {
    return classes.filter(Boolean).join(" ");
}

interface AnimatedTextProps {
    text?: string;
    className?: string;
}

function Text_03({
    text = "Hover me",
    className = "",
}: AnimatedTextProps) {
    return (
        <motion.span
            className={cn(
                "w-full text-center inline-block cursor-pointer transition-all",
                className
            )}
            whileHover="hover"
            initial="initial"
        >
            {text.split("").map((char, index) => (
                <motion.span
                    key={index}
                    className="inline-block"
                    variants={{
                        initial: {
                            y: 0,
                            scale: 1,
                        },
                        hover: {
                            y: -4,
                            scale: 1.2,
                            transition: {
                                type: "spring",
                                stiffness: 300,
                                damping: 15,
                                delay: index * 0.03,
                            },
                        },
                    }}
                >
                    {char === " " ? "\u00A0" : char}
                </motion.span>
            ))}
        </motion.span>
    );
}

export { Text_03 };
