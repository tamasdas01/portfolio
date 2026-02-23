"use client";

import React, { useRef, useEffect, useCallback } from "react";

// ─────────────────────────────────────────────────────────────
// Music-Reactive Background Canvas
// Renders animated colour waves with film grain, scanlines,
// vignette, dust & flicker — pure visual, no audio required.
// ─────────────────────────────────────────────────────────────

interface MusicReactiveCanvasProps {
    /** Extra CSS classes on the wrapper div */
    className?: string;
    /** 0-1 — controls overall wave intensity when no audio is connected */
    intensity?: number;
}

export function MusicReactiveCanvas({
    className = "",
    intensity = 1,
}: MusicReactiveCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number | null>(null);

    const initCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // ── Film-grain generator ──────────────────────────────
        const grainCanvas = document.createElement("canvas");
        let grainCtx = grainCanvas.getContext("2d")!;
        let grainData: ImageData | null = null;
        let grainFrame = 0;

        const generateGrain = (w: number, h: number) => {
            grainCanvas.width = w;
            grainCanvas.height = h;
            grainCtx = grainCanvas.getContext("2d")!;
            const img = grainCtx.createImageData(w, h);
            const d = img.data;
            for (let i = 0; i < d.length; i += 4) {
                const v = Math.random() * 255;
                d[i] = v;
                d[i + 1] = v;
                d[i + 2] = v;
                d[i + 3] = 255;
            }
            grainData = img;
        };

        const updateGrain = () => {
            grainFrame++;
            if (grainFrame % 2 !== 0 || !grainData) return;
            const d = grainData.data;
            const t = grainFrame * 0.01;
            const w = grainCanvas.width;
            for (let i = 0; i < d.length; i += 4) {
                const x = (i / 4) % w;
                const y = Math.floor(i / 4 / w);
                const pattern = Math.sin(x * 0.01 + t) * Math.cos(y * 0.01 - t);
                const v = (Math.random() * 0.8 + pattern * 0.2) * 255;
                d[i] = v;
                d[i + 1] = v;
                d[i + 2] = v;
            }
            grainCtx.putImageData(grainData, 0, 0);
        };

        const applyGrain = (
            target: CanvasRenderingContext2D,
            grainIntensity: number,
            hue: number
        ) => {
            target.save();
            target.globalCompositeOperation = "screen";
            target.globalAlpha = grainIntensity * 0.5;
            target.drawImage(grainCanvas, 0, 0);
            target.globalCompositeOperation = "multiply";
            target.globalAlpha = 1 - grainIntensity * 0.3;
            target.drawImage(grainCanvas, 0, 0);
            target.globalCompositeOperation = "overlay";
            target.globalAlpha = grainIntensity * 0.3;
            target.fillStyle = `hsla(${hue}, 50%, 50%, 1)`;
            target.fillRect(0, 0, canvas.width, canvas.height);
            target.restore();
        };

        // ── Resize ────────────────────────────────────────────
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            generateGrain(canvas.width, canvas.height);
        };
        resize();

        // ── Wave state ────────────────────────────────────────
        const waves = [
            { amplitude: 30, frequency: 0.003, speed: 0.02, offset: 0, opacity: 0.9 },
            {
                amplitude: 25,
                frequency: 0.004,
                speed: 0.015,
                offset: Math.PI * 0.5,
                opacity: 0.7,
            },
            {
                amplitude: 20,
                frequency: 0.005,
                speed: 0.025,
                offset: Math.PI,
                opacity: 0.5,
            },
            {
                amplitude: 35,
                frequency: 0.002,
                speed: 0.01,
                offset: Math.PI * 1.5,
                opacity: 0.6,
            },
        ];

        let time = 0;
        const color = { hue: 180, saturation: 70, lightness: 50 };

        // ── Animation loop ────────────────────────────────────
        const animate = () => {
            animationRef.current = requestAnimationFrame(animate);
            if (!ctx) return;

            // Fade-trail clear for motion blur
            ctx.fillStyle = "rgba(0, 0, 0, 0.92)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Demo-mode intensity values (no audio)
            const bass = (0.4 + Math.sin(time * 0.01) * 0.3) * intensity;
            const mid = (0.3 + Math.sin(time * 0.015) * 0.2) * intensity;
            const treble = (0.2 + Math.sin(time * 0.02) * 0.1) * intensity;

            const targetHue = 180 + Math.sin(time * 0.005) * 180;
            const targetSat = 70 + Math.sin(time * 0.01) * 30;
            const targetLight = 50 + Math.sin(time * 0.008) * 20;

            color.hue += (targetHue - color.hue) * 0.5;
            color.saturation += (targetSat - color.saturation) * 0.2;
            color.lightness += (targetLight - color.lightness) * 0.1;

            time++;
            const cy = canvas.height / 2;

            // ── Draw waves ──────────────────────────────────────
            waves.forEach((wave, wi) => {
                wave.offset += wave.speed * (1 + bass * 0.8);
                const freqInf = wi < 2 ? bass : mid;
                const dynAmp = wave.amplitude * (1 + freqInf * 5);

                const wHue = color.hue + wi * 15;
                const wSat = color.saturation - wi * 5;
                const wLight = color.lightness + wi * 5;
                const alpha = wave.opacity * (0.5 + bass * 0.5);

                const grad = ctx.createLinearGradient(
                    0,
                    cy - dynAmp,
                    0,
                    cy + dynAmp
                );
                grad.addColorStop(
                    0,
                    `hsla(${wHue}, ${wSat}%, ${wLight}%, 0)`
                );
                grad.addColorStop(
                    0.5,
                    `hsla(${wHue}, ${wSat}%, ${wLight + 10}%, ${alpha})`
                );
                grad.addColorStop(
                    1,
                    `hsla(${wHue}, ${wSat}%, ${wLight}%, 0)`
                );

                ctx.beginPath();
                for (let x = -50; x <= canvas.width + 50; x += 2) {
                    const y1 =
                        Math.sin(x * wave.frequency + wave.offset) * dynAmp;
                    const y2 =
                        Math.sin(x * wave.frequency * 2 + wave.offset * 1.5) *
                        (dynAmp * 0.3 * mid);
                    const y3 =
                        Math.sin(x * wave.frequency * 0.5 + wave.offset * 0.7) *
                        (dynAmp * 0.5);
                    const y = cy + y1 + y2 + y3;
                    if (x === -50) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.lineTo(canvas.width + 50, canvas.height);
                ctx.lineTo(-50, canvas.height);
                ctx.closePath();
                ctx.fillStyle = grad;
                ctx.fill();
            });

            // ── Post-processing ─────────────────────────────────

            // 1 — Film grain
            const grainIntensity = 0.03 + bass * 0.2;
            updateGrain();
            applyGrain(ctx, grainIntensity, color.hue);

            // 2 — Scanlines
            ctx.strokeStyle = `rgba(0, 0, 0, 0.02)`;
            ctx.lineWidth = 1;
            for (let y = 0; y < canvas.height; y += 3) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            }

            // 3 — Chromatic aberration (subtle)
            const chromatic = treble * 0.5;
            if (chromatic > 0.1) {
                ctx.save();
                ctx.globalCompositeOperation = "screen";
                ctx.globalAlpha = chromatic * 0.7;
                const temp = document.createElement("canvas");
                temp.width = canvas.width;
                temp.height = canvas.height;
                const tCtx = temp.getContext("2d")!;
                tCtx.drawImage(canvas, 0, 0);
                ctx.globalCompositeOperation = "multiply";
                ctx.fillStyle = "rgb(255, 0, 0)";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.globalCompositeOperation = "screen";
                ctx.drawImage(temp, -2 * chromatic, 0);
                ctx.globalCompositeOperation = "multiply";
                ctx.fillStyle = "rgb(0, 0, 255)";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.globalCompositeOperation = "screen";
                ctx.drawImage(temp, 2 * chromatic, 0);
                ctx.restore();
            }

            // 4 — Vignette
            const vig = ctx.createRadialGradient(
                canvas.width / 2,
                canvas.height / 2,
                canvas.width * 0.2,
                canvas.width / 2,
                canvas.height / 2,
                canvas.width * 0.9
            );
            vig.addColorStop(0, "rgba(0, 0, 0, 0)");
            vig.addColorStop(0.5, "rgba(0, 0, 0, 0.12)");
            vig.addColorStop(0.8, "rgba(0, 0, 0, 0.24)");
            vig.addColorStop(1, "rgba(0, 0, 0, 0.4)");
            ctx.fillStyle = vig;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // 5 — Film dust
            if (Math.random() < 0.02) {
                const n = Math.floor(Math.random() * 5) + 1;
                for (let i = 0; i < n; i++) {
                    const dx = Math.random() * canvas.width;
                    const dy = Math.random() * canvas.height;
                    const sz = Math.random() * 2 + 0.5;
                    ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.3})`;
                    ctx.beginPath();
                    ctx.arc(dx, dy, sz, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            // 6 — Flicker
            const flicker =
                Math.sin(time * 0.3) * 0.02 + Math.random() * 0.01;
            ctx.fillStyle = `rgba(255, 255, 255, ${flicker})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // 7 — Colour grading
            ctx.save();
            ctx.globalCompositeOperation = "overlay";
            ctx.globalAlpha = 0.1;
            const cg = ctx.createLinearGradient(0, 0, 0, canvas.height);
            cg.addColorStop(0, "rgb(255, 240, 220)");
            cg.addColorStop(0.5, "rgb(255, 255, 255)");
            cg.addColorStop(1, "rgb(220, 230, 255)");
            ctx.fillStyle = cg;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.restore();

            // 8 — Film scratches (rare)
            if (Math.random() < 0.005) {
                ctx.strokeStyle = `rgba(255, 255, 255, ${Math.random() * 0.2 + 0.1
                    })`;
                ctx.lineWidth = Math.random() * 2 + 0.5;
                ctx.beginPath();
                const sx = Math.random() * canvas.width;
                ctx.moveTo(sx, 0);
                ctx.lineTo(sx + (Math.random() - 0.5) * 20, canvas.height);
                ctx.stroke();
            }
        };

        animate();

        window.addEventListener("resize", resize);
        return () => {
            window.removeEventListener("resize", resize);
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [intensity]);

    useEffect(() => {
        const cleanup = initCanvas();
        return cleanup;
    }, [initCanvas]);

    return (
        <canvas
            ref={canvasRef}
            className={`absolute inset-0 h-full w-full ${className}`}
            style={{ display: "block" }}
        />
    );
}
