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
            "End-to-end digital products — from system architecture and backend logic to pixel-precise interfaces. I don't just build screens; I build things that work in production, at scale, and feel intentional to use.",
    },
    {
        id: "2",
        title: "Who am I?",
        content:
            "I'm Tamas Das — a self-taught full-stack developer and freelancer from Kolkata. I've independently designed, built, and shipped real products used by real people. I treat every project like a founder would: with ownership, urgency, and care for the long term.",
    },
    {
        id: "3",
        title: "My design approach",
        content:
            "System-first, always. I start with structure — how data flows, how components scale, how the user moves. Design is the last mile, not the starting point. That's what makes the end result feel both polished and purposeful.",
    },
    {
        id: "4",
        title: "Beyond work",
        content:
            "I teach school students, hit the gym daily, go on long rides, and shoot photos along the way. Discipline outside of work is what keeps my work disciplined. These aren't hobbies — they're how I stay sharp.",
    },
    {
        id: "5",
        title: "What inspires me",
        content:
            "Products that feel inevitable. The kind where every detail seems obvious in hindsight — but took real thought to get there. Linear, Vercel, Rauno's work. Things built with conviction, not trend.",
    },
    {
        id: "6",
        title: "Who I work with",
        content:
            "Founders who need a technical co-pilot. Startups that want production-quality work without a full engineering team. Clients who value clarity and execution over back-and-forth. If you have a real problem, I'm interested.",
    },
    {
        id: "7",
        title: "My toolkit",
        content:
            "Next.js, React, TypeScript, Supabase, Firebase, Tailwind, Framer Motion, and Node.js form the core. But the real toolkit is product thinking — knowing when to use what, and when to ship and iterate.",
    },
    {
        id: "8",
        title: "Let's connect",
        content: (
            <>
                I&apos;m currently open to freelance projects and full-time SDE roles starting 2026. If you&apos;re building something worth building — reach out. I respond to every serious message.
                <span className="flex flex-col sm:flex-row sm:items-center gap-3 mt-3">
                    <a
                        href="/resume.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-mono text-xs text-accent hover:underline underline-offset-4"
                    >
                        View Resume
                    </a>
                    <a
                        href="https://mail.google.com/mail/?view=cm&fs=1&to=das.tamas13@gmail.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-mono text-xs text-accent hover:underline underline-offset-4"
                    >
                        das.tamas13@gmail.com
                    </a>
                </span>
            </>
        ),
    },
];

export function Accordion05() {
    const [openItem, setOpenItem] = useState<string>("1");

    const scrollToSection = (id: string) => {
        const sectionMap: Record<string, string> = {
            "1": "work",         // What do I design? → Projects
            "2": "about",         // Who am I? → About section
            "3": "how-i-think",   // My design approach → How I Think
            "4": "beyond-work",   // Beyond work → Beyond Work section
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
