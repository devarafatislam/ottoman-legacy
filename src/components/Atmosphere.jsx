import React, { useMemo } from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { theme } from "../theme";
import { useClock } from "../lib/anim";
import { Rosette, Embers } from "./FX";

const c = theme.colors;

// Layer 1 — slow drifting emerald/navy mesh (never a flat background)
export const Backdrop = ({ tone = "emerald" }) => {
  const { frame } = useClock();
  const d1 = Math.sin(frame / 160) * 70, d2 = Math.cos(frame / 210) * 60;
  const a = tone === "navy" ? c.navyMid : c.emeraldMid;
  const b = tone === "navy" ? c.emerald : c.navy;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(160deg, ${c.navyDeep} 0%, ${c.emeraldDeep} 55%, ${c.navyDeep} 100%)` }}>
      <div style={{ position: "absolute", width: 1500, height: 1500, borderRadius: "50%", top: -620 + d2, left: -380 + d1, filter: "blur(80px)", background: `radial-gradient(circle, ${a}AA, transparent 64%)` }} />
      <div style={{ position: "absolute", width: 1300, height: 1300, borderRadius: "50%", bottom: -640 - d1, right: -330 + d2, filter: "blur(90px)", background: `radial-gradient(circle, ${b}CC, transparent 66%)` }} />
      <div style={{ position: "absolute", width: 900, height: 900, borderRadius: "50%", top: 120, right: 240 + d1 * 0.5, filter: "blur(100px)", background: `radial-gradient(circle, ${c.gold}1F, transparent 66%)` }} />
      <Rosette />
      <Embers count={30} />
    </AbsoluteFill>
  );
};

const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='260' height='260'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1.4 -0.2'/%3E%3C/filter%3E%3Crect width='260' height='260' filter='url(%23n)'/%3E%3C/svg%3E")`;

// Archival paper: warm gradient + fibre noise + stains. Used as map sheet / card stock.
export const Parchment = ({ style, children, stains = true, seed = 0 }) => (
  <div style={{ position: "relative", overflow: "hidden", background: `radial-gradient(ellipse at 40% 35%, ${c.parchmentLight}, ${c.parchment} 55%, ${c.parchmentDark} 100%)`, ...style }}>
    <div style={{ position: "absolute", inset: 0, backgroundImage: NOISE, backgroundSize: "260px", opacity: 0.16, mixBlendMode: "multiply", backgroundPosition: `${seed * 53}px ${seed * 31}px` }} />
    {stains && (
      <>
        <div style={{ position: "absolute", width: 520, height: 420, left: `${(seed * 37) % 60}%`, top: `${(seed * 23) % 55}%`, borderRadius: "50%", background: "radial-gradient(circle, rgba(122,94,44,0.20), transparent 68%)" }} />
        <div style={{ position: "absolute", width: 380, height: 300, right: `${(seed * 17) % 40}%`, bottom: `${(seed * 29) % 40}%`, borderRadius: "50%", background: "radial-gradient(circle, rgba(122,94,44,0.16), transparent 70%)" }} />
      </>
    )}
    <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 0 120px rgba(90,60,20,0.55), inset 0 0 22px rgba(60,35,10,0.6)", pointerEvents: "none" }} />
    {children}
  </div>
);

// Layer 4/5 — floating dust motes (deterministic, frame-driven)
export const Dust = ({ count = 34, opacity = 0.5 }) => {
  const { frame } = useClock();
  const motes = useMemo(
    () => Array.from({ length: count }, (_, i) => {
      const r = (n) => { const x = Math.sin(i * 127.1 + n * 311.7) * 43758.5453; return x - Math.floor(x); };
      return { x: r(1) * 1920, y: r(2) * 1080, s: 1.2 + r(3) * 2.8, sp: 0.15 + r(4) * 0.5, ph: r(5) * 6.28, a: 0.25 + r(6) * 0.6 };
    }),
    [count]
  );
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity }}>
      {motes.map((m, i) => {
        const y = (m.y - frame * m.sp * 0.7 + 2000) % 1180 - 50;
        const x = m.x + Math.sin(frame / 60 + m.ph) * 26;
        const tw = 0.6 + 0.4 * Math.sin(frame / 22 + m.ph);
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: m.s, height: m.s, borderRadius: "50%", background: c.goldBright, opacity: m.a * tw, filter: `blur(${m.s > 3 ? 1.2 : 0.4}px)` }} />;
      })}
    </AbsoluteFill>
  );
};

export const Grade = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill style={{ backgroundColor: c.emeraldMid, mixBlendMode: "soft-light", opacity: 0.2 }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.22), transparent 24%, transparent 70%, rgba(0,0,0,0.38))" }} />
  </AbsoluteFill>
);

export const Grain = () => {
  const { frame } = useClock();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", backgroundImage: NOISE, backgroundSize: "260px", backgroundPosition: `${(frame * 7) % 260}px ${(frame * 13) % 260}px`, opacity: 0.07, mixBlendMode: "overlay" }} />
  );
};

export const Vignette = () => (
  <AbsoluteFill style={{ pointerEvents: "none", background: "radial-gradient(ellipse at center, transparent 52%, rgba(0,0,0,0.45) 100%)" }} />
);

// Ornamental gold hairline with diamond centre
export const GoldRule = ({ width = 360, style }) => (
  <svg width={width} height={14} viewBox={`0 0 ${width} 14`} style={style}>
    <defs>
      <linearGradient id="gr" x1="0" x2="1"><stop offset="0" stopColor={c.gold} stopOpacity="0" /><stop offset="0.5" stopColor={c.goldBright} /><stop offset="1" stopColor={c.gold} stopOpacity="0" /></linearGradient>
    </defs>
    <rect x={0} y={6.4} width={width} height={1.2} fill="url(#gr)" />
    <path d={`M${width / 2 - 7} 7 L${width / 2} 1 L${width / 2 + 7} 7 L${width / 2} 13 Z`} fill={c.goldBright} />
  </svg>
);
