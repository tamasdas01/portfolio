'use client';

import { useIntro } from '@/providers/IntroProvider';
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createFrameGate, getPerfTier, subscribePerfTier, type PerfTier } from '@/lib/perf';

type DottedSurfaceProps = Omit<React.ComponentProps<'div'>, 'ref'>;

interface Engine {
    start: () => void;
}

/* ─────────────────────────────────────────────────────────
   Fixed Three.js dotted wave background.

   Performance notes (visuals unchanged):
   • Scene is built on mount — while the intro is still
     playing — so WebGL context creation + shader compile
     never lands on the reveal frame.
   • Scroll fade writes opacity straight to the DOM (no React
     re-render per scroll frame) and no longer uses a
     full-screen CSS blur filter (very expensive on weak GPUs).
   • Rendering pauses while an opaque section
     ([data-opaque-section]) fully covers the viewport, or the
     tab is hidden — the wave phase keeps advancing, so it
     resumes seamlessly.
   • Wave speed is time-based; "low" perf tier renders at
     ~30 fps and pixel ratio 1.
   ───────────────────────────────────────────────────────── */
export function DottedSurface({ className, style, ...props }: DottedSurfaceProps) {
    const { isIntroComplete } = useIntro();
    const containerRef = useRef<HTMLDivElement>(null);
    const engineRef = useRef<Engine | null>(null);
    const startedRef = useRef(false);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const isMobile = window.innerWidth <= 768;

        const SEPARATION = 200;
        const AMOUNTX = isMobile ? 15 : 30;
        const AMOUNTY = isMobile ? 20 : 45;

        const pixelRatioFor = (tier: PerfTier) => {
            const dpr = window.devicePixelRatio || 1;
            if (tier === 'low') return 1;
            return Math.min(dpr, 1.5);
        };

        // Scene setup
        const scene = new THREE.Scene();
        scene.fog = new THREE.Fog(0x000000, 800, 4000);

        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.set(0, 355, 1220);

        let tier = getPerfTier();
        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: !isMobile && tier !== 'low',
            powerPreference: tier === 'low' ? 'low-power' : 'default',
        });
        renderer.setPixelRatio(pixelRatioFor(tier));
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);

        // Particle grid
        const positions = new Float32Array(AMOUNTX * AMOUNTY * 3);
        const colors = new Float32Array(AMOUNTX * AMOUNTY * 3);
        let p = 0;
        for (let ix = 0; ix < AMOUNTX; ix++) {
            for (let iy = 0; iy < AMOUNTY; iy++) {
                positions[p] = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
                positions[p + 1] = 0;
                positions[p + 2] = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;
                // Dim dots — typography comes first
                colors[p] = colors[p + 1] = colors[p + 2] = 100;
                p += 3;
            }
        }
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 5,
            vertexColors: true,
            transparent: true,
            opacity: 0.45,
            sizeAttenuation: true,
        });

        const points = new THREE.Points(geometry, material);
        scene.add(points);

        // Precomputed per-row/column phase terms → one sin per axis, not per point.
        const sinX = new Float32Array(AMOUNTX);
        const sinY = new Float32Array(AMOUNTY);
        let count = 0;
        const countPerSecond = (isMobile ? 0.05 : 0.1) * 60;

        const updateWave = () => {
            for (let ix = 0; ix < AMOUNTX; ix++) sinX[ix] = Math.sin((ix + count) * 0.3) * 30;
            for (let iy = 0; iy < AMOUNTY; iy++) sinY[iy] = Math.sin((iy + count) * 0.5) * 30;
            let i = 1;
            for (let ix = 0; ix < AMOUNTX; ix++) {
                const sx = sinX[ix];
                for (let iy = 0; iy < AMOUNTY; iy++) {
                    positions[i] = sx + sinY[iy];
                    i += 3;
                }
            }
            geometry.attributes.position.needsUpdate = true;
        };

        // First frame now (hidden under the intro) to compile shaders early.
        updateWave();
        renderer.render(scene, camera);

        // ── Opaque-section coverage (skip rendering when fully hidden)
        let opaque: { top: number; bottom: number }[] = [];
        const measureOpaque = () => {
            const y = window.scrollY;
            opaque = Array.from(document.querySelectorAll<HTMLElement>('[data-opaque-section]')).map((el) => {
                const r = el.getBoundingClientRect();
                return { top: r.top + y, bottom: r.bottom + y };
            });
        };
        let covered = false;
        const checkCovered = () => {
            const top = window.scrollY;
            const bottom = top + window.innerHeight;
            covered = opaque.some((s) => s.top <= top && s.bottom >= bottom);
        };

        // ── Scroll fade (was: React state + blur filter every scroll frame)
        let faded = false; // becomes true once the intro reveal fade has run
        const targetOpacity = () => {
            const vh = window.innerHeight;
            const y = window.scrollY;
            if (y <= vh) return 1 - (y / vh) * 0.6; // 1 → 0.4
            if (y <= vh * 1.8) return 0.4 - ((y - vh) / (vh * 0.8)) * 0.29; // 0.4 → 0.11
            return 0.11;
        };
        const onScroll = () => {
            checkCovered();
            if (faded) container.style.opacity = String(targetOpacity());
        };

        const ro = new ResizeObserver(() => {
            measureOpaque();
            checkCovered();
        });
        ro.observe(document.body);
        measureOpaque();
        checkCovered();
        window.addEventListener('scroll', onScroll, { passive: true });

        const unsubscribeTier = subscribePerfTier(() => {
            tier = getPerfTier();
            renderer.setPixelRatio(pixelRatioFor(tier));
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // ── Render loop (started on intro completion)
        const gate = createFrameGate();
        let raf = 0;
        let last = 0;
        const animate = (now: number) => {
            raf = requestAnimationFrame(animate);
            const dt = last ? Math.min(0.1, (now - last) / 1000) : 1 / 60;
            last = now;
            count += countPerSecond * dt;
            if (covered || document.hidden) return;
            if (!gate(tier)) return;
            updateWave();
            renderer.render(scene, camera);
        };

        engineRef.current = {
            start: () => {
                if (raf) return;
                raf = requestAnimationFrame(animate);
                // Reveal fade, then hand over to the scroll-linked opacity.
                container.style.transition = 'opacity 1s ease';
                container.style.opacity = String(targetOpacity());
                window.setTimeout(() => {
                    container.style.transition = 'opacity 0.15s ease-out';
                    faded = true;
                    onScroll();
                }, 1000);
            },
        };
        if (startedRef.current) engineRef.current.start();

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            measureOpaque();
            onScroll();
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', onScroll);
            ro.disconnect();
            unsubscribeTier();
            cancelAnimationFrame(raf);
            engineRef.current = null;
            geometry.dispose();
            material.dispose();
            renderer.dispose();
            if (renderer.domElement.parentNode === container) {
                container.removeChild(renderer.domElement);
            }
        };
    }, []);

    useEffect(() => {
        if (!isIntroComplete) return;
        startedRef.current = true;
        engineRef.current?.start();
    }, [isIntroComplete]);

    return (
        <div
            ref={containerRef}
            className={className}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 0,
                pointerEvents: 'none',
                opacity: 0,
                willChange: 'opacity',
                ...style,
            }}
            {...props}
        />
    );
}
