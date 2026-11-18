"use client";

import { useEffect, useRef } from "react";
import type { IconType } from "react-icons";
import * as THREE from "three";
import { FaReact, FaJs, FaHtml5, FaCss3Alt, FaNodeJs, FaPython, FaBrain } from "react-icons/fa";
import { SiSupabase, SiNextdotjs, SiFlutter, SiTypescript, SiFirebase, SiOpenai, SiGooglegemini } from "react-icons/si";
import { createFrameGate, getPerfTier, subscribePerfTier, type PerfTier } from "@/lib/perf";

const ICON_DEFS: { id: string; label: string; Icon: IconType; color: string }[] = [
    { id: "react", label: "React", Icon: FaReact, color: "#61DAFB" },
    { id: "js", label: "JavaScript", Icon: FaJs, color: "#F7DF1E" },
    { id: "html", label: "HTML5", Icon: FaHtml5, color: "#E34F26" },
    { id: "css", label: "CSS3", Icon: FaCss3Alt, color: "#1572B6" },
    { id: "node", label: "Node.js", Icon: FaNodeJs, color: "#339933" },
    { id: "supabase", label: "Supabase", Icon: SiSupabase, color: "#3ECF8E" },
    { id: "next", label: "Next.js", Icon: SiNextdotjs, color: "#ffffff" },
    { id: "flutter", label: "Flutter", Icon: SiFlutter, color: "#02569B" },
    { id: "ts", label: "TypeScript", Icon: SiTypescript, color: "#3178C6" },
    { id: "firebase", label: "Firebase", Icon: SiFirebase, color: "#FFCA28" },
    { id: "python", label: "Python", Icon: FaPython, color: "#3776AB" },
    { id: "openai", label: "OpenAI", Icon: SiOpenai, color: "#ffffff" },
    { id: "notebooklm", label: "NotebookLM", Icon: FaBrain, color: "#1A73E8" },
    { id: "gemini", label: "Gemini", Icon: SiGooglegemini, color: "#8E75B2" },
];

/* ─────────────────────────────────────────────────────────
   Rotating wireframe globe with orbiting tech icons.

   Performance notes (visuals unchanged):
   • Icon positions are written straight to the DOM each
     frame — previously setState() re-rendered all 14 icons
     (with their blur glows) 60× per second, forever.
   • The loop only runs while the globe is on screen and the
     tab is visible.
   • Rotation is time-based; "low" tier renders at ~30 fps,
     pixel ratio 1, no MSAA.
   ───────────────────────────────────────────────────────── */
export function TechGlobe() {
    const rootRef = useRef<HTMLDivElement>(null);
    const mountRef = useRef<HTMLDivElement>(null);
    const iconRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const mount = mountRef.current;
        const root = rootRef.current;
        if (!mount || !root) return;

        let w = mount.clientWidth;
        let h = mount.clientHeight;
        let tier = getPerfTier();
        const pixelRatioFor = (t: PerfTier) =>
            t === "low" ? 1 : Math.min(window.devicePixelRatio || 1, 2);

        const scene = new THREE.Scene();

        // Particle field background
        const particlesGeom = new THREE.BufferGeometry();
        const particlesCount = 400;
        const posArray = new Float32Array(particlesCount * 3);
        for (let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 12;
        }
        particlesGeom.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
        const particleMat = new THREE.PointsMaterial({
            size: 0.015,
            color: 0x8b5cf6,
            transparent: true,
            opacity: 0.5,
        });
        const particles = new THREE.Points(particlesGeom, particleMat);
        scene.add(particles);

        // Camera — further back on mobile to fit the globe comfortably
        const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
        camera.position.z = w < 768 ? 9.0 : 5.5;

        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: tier !== "low",
            powerPreference: tier === "low" ? "low-power" : "high-performance",
        });
        renderer.setSize(w, h);
        renderer.setPixelRatio(pixelRatioFor(tier));
        mount.appendChild(renderer.domElement);

        // Sphere group
        const sphereGroup = new THREE.Group();
        scene.add(sphereGroup);

        const globeGeom = new THREE.SphereGeometry(1.6, 28, 28);
        const globeMat = new THREE.MeshBasicMaterial({
            color: 0x8b5cf6,
            wireframe: true,
            transparent: true,
            opacity: 0.15,
        });
        sphereGroup.add(new THREE.Mesh(globeGeom, globeMat));

        // Icons on a spherical Fibonacci lattice, floating just above the globe
        const radius = 1.8;
        const N = ICON_DEFS.length;
        const phi = Math.PI * (3 - Math.sqrt(5));
        const origVectors = ICON_DEFS.map((_, i) => {
            const y = 1 - (i / (N - 1)) * 2;
            const radiusAtY = Math.sqrt(1 - y * y);
            const theta = phi * i;
            return new THREE.Vector3(
                Math.cos(theta) * radiusAtY * radius,
                y * radius,
                Math.sin(theta) * radiusAtY * radius
            );
        });

        // Tilt the group slightly
        sphereGroup.rotation.z = Math.PI / 8;
        sphereGroup.rotation.x = Math.PI / 12;

        const tmp = new THREE.Vector3();
        const updateIcons = () => {
            camera.updateMatrixWorld();
            for (let i = 0; i < N; i++) {
                const el = iconRefs.current[i];
                if (!el) continue;
                tmp.copy(origVectors[i]).applyEuler(sphereGroup.rotation).project(camera);
                const x = (tmp.x * 0.5 + 0.5) * w;
                const y = (tmp.y * -0.5 + 0.5) * h;
                const scale = Math.max(0.4, 1 - tmp.z * 0.5);
                el.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
                el.style.zIndex = tmp.z < 0.9 ? "10" : "0"; // front vs back
                el.style.opacity = String(tmp.z > 0.98 ? 0.2 : tmp.z > 0.9 ? 0.6 : 1);
            }
        };

        const renderFrame = () => {
            renderer.render(scene, camera);
            updateIcons();
        };
        renderFrame(); // initial positions, even before it scrolls into view

        // ── Loop: only while visible
        const gate = createFrameGate();
        let raf = 0;
        let last = 0;
        let visible = false;
        const animate = (now: number) => {
            raf = requestAnimationFrame(animate);
            const dt = last ? Math.min(0.1, (now - last) / 1000) : 1 / 60;
            last = now;
            const f = dt * 60; // keep the original per-frame speeds at 60 fps
            sphereGroup.rotation.y += 0.002 * f;
            particles.rotation.y += 0.0004 * f;
            particles.rotation.x += 0.0001 * f;
            if (!gate(tier)) return;
            renderFrame();
        };
        const start = () => {
            if (raf || document.hidden || !visible) return;
            last = 0;
            raf = requestAnimationFrame(animate);
        };
        const stop = () => {
            cancelAnimationFrame(raf);
            raf = 0;
        };

        const io = new IntersectionObserver(
            ([entry]) => {
                visible = entry.isIntersecting;
                if (visible) start();
                else stop();
            },
            { rootMargin: "120px 0px" }
        );
        io.observe(root);

        const onVisibility = () => (document.hidden ? stop() : start());
        document.addEventListener("visibilitychange", onVisibility);

        const unsubscribeTier = subscribePerfTier(() => {
            tier = getPerfTier();
            renderer.setPixelRatio(pixelRatioFor(tier));
            renderer.setSize(w, h);
        });

        const handleResize = () => {
            w = mount.clientWidth;
            h = mount.clientHeight;
            renderer.setSize(w, h);
            camera.aspect = w / h;
            camera.position.z = w < 768 ? 9.0 : 5.5;
            camera.updateProjectionMatrix();
            renderFrame();
        };
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            document.removeEventListener("visibilitychange", onVisibility);
            io.disconnect();
            unsubscribeTier();
            stop();
            renderer.dispose();
            globeGeom.dispose();
            globeMat.dispose();
            particlesGeom.dispose();
            particleMat.dispose();
            if (renderer.domElement.parentNode === mount) {
                mount.removeChild(renderer.domElement);
            }
        };
    }, []);

    return (
        <div
            ref={rootRef}
            className="relative w-full h-[60vh] md:h-screen flex items-center justify-center overflow-hidden"
        >
            <div ref={mountRef} className="absolute inset-0 z-0" />
            <div className="absolute inset-0 pointer-events-none z-10">
                {ICON_DEFS.map((ic, i) => (
                    <div
                        key={ic.id}
                        ref={(el) => {
                            iconRefs.current[i] = el;
                        }}
                        className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer group"
                        style={{ opacity: 0, willChange: "transform, opacity" }}
                        title={ic.label}
                    >
                        {/* Glow wrapper for intense hover aura */}
                        <div className="relative flex items-center justify-center transition-all duration-300 group-hover:scale-125">
                            <div
                                className="absolute inset-0 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                style={{ background: ic.color, transform: "scale(1.5)" }}
                            />
                            <div
                                className="absolute inset-0 blur-md opacity-20 group-hover:opacity-80 transition-opacity duration-300"
                                style={{ background: ic.color, transform: "scale(1.2)" }}
                            />
                            <ic.Icon
                                aria-label={ic.label}
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
