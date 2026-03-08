"use client";

import { ClipPathLinks } from "@/components/ui/clip-path-links";

export function Contact() {
    return (
        <section id="contact" className="px-6 pt-24 pb-32 md:px-8 md:pt-32 md:pb-40">
            <div className="mx-auto max-w-7xl">
                <div className="mb-12 text-center md:text-left">
                    <h2
                        className="font-display font-light tracking-tight"
                        style={{
                            color: 'rgba(255,255,255,0.9)',
                            fontSize: 'clamp(2.5rem, 6vw, 4.25rem)',
                            lineHeight: 1.1,
                        }}
                    >
                        Let&apos;s <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A78BFA] to-[#7C3AED]">connect</span>
                    </h2>
                </div>
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
