import React, { useMemo } from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { theme } from "../theme";
import { useClock, prog } from "../lib/anim";

const c = theme.colors;

// ── Rotating 8-fold Islamic geometric rosette (very faint, behind everything) ──
export const Rosette = ({ opacity = 0.09 }) => {
  const { frame } = useClock();
  const rot = frame / 14;
  const star = (r, rot0) => {
    const pts = (k) => Array.from({ length: 4 }, (_, i) => { const a = ((i * 90 + k) * Math.PI) / 180; return `${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`; }).join(" ");
    return <><polygon points={pts(rot0)} /><polygon points={pts(rot0 + 45)} /></>;
  };
  return (
    <svg width={1920} height={1080} viewBox="-960 -540 1920 1080" style={{ position: "absolute", inset: 0, opacity, pointerEvents: "none" }}>
      <g fill="none" stroke={c.goldBright} strokeWidth={1.6}>
        <g transform={`rotate(${rot})`}>{[220, 340, 470, 620, 800].map((r, i) => <g key={r} transform={`rotate(${i % 2 ? 22.5 : 0})`}>{star(r, 0)}</g>)}</g>
        <g transform={`rotate(${-rot * 0.6})`}>{[280, 540, 720].map((r) => <circle key={r} r={r} strokeDasharray="3 14" />)}</g>
        <g transform={`rotate(${rot * 0.4})`}>{Array.from({ length: 16 }, (_, i) => <line key={i} x1={150} y1={0} x2={880} y2={0} transform={`rotate(${i * 22.5})`} opacity={0.5} />)}</g>
      </g>
    </svg>
  );
};

// ── Rising gold embers (additive look) ──
export const Embers = ({ count = 34 }) => {
  const { frame } = useClock();
  const P = useMemo(() => Array.from({ length: count }, (_, i) => {
    const r = (n) => { const x = Math.sin(i * 91.7 + n * 17.3) * 43758.5453; return x - Math.floor(x); };
    return { x: r(1) * 1920, y: r(2) * 1300, s: 2 + r(3) * 4.5, sp: 0.5 + r(4) * 1.4, ph: r(5) * 6.28, a: 0.35 + r(6) * 0.5 };
  }), [count]);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {P.map((m, i) => {
        const y = 1160 - ((m.y + frame * m.sp * 1.1) % 1300);
        const x = m.x + Math.sin(frame / 45 + m.ph) * 38;
        const fade = Math.min(1, Math.max(0, (1160 - y) / 160)) * Math.min(1, Math.max(0, y / 200));
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: m.s, height: m.s, borderRadius: "50%", background: "#ffd98a", boxShadow: `0 0 ${m.s * 3}px ${m.s}px rgba(255,190,90,0.55)`, opacity: m.a * fade * (0.7 + 0.3 * Math.sin(frame / 14 + m.ph)) }} />;
      })}
    </AbsoluteFill>
  );
};

// ── Drifting warm light leak (screen blend), swells at scene boundaries ──
export const LightLeak = ({ boosts = [] }) => {
  const { frame, t } = useClock();
  let boost = 0;
  boosts.forEach((b) => { const d = t - b; if (d > -0.7 && d < 1.8) boost = Math.max(boost, Math.exp(-Math.pow((d - 0.3) / 0.8, 2))); });
  const a = 0.07 + 0.04 * Math.sin(frame / 90) + boost * 0.34;
  const x1 = 960 + Math.sin(frame / 150) * 700, x2 = 960 + Math.cos(frame / 190) * 760;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen", opacity: a }}>
      <div style={{ position: "absolute", left: x1 - 600, top: -300, width: 1200, height: 1100, background: "radial-gradient(ellipse, rgba(255,170,70,0.9), rgba(255,120,40,0) 62%)" }} />
      <div style={{ position: "absolute", left: x2 - 500, top: 380, width: 1000, height: 900, background: "radial-gradient(ellipse, rgba(255,214,140,0.8), rgba(255,190,100,0) 64%)" }} />
    </AbsoluteFill>
  );
};

// ── Cinematic chapter band: lines draw outward, title unmasks, then retracts ──
export const ChapterCard = ({ at, no, title, years, dur = 3.8 }) => {
  const { t } = useClock();
  const inP = prog(t, at, 0.9, theme.ease.inOut);
  const outP = prog(t, at + dur - 0.8, 0.8, theme.ease.in);
  const v = inP * (1 - outP);
  if (v <= 0.001) return null;
  const rev = prog(t, at + 0.45, 1.0, theme.ease.out);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 392, height: 250, pointerEvents: "none", opacity: Math.min(1, v * 1.4) }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, background: "linear-gradient(90deg, rgba(3,9,20,0), rgba(3,9,20,0.88) 22%, rgba(3,9,20,0.88) 78%, rgba(3,9,20,0))", transform: `scaleY(${inP * (1 - outP)})` }} />
      {[0, 1].map((k) => <div key={k} style={{ position: "absolute", left: "50%", [k ? "bottom" : "top"]: 0, height: 2, width: 1300 * inP * (1 - outP * 0.6), transform: "translateX(-50%)", background: `linear-gradient(90deg, transparent, ${c.goldBright}, transparent)` }} />)}
      <div style={{ position: "absolute", left: 0, right: 0, top: 26, textAlign: "center", fontFamily: theme.fonts.bn, fontWeight: 600, fontSize: 30, color: c.goldBright, opacity: prog(t, at + 0.3, 0.8), transform: `translateY(${(1 - prog(t, at + 0.3, 0.8)) * -16}px)` }}>অধ্যায় {no}</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", overflow: "hidden", height: 112 }}>
        <div style={{ fontFamily: theme.fonts.bnSerif, fontWeight: 700, fontSize: 84, lineHeight: "112px", color: c.ivory, textShadow: "0 6px 26px rgba(0,0,0,0.85)", transform: `translateY(${(1 - rev) * 118}px)` }}>{title}</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 192, textAlign: "center", fontFamily: theme.fonts.bnSerif, fontWeight: 600, fontSize: 32, color: c.parchmentDark, opacity: prog(t, at + 0.9, 0.8) }}>{years}</div>
    </div>
  );
};

// ── point on a path string of the forms we generate: M L | M Q | M C ──
export const pointOnPath = (d, u) => {
  const n = d.match(/-?\d+(\.\d+)?/g).map(Number);
  const cmd = d.includes("C") ? "C" : d.includes("Q") ? "Q" : "L";
  const [x0, y0] = n;
  if (cmd === "L") return [x0 + (n[2] - x0) * u, y0 + (n[3] - y0) * u];
  const m = 1 - u;
  if (cmd === "Q") return [m * m * x0 + 2 * m * u * n[2] + u * u * n[4], m * m * y0 + 2 * m * u * n[3] + u * u * n[5]];
  return [m ** 3 * x0 + 3 * m * m * u * n[2] + 3 * m * u * u * n[4] + u ** 3 * n[6], m ** 3 * y0 + 3 * m * m * u * n[3] + 3 * m * u * u * n[5] + u ** 3 * n[7]];
};

export const PulseDot = ({ d, t, phase = 0, speed = 0.33, r = 5, color = "#fff3c9" }) => {
  const u = (((t * speed + phase) % 1) + 1) % 1;
  const [x, y] = pointOnPath(d, u);
  const fade = Math.min(1, u * 6, (1 - u) * 6);
  return (
    <g opacity={fade}>
      <circle cx={x} cy={y} r={r * 2.8} fill="rgba(255,214,140,0.28)" />
      <circle cx={x} cy={y} r={r} fill={color} />
    </g>
  );
};
