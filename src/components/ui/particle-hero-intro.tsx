"use client";

import { useEffect, useRef, useCallback, useState } from "react";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

interface Particle {
    x: number;
    y: number;
    tx: number; // target x
    ty: number; // target y
    ox: number; // origin x (random scatter position)
    oy: number; // origin y
    vx: number;
    vy: number;
    r: number; // radius
    color: string;
    targetColor: string;
    alpha: number;
    targetAlpha: number;
    active: boolean;
}

export interface ParticleHeroIntroProps {
    words?: string[];
    autoChangeInterval?: number;
    particleDensity?: number;
    /** ms after first word settles to auto-dismiss. Omit to disable auto-dismiss. */
    autoDismissAfter?: number;
    onComplete?: () => void;
}

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

const DEFAULT_WORDS = [
    "Hello",
    "Hola",
    "Bonjour",
    "Ciao",
    "Hallo",
    "こんにちは",
    "안녕하세요",
    "你好",
    "Olá",
    "Привет",
    "नमस्ते",
    "مرحبا",
];

/** Returns a random HSL color string for a given word index */
function wordColor(index: number, salt: number): string {
    const hues = [180, 270, 310, 140, 200, 48, 340, 90, 220, 0, 30, 260];
    const hue = (hues[index % hues.length] + salt) % 360;
    const s = 70 + Math.random() * 20;
    const l = 65 + Math.random() * 15;
    return `hsl(${hue},${s}%,${l}%)`;
}

/** Sample pixel data from an offscreen canvas to get particle targets */
function sampleTextPixels(
    word: string,
    canvasW: number,
    canvasH: number,
    density: number
): Array<{ x: number; y: number }> {
    const off = document.createElement("canvas");
    off.width = canvasW;
    off.height = canvasH;
    const ctx = off.getContext("2d")!;

    // Dynamic font size based on canvas width and word length
    const isLongWord = word.length > 5;
    const baseFontSize = Math.min(canvasW * 0.18, canvasH * 0.45);
    const fontSize = isLongWord
        ? Math.max(baseFontSize * (4 / Math.max(word.length, 4)), 40)
        : baseFontSize;

    // Use a generic sans-serif that covers all scripts (browser default covers CJK, Arabic, etc.)
    ctx.font = `700 ${fontSize}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(word, canvasW / 2, canvasH / 2);

    const imageData = ctx.getImageData(0, 0, canvasW, canvasH);
    const pixels: Array<{ x: number; y: number }> = [];

    const step = Math.max(3, Math.round(6 - density));
    for (let y = 0; y < canvasH; y += step) {
        for (let x = 0; x < canvasW; x += step) {
            const idx = (y * canvasW + x) * 4;
            if (imageData.data[idx + 3] > 128) {
                pixels.push({ x, y });
            }
        }
    }

    return pixels;
}

function lerp(a: number, b: number, t: number) {
    return a + (b - a) * t;
}

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

export function ParticleHeroIntro({
    words = DEFAULT_WORDS,
    autoChangeInterval = 3200,
    particleDensity = 3,
    autoDismissAfter,
    onComplete,
}: ParticleHeroIntroProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const rafRef = useRef<number>(0);
    const wordIndexRef = useRef(0);
    const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const mouseRef = useRef({ x: -9999, y: -9999, pressing: false, right: false });
    const mountedRef = useRef(true);
    const currentColorRef = useRef<string>("hsl(180,80%,70%)");

    const [subtitleVisible, setSubtitleVisible] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);

    // ── Dissolve & complete ───────────────────────────────────
    const dissolveAndComplete = useCallback(() => {
        if (!mountedRef.current) return;
        // Scatter all particles outward
        const canvas = canvasRef.current;
        const particles = particlesRef.current;
        if (canvas) {
            const W = canvas.width;
            const H = canvas.height;
            const cx = W / 2;
            const cy = H / 2;
            particles.forEach((p) => {
                const angle = Math.atan2(p.y - cy, p.x - cx);
                const dist = 300 + Math.random() * 400;
                p.tx = p.x + Math.cos(angle) * dist;
                p.ty = p.y + Math.sin(angle) * dist;
                p.targetAlpha = 0;
            });
        }
        setFadeOut(true);
        // Wait for scatter + fade, then complete
        setTimeout(() => {
            if (!mountedRef.current) return;
            if (intervalRef.current) clearTimeout(intervalRef.current);
            cancelAnimationFrame(rafRef.current);
            onComplete?.();
        }, 900);
    }, [onComplete]);

    // ── Skip handler (instant) ────────────────────────────────
    const skip = useCallback(() => {
        if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
        if (intervalRef.current) clearTimeout(intervalRef.current);
        cancelAnimationFrame(rafRef.current);
        onComplete?.();
    }, [onComplete]);

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === "Escape" || e.key === " " || e.key === "Enter") skip();
        },
        [skip]
    );

    // ── Word transition ───────────────────────────────────────
    const transitionToWord = useCallback(
        (wordIdx: number) => {
            const canvas = canvasRef.current;
            if (!canvas || !mountedRef.current) return;

            const W = canvas.width;
            const H = canvas.height;
            const targets = sampleTextPixels(
                words[wordIdx],
                W,
                H,
                particleDensity
            );

            if (targets.length === 0) return;

            const color = wordColor(wordIdx, Math.floor(Math.random() * 40));
            currentColorRef.current = color;
            const particles = particlesRef.current;

            // If we have MORE targets than particles, add new ones
            while (particles.length < targets.length) {
                const ox = Math.random() * W;
                const oy = Math.random() * H;
                particles.push({
                    x: ox,
                    y: oy,
                    tx: ox,
                    ty: oy,
                    ox,
                    oy,
                    vx: (Math.random() - 0.5) * 4,
                    vy: (Math.random() - 0.5) * 4,
                    r: Math.random() * 1.5 + 0.5,
                    color,
                    targetColor: color,
                    alpha: 0,
                    targetAlpha: 1,
                    active: true,
                });
            }

            // Assign targets (shuffle targets for nicer visual)
            const shuffled = [...targets].sort(() => Math.random() - 0.5);

            particles.forEach((p, i) => {
                if (i < shuffled.length) {
                    p.tx = shuffled[i].x;
                    p.ty = shuffled[i].y;
                    p.targetColor = color;
                    p.targetAlpha = 1;
                    p.active = true;
                } else {
                    // Extra particles — scatter off screen
                    p.tx = (Math.random() - 0.5) * W * 2 + W / 2;
                    p.ty = (Math.random() - 0.5) * H * 2 + H / 2;
                    p.targetAlpha = 0;
                }
            });
        },
        [words, particleDensity]
    );

    // ── Schedule next word ────────────────────────────────────
    const scheduleNext = useCallback(() => {
        if (intervalRef.current) clearTimeout(intervalRef.current);
        intervalRef.current = setTimeout(() => {
            if (!mountedRef.current) return;
            wordIndexRef.current = (wordIndexRef.current + 1) % words.length;
            transitionToWord(wordIndexRef.current);
            scheduleNext();
        }, autoChangeInterval);
    }, [autoChangeInterval, words.length, transitionToWord]);

    // ── Main animation loop ───────────────────────────────────
    const animate = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Trail fade instead of full clear — creates ghosting effect
        ctx.fillStyle = "rgba(10,10,10,0.18)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const mouse = mouseRef.current;
        const particles = particlesRef.current;
        const attractRadius = 100;
        const repelRadius = 120;

        for (const p of particles) {
            // Spring physics toward target
            const stiffness = 0.06;
            const damping = 0.82;

            let attractX = p.tx;
            let attractY = p.ty;

            // Mouse interaction
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (mouse.pressing && mouse.right) {
                // Right-click drag → repel
                if (dist < repelRadius) {
                    const force = (repelRadius - dist) / repelRadius;
                    attractX = p.x + (dx / dist) * force * 80;
                    attractY = p.y + (dy / dist) * force * 80;
                }
            } else {
                // Mouse move → subtle attraction toward cursor
                if (dist < attractRadius && dist > 0) {
                    const pull = (1 - dist / attractRadius) * 0.15;
                    attractX = lerp(p.tx, mouse.x, pull);
                    attractY = lerp(p.ty, mouse.y, pull);
                }
            }

            p.vx += (attractX - p.x) * stiffness;
            p.vy += (attractY - p.y) * stiffness;
            p.vx *= damping;
            p.vy *= damping;
            p.x += p.vx;
            p.y += p.vy;

            // Smoothly blend alpha
            p.alpha = lerp(p.alpha, p.targetAlpha, 0.06);

            // Draw glow particle
            const glow = p.r * 3;
            const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glow);
            gradient.addColorStop(0, p.targetColor.replace(")", `, ${Math.min(p.alpha, 1)})`).replace("hsl", "hsla"));
            gradient.addColorStop(1, "transparent");

            ctx.beginPath();
            ctx.arc(p.x, p.y, glow, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();

            // Core dot
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.targetColor.replace(")", `, ${Math.min(p.alpha, 1)})`).replace("hsl", "hsla");
            ctx.fill();
        }

        rafRef.current = requestAnimationFrame(animate);
    }, []);

    // ── Canvas resize ─────────────────────────────────────────
    const resize = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        // Re-layout current word after resize
        transitionToWord(wordIndexRef.current);
    }, [transitionToWord]);

    // ── Effect: setup ─────────────────────────────────────────
    useEffect(() => {
        mountedRef.current = true;

        const canvas = canvasRef.current;
        if (!canvas) return;

        // Set initial canvas size
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        // Init first word (tiny delay so font is ready)
        const initTimer = setTimeout(() => {
            if (!mountedRef.current) return;
            transitionToWord(0);
            setSubtitleVisible(true);
            if (words.length > 1) scheduleNext();
            animate();

            // Auto-dismiss after particles settle
            if (autoDismissAfter != null) {
                dismissTimerRef.current = setTimeout(() => {
                    dissolveAndComplete();
                }, autoDismissAfter);
            }
        }, 120);

        // Event listeners
        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current.x = e.clientX - rect.left;
            mouseRef.current.y = e.clientY - rect.top;
        };
        const handleMouseDown = (e: MouseEvent) => {
            mouseRef.current.pressing = true;
            mouseRef.current.right = e.button === 2;
        };
        const handleMouseUp = () => {
            mouseRef.current.pressing = false;
            mouseRef.current.right = false;
        };
        const handleContextMenu = (e: Event) => e.preventDefault();

        const handleTouchMove = (e: TouchEvent) => {
            const rect = canvas.getBoundingClientRect();
            const t = e.touches[0];
            mouseRef.current.x = t.clientX - rect.left;
            mouseRef.current.y = t.clientY - rect.top;
            mouseRef.current.pressing = true;
            mouseRef.current.right = true; // touch → disperse
        };
        const handleTouchEnd = () => {
            mouseRef.current.pressing = false;
            mouseRef.current.right = false;
            mouseRef.current.x = -9999;
            mouseRef.current.y = -9999;
        };

        canvas.addEventListener("mousemove", handleMouseMove);
        canvas.addEventListener("mousedown", handleMouseDown);
        canvas.addEventListener("mouseup", handleMouseUp);
        canvas.addEventListener("contextmenu", handleContextMenu);
        canvas.addEventListener("touchmove", handleTouchMove, { passive: true });
        canvas.addEventListener("touchend", handleTouchEnd);
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("resize", resize);

        return () => {
            mountedRef.current = false;
            clearTimeout(initTimer);
            if (intervalRef.current) clearTimeout(intervalRef.current);
            if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
            cancelAnimationFrame(rafRef.current);
            canvas.removeEventListener("mousemove", handleMouseMove);
            canvas.removeEventListener("mousedown", handleMouseDown);
            canvas.removeEventListener("mouseup", handleMouseUp);
            canvas.removeEventListener("contextmenu", handleContextMenu);
            canvas.removeEventListener("touchmove", handleTouchMove);
            canvas.removeEventListener("touchend", handleTouchEnd);
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("resize", resize);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a0a] cursor-pointer select-none"
            onClick={skip}
            role="button"
            tabIndex={0}
            aria-label="Skip intro"
            style={{
                opacity: fadeOut ? 0 : 1,
                transition: fadeOut ? "opacity 0.8s ease" : undefined,
                pointerEvents: fadeOut ? "none" : undefined,
            }}
        >
            {/* Canvas fills the full area */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
                style={{ touchAction: "none" }}
            />

            {/* Subtitle text — layered above canvas */}
            <div
                className="relative z-10 flex flex-col items-center gap-2 pointer-events-none"
                style={{
                    bottom: "12%",
                    position: "absolute",
                    left: "50%",
                    transform: "translateX(-50%)",
                    opacity: subtitleVisible ? 1 : 0,
                    transition: "opacity 1.2s ease",
                    whiteSpace: "nowrap",
                }}
            >
                <span
                    style={{
                        fontFamily: "var(--font-mono-var), ui-monospace, monospace",
                        fontSize: "0.65rem",
                        letterSpacing: "0.25em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.35)",
                    }}
                >
                    Creative Developer &nbsp;·&nbsp; Building immersive digital experiences
                </span>
            </div>

            {/* Skip hint */}
            <span
                className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none"
                style={{
                    fontFamily: "var(--font-mono-var), ui-monospace, monospace",
                    fontSize: "0.6rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.18)",
                    opacity: subtitleVisible ? 1 : 0,
                    transition: "opacity 1.8s ease",
                }}
            >
                click anywhere to skip
            </span>
        </div>
    );
}
