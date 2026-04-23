'use client';

import React from 'react';
import StackingCard from '@/components/ui/stacking-card';

const projects = [
    {
        title: 'Teaching & Mentoring',
        description:
            "For the past five years, I have taught school students, simplifying complex concepts into clear and manageable lessons. This ongoing experience has refined my communication skills and reinforced my belief that knowledge is most valuable when shared. As I transition from my final year of engineering into a professional career, I bring this same commitment to clarity and collaborative learning to my development work.",
        link: '/beyond-work/teaching-mentoring.webp',
    },
    {
        title: 'Fitness & Discipline',
        description:
            'I go to the gym every day and stay highly consistent with my fitness routine. Building and maintaining an aesthetic physique requires discipline, dedication, and balance — the same qualities I bring to my work. Balancing fitness and development keeps me focused, healthy, and performing at my best.',
        link: '/beyond-work/fitness-discipline.webp',
    },
    {
        title: 'Long Rides',
        description:
            'I genuinely enjoy going on long rides and exploring new places along the way. Riding gives me a sense of freedom and adventure while allowing me to appreciate the journey itself. It’s a hobby that helps me stay refreshed, think clearly, and maintain a healthy balance between work and life.',
        link: '/beyond-work/long-rides.webp',
    },
    {
        title: 'Photography',
        description:
            'I love capturing moments through photography. Whether it’s places, people, or small everyday details, I enjoy freezing those moments in a frame. Photography helps me observe the world more closely and appreciate perspectives that often go unnoticed.',
        link: '/beyond-work/photography.webp',
    },
    {
        title: 'Adventure & Exploration',
        description:
            'I enjoy exploring new cafés, places, and experiences. From short trips to relaxing vacations, I love discovering new environments and enjoying the change of scenery. It helps me stay curious and appreciate experiences beyond everyday routines.',
        link: '/beyond-work/adventure-exploration.webp',
    },
];

export function BeyondWorkSection() {
    return (
        <section id="beyond-work" className="relative w-full">
            {/* ─── Heading area (scrolls normally, NOT part of stacking) ─── */}
            <div className="mx-auto max-w-6xl px-6 md:px-8 pt-12 pb-24 md:pt-16 md:pb-32">
                {/* Big heading — Playfair Display */}
                <h2
                    className="font-display font-light tracking-tight"
                    style={{
                        color: 'rgba(255,255,255,0.9)',
                        fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                        lineHeight: 1.1,
                    }}
                >
                    <span style={{ color: '#8B5CF6' }}>Beyond</span> Work
                </h2>

                {/* Subheading — one line */}
                <p
                    className="mt-4 font-mono text-sm"
                    style={{ color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em' }}
                >
                    Things that shape how I think and build.
                </p>

                {/* Description */}
                <p
                    className="mt-6 max-w-3xl text-sm leading-relaxed md:text-base"
                    style={{ color: 'rgba(255,255,255,0.5)' }}
                >
                    The best developers I know have rich lives outside the terminal. Teaching sharpened how I explain complex systems. The gym taught me what consistency actually looks like. Long rides reminded me that getting lost is part of finding direction. These aren&apos;t separate from my work — they&apos;re why my work is better.
                </p>
            </div>

            {/* ─── Stacking cards (scroll animation starts here) ─── */}
            <div
                style={{
                    background:
                        'radial-gradient(circle at center, rgba(124,58,237,0.12), transparent 60%)',
                }}
            >
                <StackingCard projects={projects} />
            </div>
        </section>
    );
}
