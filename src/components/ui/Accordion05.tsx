"use client";

import React, { useState } from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const items = [
    {
        id: "1",
        title: "What do I design?",
        content:
            "I create clean, functional interfaces, brand systems, and digital products. My work blends simplicity with clarity and usability.",
    },
    {
        id: "2",
        title: "Who am I?",
        content:
            "I'm Tamas Das — a designer and creative developer focused on building digital experiences that are minimal, meaningful, and timeless.",
    },
    {
        id: "3",
        title: "My design approach",
        content:
            "For me, design isn't just visuals — it's how something feels and works. I focus on clarity, detail, and storytelling in every project.",
    },
    {
        id: "4",
        title: "Beyond design",
        content:
            "I bridge design and development, turning ideas into interactive experiences with modern tools and technology.",
    },
    {
        id: "5",
        title: "What inspires me",
        content:
            "Minimalism, architecture, and everyday details. I believe great design is found in the small things we often overlook.",
    },
    {
        id: "6",
        title: "Who I work with",
        content:
            "I collaborate with startups, brands, and individuals who value thoughtful design and want to create lasting impact.",
    },
    {
        id: "7",
        title: "My toolkit",
        content:
            "Figma, Next.js, and modern frameworks are part of my process — but for me, tools always serve the idea, not the other way around.",
    },
    {
        id: "8",
        title: "Let's connect",
        content:
            "You can reach me through das.tamas13@gmail.com or on social platforms. I'm always open to new projects, collaborations, and conversations.",
    },
];

export function Accordion05() {
    const [openItem, setOpenItem] = useState<string>("1");

    const scrollToSection = (id: string) => {
        const sectionMap: Record<string, string> = {
            "1": "work",         // What do I design? → Projects
            "2": "about",         // Who am I? → About section
            "3": "how-i-think",   // My design approach → How I Think
            "7": "toolkit",       // My toolkit → I build digital experiences
            "8": "contact",       // Let's connect → Contact
        };

        const targetId = sectionMap[id];
        if (targetId) {
            const el = document.getElementById(targetId);
            if (el) {
                el.scrollIntoView({ behavior: "smooth" });
            }
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto">
            <Accordion
                type="single"
                value={openItem}
                onValueChange={(val) => {
                    if (val) {
                        setOpenItem(val);
                        scrollToSection(val);
                    }
                }}
                collapsible
                className="w-full"
            >
                {items.map((item) => (
                    <AccordionItem
                        value={item.id}
                        key={item.id}
                        className="border-white/[0.08] last:border-b"
                    >
                        <AccordionTrigger
                            className={`text-left pl-6 md:pl-14 overflow-hidden duration-200 hover:no-underline cursor-pointer
                                -space-y-6 data-[state=open]:space-y-0
                                text-white/[0.15] data-[state=open]:text-white
                                [&>svg]:hidden`}
                        >
                            <div className="flex flex-1 items-start gap-4">
                                <p className="text-xs text-white/25 mt-1 md:mt-2">
                                    {item.id}
                                </p>
                                <h1 className="uppercase relative text-3xl md:text-5xl font-light tracking-tight">
                                    {item.title}
                                </h1>
                            </div>
                        </AccordionTrigger>

                        <AccordionContent className="text-white/40 pb-6 pl-6 md:px-20 text-sm md:text-base leading-relaxed">
                            {item.content}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}
