import React from "react";
import { Img, staticFile, interpolate } from "remotion";
import { theme } from "../theme";
import { useClock, prog } from "../lib/anim";
import { PulseDot } from "./FX";
import { SULTANS, BY_ID, portrait } from "../data/sultans";
import { SUCCESSIONS, RELATION_BN } from "../data/successions";
import { MENTIONS, mentionTime } from "../data/narration";
import { spanBn, toBn } from "../lib/time";

const c = theme.colors;
export const COLS = 9, PITCH_X = 200, PITCH_Y = 235, OX = 175, OY = 125;
export const WORLD_W = 1990, WORLD_H = 960;
const PW = 78, PH = 96;

// Snake layout: row 0 L→R, row 1 R→L … so the political succession reads as one continuous path.
export const NODE_POS = Object.fromEntries(
  SULTANS.map((s, i) => {
    const row = Math.floor(i / COLS);
    const col = row % 2 === 0 ? i % COLS : COLS - 1 - (i % COLS);
    return [s.id, { x: OX + col * PITCH_X, y: OY + row * PITCH_Y, row, col }];
  })
);

// Reveal time per node/edge in "narrated" mode = first mention (edges: the mention of the successor)
const nodeTime = (id, o) => (o.mode === "sequence" ? o.seqStart + (BY_ID[id].order - 1) * 0.42 : (mentionTime(id, 0) ?? 1e9) - 0.35);
const edgeTime = (e, o) => {
  if (o.mode === "sequence") return o.seqStart + (BY_ID[e.to].order - 1) * 0.42 + 0.25 + (e.type === "return" ? 0.2 : 0);
  if (e.type === "return") {
    const nth = MENTIONS.filter((m) => m.id === e.to && m.ret);
    return (nth.find((m) => (e.to === "mustafa1" ? m.cue === 113 : m.cue === 60))?.t ?? 1e9) - 0.2;
  }
  // second reign of the 1444 abdication edge: use first mention of successor
  return (mentionTime(e.to, 0) ?? 1e9) - 0.15;
};

const edgePath = (e) => {
  const a = NODE_POS[e.from], b = NODE_POS[e.to];
  const ay = a.y - 24, by = b.y - 24;
  if (e.type === "return") {
    const mx = (a.x + b.x) / 2;
    return { d: `M${a.x},${ay - 52} Q${mx},${ay - 132} ${b.x},${by - 52}`, lx: mx, ly: ay - 92 };
  }
  if (a.row !== b.row) { // row turn: bracket on the outside edge
    const side = a.col === COLS - 1 ? 1 : -1;
    const ox = a.x + side * 62;
    return { d: `M${a.x + side * 46},${ay} C${ox + side * 70},${ay} ${ox + side * 70},${by} ${b.x + side * 46},${by}`, lx: ox + side * 52, ly: (ay + by) / 2 };
  }
  const dir = Math.sign(b.x - a.x);
  const gap = Math.abs(b.x - a.x);
  if (gap > PITCH_X * 1.5) { // skip arc over an intermediate node (Mustafa I → Murad IV)
    const mx = (a.x + b.x) / 2;
    return { d: `M${a.x + dir * 30},${ay - 50} Q${mx},${ay - 176} ${b.x - dir * 30},${by - 50}`, lx: mx + dir * 110, ly: ay - 112 };
  }
  return { d: `M${a.x + dir * 50},${ay} L${b.x - dir * 50},${by}`, lx: (a.x + b.x) / 2, ly: ay - 16 };
};

const Node = ({ s, o, activeId }) => {
  const { t } = useClock();
  const pos = NODE_POS[s.id];
  const p = prog(t, nodeTime(s.id, o), 0.9, theme.ease.out);
  const active = activeId === s.id;
  const sc = 0.82 + 0.18 * p + (active ? 0.1 : 0);
  return (
    <div style={{ position: "absolute", left: pos.x - 95, top: pos.y - 92, width: 190, textAlign: "center", opacity: 0.16 + 0.84 * p, transform: `scale(${sc})`, transformOrigin: "50% 40%" }}>
      <div style={{ width: PW + 8, height: PH + 8, margin: "0 auto", borderRadius: "50%", padding: 4, background: p > 0.05 ? `conic-gradient(from 210deg, ${c.goldBright}, ${c.goldDim}, ${c.goldBright}, #fff2c4, ${c.goldDim}, ${c.goldBright})` : "rgba(199,160,74,0.3)", boxShadow: active ? `0 0 34px 6px ${c.gold}AA` : "0 8px 16px rgba(0,0,0,0.5)" }}>
        <div style={{ width: PW, height: PH, borderRadius: "50%", overflow: "hidden", background: c.navy }}>
          <Img src={staticFile(portrait(s.id))} style={{ width: "100%", height: "100%", objectFit: "cover", filter: p > 0.05 ? undefined : "grayscale(1) brightness(0.3)", opacity: 0.25 + 0.75 * p }} />
        </div>
      </div>
      <div style={{ marginTop: 6, fontFamily: theme.fonts.bn, fontWeight: 700, fontSize: 21, lineHeight: 1.25, color: active ? c.goldBright : c.ivory, textShadow: "0 2px 6px #000" }}>{s.bn}</div>
      <div style={{ fontFamily: theme.fonts.bn, fontWeight: 600, fontSize: 16, color: c.parchmentDark, textShadow: "0 2px 6px #000" }}>{spanBn(s.reigns)}</div>
      <div style={{ position: "absolute", left: 14, top: -4, width: 26, height: 26, borderRadius: "50%", background: c.gold, color: c.ink, fontFamily: theme.fonts.bn, fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", opacity: p }}>{toBn(s.order)}</div>
    </div>
  );
};

// Father→son lines that are NOT already drawn as a political "son" succession (biological layer)
const FAMILY_EXTRA = SULTANS.filter((s) => s.father && !SUCCESSIONS.some((e) => e.relation === "son" && e.from === s.father && e.to === s.id) && !SUCCESSIONS.some((e) => e.relation === "father" && e.from === s.id && e.to === s.father))
  .map((s) => ({ from: s.father, to: s.id }));

export const SuccessionTree = ({ overviewUntil, x = 60, y = 150, w = 1800, h = 700, camera, mode = "narrated", seqStart = 0, appear = 0, out, family, followZoom = 1.5, bg = true, legend = false, legendAt = 0 }) => {
  const { t } = useClock();
  const o = { mode, seqStart };
  // Active ruler (narrated) or sequence head
  let activeId = null;
  if (mode === "narrated") {
    let cur = null; for (const m of MENTIONS) if (m.t <= t) cur = m; else break;
    activeId = cur?.id;
  } else {
    const k = Math.floor((t - seqStart) / 0.42);
    activeId = k >= 0 && k < 36 ? SULTANS[k].id : null;
  }
  // camera: explicit keyframes {t,cx,cy,zoom,dur} OR auto-follow of narrated rulers
  let cx, cy, z;
  if (camera) {
    let cur = camera[0];
    for (let i = 1; i < camera.length; i++) {
      const k = camera[i];
      if (t < k.t) break;
      const p = interpolate(t, [k.t, k.t + (k.dur ?? 3)], [0, 1], { easing: theme.ease.inOutSlow, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      const pv = camera[i - 1];
      cur = { cx: pv.cx + (k.cx - pv.cx) * p, cy: pv.cy + (k.cy - pv.cy) * p, zoom: pv.zoom * Math.pow(k.zoom / pv.zoom, p) };
      if (p < 1) break;
      cur = k;
    }
    cx = cur.cx; cy = cur.cy; z = cur.zoom;
  } else {
    let i = -1; MENTIONS.forEach((m, j) => { if (m.t <= t) i = j; });
    const cur = MENTIONS[Math.max(i, 0)], prev = MENTIONS[Math.max(i - 1, 0)];
    const A = NODE_POS[prev.id], B = NODE_POS[cur.id];
    const p = interpolate(t, [cur.t, cur.t + 1.9], [0, 1], { easing: theme.ease.inOutSlow, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    cx = A.x + (B.x - A.x) * p; cy = A.y + (B.y - A.y) * p; z = followZoom;
    if (overviewUntil != null) {
      const k = interpolate(t, [overviewUntil, overviewUntil + 2.6], [0, 1], { easing: theme.ease.inOutSlow, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      const oz = Math.min(w / WORLD_W, h / WORLD_H) * 0.97;
      cx = WORLD_W / 2 + (cx - WORLD_W / 2) * k; cy = 470 + (cy - 470) * k; z = oz + (z - oz) * k;
    }
  }
  const vis = prog(t, appear, 1.0) * (out != null ? 1 - prog(t, out - 0.6, 0.6, theme.ease.in) : 1);

  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: vis, transform: `translateY(${(1 - vis) * 24}px)`, overflow: "hidden", borderRadius: 14, border: bg ? "1.5px solid rgba(199,160,74,0.5)" : "none", background: bg ? "radial-gradient(ellipse at 50% 40%, rgba(19,89,74,0.55), rgba(5,12,26,0.92))" : "none", boxShadow: bg ? "0 30px 60px -20px rgba(0,0,0,0.8)" : "none" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: WORLD_W, height: WORLD_H, transformOrigin: "0 0", transform: `translate(${w / 2 - cx * z}px, ${h / 2 - cy * z}px) scale(${z})` }}>
        <svg width={WORLD_W} height={WORLD_H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <defs>
            <marker id="arrG" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill={c.goldBright} /></marker>
            <marker id="arrR" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#E08A7E" /></marker>
          </defs>
          {family && FAMILY_EXTRA.map((f, i) => {
            const A = NODE_POS[f.from], B = NODE_POS[f.to];
            const mx = (A.x + B.x) / 2, my = (A.y + B.y) / 2 + 34 + (i % 3) * 8;
            const p = prog(t, family + i * 0.12, 0.9);
            return <path key={i} d={`M${A.x},${A.y + 80} Q${mx},${my + 60} ${B.x},${B.y + 80}`} fill="none" stroke="rgba(244,235,211,0.5)" strokeWidth={1.4} strokeDasharray="3 5" opacity={p * 0.55} />;
          })}
          {SUCCESSIONS.map((e, i) => {
            const g = edgePath(e);
            const at = edgeTime(e, o);
            const p = prog(t, at, 1.1, theme.ease.inOut);
            if (p <= 0) return null;
            const special = e.type !== "primary";
            const col = special ? "#E08A7E" : c.goldBright;
            const showPill = e.relation !== "son" || special;
            const label = e.type === "interregnum" ? "ইন্টাররেগনাম" : e.type === "return" ? `${toBn(e.year)} · ফিরে আসেন` : RELATION_BN[e.relation];
            return (
              <g key={i}>
                <path d={g.d} fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth={7} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} strokeLinecap="round" />
                <path d={g.d} fill="none" stroke={col} strokeWidth={special ? 3 : 3.6} pathLength={1} strokeDasharray={special && p >= 1 ? "0.02 0.012" : "1 1"} strokeDashoffset={special && p >= 1 ? 0 : 1 - p} strokeLinecap="round" markerEnd={p > 0.97 ? (special ? "url(#arrR)" : "url(#arrG)") : undefined} />
                {p >= 1 && <PulseDot d={g.d} t={t} phase={(i * 0.137) % 1} r={4.5} color={special ? "#ffc2b8" : "#fff3c9"} />}
                {showPill && p > 0.6 && (
                  <g transform={`translate(${g.lx} ${g.ly})`} opacity={prog(t, at + 0.7, 0.5)}>
                    <rect x={-(label.length * 5.6 + 12)} y={-13} width={label.length * 11.2 + 24} height={26} rx={13} fill="rgba(5,12,26,0.92)" stroke={col} strokeWidth={1.2} />
                    <text textAnchor="middle" y={6} fontFamily={theme.fonts.bn} fontWeight={600} fontSize={15} fill={c.ivory}>{label}</text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
        {SULTANS.map((s) => <Node key={s.id} s={s} o={o} activeId={activeId} />)}
      </div>
    </div>
  );
};

export const TreeLegend = ({ at = 0, x = 60, y = 112 }) => {
  const { t } = useClock();
  return (
    <div style={{ position: "absolute", left: x, top: y, display: "flex", gap: 28, opacity: prog(t, at, 0.8), fontFamily: theme.fonts.bn, fontWeight: 600, fontSize: 21, color: c.ivory, background: "rgba(5,12,26,0.82)", padding: "7px 22px", borderRadius: 12, border: "1px solid rgba(199,160,74,0.35)" }}>
      <span><span style={{ color: c.goldBright }}>━▶</span> রাজনৈতিক উত্তরাধিকার</span>
      <span><span style={{ color: "#E08A7E" }}>╌╌▶</span> ফিরে আসা / ইন্টাররেগনাম</span>
      <span><span style={{ color: c.ivoryDim }}>┄┄</span> পিতা–পুত্র সম্পর্ক</span>
    </div>
  );
};
