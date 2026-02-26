"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { FaReact, FaJs, FaHtml5, FaCss3Alt, FaNodeJs, FaPython, FaBrain } from "react-icons/fa";
import { SiSupabase, SiNextdotjs, SiFlutter, SiTypescript, SiFirebase, SiOpenai, SiGooglegemini } from "react-icons/si";

interface IconPos {
    id: string;
    Icon: any;
    color: string;
    origVector: THREE.Vector3;
    x: number;
    y: number;
    scale: number;
    zIndex: number;
    opacity: number;
}

export function TechGlobe() {
    const mountRef = useRef<HTMLDivElement>(null);
    const [icons, setIcons] = useState<IconPos[]>([]);

    useEffect(() => {
        if (!mountRef.current) return;

        const w = mountRef.current.clientWidth;
        const h = mountRef.current.clientHeight;

        const scene = new THREE.Scene();

        // Particle field background
        const particlesGeom = new THREE.BufferGeometry();
        const particlesCount = 400;
        const posArray = new Float32Array(particlesCount * 3);
        for (let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 12;
        }
        particlesGeom.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const particleMat = new THREE.PointsMaterial({
            size: 0.015,
            color: 0x8B5CF6,
            transparent: true,
            opacity: 0.5
        });
        const particles = new THREE.Points(particlesGeom, particleMat);
        scene.add(particles);

        // Camera setup - move back further on mobile to fit the globe comfortably
        const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
        camera.position.z = w < 768 ? 9.0 : 5.5;

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
        renderer.setSize(w, h);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        mountRef.current.appendChild(renderer.domElement);

        // Sphere group
        const sphereGroup = new THREE.Group();
        scene.add(sphereGroup);

        const globeGeom = new THREE.SphereGeometry(1.6, 28, 28);
        const globeMat = new THREE.MeshBasicMaterial({
            color: 0x8B5CF6,
            wireframe: true,
            transparent: true,
            opacity: 0.15
        });
        const globe = new THREE.Mesh(globeGeom, globeMat);
        sphereGroup.add(globe);

        // Orbiting icons definition
        // We position them on the surface of the sphere (radius ~ 1.7 to float slightly above 1.6)
        const radius = 1.8;
        const iconDefs = [
            { id: 'react', Icon: FaReact, color: '#61DAFB' },
            { id: 'js', Icon: FaJs, color: '#F7DF1E' },
            { id: 'html', Icon: FaHtml5, color: '#E34F26' },
            { id: 'css', Icon: FaCss3Alt, color: '#1572B6' },
            { id: 'node', Icon: FaNodeJs, color: '#339933' },
            { id: 'supabase', Icon: SiSupabase, color: '#3ECF8E' },
            { id: 'next', Icon: SiNextdotjs, color: '#ffffff' },
            { id: 'flutter', Icon: SiFlutter, color: '#02569B' },
            { id: 'ts', Icon: SiTypescript, color: '#3178C6' },
            { id: 'firebase', Icon: SiFirebase, color: '#FFCA28' },
            { id: 'python', Icon: FaPython, color: '#3776AB' },
            { id: 'openai', Icon: SiOpenai, color: '#ffffff' },
            { id: 'notebooklm', Icon: FaBrain, color: '#1A73E8' },
            { id: 'gemini', Icon: SiGooglegemini, color: '#8E75B2' }
        ];

        // Distribute evenly using a spherical Fibonacci lattice
        const N = iconDefs.length;
        const phi = Math.PI * (3 - Math.sqrt(5));
        const initialIcons = iconDefs.map((def, i) => {
            const y = 1 - (i / (N - 1)) * 2;
            const radiusAtY = Math.sqrt(1 - y * y);
            const theta = phi * i;

            const origVector = new THREE.Vector3(
                Math.cos(theta) * radiusAtY * radius,
                y * radius,
                Math.sin(theta) * radiusAtY * radius
            );
            return { ...def, origVector };
        });

        // Tilt the group slightly
        sphereGroup.rotation.z = Math.PI / 8;
        sphereGroup.rotation.x = Math.PI / 12;

        let reqId: number;

        const updateIcons = () => {
            camera.updateMatrixWorld();
            const newIcons: IconPos[] = [];

            initialIcons.forEach((ic) => {
                const vec = ic.origVector.clone();
                // Rotate the vector alongside the sphereGroup
                vec.applyEuler(sphereGroup.rotation);

                vec.project(camera);

                const x = (vec.x * .5 + .5) * w;
                const y = (vec.y * -.5 + .5) * h;

                // Scale based on z distance
                const scale = Math.max(0.4, 1 - vec.z * 0.5);
                const zIndex = vec.z < 0.9 ? 10 : 0; // Front vs back
                const opacity = vec.z > 0.98 ? 0.2 : (vec.z > 0.9 ? 0.6 : 1); // fade into distance

                newIcons.push({ ...ic, x, y, scale, zIndex, opacity });
            });

            setIcons(newIcons);
        };

        const animate = () => {
            reqId = requestAnimationFrame(animate);
            sphereGroup.rotation.y += 0.002;
            particles.rotation.y += 0.0004;
            particles.rotation.x += 0.0001;
            renderer.render(scene, camera);
            updateIcons();
        };

        animate();

        const handleResize = () => {
            if (!mountRef.current) return;
            const w2 = mountRef.current.clientWidth;
            const h2 = mountRef.current.clientHeight;
            renderer.setSize(w2, h2);
            camera.aspect = w2 / h2;
            camera.position.z = w2 < 768 ? 9.0 : 5.5; // Update zoom on resize
            camera.updateProjectionMatrix();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(reqId);
            renderer.dispose();
            globeGeom.dispose();
            globeMat.dispose();
            particlesGeom.dispose();
            particleMat.dispose();
            if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
                mountRef.current.removeChild(renderer.domElement);
            }
        };
    }, []);

    return (
        <div className="relative w-full h-[60vh] md:h-screen flex items-center justify-center overflow-hidden">
            <div ref={mountRef} className="absolute inset-0 z-0" />
            <div className="absolute inset-0 pointer-events-none z-10">
                {icons.map((ic) => (
                    <div
                        key={ic.id}
                        className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer group"
                        style={{
                            transform: `translate(${ic.x}px, ${ic.y}px) scale(${ic.scale})`,
                            zIndex: ic.zIndex,
                            opacity: ic.opacity,
                        }}
                    >
                        {/* Glow wrapper for intense hover aura */}
                        <div className="relative flex items-center justify-center transition-all duration-300 group-hover:scale-125">
                            <div
                                className="absolute inset-0 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                style={{ background: ic.color, transform: 'scale(1.5)' }}
                            />
                            <div
                                className="absolute inset-0 blur-md opacity-20 group-hover:opacity-80 transition-opacity duration-300"
                                style={{ background: ic.color, transform: 'scale(1.2)' }}
                            />
                            <ic.Icon
                                className="text-[3rem] md:text-[5.5rem] relative z-10 drop-shadow-lg"
                                style={{ color: ic.color }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{
                    background:
                        "radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.8) 100%)",
                }}
            />
        </div>
    );
}
