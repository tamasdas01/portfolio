"use client";

import { Reveal } from "@/components/ui/Reveal";
import { fadeUp, fadeUpSmall } from "@/lib/animations";

export function About() {
    return (
        <section id="about" className="px-6 py-24 md:px-8 md:py-32">
            <div className="mx-auto max-w-7xl">
                <Reveal>
                    <p className="font-mono text-sm text-text-secondary">About</p>
                </Reveal>

                <div className="mt-12 grid gap-12 md:mt-16 md:grid-cols-2 md:gap-16">
                    <div className="space-y-6">
                        <Reveal>
                            <p className="text-2xl font-light leading-relaxed text-text-primary md:text-3xl">
                                I&apos;m a designer and developer focused on building digital
                                products that are clear, functional, and considered.
                            </p>
                        </Reveal>
                    </div>

                    <div className="space-y-6">
                        <Reveal variants={fadeUpSmall} delay={0.1}>
                            <p className="text-base leading-relaxed text-text-secondary">
                                With a background spanning product design, frontend engineering,
                                and creative direction, I work at the intersection of aesthetics
                                and engineering. I believe the best digital experiences feel
                                inevitable — where every decision serves the whole.
                            </p>
                        </Reveal>

                        <Reveal variants={fadeUpSmall} delay={0.2}>
                            <p className="text-base leading-relaxed text-text-secondary">
                                Currently available for select freelance projects and full-time
                                opportunities. I&apos;m particularly interested in design systems,
                                developer tools, and products that respect their users&apos; time.
                            </p>
                        </Reveal>
                    </div>
                </div>
            </div>
        </section>
    );
}
