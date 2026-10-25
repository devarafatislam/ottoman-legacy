import React from "react";
import { theme } from "../theme";
import { useClock, prog } from "../lib/anim";

const c = theme.colors;

// ───── Mosque silhouettes (procedural, deliberately generic — not claimed as a specific survey) ─────
const Minaret = ({ x, base, h, w = 9, fill }) => (
  <g fill={fill}>
    <rect x={x - w / 2} y={base - h} width={w} height={h} />
    <rect x={x - w * 0.9} y={base - h * 0.74} width={w * 1.8} height={w * 0.5} />
    <rect x={x - w * 0.9} y={base - h * 0.9} width={w * 1.8} height={w * 0.5} />
    <path d={`M${x - w * 0.62} ${base - h} L${x} ${base - h - w * 4.4} L${x + w * 0.62} ${base - h} Z`} />
    <circle cx={x} cy={base - h - w * 4.6} r={w * 0.28} />
  </g>
);

export const Mosque = ({ cx, base, s = 1, minarets = [-3, -2.4, 2.4, 3], fill = c.navyDeep, glow }) => {
  const R = 118 * s, bodyH = 96 * s;
  return (
    <g>
      {glow && <ellipse cx={cx} cy={base - bodyH - R * 0.4} rx={R * 3.2} ry={R * 2.0} fill="url(#glowG)" />}
      <g fill={fill}>
        <rect x={cx - R * 1.15} y={base - bodyH} width={R * 2.3} height={bodyH} />
        <path d={`M${cx - R} ${base - bodyH} A${R} ${R} 0 0 1 ${cx + R} ${base - bodyH} Z`} />
        <rect x={cx - 2.5 * s} y={base - bodyH - R - 26 * s} width={5 * s} height={26 * s} />
        <path d={`M${cx - 10 * s} ${base - bodyH - R - 26 * s} a10 10 0 1 0 8 -14 a8 8 0 1 1 -8 14 Z`} transform={`translate(0 ${-4 * s})`} />
        {[-1, 1].map((d) => (
          <g key={d}>
            <path d={`M${cx + d * R * 1.12 - R * 0.62} ${base - bodyH * 0.9} A${R * 0.62} ${R * 0.62} 0 0 1 ${cx + d * R * 1.12 + R * 0.62} ${base - bodyH * 0.9} Z`} />
            <path d={`M${cx + d * R * 1.62 - R * 0.42} ${base - bodyH * 0.5} A${R * 0.42} ${R * 0.42} 0 0 1 ${cx + d * R * 1.62 + R * 0.42} ${base - bodyH * 0.5} Z`} />
            <rect x={cx + d * R * 1.62 - R * 0.42} y={base - bodyH * 0.5} width={R * 0.84} height={bodyH * 0.5} />
          </g>
        ))}
      </g>
      {minarets.map((m, i) => (
        <Minaret key={i} x={cx + m * R * 0.95} base={base} h={(310 - Math.abs(m) * 14) * s} w={9 * s} fill={fill} />
      ))}
    </g>
  );
};

// Layered skyline over a glowing dawn sky. `kind` changes minaret layout.
export const Skyline = ({ top = 0, height = 520, kind = "classic", drift = 0, sky = true, dim = 1 }) => {
  const { frame } = useClock();
  const dx = Math.sin(frame / 300) * 8 + drift;
  const W = 1920;
  const six = [-3.6, -3.0, -1.7, 1.7, 3.0, 3.6];
  return (
    <svg width={W} height={height} viewBox={`0 0 ${W} ${height}`} style={{ position: "absolute", left: 0, top, opacity: dim }}>
      <defs>
        <radialGradient id="glowG"><stop offset="0" stopColor="rgba(235,203,122,0.40)" /><stop offset="1" stopColor="rgba(235,203,122,0)" /></radialGradient>
        <linearGradient id="dawn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgba(5,12,26,0)" />
          <stop offset="0.7" stopColor="rgba(199,160,74,0.30)" />
          <stop offset="1" stopColor="rgba(235,203,122,0.55)" />
        </linearGradient>
      </defs>
      {sky && <rect width={W} height={height} fill="url(#dawn)" />}
      <g transform={`translate(${dx * 0.4} 0)`} opacity={0.55}>
        <Mosque cx={380} base={height - 20} s={0.62} minarets={[-3.2, 3.2]} fill={c.navyMid} />
        <Mosque cx={1530} base={height - 20} s={0.7} minarets={[-3, -2.2, 2.2, 3]} fill={c.navyMid} />
      </g>
      <g transform={`translate(${dx * 0.9} 0)`}>
        <Mosque cx={960} base={height + 4} s={1.02} minarets={kind === "six" ? six : [-3.3, -2.5, 2.5, 3.3]} fill="#030a14" glow="rgba(235,203,122,0.22)" />
        <Mosque cx={250} base={height + 4} s={0.72} minarets={[-2.4, 2.4]} fill="#030a14" />
        <Mosque cx={1700} base={height + 4} s={0.78} minarets={[-2.6, 2.6]} fill="#030a14" />
      </g>
      <rect x={0} y={height - 26} width={W} height={30} fill="#030a14" />
    </svg>
  );
};

// ───── Tulip (Tulip Era motif) ─────
export const Tulip = ({ x, y, s = 1, delay = 0, hue = c.crimson }) => {
  const { t, frame } = useClock();
  const p = prog(t, delay, 1.6);
  const sway = Math.sin(frame / 38 + x) * 3;
  return (
    <g transform={`translate(${x} ${y}) rotate(${sway}) scale(${s})`} opacity={p}>
      <path d="M0 0 C-4 -90 6 -150 0 -190" stroke="#2f6b47" strokeWidth={5} fill="none" strokeLinecap="round" strokeDasharray="1 1" pathLength={1} strokeDashoffset={1 - p} />
      <path d="M0 -60 C-46 -80 -60 -120 -48 -150 C-30 -130 -12 -112 0 -92 Z" fill="#2f6b47" opacity={0.9} />
      <g transform={`translate(0 -190) scale(${0.4 + 0.6 * p})`}>
        <path d="M0 0 C-34 -4 -42 -50 -30 -84 C-14 -66 -6 -48 0 -26 C6 -48 14 -66 30 -84 C42 -50 34 -4 0 0 Z" fill={hue} />
        <path d="M0 0 C-14 -10 -16 -50 0 -90 C16 -50 14 -10 0 0 Z" fill="#B5453A" opacity={0.9} />
        <path d="M-30 -84 L-18 -108 L-8 -84 M30 -84 L18 -108 L8 -84 M-8 -90 L0 -118 L8 -90" fill={hue} stroke={hue} strokeWidth={1} />
      </g>
    </g>
  );
};

// ───── Illustrative document (labelled symbolic — never presented as an authentic source) ─────
export const DocCard = ({ title, lines = 9, w = 440, h = 560, seal = true, stamp = "প্রতীকী চিত্র", rot = -2 }) => (
  <div style={{ width: w, height: h, transform: `rotate(${rot}deg)`, position: "relative", background: `linear-gradient(160deg, ${c.parchmentLight}, ${c.parchment} 60%, ${c.parchmentDark})`, border: `2px solid ${c.parchmentEdge}`, borderRadius: 6, boxShadow: "0 40px 60px -20px rgba(0,0,0,0.7), inset 0 0 70px rgba(122,94,44,0.45)", padding: "34px 40px" }}>
    <div style={{ height: 8, background: `linear-gradient(90deg, transparent, ${c.goldDim}, transparent)`, marginBottom: 16 }} />
    <div style={{ textAlign: "center", fontFamily: theme.fonts.bnSerif, fontWeight: 700, fontSize: 34, color: c.ink, marginBottom: 18 }}>{title}</div>
    {Array.from({ length: lines }).map((_, i) => (
      <div key={i} style={{ height: 7, marginBottom: 17, width: `${i % 4 === 3 ? 62 : 100 - ((i * 7) % 13)}%`, background: "rgba(42,29,12,0.38)", borderRadius: 3 }} />
    ))}
    {seal && <div style={{ position: "absolute", right: 46, bottom: 44, width: 78, height: 78, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, #b5453a, ${c.crimson} 70%)`, boxShadow: "0 6px 12px rgba(0,0,0,0.4)", border: "3px solid rgba(60,10,10,0.5)" }} />}
    <div style={{ position: "absolute", left: 22, bottom: 14, fontFamily: theme.fonts.bn, fontWeight: 600, fontSize: 17, color: "rgba(60,40,14,0.7)", border: "1px dashed rgba(60,40,14,0.5)", padding: "2px 10px", borderRadius: 4 }}>{stamp}</div>
  </div>
);

// ───── Section label chip ─────
export const Chip = ({ children, big = false, tone = "gold", style }) => (
  <div style={{ display: "inline-block", padding: big ? "10px 30px" : "7px 22px", borderRadius: 999, background: tone === "crimson" ? c.crimson : "rgba(4,32,26,0.88)", border: `1.5px solid ${c.gold}`, color: c.ivory, fontFamily: theme.fonts.bn, fontWeight: 600, fontSize: big ? 31 : 24, boxShadow: "0 10px 24px rgba(0,0,0,0.5)", ...style }}>{children}</div>
);
