"use client";

import { Reveal } from "./Reveal";
import { SITE } from "@/lib/constants";

export function Footer() {
    return (
        <footer className="border-t border-border px-6 py-12 md:px-8">
            <div className="mx-auto max-w-7xl">
                <Reveal>
                    <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
                        <p className="font-mono text-sm text-text-secondary">
                            © {new Date().getFullYear()} {SITE.name}
                        </p>

                        <div className="flex gap-6">
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
                    </div>
                </Reveal>
            </div>
        </footer>
    );
}
