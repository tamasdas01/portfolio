"use client";

import { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import "./multilingual-intro.css";

/* ── Word data — 14 languages, Bengali first, English last ── */
interface Word {
  text: string;
  script: "default" | "cjk" | "arabic" | "korean";
}

const WORDS: Word[] = [
  { text: "নমস্কার", script: "default" },  // 1.  Bengali
  { text: "नमस्ते", script: "default" },  // 2.  Hindi
  { text: "こんにちは", script: "cjk" },  // 3.  Japanese
  { text: "你好", script: "cjk" },  // 4.  Mandarin
  { text: "안녕하세요", script: "korean" },  // 5.  Korean
  { text: "مرحبًا", script: "arabic" },  // 6.  Arabic
  { text: "Привет", script: "default" },  // 7.  Russian
  { text: "Γεια σου", script: "default" },  // 8.  Greek
  { text: "Ciao", script: "default" },  // 9.  Italian
  { text: "Bonjour", script: "default" },  // 10. French
  { text: "Hallo", script: "default" },  // 11. German
  { text: "Hola", script: "default" },  // 12. Spanish
  { text: "Olá", script: "default" },  // 13. Portuguese
  { text: "Hello", script: "default" },  // 14. English — FINAL (water fall)
];

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/* ── Split text into visual grapheme clusters ──
   Handles Bengali/Hindi combining chars that [...text] would break */
function splitGraphemes(text: string): string[] {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
    return [...segmenter.segment(text)].map((s) => s.segment);
  }
  const clusters = text.match(/\P{M}\p{M}*/gu);
  return clusters || [...text];
}

/* ── CSS class for script type ── */
function scriptClass(script: Word["script"]): string {
  switch (script) {
    case "arabic": return " ml-intro__letter--arabic";
    case "cjk": return " ml-intro__letter--cjk";
    case "korean": return " ml-intro__letter--korean";
    default: return "";
  }
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

  /* ─────────────────────────────────────────────
     BUILD — single whole-word span (flash words)
  ───────────────────────────────────────────── */
  const buildWordUnit = useCallback((word: Word): HTMLSpanElement => {
    const container = wordRef.current!;
    container.innerHTML = "";
    const span = document.createElement("span");
    span.className = `ml-intro__letter${scriptClass(word.script)}`;
    span.textContent = word.text;
    gsap.set(span, { opacity: 0 });
    container.appendChild(span);
    return span;
  }, []);

  /* ─────────────────────────────────────────────
     BUILD — per-letter spans (Hello finale only)
  ───────────────────────────────────────────── */
  const buildLetters = useCallback((word: Word): HTMLSpanElement[] => {
    const container = wordRef.current!;
    container.innerHTML = "";

    // Arabic: always single unit — splitting RTL ligatures breaks rendering
    if (word.script === "arabic") {
      const span = document.createElement("span");
      span.className = "ml-intro__letter ml-intro__letter--arabic";
      gsap.set(span, { opacity: 0, y: 20 });
      span.textContent = word.text;
      container.appendChild(span);
      return [span];
    }

    const graphemes = splitGraphemes(word.text);
    return graphemes.map((ch) => {
      const span = document.createElement("span");
      span.className = `ml-intro__letter${scriptClass(word.script)}`;
      span.textContent = ch === " " ? "\u00A0" : ch;
      gsap.set(span, { opacity: 0, y: 20 });
      container.appendChild(span);
      return span;
    });
  }, []);

  /* ─────────────────────────────────────────────
     FLASH IN — instant appear, hold 130ms
  ───────────────────────────────────────────── */
  const flashIn = useCallback(async (span: HTMLSpanElement) => {
    gsap.set(span, { opacity: 1 });
    await delay(130);
  }, []);

  /* ─────────────────────────────────────────────
     FLASH OUT — 35ms fade, then tiny gap
  ───────────────────────────────────────────── */
  const flashOut = useCallback(async (span: HTMLSpanElement) => {
    return new Promise<void>((resolve) => {
      gsap.to(span, {
        opacity: 0,
        duration: 0.035,
        ease: "none",
        onComplete: resolve,
      });
    });
  }, []);

  /* ─────────────────────────────────────────────
     STAGGER IN — Hello entrance (per-letter)
  ───────────────────────────────────────────── */
  const staggerIn = useCallback(async (letters: HTMLSpanElement[]) => {
    return new Promise<void>((resolve) => {
      gsap.to(letters, {
        opacity: 1,
        y: 0,
        duration: 0.22,
        ease: "power2.out",
        stagger: 0.03,
        onComplete: resolve,
      });
    });
  }, []);

  /* ─────────────────────────────────────────────
     RIPPLE
  ───────────────────────────────────────────── */
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
    const tick = () => {
      frame++;
      const p = frame / 30;
      el.setAttribute("rx", String(2 + p * 44));
      el.setAttribute("ry", String(1.5 + p * 10));
      el.setAttribute("stroke", `rgba(168,85,247,${(1 - p) * 0.7})`);
      if (frame < 30) requestAnimationFrame(tick);
      else el.remove();
    };
    requestAnimationFrame(tick);
  }, []);

  /* ─────────────────────────────────────────────
     RIVER FALL — Hello sinks into water
  ───────────────────────────────────────────── */
  const riverFall = useCallback(
    async (letters: HTMLSpanElement[]) => {
      const intro = introRef.current;
      const water = waterRef.current;
      const mask = maskRef.current;
      const wordDisplay = wordRef.current;
      if (!intro || !water || !mask || !wordDisplay) return;

      gsap.to(water, { opacity: 1, duration: 0.3, ease: "none" });

      const surfaceRect = water.getBoundingClientRect();
      const introRect = intro.getBoundingClientRect();
      mask.style.height = introRect.bottom - surfaceRect.bottom + "px";
      gsap.set(mask, { opacity: 1 });

      const stageRect = wordDisplay.getBoundingClientRect();
      const dropToWater = surfaceRect.top - stageRect.bottom + 10;

      const fallPromises = letters.map(
        (letter, i) =>
          new Promise<void>((resolve) => {
            const tipDir = Math.random() > 0.5 ? 1 : -1;
            const tipAngle = (78 + Math.random() * 18) * tipDir;
            const xDrift = (Math.random() - 0.5) * 30;
            const fallDelay = Math.max(0, i * 0.06 + (Math.random() - 0.5) * 0.08);
            const xPct = 20 + (i / Math.max(letters.length - 1, 1)) * 60;

            // Phase 1 — Fall
            gsap.to(letter, {
              y: dropToWater,
              x: xDrift,
              rotation: tipAngle,
              opacity: 0.85,
              duration: 0.58,
              ease: "power2.in",
              delay: fallDelay,
              onComplete: () => {
                // Phase 2 — Splash
                spawnRipple(xPct);
                setTimeout(() => spawnRipple(xPct + (Math.random() - 0.5) * 9), 75);

                // Phase 3 — Sink
                gsap.to(letter, {
                  y: dropToWater + 85,
                  x: xDrift + (Math.random() - 0.5) * 12,
                  rotation: tipAngle + (Math.random() - 0.5) * 16,
                  opacity: 0,
                  duration: 0.44,
                  ease: "power1.out",
                  onComplete: resolve,
                });
              },
            });
          })
      );

      await Promise.all(fallPromises);
      await delay(340);
      gsap.to(water, { opacity: 0, duration: 0.45, ease: "none" });
      gsap.to(mask, { opacity: 0, duration: 0.45, ease: "none" });
    },
    [spawnRipple]
  );

  /* ─────────────────────────────────────────────
     MAIN SEQUENCE
  ───────────────────────────────────────────── */
  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const intro = introRef.current;
    if (!intro) return;

    // sessionStorage skip
    if (typeof window !== "undefined" && sessionStorage.getItem("introSeen")) {
      intro.style.display = "none";
      onComplete?.();
      return;
    }

    // prefers-reduced-motion fallback
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      const runReduced = async () => {
        const letters = buildLetters(WORDS[WORDS.length - 1]);
        gsap.set(letters, { opacity: 1, y: 0 });
        await delay(800);
        gsap.to(intro, {
          opacity: 0, duration: 0.5, ease: "none",
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

    // Full intro (~4.5s total)
    const runIntro = async () => {
      const progress = progressRef.current;

      // Progress bar over ~4.5s
      if (progress) {
        gsap.to(progress, { width: "100%", duration: 4.5, ease: "none" });
      }

      const transitional = WORDS.slice(0, -1);   // first 13
      const finalWord = WORDS[WORDS.length - 1]; // "Hello"

      // ── 13 flash words ──
      for (const word of transitional) {
        const span = buildWordUnit(word);
        await flashIn(span);
        await flashOut(span);
        await delay(8); // micro-gap between words
      }

      // ── Hello: stagger in → hold → river fall ──
      const letters = buildLetters(finalWord);
      await staggerIn(letters);
      await delay(280);
      await riverFall(letters);

      // Fade intro out, reveal site
      gsap.to(intro, {
        opacity: 0,
        duration: 0.55,
        ease: "none",
        onComplete: () => {
          intro.style.display = "none";
          sessionStorage.setItem("introSeen", "true");
          onComplete?.();
        },
      });
    };

    runIntro();
  }, [buildWordUnit, buildLetters, flashIn, flashOut, staggerIn, riverFall, onComplete]);

  return (
    <div ref={introRef} className="ml-intro">
      <div ref={progressRef} className="ml-intro__progress" />
      <div className="ml-intro__glow" />
      <div className="ml-intro__stage">
        <div ref={wordRef} className="ml-intro__word" />
      </div>
      <div ref={waterRef} className="ml-intro__water">
        <svg ref={rippleSvgRef} className="ml-intro__ripple-svg" height="40" />
      </div>
      <div ref={maskRef} className="ml-intro__mask" />
    </div>
  );
}