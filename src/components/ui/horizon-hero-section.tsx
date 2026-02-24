"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import './horizon-hero.css';

gsap.registerPlugin(ScrollTrigger);

interface HorizonHeroSectionProps {
  onComplete?: () => void;
  autoPlay?: boolean;
}

interface ThreeRefs {
  scene: THREE.Scene | null;
  camera: THREE.PerspectiveCamera | null;
  renderer: THREE.WebGLRenderer | null;
  composer: EffectComposer | null;
  stars: THREE.Points[];
  nebula: THREE.Mesh | null;
  mountains: THREE.Mesh[];
  animationId: number | null;
  targetCameraX?: number;
  targetCameraY?: number;
  targetCameraZ?: number;
  locations?: number[];
}

export const HorizonHeroSection = ({ onComplete, autoPlay = true }: HorizonHeroSectionProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const smoothCameraPos = useRef({ x: 0, y: 30, z: 300 });

  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [flashActive, setFlashActive] = useState(false);
  const [textHidden, setTextHidden] = useState(false);
  const totalSections = 3;

  const threeRefs = useRef<ThreeRefs>({
    scene: null,
    camera: null,
    renderer: null,
    composer: null,
    stars: [],
    nebula: null,
    mountains: [],
    animationId: null
  });

  const titles = ["WELCOME", "TO MY", "UNIVERSE"];
  const subtitles = [
    { line1: "Where vision meets reality,", line2: "we shape the future of tomorrow" },
    { line1: "Beyond the boundaries of imagination,", line2: "lies the universe of possibilities" },
    { line1: "In the space between thought and creation,", line2: "we find the essence of true innovation" }
  ];

  // Initialize Three.js
  useEffect(() => {
    const initThree = () => {
      const { current: refs } = threeRefs;

      // Scene setup
      refs.scene = new THREE.Scene();
      refs.scene.fog = new THREE.FogExp2(0x000000, 0.00025);

      // Camera
      refs.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        2000
      );
      refs.camera.position.z = 300;
      refs.camera.position.y = 30;

      // Renderer
      refs.renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current!,
        antialias: true,
        alpha: true
      });
      refs.renderer.setSize(window.innerWidth, window.innerHeight);
      refs.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      refs.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      refs.renderer.toneMappingExposure = 0.5;

      // Post-processing
      refs.composer = new EffectComposer(refs.renderer);
      const renderPass = new RenderPass(refs.scene, refs.camera);
      refs.composer.addPass(renderPass);

      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        0.8,
        0.4,
        0.85
      );
      refs.composer.addPass(bloomPass);

      // Create scene elements
      createStarField();
      createNebula();
      createMountains();
      createAtmosphere();

      // Helper to store initial positions for parallax
      const locations: number[] = [];
      refs.mountains.forEach((mountain, i) => {
        locations[i] = mountain.position.z;
      });
      refs.locations = locations;

      // Start animation
      animate();

      setIsReady(true);
    };

    const createStarField = () => {
      const { current: refs } = threeRefs;
      const starCount = 5000;

      for (let i = 0; i < 3; i++) {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(starCount * 3);
        const colors = new Float32Array(starCount * 3);
        const sizes = new Float32Array(starCount);

        for (let j = 0; j < starCount; j++) {
          const radius = 200 + Math.random() * 800;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(Math.random() * 2 - 1);

          positions[j * 3] = radius * Math.sin(phi) * Math.cos(theta);
          positions[j * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
          positions[j * 3 + 2] = radius * Math.cos(phi);

          const color = new THREE.Color();
          const colorChoice = Math.random();
          if (colorChoice < 0.7) {
            color.setHSL(0, 0, 0.8 + Math.random() * 0.2);
          } else if (colorChoice < 0.9) {
            color.setHSL(0.08, 0.5, 0.8);
          } else {
            color.setHSL(0.6, 0.5, 0.8);
          }

          colors[j * 3] = color.r;
          colors[j * 3 + 1] = color.g;
          colors[j * 3 + 2] = color.b;

          sizes[j] = Math.random() * 2 + 0.5;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.ShaderMaterial({
          uniforms: {
            time: { value: 0 },
            depth: { value: i }
          },
          vertexShader: `
            attribute float size;
            attribute vec3 color;
            varying vec3 vColor;
            uniform float time;
            uniform float depth;
            
            void main() {
              vColor = color;
              vec3 pos = position;
              float angle = time * 0.05 * (1.0 - depth * 0.3);
              mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
              pos.xy = rot * pos.xy;
              vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
              gl_PointSize = size * (300.0 / -mvPosition.z);
              gl_Position = projectionMatrix * mvPosition;
            }
          `,
          fragmentShader: `
            varying vec3 vColor;
            void main() {
              float dist = length(gl_PointCoord - vec2(0.5));
              if (dist > 0.5) discard;
              float opacity = 1.0 - smoothstep(0.0, 0.5, dist);
              gl_FragColor = vec4(vColor, opacity);
            }
          `,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });

        const stars = new THREE.Points(geometry, material);
        refs.scene?.add(stars);
        refs.stars.push(stars);
      }
    };

    const createNebula = () => {
      const { current: refs } = threeRefs;
      const geometry = new THREE.PlaneGeometry(8000, 4000, 50, 50);
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          color1: { value: new THREE.Color(0x0033ff) },
          color2: { value: new THREE.Color(0xff0066) },
          opacity: { value: 0.3 }
        },
        vertexShader: `
          varying vec2 vUv;
          varying float vElevation;
          uniform float time;
          void main() {
            vUv = uv;
            vec3 pos = position;
            float elevation = sin(pos.x * 0.01 + time) * cos(pos.y * 0.01 + time) * 20.0;
            pos.z += elevation;
            vElevation = elevation;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 color1;
          uniform vec3 color2;
          uniform float opacity;
          uniform float time;
          varying vec2 vUv;
          varying float vElevation;
          void main() {
            float mixFactor = sin(vUv.x * 10.0 + time * 0.5) * cos(vUv.y * 10.0 + time * 0.5);
            vec3 color = mix(color1, color2, mixFactor * 0.5 + 0.5);
            float alpha = opacity * (1.0 - length(vUv - 0.5) * 2.0);
            alpha *= 1.0 + vElevation * 0.01;
            gl_FragColor = vec4(color, alpha);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
      });

      const nebula = new THREE.Mesh(geometry, material);
      nebula.position.z = -1050;
      refs.scene?.add(nebula);
      refs.nebula = nebula;
    };

    const createMountains = () => {
      const { current: refs } = threeRefs;
      const layers = [
        { distance: -50, height: 60, color: 0x1a1a2e, opacity: 1 },
        { distance: -100, height: 80, color: 0x16213e, opacity: 0.8 },
        { distance: -150, height: 100, color: 0x0f3460, opacity: 0.6 },
        { distance: -200, height: 120, color: 0x0a4668, opacity: 0.4 }
      ];

      layers.forEach((layer) => {
        const shapePoints = [];
        const segments = 50;
        for (let i = 0; i <= segments; i++) {
          const x = (i / segments - 0.5) * 2000;
          const y = Math.sin(i * 0.1) * layer.height +
            Math.sin(i * 0.05) * layer.height * 0.5 +
            Math.random() * layer.height * 0.2 - 100;
          shapePoints.push(new THREE.Vector2(x, y));
        }
        shapePoints.push(new THREE.Vector2(5000, -1000));
        shapePoints.push(new THREE.Vector2(-5000, -1000));

        const shape = new THREE.Shape(shapePoints);
        const geometry = new THREE.ShapeGeometry(shape);
        const material = new THREE.MeshBasicMaterial({
          color: layer.color,
          transparent: true,
          opacity: layer.opacity,
          side: THREE.DoubleSide
        });

        const mountain = new THREE.Mesh(geometry, material);
        mountain.position.z = layer.distance;
        mountain.position.y = layer.distance;
        mountain.userData = { baseZ: layer.distance };
        refs.scene?.add(mountain);
        refs.mountains.push(mountain);
      });
    };

    const createAtmosphere = () => {
      const { current: refs } = threeRefs;
      const geometry = new THREE.SphereGeometry(600, 32, 32);
      const material = new THREE.ShaderMaterial({
        uniforms: { time: { value: 0 } },
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          uniform float time;
          void main() {
            float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
            vec3 atmosphere = vec3(0.3, 0.6, 1.0) * intensity;
            float pulse = sin(time * 2.0) * 0.1 + 0.9;
            atmosphere *= pulse;
            gl_FragColor = vec4(atmosphere, intensity * 0.25);
          }
        `,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true
      });
      const atmosphere = new THREE.Mesh(geometry, material);
      refs.scene?.add(atmosphere);
    };

    const animate = () => {
      const { current: refs } = threeRefs;
      refs.animationId = requestAnimationFrame(animate);
      const time = Date.now() * 0.001;

      refs.stars.forEach((starField) => {
        if (starField.material instanceof THREE.ShaderMaterial) {
          starField.material.uniforms.time.value = time;
        }
      });

      if (refs.nebula && refs.nebula.material instanceof THREE.ShaderMaterial) {
        refs.nebula.material.uniforms.time.value = time * 0.5;
      }

      if (refs.camera && refs.targetCameraX !== undefined) {
        const smoothingFactor = 0.05;
        smoothCameraPos.current.x += (refs.targetCameraX - smoothCameraPos.current.x) * smoothingFactor;
        smoothCameraPos.current.y += (refs.targetCameraY - smoothCameraPos.current.y) * smoothingFactor;
        smoothCameraPos.current.z += (refs.targetCameraZ - smoothCameraPos.current.z) * smoothingFactor;

        const floatX = Math.sin(time * 0.1) * 2;
        const floatY = Math.cos(time * 0.15) * 1;

        refs.camera.position.x = smoothCameraPos.current.x + floatX;
        refs.camera.position.y = smoothCameraPos.current.y + floatY;
        refs.camera.position.z = smoothCameraPos.current.z;
        refs.camera.lookAt(0, 10, -600);
      }

      refs.mountains.forEach((mountain, i) => {
        const parallaxFactor = 1 + i * 0.5;
        mountain.position.x = Math.sin(time * 0.1) * 2 * parallaxFactor;
        mountain.position.y = 50 + (Math.cos(time * 0.15) * 1 * parallaxFactor);
      });

      refs.composer?.render();
    };

    initThree();

    const handleResize = () => {
      const { current: refs } = threeRefs;
      if (refs.camera && refs.renderer && refs.composer) {
        refs.camera.aspect = window.innerWidth / window.innerHeight;
        refs.camera.updateProjectionMatrix();
        refs.renderer.setSize(window.innerWidth, window.innerHeight);
        refs.composer.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      const { current: refs } = threeRefs;
      if (refs.animationId) cancelAnimationFrame(refs.animationId);
      window.removeEventListener('resize', handleResize);
      refs.stars.forEach(s => { s.geometry.dispose(); (s.material as THREE.Material).dispose(); });
      refs.mountains.forEach(m => { m.geometry.dispose(); (m.material as THREE.Material).dispose(); });
      refs.nebula?.geometry.dispose(); (refs.nebula?.material as THREE.Material)?.dispose();
      refs.renderer?.dispose();
    };
  }, []);

  // Update target camera based on progress (text section is managed by the timeline, not here)
  const updateCamera = useCallback((progress: number) => {
    const { current: refs } = threeRefs;
    const totalProgress = progress * (totalSections - 1);
    const newSection = Math.floor(totalProgress);
    const sectionProgress = totalProgress % 1;

    const cameraPositions = [
      { x: 0, y: 30, z: 300 },
      { x: 0, y: 40, z: -50 },
      { x: 0, y: 50, z: -700 }
    ];

    const currentPos = cameraPositions[newSection] || cameraPositions[0];
    const nextPos = cameraPositions[newSection + 1] || currentPos;

    refs.targetCameraX = currentPos.x + (nextPos.x - currentPos.x) * sectionProgress;
    refs.targetCameraY = currentPos.y + (nextPos.y - currentPos.y) * sectionProgress;
    refs.targetCameraZ = currentPos.z + (nextPos.z - currentPos.z) * sectionProgress;

    // Mountain transition logic from provided code
    refs.mountains.forEach((mountain, i) => {
      const locations = refs.locations || [];
      if (progress > 0.7) {
        mountain.position.z = 600000;
      } else {
        mountain.position.z = locations[i] || 0;
      }
    });

    if (refs.nebula && refs.mountains[3]) {
      refs.nebula.position.z = refs.mountains[3].position.z;
    }
  }, []);

  // Handle autoPlay intro logic — staged timeline with white flash
  useEffect(() => {
    if (!autoPlay || !isReady) return;

    // Timeline (TEXT only — background camera progresses smoothly throughout):
    //   0–4s:      WELCOME text visible
    //   4–6s:      TO MY text visible (2s only)
    //   6–11s:     Text hidden, background scene continues (5s gap)
    //   11–11.35s: White flash
    //   11.35–11.75s: Post-flash settle (text still hidden)
    //   11.75–15.95s: UNIVERSE text (orange) fades in
    //   Then hold & fade out

    const phase1 = 4000;      // WELCOME
    const phase2 = 2000;      // TO MY (2s)
    const gapDur = 3000;      // Silent gap — no text, background plays
    const flashDur = 350;     // White flash
    const postFlash = 400;    // Post-flash settle
    const phase3 = 4200;      // UNIVERSE
    const holdEnd = 1500;     // Hold at end before fade
    const totalDur = phase1 + phase2 + gapDur + flashDur + postFlash + phase3;

    let rafId: number;
    let cancelled = false;
    const startTime = Date.now();

    const tick = () => {
      if (cancelled) return;
      const elapsed = Date.now() - startTime;

      // Camera progresses smoothly 0→1 over the full duration (background unchanged)
      const camProgress = Math.min(elapsed / totalDur, 1);
      updateCamera(camProgress);
      setScrollProgress(camProgress);

      if (elapsed < phase1) {
        // WELCOME
        setCurrentSection(0);
        setTextHidden(false);
      } else if (elapsed < phase1 + phase2) {
        // TO MY (2s)
        setCurrentSection(1);
        setTextHidden(false);
      } else if (elapsed < phase1 + phase2 + gapDur) {
        // Silent gap — text hidden, background keeps going
        setTextHidden(true);
      } else if (elapsed < phase1 + phase2 + gapDur + flashDur) {
        // WHITE FLASH
        setTextHidden(true);
        setFlashActive(true);
      } else if (elapsed < phase1 + phase2 + gapDur + flashDur + postFlash) {
        // Post-flash settle — flash fading out, text still hidden
        setFlashActive(false);
        setTextHidden(true);
      } else if (elapsed < totalDur) {
        // UNIVERSE — reveal orange text
        setFlashActive(false);
        setTextHidden(false);
        setCurrentSection(2);
      } else {
        // Done — hold then fade
        setCurrentSection(2);
        setTextHidden(false);
        setTimeout(() => {
          if (cancelled) return;
          setFadeOut(true);
          setTimeout(() => onComplete?.(), 1000);
        }, holdEnd);
        return; // stop the loop
      }

      rafId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
    };
  }, [autoPlay, isReady, updateCamera, onComplete]);

  // Entrance animations for UI
  useEffect(() => {
    if (!isReady) return;

    gsap.set([menuRef.current, titleRef.current, subtitleRef.current, scrollProgressRef.current], {
      visibility: 'visible',
      opacity: 0
    });

    const tl = gsap.timeline();
    tl.to(menuRef.current, { x: 0, opacity: 1, duration: 1, ease: "power3.out" })
      .to(titleRef.current, { y: 0, opacity: 1, duration: 1.5, ease: "power4.out" }, "-=0.5")
      .to(subtitleRef.current, { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out" }, "-=0.8")
      .to(scrollProgressRef.current, { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, "-=0.5");

    return () => { tl.kill(); };
  }, [isReady]);

  return (
    <div
      ref={containerRef}
      className={`hero-container cosmos-style ${fadeOut ? 'fade-out' : ''}`}
      style={{
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 1s ease-in-out',
        pointerEvents: fadeOut ? 'none' : 'auto'
      }}
    >
      <canvas ref={canvasRef} className="hero-canvas" />

      <div ref={menuRef} className="side-menu">
        <div className="menu-icon">
          <span></span><span></span><span></span>
        </div>
        <div className="vertical-text">SPACE</div>
      </div>

      {/* White flash overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-30"
        style={{
          backgroundColor: '#ffffff',
          opacity: flashActive ? 1 : 0,
          transition: flashActive
            ? 'opacity 0.35s cubic-bezier(0.4, 0, 1, 1)'
            : 'opacity 0.45s cubic-bezier(0, 0, 0.2, 1)',
        }}
      />

      <div
        className="hero-content cosmos-content"
        style={{
          opacity: textHidden ? 0 : 1,
          transition: textHidden ? 'opacity 0.1s ease' : 'opacity 0.6s ease 0.1s',
        }}
      >
        <h1
          ref={titleRef}
          className="hero-title"
          style={{
            color: currentSection === 2 ? '#FF6B2B' : '#ffffff',
            transition: 'color 0.6s ease',
          }}
        >
          {titles[currentSection]}
        </h1>

        <div ref={subtitleRef} className="hero-subtitle cosmos-subtitle">
          <p className="subtitle-line">{subtitles[currentSection]?.line1}</p>
          <p className="subtitle-line">{subtitles[currentSection]?.line2}</p>
        </div>
      </div>

      <div ref={scrollProgressRef} className="scroll-progress">
        <div className="scroll-text">REVEALING</div>
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>
        <div className="section-counter">
          {String(currentSection + 1).padStart(2, '0')} / 03
        </div>
      </div>
    </div>
  );
};
