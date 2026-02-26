"use client";

import { ClipPathLinks } from "@/components/ui/clip-path-links";

export function Contact() {
    return (
        <section id="contact" className="px-6 py-24 md:px-8 md:py-32">
            <div className="mx-auto max-w-7xl">
                <ClipPathLinks />
                <div className="mt-12 flex justify-center">
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                        className="group flex flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/20 transition-colors hover:text-white/60"
                    >
                        <span>Back to top</span>
                        <div className="h-8 w-px bg-gradient-to-b from-white/20 to-transparent transition-colors group-hover:from-white/60" />
                    </button>
                </div>
            </div>
        </section>
    );
}
