import React from "react";
import { interpolate } from "remotion";
import { theme } from "../theme";
import { useClock, prog } from "../lib/anim";
import { SEGMENTS } from "../data/sultans";
import { YEAR_KEYS, activeRuler } from "../data/narration";
import { toBn } from "../lib/time";

const c = theme.colors;
const X0 = 150, X1 = 1770, Y0 = 1299, Y1 = 1922;
const xOf = (yr) => X0 + ((yr - Y0) / (Y1 - Y0)) * (X1 - X0);

// Marker position in years at narration time t: eased move to each keyframe, then a slow drift.
export const yearAt = (t) => {
  const K = YEAR_KEYS;
  if (t <= K[0][0]) return K[0][1];
  for (let i = 0; i < K.length - 1; i++) {
    const [t0, y0] = K[i], [t1, y1] = K[i + 1];
    if (t >= t0 && t < t1) {
      // hold near the ruler being narrated (slow drift), then glide to the next date as the next name lands
      const drift = 0.12 * ((t - t0) / (t1 - t0));
      const q = interpolate(t, [t1 - Math.min(2.4, (t1 - t0) * 0.5), t1], [0, 1], { easing: theme.ease.inOut, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      return y0 + (y1 - y0) * (drift * (1 - q) + q);
    }
  }
  return K[K.length - 1][1];
};

export const Timeline = ({ from, to }) => {
  const { t } = useClock();
  const vis = Math.min(prog(t, from, 1.2), 1 - prog(t, to - 0.8, 0.8, theme.ease.in));
  if (vis <= 0.001) return null;
  const yr = yearAt(t);
  const ruler = activeRuler(t);
  const mx = xOf(yr);
  const ticks = [1300, 1400, 1500, 1600, 1700, 1800, 1900];
  const inInter = yr > 1402.2 && yr < 1412.8;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 150, opacity: vis, transform: `translateY(${(1 - vis) * -24}px)`, pointerEvents: "none" }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(3,10,20,0.78), rgba(3,10,20,0))" }} />
      <svg width={1920} height={150} style={{ position: "absolute", left: 0, top: 0 }}>
        <line x1={X0} x2={X1} y1={84} y2={84} stroke={c.goldDim} strokeWidth={1.5} />
        {ticks.map((y) => (
          <g key={y}>
            <line x1={xOf(y)} x2={xOf(y)} y1={78} y2={92} stroke={c.gold} strokeWidth={1.4} />
            <text x={xOf(y)} y={112} textAnchor="middle" fontFamily={theme.fonts.bn} fontWeight={600} fontSize={19} fill={c.ivoryDim}>{toBn(y)}</text>
          </g>
        ))}
        {SEGMENTS.map((s, i) => {
          const on = ruler && ruler.id === s.id;
          const x = xOf(s.from), w = Math.max(xOf(s.to === s.from ? s.to + 0.6 : s.to) - x, 2.2);
          return <rect key={i} x={x} y={on ? 74 : 79} width={w} height={on ? 20 : 10} rx={2} fill={on ? c.goldBright : i % 2 ? c.emeraldLight : c.gold} opacity={on ? 1 : 0.62} />;
        })}
        <defs>
          <pattern id="hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="2" height="5" fill={c.crimson} /></pattern>
        </defs>
        <rect x={xOf(1402)} y={72} width={xOf(1413) - xOf(1402)} height={24} fill="url(#hatch)" stroke={c.crimson} strokeWidth={1} opacity={0.95} />
        <line x1={mx} x2={mx} y1={60} y2={100} stroke={c.goldBright} strokeWidth={2} />
        <path d={`M${mx - 9} 56 L${mx + 9} 56 L${mx} 70 Z`} fill={c.goldBright} />
      </svg>
      <div style={{ position: "absolute", left: mx - 110, top: 8, width: 220, textAlign: "center", fontFamily: theme.fonts.bnSerif, fontWeight: 700, fontSize: 36, color: c.goldBright, textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}>
        {toBn(Math.round(yr))}
      </div>
      {inInter && (
        <div style={{ position: "absolute", left: mx - 140, top: 116, width: 280, textAlign: "center", fontFamily: theme.fonts.bn, fontWeight: 600, fontSize: 21, color: "#F1C6C0", textShadow: "0 2px 8px #000" }}>ইন্টাররেগনাম ১৪০২–১৪১৩</div>
      )}
    </div>
  );
};
