'use client';

import { useIntro } from '@/providers/IntroProvider';
import React, { useEffect, useRef, useState } from 'react';
import { useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import * as THREE from 'three';

type DottedSurfaceProps = Omit<React.ComponentProps<'div'>, 'ref'>;

export function DottedSurface({ className, ...props }: DottedSurfaceProps) {
    const { isIntroComplete } = useIntro();
    const containerRef = useRef<HTMLDivElement>(null);
    const initializedRef = useRef(false);
    const animationIdRef = useRef(0);
    const [ready, setReady] = useState(false);

    // ── Scroll-driven fade: dim + blur mesh as user scrolls past first viewport ──
    const [vh, setVh] = useState(800);
    useEffect(() => { setVh(window.innerHeight); }, []);

    const { scrollY } = useScroll();
    const scrollOpacity = useTransform(scrollY, [0, vh, vh * 1.8], [1, 0.4, 0.12]);
    const scrollBlur = useTransform(scrollY, [0, vh, vh * 1.8], [0, 1, 2.5]);
    const [fadeStyle, setFadeStyle] = useState({ opacity: 1, filter: 'blur(0px)' });

    useMotionValueEvent(scrollOpacity, 'change', (v) => {
        const blur = scrollBlur.get();
        setFadeStyle({ opacity: v, filter: `blur(${blur}px)` });
    });

    useEffect(() => {
        // Only initialize once when intro completes
        if (!isIntroComplete || initializedRef.current || !containerRef.current) return;
        initializedRef.current = true;

        const container = containerRef.current;

        // ── Mobile check: reduce particle count and animation cost ──
        const isMobile = window.innerWidth <= 768;

        const SEPARATION = 200;
        const AMOUNTX = isMobile ? 15 : 30;
        const AMOUNTY = isMobile ? 20 : 45;

        // Scene setup
        const scene = new THREE.Scene();
        scene.fog = new THREE.Fog(0x000000, 800, 4000);

        const camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            1,
            10000,
        );
        camera.position.set(0, 355, 1220);

        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: !isMobile, // Skip antialiasing on mobile for perf
        });
        // Cap pixel ratio at 1.5 on mobile to avoid GPU overload
        renderer.setPixelRatio(
            isMobile
                ? Math.min(window.devicePixelRatio, 1.5)
                : window.devicePixelRatio
        );
        renderer.setSize(window.innerWidth, window.innerHeight);
        // Transparent clear so the dark page bg shows through
        renderer.setClearColor(0x000000, 0);

        container.appendChild(renderer.domElement);

        // Create particle grid
        const positions: number[] = [];
        const colors: number[] = [];
        const geometry = new THREE.BufferGeometry();

        for (let ix = 0; ix < AMOUNTX; ix++) {
            for (let iy = 0; iy < AMOUNTY; iy++) {
                const x = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
                const y = 0;
                const z = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;

                positions.push(x, y, z);
                // Dim dots — typography comes first
                colors.push(100, 100, 100);
            }
        }

        geometry.setAttribute(
            'position',
            new THREE.Float32BufferAttribute(positions, 3),
        );
        geometry.setAttribute(
            'color',
            new THREE.Float32BufferAttribute(colors, 3),
        );

        const material = new THREE.PointsMaterial({
            size: 5,
            vertexColors: true,
            transparent: true,
            opacity: 0.45,
            sizeAttenuation: true,
        });

        const points = new THREE.Points(geometry, material);
        scene.add(points);

        let count = 0;
        // Mobile: slower wave animation = lighter RAF workload
        const countIncrement = isMobile ? 0.05 : 0.1;

        // Animation loop
        const animate = () => {
            animationIdRef.current = requestAnimationFrame(animate);

            const positionAttribute = geometry.attributes.position;
            const posArr = positionAttribute.array as Float32Array;

            let i = 0;
            for (let ix = 0; ix < AMOUNTX; ix++) {
                for (let iy = 0; iy < AMOUNTY; iy++) {
                    const index = i * 3;
                    posArr[index + 1] =
                        Math.sin((ix + count) * 0.3) * 30 +
                        Math.sin((iy + count) * 0.5) * 30;
                    i++;
                }
            }

            positionAttribute.needsUpdate = true;
            renderer.render(scene, camera);
            count += countIncrement;
        };

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);
        animate();
        setReady(true);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationIdRef.current);

            scene.traverse((object) => {
                if (object instanceof THREE.Points) {
                    object.geometry.dispose();
                    if (Array.isArray(object.material)) {
                        object.material.forEach((m) => m.dispose());
                    } else {
                        object.material.dispose();
                    }
                }
            });

            renderer.dispose();

            if (container && renderer.domElement.parentNode === container) {
                container.removeChild(renderer.domElement);
            }

            initializedRef.current = false;
        };
    }, [isIntroComplete]);

    return (
        <div
            ref={containerRef}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 0,
                pointerEvents: 'none',
                opacity: ready ? fadeStyle.opacity : 0,
                filter: fadeStyle.filter,
                transition: ready ? 'opacity 0.15s ease-out, filter 0.15s ease-out' : 'opacity 1s ease',
                willChange: 'opacity, filter',
            }}
            {...props}
        />
    );
}
