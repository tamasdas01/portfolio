"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { useIntro } from "@/providers/IntroProvider";
import { getPerfTier } from "@/lib/perf";
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
  { text: "Hello", script: "default" },  // 14. English — FINAL (shatters into black water)
];

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const rand = (min: number, max: number) => min + Math.random() * (max - min);
const sign = () => (Math.random() > 0.5 ? 1 : -1);

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

/* ═════════════════════════════════════════════════════════════
   Water engine — one 2D canvas, alive only for the ~2 s finale.
   Draws: glowing surface line that bends under impacts,
   perspective ripple rings, impact glow, and splash droplets.
   ═════════════════════════════════════════════════════════════ */
interface Ripple { x: number; t0: number; strength: number }
interface Drop { x: number; y: number; vx: number; vy: number; r: number }
interface Flash { x: number; t0: number }

function createWater(canvas: HTMLCanvasElement, surfaceY: number, lowTier: boolean) {
  const dpr = Math.min(window.devicePixelRatio || 1, lowTier ? 1.25 : 2);
  const W = window.innerWidth;
  const H = window.innerHeight;
  canvas.width = Math.round(W * dpr);
  canvas.height = Math.round(H * dpr);
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const ripples: Ripple[] = [];
  const drops: Drop[] = [];
  const flashes: Flash[] = [];
  const params = { reveal: 0, fade: 1 };

  const RING_SPEED = 260; // px/s
  const RING_LIFE = 1.0; // s
  const STEP = lowTier ? 6 : 3; // surface line resolution (px)
  const BAND_STEP = lowTier ? 12 : 7; // wave-band resolution (px)
  const BANDS = lowTier ? 4 : 8; // dense rolling wave lines inside the water
  const born = performance.now();
  // Per-band wave character, fixed so the motion reads as one body of liquid.
  const bands = Array.from({ length: BANDS }, (_, j) => ({
    depth: 9 + Math.pow(j + 1, 1.55) * 10, // perspective: spacing grows with depth
    k: 0.011 + j * 0.0016,
    w: 1.6 + j * 0.35,
    amp: 1.4 + j * 0.55,
    phase: j * 1.7,
    alpha: 0.34 * (1 - j / BANDS),
  }));
  let raf = 0;
  let running = false;
  let last = 0;

  // Travelling wave packet on the surface line for each impact.
  const surfaceOffset = (x: number, now: number) => {
    let d = 0;
    for (const r of ripples) {
      const t = (now - r.t0) / 1000;
      if (t < 0 || t > 1.5) continue;
      const dist = Math.abs(x - r.x);
      const front = t * RING_SPEED;
      const env = Math.exp(-((dist - front) ** 2) / 1400) * Math.exp(-t * 2.4);
      d += r.strength * env * Math.sin(dist * 0.12 - t * 15);
    }
    return d;
  };

  const draw = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    ctx.clearRect(0, 0, W, H);
    const fade = params.fade;
    if (fade <= 0.001) return;

    // ── Surface line (draws outward from centre, bends under impacts)
    const cx = W / 2;
    const half = W * 0.46 * params.reveal;
    if (half > 1) {
      const grad = ctx.createLinearGradient(cx - half, 0, cx + half, 0);
      grad.addColorStop(0, "rgba(168,85,247,0)");
      grad.addColorStop(0.18, "rgba(168,85,247,0.3)");
      grad.addColorStop(0.5, "rgba(214,178,255,0.95)");
      grad.addColorStop(0.82, "rgba(168,85,247,0.3)");
      grad.addColorStop(1, "rgba(168,85,247,0)");
      ctx.beginPath();
      for (let x = cx - half; x <= cx + half; x += STEP) {
        const y = surfaceY + surfaceOffset(x, now);
        if (x === cx - half) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = grad;
      ctx.globalAlpha = fade * 0.22;
      ctx.lineWidth = 8;
      ctx.stroke();
      ctx.globalAlpha = fade;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // ── Dense rolling wave bands beneath the surface (black-purple liquid)
      const t = (now - born) / 1000;
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1;
      for (const b of bands) {
        const baseY = surfaceY + b.depth;
        if (baseY > H) break;
        ctx.beginPath();
        for (let x = cx - half; x <= cx + half; x += BAND_STEP) {
          const y =
            baseY +
            Math.sin(x * b.k + t * b.w + b.phase) * b.amp +
            surfaceOffset(x, now) * (0.55 - b.depth / 400);
          if (x === cx - half) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.globalAlpha = b.alpha * fade * params.reveal;
        ctx.stroke();
      }
      ctx.restore();
    }

    // ── Ripple rings + impact glow, clipped to the water (below the line)
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, surfaceY + 1, W, H - surfaceY);
    ctx.clip();
    ctx.globalCompositeOperation = "lighter";
    for (const r of ripples) {
      for (let k = 0; k < 3; k++) {
        const t = (now - r.t0) / 1000 - k * 0.14;
        if (t < 0 || t > RING_LIFE) continue;
        const rx = 3 + t * RING_SPEED * (1 - k * 0.14);
        const ry = rx * 0.16;
        const a = Math.pow(1 - t / RING_LIFE, 1.7) * 0.6 * Math.min(1, r.strength / 6) * (1 - k * 0.25);
        ctx.globalAlpha = a * fade;
        ctx.strokeStyle = "rgb(196,150,255)";
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.ellipse(r.x, surfaceY + 1, rx, ry, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    for (const f of flashes) {
      const t = (now - f.t0) / 1000;
      if (t < 0 || t > 0.55) continue;
      const a = (1 - t / 0.55) * 0.32 * fade;
      const g = ctx.createRadialGradient(f.x, surfaceY, 0, f.x, surfaceY, 80);
      g.addColorStop(0, `rgba(190,130,255,${a})`);
      g.addColorStop(1, "rgba(190,130,255,0)");
      ctx.globalAlpha = 1;
      ctx.fillStyle = g;
      ctx.fillRect(f.x - 80, surfaceY, 160, 80);
    }
    ctx.restore();

    // ── Splash droplets (simple ballistic particles)
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.fillStyle = "rgb(220,195,255)";
    for (let i = drops.length - 1; i >= 0; i--) {
      const d = drops[i];
      d.vy += 1100 * dt;
      d.x += d.vx * dt;
      d.y += d.vy * dt;
      if (d.y >= surfaceY && d.vy > 0) {
        drops.splice(i, 1);
        ripples.push({ x: d.x, t0: now, strength: 1.2 });
        continue;
      }
      ctx.globalAlpha = 0.75 * fade;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // ── Prune old effects
    for (let i = ripples.length - 1; i >= 0; i--) if (now - ripples[i].t0 > 1700) ripples.splice(i, 1);
    for (let i = flashes.length - 1; i >= 0; i--) if (now - flashes[i].t0 > 600) flashes.splice(i, 1);
  };

  const loop = (now: number) => {
    draw(now);
    if (running) raf = requestAnimationFrame(loop);
  };

  return {
    params,
    start() {
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    },
    stop() {
      running = false;
      cancelAnimationFrame(raf);
      ctx.clearRect(0, 0, W, H);
    },
    impact(x: number, strength = 6) {
      const now = performance.now();
      ripples.push({ x, t0: now, strength });
      flashes.push({ x, t0: now });
      const count = lowTier ? 3 : 7;
      for (let i = 0; i < count; i++) {
        drops.push({
          x: x + rand(-6, 6),
          y: surfaceY - 1,
          vx: rand(-90, 90),
          vy: -rand(140, 300) * Math.min(1.2, strength / 6),
          r: rand(0.8, 1.9),
        });
      }
    },
  };
}

/* ═════════════════════════════════════════════════════════════ */

interface ShardPair { a: HTMLSpanElement; b: HTMLSpanElement }
interface Glyph {
  real: { wrap: HTMLSpanElement } & ShardPair;
  twin: { wrap: HTMLSpanElement } & ShardPair;
  crack: number; // average crack height in % of the glyph box
}

interface MultilingualIntroProps {
  /** Fired when the site should start revealing (overlay begins fading). */
  onReveal?: () => void;
  /** Fired once the overlay is fully gone and can be unmounted. */
  onDone?: () => void;
}

export function MultilingualIntro({ onReveal, onDone }: MultilingualIntroProps) {
  const { setIntroPlaying } = useIntro();
  const introRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);
  const waterRef = useRef<HTMLDivElement>(null);
  const reflWrapRef = useRef<HTMLDivElement>(null);
  const reflRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const hasRun = useRef(false);

  // Keep the latest callbacks without re-running the sequence effect.
  const cbRef = useRef({ onReveal, onDone, setIntroPlaying });
  useLayoutEffect(() => {
    cbRef.current = { onReveal, onDone, setIntroPlaying };
  });

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const intro = introRef.current;
    const wordEl = wordRef.current;
    if (!intro || !wordEl) return;

    let cancelled = false;
    const finish = () => {
      sessionStorage.setItem("introSeen", "true");
      cbRef.current.onDone?.();
    };

    // ── Repeat visit this session → skip entirely
    if (sessionStorage.getItem("introSeen")) {
      intro.style.display = "none";
      cbRef.current.onReveal?.();
      cbRef.current.onDone?.();
      return;
    }

    /* ── BUILD — single whole-word span (flash words) ── */
    const buildWordUnit = (word: Word): HTMLSpanElement => {
      wordEl.innerHTML = "";
      const span = document.createElement("span");
      span.className = `ml-intro__letter${scriptClass(word.script)}`;
      span.textContent = word.text;
      gsap.set(span, { opacity: 0, y: 0 });
      wordEl.appendChild(span);
      return span;
    };

    // ── prefers-reduced-motion → calm static Hello, then fade
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const span = buildWordUnit(WORDS[WORDS.length - 1]);
      gsap.set(span, { opacity: 1 });
      cbRef.current.setIntroPlaying(true);
      delay(800).then(() => {
        if (cancelled) return;
        cbRef.current.onReveal?.();
        gsap.to(intro, {
          opacity: 0, duration: 0.5, ease: "none",
          onComplete: () => { intro.style.display = "none"; finish(); },
        });
      });
      return () => { cancelled = true; };
    }

    cbRef.current.setIntroPlaying(true);
    const lowTier = getPerfTier() === "low";

    /* ── BUILD — glyphs split into two shards along a random crack,
       plus a mirrored twin set inside the reflection ── */
    const buildFinale = (word: Word): Glyph[] => {
      const reflEl = reflRef.current!;
      wordEl.innerHTML = "";
      reflEl.innerHTML = "";
      const graphemes = word.script === "arabic" ? [word.text] : splitGraphemes(word.text);

      const make = (container: HTMLElement, text: string) => {
        const wrap = document.createElement("span");
        wrap.className = `ml-intro__glyph${scriptClass(word.script)}`;
        const a = document.createElement("span");
        a.className = "ml-intro__shard";
        a.textContent = text;
        const b = document.createElement("span");
        b.className = "ml-intro__shard ml-intro__shard--abs";
        b.textContent = text;
        wrap.append(a, b);
        container.appendChild(wrap);
        return { wrap, a, b };
      };

      return graphemes.map((ch) => {
        const text = ch === " " ? " " : ch;
        const real = make(wordEl, text);
        const twin = make(reflEl, text);
        const l = rand(34, 66);
        const r = rand(34, 66);
        // Tiny overlap on the top shard so no hairline shows before the crack.
        const topClip = `polygon(-15% -15%, 115% -15%, 115% ${r + 0.8}%, -15% ${l + 0.8}%)`;
        const botClip = `polygon(-15% ${l}%, 115% ${r}%, 115% 115%, -15% 115%)`;
        for (const s of [real, twin]) {
          s.a.style.clipPath = topClip;
          s.b.style.clipPath = botClip;
        }
        gsap.set([real.wrap, twin.wrap], { opacity: 0, y: 22 });
        return { real, twin, crack: (l + r) / 2 };
      });
    };

    /* ── FINALE — Hello → shatter → fall → black water ── */
    const finale = async () => {
      const glyphs = buildFinale(WORDS[WORDS.length - 1]);
      const water = waterRef.current!;
      const reflWrap = reflWrapRef.current!;
      const reflEl = reflRef.current!;
      const canvas = canvasRef.current!;

      // Geometry: surface line + mirror distance
      const introRect = intro.getBoundingClientRect();
      const surfaceY = Math.round(introRect.height * 0.72);
      const wordRect = wordEl.getBoundingClientRect();
      const mirrorGap = Math.max(12, surfaceY - wordRect.bottom);
      reflWrap.style.top = `${surfaceY}px`;
      water.style.top = `${surfaceY}px`;
      reflEl.style.top = `${mirrorGap}px`;
      reflEl.style.height = `${wordRect.height}px`;

      const engine = createWater(canvas, surfaceY, lowTier);
      engine?.start();

      // 1. Hello snaps in while the water line + black-purple water draw outward
      const reals = glyphs.map((g) => g.real.wrap);
      const twins = glyphs.map((g) => g.twin.wrap);
      gsap.to(water, { opacity: 1, duration: 0.35, ease: "power1.out" });
      gsap.to(reflWrap, { opacity: 1, duration: 0.4, ease: "power1.out" });
      if (engine) gsap.to(engine.params, { reveal: 1, duration: 0.5, ease: "expo.out" });
      await new Promise<void>((resolve) => {
        gsap.to([reals, twins], {
          opacity: 1, y: 0, duration: 0.24, ease: "power3.out",
          stagger: { each: 0.025, from: "start" },
          onComplete: resolve,
        });
      });
      if (cancelled) return;

      // 2. No pause — each glyph cracks along its fault line *as* it drops,
      //    then shards hit the surface → ripple + splash → sink into the water.
      const impacts: Promise<void>[] = [];
      glyphs.forEach((g, i) => {
        const rect = g.real.wrap.getBoundingClientRect();
        const toSurface = surfaceY - rect.bottom;
        const cx = rect.left + rect.width / 2;
        const base = i * 0.045 + rand(-0.015, 0.015);

        // Resolves on impact; the sink keeps playing underneath the cross-fade.
        const shardFall = (pair: [HTMLSpanElement, HTMLSpanElement], opts: {
          dy: number; rot: number; dx: number; at: number; strength: number;
        }) =>
          new Promise<void>((resolve) => {
            gsap.to(pair, {
              y: opts.dy, x: opts.dx, rotation: opts.rot,
              duration: 0.42, ease: "power2.in", delay: Math.max(0, opts.at),
              onComplete: () => {
                engine?.impact(cx + opts.dx, opts.strength);
                resolve();
                gsap.to(pair, {
                  y: opts.dy + 95,
                  x: opts.dx + rand(-10, 10),
                  rotation: opts.rot + rand(-14, 14),
                  opacity: 0,
                  ...(lowTier ? {} : { filter: "blur(3px)" }),
                  duration: 0.5, ease: "power1.out",
                });
              },
            });
          });

        // Lower shard drops first; upper shard follows, tumbling harder.
        const lowerDx = rand(-8, 8);
        impacts.push(shardFall([g.real.b, g.twin.b], {
          dy: toSurface, rot: sign() * rand(12, 32), dx: lowerDx, at: base, strength: 6,
        }));
        impacts.push(shardFall([g.real.a, g.twin.a], {
          dy: toSurface + rect.height * (1 - g.crack / 100),
          rot: sign() * rand(55, 95),
          dx: lowerDx + rand(-16, 16),
          at: base + rand(0.03, 0.06),
          strength: 4.5,
        }));
      });
      await Promise.all(impacts);
      if (cancelled) return;

      // 3. A short beat while the shards sink and the ripples settle,
      //    then reveal the site (~3.2 s from the first word).
      await delay(650);
      cbRef.current.onReveal?.();
      const outro = gsap.timeline({
        onComplete: () => {
          engine?.stop();
          intro.style.display = "none";
          finish();
        },
      });
      if (engine) outro.to(engine.params, { fade: 0, duration: 0.45, ease: "power1.in" }, 0);
      outro.to([water, reflWrap], { opacity: 0, duration: 0.4, ease: "none" }, 0);
      outro.to(intro, { opacity: 0, duration: 0.5, ease: "power1.inOut" }, 0.05);
    };

    /* ── MAIN SEQUENCE ── */
    const run = async () => {
      if (progressRef.current) {
        // Matches the time until the site starts revealing (~3.2 s total).
        gsap.to(progressRef.current, { width: "100%", duration: 3.15, ease: "none" });
      }

      // 13 flash words — quick rhythm: 85 ms hold, 25 ms fade, 5 ms gap (~1.5 s)
      for (const word of WORDS.slice(0, -1)) {
        if (cancelled) return;
        const span = buildWordUnit(word);
        gsap.set(span, { opacity: 1 });
        await delay(85);
        await new Promise<void>((resolve) =>
          gsap.to(span, { opacity: 0, duration: 0.025, ease: "none", onComplete: resolve })
        );
        await delay(5);
      }
      if (cancelled) return;
      await finale();
    };

    run();
    return () => { cancelled = true; };
  }, []);

  return (
    <div ref={introRef} className="ml-intro" aria-hidden="true">
      <div ref={progressRef} className="ml-intro__progress" />
      <div className="ml-intro__glow" />
      <div className="ml-intro__stage">
        <div ref={wordRef} className="ml-intro__word" />
      </div>

      {/* Black water body — sunk shards fade into it */}
      <div ref={waterRef} className="ml-intro__water" />

      {/* Mirrored reflection, clipped at the surface line */}
      <div ref={reflWrapRef} className="ml-intro__reflection-wrap">
        <div ref={reflRef} className="ml-intro__reflection" />
      </div>

      {/* Surface line, ripples, splash droplets */}
      <canvas ref={canvasRef} className="ml-intro__canvas" />

      {/* SVG water distortion for the reflection (high tier only, via CSS) */}
      <svg className="ml-intro__defs" width="0" height="0" aria-hidden="true" focusable="false">
        <filter id="ml-water-distort" x="-10%" y="-20%" width="120%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.008 0.09" numOctaves="1" seed="3" result="noise">
            <animate attributeName="baseFrequency" dur="3.2s" values="0.008 0.09;0.011 0.12;0.008 0.09" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="9" xChannelSelector="R" yChannelSelector="G" />
          <feGaussianBlur stdDeviation="0.6" />
        </filter>
      </svg>
    </div>
  );
}
