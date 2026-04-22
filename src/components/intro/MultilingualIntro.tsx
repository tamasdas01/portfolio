"use client";

import { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import "./multilingual-intro.css";

/* ── Word data — exact order from prompt ── */
interface Word {
  text: string;
  script: "default" | "cjk" | "arabic";
}

const WORDS: Word[] = [
  { text: "নমস্কার", script: "default" },   // Bengali
  { text: "नमस्ते", script: "default" },    // Hindi
  { text: "こんにちは", script: "cjk" },      // Japanese
  { text: "你好", script: "cjk" },           // Mandarin
  { text: "مرحبًا", script: "arabic" },      // Arabic
  { text: "Привет", script: "default" },    // Russian
  { text: "Ciao", script: "default" },      // Italian
  { text: "Bonjour", script: "default" },   // French
  { text: "Hola", script: "default" },      // Spanish
  { text: "Hello", script: "default" },     // English — FINAL
];

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/* ── Split text into visual grapheme clusters ──
   Handles Bengali/Hindi combining chars (virama, vowel signs)
   that [...text] would break into individual code points */
function splitGraphemes(text: string): string[] {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
    return [...segmenter.segment(text)].map((s) => s.segment);
  }
  // Fallback: regex-based approach for combining marks
  const clusters = text.match(/\P{M}\p{M}*/gu);
  return clusters || [...text];
}

interface MultilingualIntroProps {
  onComplete?: () => void;
}

export function MultilingualIntro({ onComplete }: MultilingualIntroProps) {
  const introRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);
  const waterRef = useRef<HTMLDivElement>(null);
  const rippleSvgRef = useRef<SVGSVGElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const hasRun = useRef(false);

  /* ── Build letter spans for a word ── */
  const buildLetters = useCallback((word: Word): HTMLSpanElement[] => {
    const container = wordRef.current;
    if (!container) return [];
    container.innerHTML = "";

    // Arabic: single unit — splitting RTL ligatures breaks rendering
    if (word.script === "arabic") {
      const span = document.createElement("span");
      span.className = "ml-intro__letter ml-intro__letter--arabic";
      span.textContent = word.text;
      span.style.opacity = "0";
      span.style.transform = "translateY(28px)";
      container.appendChild(span);
      return [span];
    }

    // Use grapheme segmenter for proper cluster splitting
    // (prevents Bengali/Hindi combining marks from showing as broken circles)
    const graphemes = splitGraphemes(word.text);

    return graphemes.map((ch) => {
      const span = document.createElement("span");
      span.className = `ml-intro__letter${word.script === "cjk" ? " ml-intro__letter--cjk" : ""}`;
      span.textContent = ch === " " ? "\u00A0" : ch;
      span.style.opacity = "0";
      span.style.transform = "translateY(28px)";
      container.appendChild(span);
      return span;
    });
  }, []);

  /* ── Stagger IN — 42ms between letters, GSAP ── */
  const staggerIn = useCallback(async (letters: HTMLSpanElement[]) => {
    return new Promise<void>((resolve) => {
      gsap.set(letters, { opacity: 0, y: 28 });
      gsap.to(letters, {
        opacity: 1,
        y: 0,
        duration: 0.32,
        ease: "cubic-bezier(0.22,1,0.36,1)",
        stagger: 0.042,
        onComplete: resolve,
      });
    });
  }, []);

  /* ── Stagger OUT — 28ms between letters, GSAP ── */
  const staggerOut = useCallback(async (letters: HTMLSpanElement[]) => {
    return new Promise<void>((resolve) => {
      gsap.to(letters, {
        opacity: 0,
        y: -20,
        duration: 0.18,
        ease: "ease-in",
        stagger: 0.028,
        onComplete: resolve,
      });
    });
  }, []);

  /* ── Spawn SVG ripple at x-position ── */
  const spawnRipple = useCallback((xPercent: number) => {
    const svg = rippleSvgRef.current;
    if (!svg) return;

    const el = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
    el.setAttribute("cx", `${xPercent}%`);
    el.setAttribute("cy", "4");
    el.setAttribute("rx", "2");
    el.setAttribute("ry", "1.5");
    el.setAttribute("fill", "none");
    el.setAttribute("stroke", "rgba(168,85,247,0.75)");
    el.setAttribute("stroke-width", "1.2");
    svg.appendChild(el);

    let frame = 0;
    const max = 30;
    const tick = () => {
      frame++;
      const p = frame / max;
      el.setAttribute("rx", String(2 + p * 44));
      el.setAttribute("ry", String(1.5 + p * 10));
      el.setAttribute("stroke", `rgba(168,85,247,${(1 - p) * 0.7})`);
      if (frame < max) requestAnimationFrame(tick);
      else el.remove();
    };
    requestAnimationFrame(tick);
  }, []);

  /* ── River Fall — "Hello" sinks into water ── */
  const riverFall = useCallback(
    async (letters: HTMLSpanElement[]) => {
      const intro = introRef.current;
      const water = waterRef.current;
      const mask = maskRef.current;
      const wordDisplay = wordRef.current;
      if (!intro || !water || !mask || !wordDisplay) return;

      // 1. Fade in water surface over 350ms
      gsap.to(water, { opacity: 1, duration: 0.35, ease: "none" });

      // 2. Size & show the sink mask
      const surfaceRect = water.getBoundingClientRect();
      const introRect = intro.getBoundingClientRect();
      mask.style.height = introRect.bottom - surfaceRect.bottom + "px";
      gsap.set(mask, { opacity: 1 });

      // Calculate how far letters need to fall to reach water
      const stageRect = wordDisplay.getBoundingClientRect();
      const dropToWater = surfaceRect.top - stageRect.bottom + 10;

      // 3. Each letter falls independently
      const fallPromises = letters.map(
        (letter, i) =>
          new Promise<void>(async (resolve) => {
            const tipDir = Math.random() > 0.5 ? 1 : -1;
            const tipAngle = (78 + Math.random() * 18) * tipDir;
            const xDrift = (Math.random() - 0.5) * 30;
            // 70ms stagger ± 45ms random jitter
            const fallDelay = i * 0.07 + (Math.random() - 0.5) * 0.09;
            const xPct = 20 + (i / Math.max(letters.length - 1, 1)) * 60;

            // Phase 1 — Fall + Tip
            gsap.to(letter, {
              y: dropToWater,
              x: xDrift,
              rotation: tipAngle,
              opacity: 0.85,
              duration: 0.65,
              ease: "power2.in",
              delay: Math.max(0, fallDelay),
              onComplete: () => {
                // Phase 2 — Splash
                spawnRipple(xPct);
                setTimeout(() => spawnRipple(xPct + (Math.random() - 0.5) * 9), 80);

                // Phase 3 — Sink
                gsap.to(letter, {
                  y: dropToWater + 85,
                  x: xDrift + (Math.random() - 0.5) * 12,
                  rotation: tipAngle + (Math.random() - 0.5) * 16,
                  opacity: 0,
                  duration: 0.5,
                  ease: "power1.out",
                  onComplete: resolve,
                });
              },
            });
          })
      );

      await Promise.all(fallPromises);

      // 4. Wait 400ms then fade out water surface over 500ms
      await delay(400);
      gsap.to(water, { opacity: 0, duration: 0.5, ease: "none" });
      gsap.to(mask, { opacity: 0, duration: 0.5, ease: "none" });
    },
    [spawnRipple]
  );

  /* ── Main intro sequence ── */
  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const intro = introRef.current;
    if (!intro) return;

    // ── sessionStorage skip ──
    if (typeof window !== "undefined" && sessionStorage.getItem("introSeen")) {
      intro.style.display = "none";
      onComplete?.();
      return;
    }

    // ── prefers-reduced-motion fallback ──
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      const runReduced = async () => {
        const letters = buildLetters(WORDS[WORDS.length - 1]); // "Hello"
        gsap.set(letters, { opacity: 1, y: 0 });
        await delay(1000);
        gsap.to(intro, {
          opacity: 0,
          duration: 0.6,
          ease: "none",
          onComplete: () => {
            intro.style.display = "none";
            sessionStorage.setItem("introSeen", "true");
            onComplete?.();
          },
        });
      };
      runReduced();
      return;
    }

    // ── Full intro ──
    const runIntro = async () => {
      const progress = progressRef.current;

      // Animate progress bar across full duration
      const approxDuration = WORDS.length * 1.1; // seconds (increased for longer hold)
      if (progress) {
        gsap.to(progress, {
          width: "100%",
          duration: approxDuration,
          ease: "none",
        });
      }

      for (let i = 0; i < WORDS.length; i++) {
        const isFinal = i === WORDS.length - 1;
        const letters = buildLetters(WORDS[i]);

        await staggerIn(letters);

        if (!isFinal) {
          // Hold 500ms then stagger out — longer pause for readability
          await delay(500);
          await staggerOut(letters);
          await delay(100);
        } else {
          // HELLO: hold 500ms then river fall
          await delay(500);
          await riverFall(letters);

          // 5. Fade out intro over 600ms, show site immediately
          gsap.to(intro, {
            opacity: 0,
            duration: 0.6,
            ease: "none",
            onComplete: () => {
              intro.style.display = "none";
              sessionStorage.setItem("introSeen", "true");
              onComplete?.();
            },
          });
        }
      }
    };

    runIntro();
  }, [buildLetters, staggerIn, staggerOut, riverFall, onComplete]);

  return (
    <div ref={introRef} className="ml-intro">
      {/* Progress bar */}
      <div ref={progressRef} className="ml-intro__progress" />

      {/* Purple radial glow */}
      <div className="ml-intro__glow" />

      {/* Word stage */}
      <div className="ml-intro__stage">
        <div ref={wordRef} className="ml-intro__word" />
      </div>

      {/* Water surface */}
      <div ref={waterRef} className="ml-intro__water">
        <svg ref={rippleSvgRef} className="ml-intro__ripple-svg" height="40" />
      </div>

      {/* Sink mask */}
      <div ref={maskRef} className="ml-intro__mask" />
    </div>
  );
}
