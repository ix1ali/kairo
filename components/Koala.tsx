"use client";

import { useEffect, useId, useRef, useState } from "react";

/**
 * Kai — the Kairo koala.
 *
 * Rendered to read as a soft-body 3D character rather than a flat cartoon:
 * offset radial gradients for form, ambient occlusion where shapes meet,
 * a specular highlight, a bounce-light rim, a contact shadow, and a glossy
 * visor with the brand gradient glowing inside it.
 *
 * The eyes track the pointer, he glances down as you scroll, and he blinks.
 * Pure SVG — no images, no dependencies.
 */

export type KoalaMood = "happy" | "thinking" | "sleepy" | "wow";

export default function Koala({
  size = 260,
  mood = "happy",
  interactive = true,
  float = true,
  className = "",
}: {
  size?: number;
  mood?: KoalaMood;
  interactive?: boolean;
  float?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [look, setLook] = useState({ x: 0, y: 0 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [blink, setBlink] = useState(false);
  const [mounted, setMounted] = useState(false);
  // useId is stable across server and client, so the gradient refs hydrate cleanly.
  const raw = useId();
  const uid = `k${raw.replace(/[^a-zA-Z0-9]/g, "")}`;
  const id = (n: string) => `${uid}-${n}`;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!interactive || !mounted) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height * 0.42);
        const dist = Math.hypot(dx, dy) || 1;
        const scale = Math.min(dist / 300, 1);
        setLook({ x: (dx / dist) * 9 * scale, y: (dy / dist) * 7 * scale });
        setTilt({
          x: Math.max(-7, Math.min(7, dx / 70)),
          y: Math.max(-5, Math.min(5, dy / 90)),
        });
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, [interactive, mounted]);

  useEffect(() => {
    if (!interactive || !mounted) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer: ReturnType<typeof setTimeout>;
    let last = window.scrollY;
    const onScroll = () => {
      const dir = window.scrollY > last ? 1 : -1;
      last = window.scrollY;
      setLook((l) => ({ x: l.x * 0.35, y: dir * 8 }));
      setTilt((t) => ({ x: t.x * 0.4, y: dir * 4 }));
      clearTimeout(timer);
      timer = setTimeout(() => {
        setLook((l) => ({ ...l, y: 0 }));
        setTilt({ x: 0, y: 0 });
      }, 600);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(timer);
    };
  }, [interactive, mounted]);

  useEffect(() => {
    if (!mounted || mood === "sleepy") return;
    let timer: ReturnType<typeof setTimeout>;
    const loop = () => {
      timer = setTimeout(() => {
        setBlink(true);
        setTimeout(() => setBlink(false), 120);
        loop();
      }, 2800 + Math.random() * 4000);
    };
    loop();
    return () => clearTimeout(timer);
  }, [mounted, mood]);

  const sleepy = mood === "sleepy";
  const eyeH = sleepy ? 3 : blink ? 2 : mood === "wow" ? 30 : mood === "thinking" ? 17 : 24;
  const eyeW = mood === "wow" ? 26 : mood === "thinking" ? 20 : 23;

  return (
    <div
      ref={ref}
      className={`${float ? "animate-floaty" : ""} ${className}`}
      style={{ width: size, height: size, perspective: 600 }}
    >
      <svg
        viewBox="0 0 260 260"
        width={size}
        height={size}
        role="img"
        aria-label="Kai, the Kairo koala"
        style={{
          transform: `rotateY(${tilt.x}deg) rotateX(${-tilt.y}deg)`,
          transition: "transform 0.6s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <defs>
          {/* pearl body material: light from upper-left */}
          <radialGradient id={id("shell")} cx="34%" cy="24%" r="82%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="42%" stopColor="#EEF1F7" />
            <stop offset="74%" stopColor="#C8CFDF" />
            <stop offset="100%" stopColor="#98A0B6" />
          </radialGradient>
          <radialGradient id={id("shellEar")} cx="32%" cy="26%" r="86%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#E6EAF2" />
            <stop offset="100%" stopColor="#A6AEC4" />
          </radialGradient>
          <radialGradient id={id("inner")} cx="40%" cy="32%" r="80%">
            <stop offset="0%" stopColor="#D9CEFF" />
            <stop offset="60%" stopColor="#B7A6F0" />
            <stop offset="100%" stopColor="#8574C9" />
          </radialGradient>

          {/* glossy visor */}
          <linearGradient id={id("visor")} x1="0.2" y1="0" x2="0.8" y2="1">
            <stop offset="0%" stopColor="#23233A" />
            <stop offset="45%" stopColor="#0E0E18" />
            <stop offset="100%" stopColor="#05050B" />
          </linearGradient>
          <linearGradient id={id("gloss")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.34" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
          <radialGradient id={id("eyeL")} cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#C9B6FF" />
            <stop offset="45%" stopColor="#7C5CFF" />
            <stop offset="100%" stopColor="#4B2FD0" stopOpacity="0.25" />
          </radialGradient>
          <radialGradient id={id("eyeR")} cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#B8F4FF" />
            <stop offset="45%" stopColor="#22D3EE" />
            <stop offset="100%" stopColor="#1195AC" stopOpacity="0.25" />
          </radialGradient>

          {/* nose */}
          <radialGradient id={id("nose")} cx="36%" cy="26%" r="78%">
            <stop offset="0%" stopColor="#5C5C74" />
            <stop offset="55%" stopColor="#2E2E3E" />
            <stop offset="100%" stopColor="#15151F" />
          </radialGradient>

          <filter id={id("blurS")} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
          <filter id={id("blurM")} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="11" />
          </filter>
          <filter id={id("blurL")} x="-70%" y="-70%" width="240%" height="240%">
            <feGaussianBlur stdDeviation="20" />
          </filter>

          <clipPath id={id("visorClip")}>
            <rect x="60" y="82" width="140" height="72" rx="36" />
          </clipPath>
        </defs>

        {/* brand aura */}
        <ellipse cx="130" cy="130" rx="104" ry="98" fill="#7C5CFF" opacity="0.17" filter={`url(#${id("blurL")})`} />

        {/* contact shadow */}
        <ellipse cx="130" cy="243" rx="70" ry="11" fill="#000000" opacity="0.55" filter={`url(#${id("blurM")})`} />

        {/* ---------- ears ---------- */}
        {[
          { cx: 42, flip: -1 },
          { cx: 218, flip: 1 },
        ].map((ear) => (
          <g key={ear.cx}>
            <circle cx={ear.cx} cy="70" r="50" fill={`url(#${id("shellEar")})`} />
            {/* bounce light on the outer edge */}
            <circle
              cx={ear.cx}
              cy="70"
              r="50"
              fill="none"
              stroke="#22D3EE"
              strokeWidth="2.5"
              opacity="0.28"
              strokeDasharray="70 200"
              strokeDashoffset={ear.flip > 0 ? 20 : 150}
            />
            <ellipse cx={ear.cx + ear.flip * 6} cy="74" rx="31" ry="29" fill={`url(#${id("inner")})`} />
            {/* inner-ear ambient occlusion */}
            <ellipse
              cx={ear.cx + ear.flip * 6}
              cy="82"
              rx="27"
              ry="20"
              fill="#5B4A9E"
              opacity="0.35"
              filter={`url(#${id("blurS")})`}
            />
            {/* specular */}
            <ellipse cx={ear.cx - 16} cy="48" rx="14" ry="10" fill="#FFFFFF" opacity="0.7" filter={`url(#${id("blurS")})`} />
          </g>
        ))}

        {/* ---------- body ---------- */}
        <ellipse cx="130" cy="212" rx="66" ry="46" fill={`url(#${id("shell")})`} />
        <ellipse cx="130" cy="236" rx="52" ry="18" fill="#8B93AA" opacity="0.4" filter={`url(#${id("blurS")})`} />

        {/* ---------- head ---------- */}
        <g
          style={{
            transform: `translate(${look.x * 0.28}px, ${look.y * 0.28}px)`,
            transition: "transform 0.6s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          <ellipse cx="130" cy="130" rx="87" ry="81" fill={`url(#${id("shell")})`} />

          {/* occlusion where the head meets the body */}
          <ellipse cx="130" cy="206" rx="60" ry="16" fill="#7F8799" opacity="0.45" filter={`url(#${id("blurM")})`} />
          {/* cool bounce light along the lower-right rim */}
          <path
            d="M55 160a87 81 0 0 0 150 0"
            fill="none"
            stroke="#22D3EE"
            strokeWidth="5"
            opacity="0.3"
            filter={`url(#${id("blurS")})`}
          />
          <path
            d="M48 118a87 81 0 0 1 34-58"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="7"
            opacity="0.8"
            strokeLinecap="round"
            filter={`url(#${id("blurS")})`}
          />
          {/* key specular */}
          <ellipse cx="88" cy="72" rx="26" ry="17" fill="#FFFFFF" opacity="0.75" filter={`url(#${id("blurS")})`} transform="rotate(-24 88 72)" />

          {/* ---------- visor ---------- */}
          <g>
            <rect x="58" y="80" width="144" height="76" rx="38" fill="#04040A" opacity="0.5" filter={`url(#${id("blurS")})`} />
            <rect x="60" y="82" width="140" height="72" rx="36" fill={`url(#${id("visor")})`} />

            <g clipPath={`url(#${id("visorClip")})`}>
              {/* eyes */}
              <ellipse
                cx={101 + look.x}
                cy={118 + look.y}
                rx={eyeW}
                ry={eyeH}
                fill={`url(#${id("eyeL")})`}
                style={{ transition: "rx 0.12s ease, ry 0.12s ease" }}
              />
              <ellipse
                cx={159 + look.x}
                cy={118 + look.y}
                rx={eyeW}
                ry={eyeH}
                fill={`url(#${id("eyeR")})`}
                style={{ transition: "rx 0.12s ease, ry 0.12s ease" }}
              />
              {/* glow bleed */}
              <ellipse cx={101 + look.x} cy={118 + look.y} rx={eyeW + 8} ry={eyeH + 6} fill="#7C5CFF" opacity="0.3" filter={`url(#${id("blurS")})`} />
              <ellipse cx={159 + look.x} cy={118 + look.y} rx={eyeW + 8} ry={eyeH + 6} fill="#22D3EE" opacity="0.26" filter={`url(#${id("blurS")})`} />
              {/* screen gloss */}
              <path d="M60 82h140v34c-46 14-96 14-140 0V82Z" fill={`url(#${id("gloss")})`} />
              {/* sharp catchlight */}
              <ellipse cx="92" cy="96" rx="20" ry="7" fill="#FFFFFF" opacity="0.32" transform="rotate(-12 92 96)" filter={`url(#${id("blurS")})`} />
            </g>

            {/* visor edge */}
            <rect
              x="60"
              y="82"
              width="140"
              height="72"
              rx="36"
              fill="none"
              stroke="#FFFFFF"
              strokeOpacity="0.16"
              strokeWidth="1.6"
            />
          </g>

          {/* ---------- nose ---------- */}
          <ellipse cx="130" cy="181" rx="30" ry="23" fill="#8E96AB" opacity="0.35" filter={`url(#${id("blurS")})`} />
          <path
            d="M130 159c-17 0-28 8-28 18 0 11 12 19 28 19s28-8 28-19c0-10-11-18-28-18Z"
            fill={`url(#${id("nose")})`}
          />
          <ellipse cx="121" cy="170" rx="7" ry="4.5" fill="#FFFFFF" opacity="0.28" transform="rotate(-18 121 170)" />

          {/* ---------- mouth ---------- */}
          {mood === "wow" ? (
            <ellipse cx="130" cy="206" rx="9" ry="7" fill="#2A2A3A" opacity="0.85" />
          ) : (
            <path
              d="M117 202q13 10 26 0"
              stroke="#6B7285"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              opacity="0.9"
            />
          )}
        </g>
      </svg>
    </div>
  );
}
