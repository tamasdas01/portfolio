"use client";

import { Reveal } from "./Reveal";
import { SITE } from "@/lib/constants";

export function Footer() {
    return (
        <footer className="border-t border-border px-6 py-12 md:px-8">
            <div className="mx-auto max-w-7xl">
                <Reveal>
                    <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
                        <p className="font-mono text-sm text-text-secondary flex items-center gap-3">
                            <span>© {new Date().getFullYear()} {SITE.name} DAS</span>
                            <span className="text-white/10">·</span>
                            <a
                                href="/resume.pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-accent/60 hover:text-accent transition-colors"
                            >
                                View Resume
                            </a>
                        </p>
                    </div>
                </Reveal>
            </div>
        </footer>
    );
}
