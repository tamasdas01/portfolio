'use client';

import { useIntro } from '@/providers/IntroProvider';
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

type DottedSurfaceProps = Omit<React.ComponentProps<'div'>, 'ref'>;

export function DottedSurface({ className, ...props }: DottedSurfaceProps) {
    const { isIntroComplete } = useIntro();
    const containerRef = useRef<HTMLDivElement>(null);
    const initializedRef = useRef(false);
    const animationIdRef = useRef(0);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        // Only initialize once when intro completes
        if (!isIntroComplete || initializedRef.current || !containerRef.current) return;
        initializedRef.current = true;

        const container = containerRef.current;

        // ── Mobile check: reduce particle count and animation cost ──
        const isMobile = window.innerWidth <= 768;

        const SEPARATION = 150;
        const AMOUNTX = isMobile ? 20 : 40;   // Mobile: 1/4 the particles
        const AMOUNTY = isMobile ? 30 : 60;   // Mobile: 1/4 the particles

        // Scene setup
        const scene = new THREE.Scene();
        scene.fog = new THREE.Fog(0x0a0a0a, 2000, 10000);

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
                // White-ish dots for dark background
                colors.push(200, 200, 200);
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
            size: 8,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
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
                        Math.sin((ix + count) * 0.3) * 50 +
                        Math.sin((iy + count) * 0.5) * 50;
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
                opacity: ready ? 1 : 0,
                transition: 'opacity 1s ease',
            }}
            {...props}
        />
    );
}
