'use client';
import Image from 'next/image';
import { useTransform, motion, useScroll, MotionValue } from 'motion/react';
import { useRef, forwardRef } from 'react';

interface ProjectData {
    title: string;
    description: string;
    link: string;
}

interface CardProps {
    i: number;
    title: string;
    description: string;
    url: string;
    progress: MotionValue<number>;
    range: [number, number];
    targetScale: number;
}

export const Card = ({
    i,
    title,
    description,
    url,
    progress,
    range,
    targetScale,
}: CardProps) => {
    const container = useRef(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ['start end', 'start start'],
    });

    const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1]);
    const scale = useTransform(progress, range, [1, targetScale]);

    return (
        <div
            ref={container}
            className="h-screen flex items-center justify-center sticky top-0"
        >
            <motion.div
                style={{
                    scale,
                    top: `calc(-5vh + ${i * 25}px)`,
                    // Was rgba(…,0.85) + backdrop-filter: blur(18px). Re-blurring the
                    // backdrop of five scaling cards every scroll frame was the
                    // heaviest paint on the page; this pre-mixed fill looks the same.
                    background:
                        'radial-gradient(ellipse 80% 70% at 50% 45%, rgba(13,8,28,0.97), rgba(10,7,23,0.97))',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: 'rgba(139,92,246,0.18)',
                    borderRadius: 20,
                }}
                whileHover={{
                    y: -6,
                    borderColor: '#7C3AED',
                    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                }}
                // Mobile: height follows content (was a fixed 450px that pushed the
                // photo out of the card). Desktop: unchanged 450px split layout.
                className="relative w-[90%] md:w-[70%] max-h-[88svh] md:max-h-none md:h-[450px] p-6 md:p-8 flex flex-col md:flex-row gap-5 md:gap-8 shadow-2xl overflow-hidden"
            >
                {/* Purple accent bar — absolute so it doesn't affect layout */}
                <div
                    className="absolute top-0 left-0 w-full pointer-events-none"
                    style={{
                        height: 2,
                        background: 'linear-gradient(90deg, #A78BFA, #7C3AED)',
                        opacity: 0.7,
                        borderRadius: 2,
                    }}
                />

                {/* Left: title + description */}
                <div className="flex flex-col flex-1 justify-center z-10 min-h-0">
                    <h3
                        className="text-2xl md:text-4xl mb-3 md:mb-4 font-display font-light tracking-tight"
                        style={{ color: '#E5E7EB' }}
                    >
                        {title}
                    </h3>
                    <p
                        className="text-[14px] md:text-[15px]"
                        style={{ color: '#9CA3AF', lineHeight: 1.6 }}
                    >
                        {description}
                    </p>
                </div>

                {/* Right (desktop) / bottom (mobile): image */}
                <div
                    className="relative shrink-0 md:shrink md:flex-1 h-[170px] sm:h-[220px] md:h-full overflow-hidden"
                    style={{ borderRadius: 12 }}
                >
                    <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                    <motion.div className="relative w-full h-full" style={{ scale: imageScale }}>
                        <Image
                            src={url}
                            alt={title}
                            fill
                            sizes="(max-width: 768px) 90vw, 36vw"
                            className="object-cover"
                        />
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

interface ComponentRootProps {
    projects: ProjectData[];
}

const Component = forwardRef<HTMLDivElement, ComponentRootProps>(
    ({ projects }, ref) => {
        const container = useRef<HTMLDivElement>(null);
        const { scrollYProgress } = useScroll({
            target: container,
            offset: ['start start', 'end end'],
        });

        return (
            <div ref={container}>
                {projects.map((project, i) => {
                    const targetScale = 1 - (projects.length - i) * 0.05;
                    return (
                        <Card
                            key={`p_${i}`}
                            i={i}
                            url={project.link}
                            title={project.title}
                            description={project.description}
                            progress={scrollYProgress}
                            range={[i * (1 / projects.length), 1]}
                            targetScale={targetScale}
                        />
                    );
                })}
            </div>
        );
    }
);

Component.displayName = 'StackingCard';

export default Component;
