"use client";

import { Reveal } from "@/components/ui/Reveal";
import { fadeUp, fadeUpSmall } from "@/lib/animations";
import { SITE } from "@/lib/constants";

export function Contact() {
    return (
        <section id="contact" className="px-6 py-24 md:px-8 md:py-32">
            <div className="mx-auto max-w-7xl">
                <Reveal>
                    <p className="font-mono text-sm text-text-secondary">Contact</p>
                </Reveal>

                <div className="mt-12 md:mt-16">
                    <Reveal>
                        <h2 className="max-w-3xl text-4xl font-light tracking-tight md:text-5xl lg:text-6xl">
                            Let&apos;s work together
                        </h2>
                    </Reveal>

                    <Reveal delay={0.1}>
                        <div className="mt-8">
                            <a
                                href={`mailto:${SITE.email}`}
                                className="group inline-flex flex-wrap items-center gap-3 text-lg text-accent transition-opacity duration-300 hover:opacity-70 md:text-xl lg:text-2xl"
                                style={{
                                    // Mobile: allow long email addresses to wrap
                                    // rather than breaking the layout.
                                    wordBreak: "break-all",
                                }}
                            >
                                {SITE.email}
                                <span className="inline-block transition-transform duration-300 ease-expo group-hover:translate-x-1">
                                    →
                                </span>
                            </a>
                        </div>
                    </Reveal>

                    <Reveal variants={fadeUpSmall} delay={0.2}>
                        <div className="mt-12 flex gap-8">
                            {Object.entries(SITE.socials).map(([name, url]) => (
                                <a
                                    key={name}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-mono text-sm capitalize text-text-secondary transition-colors duration-300 hover:text-text-primary"
                                >
                                    {name}
                                </a>
                            ))}
                        </div>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
